import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CtaGroup } from "./CtaGroup";
import { ctaGroupClass } from "./CtaGroup.styles";

describe("CtaGroup", () => {
  it("renders a grouping container with role=group", () => {
    render(<CtaGroup />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    render(<CtaGroup data-testid="cta" />);
    expect(screen.getByTestId("cta").tagName).toBe("DIV");
  });

  it("renders its child action controls", () => {
    render(
      <CtaGroup>
        <button type="button">View work</button>
        <a href="/resume">Résumé</a>
      </CtaGroup>,
    );

    const group = screen.getByRole("group");
    const button = screen.getByRole("button", { name: "View work" });
    const link = screen.getByRole("link", { name: "Résumé" });

    expect(button).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    // Children are nested inside the group container.
    expect(group).toContainElement(button);
    expect(group).toContainElement(link);
  });

  it("applies the base layout tokens from CtaGroup.styles", () => {
    render(<CtaGroup />);
    expect(screen.getByRole("group")).toHaveClass(...ctaGroupClass.split(" "));
  });

  it("merges a consumer className with the base class", () => {
    render(<CtaGroup className="mt-6" />);

    const group = screen.getByRole("group");
    expect(group).toHaveClass("mt-6");
    // Base tokens are retained alongside the custom class.
    expect(group).toHaveClass(...ctaGroupClass.split(" "));
  });

  it("spreads arbitrary props (id, aria-label) onto the root", () => {
    render(<CtaGroup id="hero-ctas" aria-label="Primary actions" />);

    const group = screen.getByRole("group", { name: "Primary actions" });
    expect(group).toHaveAttribute("id", "hero-ctas");
    expect(group).toHaveAccessibleName("Primary actions");
  });

  it("exposes an accessible name via aria-label so the group is nameable", () => {
    render(<CtaGroup aria-label="Footer actions" />);
    // getByRole with a name resolves only when the accessible name matches.
    expect(
      screen.getByRole("group", { name: "Footer actions" }),
    ).toBeInTheDocument();
  });

  it("forwards click interactions to child controls", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <CtaGroup>
        <button type="button" onClick={onClick}>
          Contact
        </button>
      </CtaGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Contact" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards event handlers on the group root itself", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <CtaGroup onClick={onClick}>
        <span>content</span>
      </CtaGroup>,
    );

    await user.click(screen.getByRole("group"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders no children when none are provided", () => {
    render(<CtaGroup />);
    expect(screen.getByRole("group")).toBeEmptyDOMElement();
  });

  it("renders multiple children in source order", () => {
    render(
      <CtaGroup>
        <button type="button">First</button>
        <button type="button">Second</button>
      </CtaGroup>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("First");
    expect(buttons[1]).toHaveTextContent("Second");
  });
});
