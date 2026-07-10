import { render, screen } from "@testing-library/react";

import { PrincipleCard } from "./PrincipleCard";
import {
  principleCardClass,
  principleCardIndexTone,
} from "./PrincipleCard.styles";

function renderInList(ui: React.ReactElement) {
  return render(<ol>{ui}</ol>);
}

describe("PrincipleCard", () => {
  it("renders as a single list item (<li>) with the base class", () => {
    renderInList(<PrincipleCard index="01" title="Instant, even on launch" />);

    const item = screen.getByRole("listitem");
    expect(item.tagName).toBe("LI");
    expect(item).toHaveClass(...principleCardClass.split(" "));
  });

  it("renders the title as an <h3> heading", () => {
    renderInList(<PrincipleCard index="01" title="Instant, even on launch" />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Instant, even on launch",
      }),
    ).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    renderInList(
      <PrincipleCard
        index="01"
        title="Instant, even on launch"
        description="Perceived performance came first."
      />,
    );

    expect(
      screen.getByText("Perceived performance came first."),
    ).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    const { container } = renderInList(
      <PrincipleCard index="01" title="Instant, even on launch" />,
    );

    // Only the heading <p>/<h3> renders; no second text block.
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders the numeral text but hides it from the accessibility tree", () => {
    renderInList(<PrincipleCard index="01" title="Instant" />);

    const numeral = screen.getByText("01");
    expect(numeral).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults tone to violet", () => {
    renderInList(<PrincipleCard index="01" title="Instant" />);

    const numeral = screen.getByText("01");
    expect(numeral).toHaveClass(...principleCardIndexTone.violet.split(" "));
  });

  it.each(["violet", "orange", "green"] as const)(
    "applies the %s tone's numeral colour",
    (tone) => {
      renderInList(<PrincipleCard index="02" title="Title" tone={tone} />);

      const numeral = screen.getByText("02");
      expect(numeral).toHaveClass(...principleCardIndexTone[tone].split(" "));
    },
  );

  it("merges a consumer className while keeping the base class", () => {
    renderInList(
      <PrincipleCard index="01" title="Instant" className="custom-class" />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("custom-class");
    expect(item).toHaveClass(...principleCardClass.split(" "));
  });

  it("spreads arbitrary props (id, data-*, aria-*) onto the <li> root", () => {
    renderInList(
      <PrincipleCard
        index="01"
        title="Instant"
        id="principle-1"
        data-analytics="principle"
      />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("id", "principle-1");
    expect(item).toHaveAttribute("data-analytics", "principle");
  });

  it("renders index, title and description in DOM order", () => {
    renderInList(
      <PrincipleCard index="01" title="Title text" description="Body text" />,
    );

    const index = screen.getByText("01");
    const title = screen.getByText("Title text");
    const description = screen.getByText("Body text");

    expect(
      index.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      title.compareDocumentPosition(description) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
