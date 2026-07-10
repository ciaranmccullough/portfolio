import { render, screen } from "@testing-library/react";

import { StoryHeader } from "./StoryHeader";
import { storyHeaderClass } from "./StoryHeader.styles";

function renderDefault() {
  return render(
    <StoryHeader
      brand="Ciaran"
      brandHref="/"
      backLabel="Back to work"
      backHref="/#work"
    />,
  );
}

describe("StoryHeader", () => {
  it("mounts as a banner landmark without crashing", () => {
    const { container } = renderDefault();

    const header = screen.getByRole("banner");
    expect(container.querySelector("header")).toBe(header);
    expect(header).toHaveClass(...storyHeaderClass.split(" "));
  });

  it("renders the brand as a link to brandHref", () => {
    renderDefault();

    const brand = screen.getByRole("link", { name: "Ciaran" });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("renders the back link with the decorative arrow and backLabel, pointing at backHref", () => {
    renderDefault();

    const back = screen.getByRole("link", { name: /Back to work/ });
    expect(back).toHaveAttribute("href", "/#work");
    expect(back).toHaveTextContent("← Back to work");
  });

  it("hides the back link's arrow glyph from the accessibility tree", () => {
    renderDefault();

    const back = screen.getByRole("link", { name: /Back to work/ });
    const arrow = back.querySelector('[aria-hidden="true"]');
    expect(arrow).toHaveTextContent("←");
  });

  it("renders exactly two links: brand and back", () => {
    renderDefault();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("merges a consumer className while keeping the base class", () => {
    render(
      <StoryHeader
        brand="Ciaran"
        brandHref="/"
        backLabel="Back to work"
        backHref="/#work"
        className="custom-class"
      />,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveClass(storyHeaderClass.split(" ")[0]);
    expect(header).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*) onto the <header> root", () => {
    render(
      <StoryHeader
        brand="Ciaran"
        brandHref="/"
        backLabel="Back to work"
        backHref="/#work"
        id="story-header"
        data-testid="story-header"
      />,
    );

    expect(screen.getByTestId("story-header")).toHaveAttribute(
      "id",
      "story-header",
    );
  });
});
