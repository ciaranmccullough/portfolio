import { render, screen, within } from "@testing-library/react";

import { SkillCategory } from "./SkillCategory";
import {
  skillCategoryBase,
  skillCategoryDotBase,
  skillCategoryDotTone,
  skillCategoryListClass,
  skillCategorySurface,
  skillCategoryTitleBase,
  skillCategoryTitleTone,
} from "./SkillCategory.styles";
import type { SkillCategoryTone } from "./SkillCategory.types";

const TONES: SkillCategoryTone[] = ["violet", "orange", "green", "amber"];

describe("SkillCategory", () => {
  it("renders the title as an <h3> heading", () => {
    render(<SkillCategory title="Languages" />);

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Languages",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H3");
  });

  it("renders as a <section> region", () => {
    const { container } = render(<SkillCategory title="Languages" />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("renders its children inside a <ul> list", () => {
    render(
      <SkillCategory title="Languages">
        <li>TypeScript</li>
        <li>Kotlin</li>
      </SkillCategory>,
    );

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("TypeScript");
    expect(items[1]).toHaveTextContent("Kotlin");
  });

  it("renders an empty list when no children are supplied", () => {
    render(<SkillCategory title="Empty" />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders a decorative dot that is hidden from assistive tech", () => {
    const { container } = render(<SkillCategory title="Languages" />);

    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass(...skillCategoryDotBase.split(" "));
  });

  it("keeps the dot inside the heading and excludes it from the accessible name", () => {
    render(<SkillCategory title="Languages" />);

    // aria-hidden dot means the heading's accessible name is just the title.
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveAccessibleName("Languages");
    expect(
      heading.querySelector('span[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });

  it("applies base surface, title and list classes", () => {
    const { container } = render(<SkillCategory title="Languages" />);

    const section = container.querySelector("section");
    expect(section).toHaveClass(...skillCategoryBase.split(" "));

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass(...skillCategoryTitleBase.split(" "));

    const list = screen.getByRole("list");
    expect(list).toHaveClass(...skillCategoryListClass.split(" "));
  });

  it("defaults to the violet tone when no tone prop is given", () => {
    const { container } = render(<SkillCategory title="Languages" />);

    const section = container.querySelector("section");
    expect(section).toHaveClass(skillCategorySurface.violet);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass(skillCategoryTitleTone.violet);

    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toHaveClass(skillCategoryDotTone.violet);
  });

  it.each(TONES)(
    "applies the %s tone tokens to surface, title and dot",
    (tone) => {
      const { container } = render(
        <SkillCategory title="Languages" tone={tone} />,
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass(skillCategorySurface[tone]);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveClass(skillCategoryTitleTone[tone]);

      const dot = container.querySelector('span[aria-hidden="true"]');
      expect(dot).toHaveClass(skillCategoryDotTone[tone]);
    },
  );

  it("merges a consumer-supplied className onto the section without dropping the base", () => {
    const { container } = render(
      <SkillCategory title="Languages" className="custom-class" />,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
    expect(section).toHaveClass(...skillCategoryBase.split(" "));
    expect(section).toHaveClass(skillCategorySurface.violet);
  });

  it("forwards arbitrary section props (id, aria-label, data-*) to the root element", () => {
    const { container } = render(
      <SkillCategory
        title="Languages"
        id="skills-languages"
        aria-label="Programming languages"
        data-testid="skill-category"
      />,
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "skills-languages");
    expect(section).toHaveAttribute("aria-label", "Programming languages");
    expect(section).toHaveAttribute("data-testid", "skill-category");
  });

  it("supports an aria-labelledby association wiring the section to its heading text", () => {
    // The consumer owns the id: they place it on the title node and point
    // aria-labelledby (spread onto the <section>) at it. Once both sides are
    // present the section resolves to a named region.
    render(
      <SkillCategory
        title={<span id="lang-heading">Languages</span>}
        aria-labelledby="lang-heading"
      >
        <li>TypeScript</li>
      </SkillCategory>,
    );

    const region = screen.getByRole("region", { name: "Languages" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("aria-labelledby", "lang-heading");
  });

  it("accepts ReactNode titles, not just strings", () => {
    render(<SkillCategory title={<em>Fancy Title</em>} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Fancy Title");
    expect(heading.querySelector("em")).toBeInTheDocument();
  });
});
