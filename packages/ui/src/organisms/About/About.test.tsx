import { render, screen } from "@testing-library/react";

import { About } from "./About";
import { aboutClass, aboutTabClass } from "./About.styles";
import type { AboutProps, AboutTab } from "./About.types";

/**
 * Realistic props modelled on the Storybook `Default` story and
 * {@link AboutProps} in About.types.ts.
 */
const tabs: AboutTab[] = [
  { title: "Product mindset", description: "I think in products, not tickets" },
  {
    title: "Teamwork",
    description: "I get design and engineering speaking one language",
  },
  {
    title: "Determination",
    description: "I push past 'good enough' on the problems others skip",
  },
  {
    title: "Creativity",
    description: "Always experimenting with new tools and ideas",
  },
];

const baseProps: AboutProps = {
  eyebrow: "03 — About",
  title: "Curious, collaborative, and relentless about the details.",
  description:
    "I'm a product-focused engineer who cares as much about how a team works as what it ships.",
  sticker: "// hi there",
  portrait: <div data-testid="portrait-media" className="size-full" />,
  tabs,
};

describe("About", () => {
  it("mounts without crashing and renders a <section> root", () => {
    const { container } = render(<About {...baseProps} data-testid="about" />);

    const section = screen.getByTestId("about");
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe("SECTION");
    // The root is the <section> itself.
    expect(container.firstChild).toBe(section);
  });

  it("renders the title as a level-2 heading (Text as='h2')", () => {
    render(<About {...baseProps} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      "Curious, collaborative, and relentless about the details.",
    );
  });

  it("renders the eyebrow, description and title copy", () => {
    render(<About {...baseProps} />);

    expect(screen.getByText("03 — About")).toBeInTheDocument();
    expect(
      screen.getByText(
        "I'm a product-focused engineer who cares as much about how a team works as what it ships.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Curious, collaborative, and relentless about the details.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the portrait media slot and its sticker", () => {
    render(<About {...baseProps} />);

    expect(screen.getByTestId("portrait-media")).toBeInTheDocument();
    expect(screen.getByText("// hi there")).toBeInTheDocument();
  });

  it("renders one <li> per tab datum inside a single list", () => {
    render(<About {...baseProps} />);

    // Exactly one list rendered for the tabs.
    expect(screen.getAllByRole("list")).toHaveLength(1);

    // One list item per tab.
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(tabs.length);

    // Each list item carries the real tab-class tokens from the styles record.
    for (const item of items) {
      expect(item).toHaveClass(...aboutTabClass.split(" "));
    }
  });

  it("renders each tab's title and description text", () => {
    render(<About {...baseProps} />);

    for (const tab of tabs) {
      expect(screen.getByText(tab.title as string)).toBeInTheDocument();
      expect(screen.getByText(tab.description as string)).toBeInTheDocument();
    }
  });

  it("applies the base aboutClass tokens to the section root", () => {
    render(<About {...baseProps} data-testid="about" />);

    // Assert against the real tokens from the styles record, not hardcoded strings.
    expect(screen.getByTestId("about")).toHaveClass(...aboutClass.split(" "));
  });

  it("merges an incoming className with the base class (stays overridable)", () => {
    render(
      <About {...baseProps} className="custom-extra" data-testid="about" />,
    );

    const section = screen.getByTestId("about");
    expect(section).toHaveClass("custom-extra");
    // Base tokens are still present alongside the override.
    expect(section).toHaveClass(...aboutClass.split(" "));
  });

  it("spreads arbitrary props (id, aria-*, data-*) onto the <section> root", () => {
    render(
      <About
        {...baseProps}
        id="about-section"
        aria-label="About me"
        data-testid="about"
      />,
    );

    const section = screen.getByRole("region", { name: "About me" });
    expect(section).toHaveAttribute("id", "about-section");
    expect(section).toHaveAttribute("data-testid", "about");
    expect(section).toHaveAccessibleName("About me");
  });

  it("omits the portrait wrapper and sticker when no portrait is provided", () => {
    render(
      <About
        eyebrow={baseProps.eyebrow}
        title={baseProps.title}
        description={baseProps.description}
        sticker={baseProps.sticker}
        data-testid="about"
      />,
    );

    // Sticker only renders inside the portrait wrapper, so it should be absent.
    expect(screen.queryByText("// hi there")).not.toBeInTheDocument();
    // Heading content still renders.
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("omits the tabs list when tabs is empty", () => {
    render(<About {...baseProps} tabs={[]} data-testid="about" />);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders with no optional content without crashing", () => {
    render(<About data-testid="about" />);

    const section = screen.getByTestId("about");
    expect(section).toBeInTheDocument();
    // No heading, no eyebrow, no tabs.
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
