import { render, screen, within } from "@testing-library/react";

import { Tag } from "../../atoms";
import { SkillCategory } from "../../molecules";
import { Toolbox } from "./Toolbox";
import {
  toolboxClass,
  toolboxEyebrowClass,
  toolboxGridClass,
  toolboxHeaderClass,
} from "./Toolbox.styles";
import type { ToolboxProps } from "./Toolbox.types";

/**
 * Realistic props modelled on the Storybook `Default` story and
 * {@link ToolboxProps} in Toolbox.types.ts. Toolbox is a presentational
 * section: an optional header (eyebrow + h2) above a responsive grid of
 * SkillCategory cards passed as `children`.
 */
const categories: ReadonlyArray<{
  title: string;
  tone: "violet" | "orange" | "green" | "amber";
  tags: readonly string[];
}> = [
  { title: "Languages", tone: "violet", tags: ["TypeScript", "Kotlin"] },
  { title: "Frameworks", tone: "orange", tags: ["React", "Next.js"] },
  { title: "Craft", tone: "green", tags: ["Accessibility", "Testing"] },
  { title: "Tooling", tone: "amber", tags: ["Git", "Figma"] },
];

const children = categories.map((c) => (
  <SkillCategory key={c.title} title={c.title} tone={c.tone}>
    {c.tags.map((tag) => (
      <Tag key={tag}>{tag}</Tag>
    ))}
  </SkillCategory>
));

const baseProps: ToolboxProps = {
  eyebrow: "02 — The toolbox",
  title: "What I reach for",
  children,
};

describe("Toolbox", () => {
  it("mounts without crashing and renders a <section> root", () => {
    const { container } = render(
      <Toolbox {...baseProps} data-testid="toolbox" />,
    );

    const section = screen.getByTestId("toolbox");
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe("SECTION");
    // The root is the <section> itself.
    expect(container.firstChild).toBe(section);
  });

  it("renders the title as a level-2 heading (Text as='h2')", () => {
    render(<Toolbox {...baseProps} />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "What I reach for",
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the eyebrow kicker copy", () => {
    render(<Toolbox {...baseProps} />);

    expect(screen.getByText("02 — The toolbox")).toBeInTheDocument();
  });

  it("wraps the header in a container carrying the header-class tokens", () => {
    const { container } = render(<Toolbox {...baseProps} />);

    // The header wrapper is the first child element of the <section>.
    const header = container.querySelector("section > div:first-child");
    expect(header).not.toBeNull();
    expect(header).toHaveClass(...toolboxHeaderClass.split(" "));
    // The eyebrow carries its own margin token.
    expect(screen.getByText("02 — The toolbox")).toHaveClass(
      ...toolboxEyebrowClass.split(" "),
    );
  });

  it("renders each SkillCategory card as a heading + list", () => {
    render(<Toolbox {...baseProps} />);

    // One level-3 heading per category card.
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(cardHeadings).toHaveLength(categories.length);
    for (const category of categories) {
      expect(
        screen.getByRole("heading", { level: 3, name: category.title }),
      ).toBeInTheDocument();
    }
  });

  it("renders one card node per datum inside the grid", () => {
    const { container } = render(<Toolbox {...baseProps} />);

    // The grid is the last child element of the <section>.
    const grid = container.querySelector("section > div:last-child");
    expect(grid).not.toBeNull();
    expect(grid).toHaveClass(...toolboxGridClass.split(" "));
    // One SkillCategory <section> child per datum, directly in the grid.
    const cards = grid!.querySelectorAll(":scope > section");
    expect(cards).toHaveLength(categories.length);
  });

  it("renders every skill tag inside its owning category list", () => {
    render(<Toolbox {...baseProps} />);

    for (const category of categories) {
      const card = screen
        .getByRole("heading", { level: 3, name: category.title })
        .closest("section") as HTMLElement;
      const list = within(card).getByRole("list");
      for (const tag of category.tags) {
        expect(within(list).getByText(tag)).toBeInTheDocument();
      }
    }
  });

  it("applies the base toolboxClass tokens to the section root", () => {
    render(<Toolbox {...baseProps} data-testid="toolbox" />);

    // Assert against the real tokens from the styles record, not hardcoded strings.
    expect(screen.getByTestId("toolbox")).toHaveClass(
      ...toolboxClass.split(" "),
    );
  });

  it("merges an incoming className with the base class (stays overridable)", () => {
    render(
      <Toolbox {...baseProps} className="custom-extra" data-testid="toolbox" />,
    );

    const section = screen.getByTestId("toolbox");
    expect(section).toHaveClass("custom-extra");
    // Base tokens are still present alongside the override.
    expect(section).toHaveClass(...toolboxClass.split(" "));
  });

  it("spreads arbitrary props (id, aria-*, data-*) onto the <section> root", () => {
    render(
      <Toolbox
        {...baseProps}
        id="toolbox-section"
        aria-label="The toolbox"
        data-testid="toolbox"
      />,
    );

    const section = screen.getByRole("region", { name: "The toolbox" });
    expect(section).toHaveAttribute("id", "toolbox-section");
    expect(section).toHaveAttribute("data-testid", "toolbox");
    expect(section).toHaveAccessibleName("The toolbox");
  });

  it("omits the header wrapper when neither eyebrow nor title is provided", () => {
    const { container } = render(
      <Toolbox data-testid="toolbox">{children}</Toolbox>,
    );

    // No section heading (h2) and no eyebrow copy.
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByText("02 — The toolbox")).not.toBeInTheDocument();

    // The <section> only holds the grid — no header wrapper before it.
    const directDivs = container.querySelectorAll("section > div");
    expect(directDivs).toHaveLength(1);
    expect(directDivs[0]).toHaveClass(...toolboxGridClass.split(" "));
  });

  it("renders the header with only an eyebrow (no title heading)", () => {
    render(<Toolbox eyebrow="02 — The toolbox">{children}</Toolbox>);

    expect(screen.getByText("02 — The toolbox")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders the header with only a title (no eyebrow)", () => {
    render(<Toolbox title="What I reach for">{children}</Toolbox>);

    expect(
      screen.getByRole("heading", { level: 2, name: "What I reach for" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("02 — The toolbox")).not.toBeInTheDocument();
  });

  it("renders with no children without crashing (empty grid)", () => {
    const { container } = render(
      <Toolbox eyebrow="02 — The toolbox" title="What I reach for" />,
    );

    // Header still renders.
    expect(
      screen.getByRole("heading", { level: 2, name: "What I reach for" }),
    ).toBeInTheDocument();
    // The grid exists but has no card children.
    const grid = container.querySelector("section > div:last-child");
    expect(grid).toHaveClass(...toolboxGridClass.split(" "));
    expect(grid!.querySelectorAll(":scope > section")).toHaveLength(0);
  });
});
