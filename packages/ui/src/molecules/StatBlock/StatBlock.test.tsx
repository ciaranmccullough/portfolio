import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StatBlock } from "./StatBlock";
import {
  statBlockClass,
  statBlockLabelClass,
  statBlockValueClass,
} from "./StatBlock.styles";

/**
 * Helper: StatBlock renders an `<li>`, so it must live inside a list to be a
 * valid listitem. Render inside a `<ul>` so `getByRole("listitem")` resolves.
 */
function renderInList(ui: React.ReactElement) {
  return render(<ul>{ui}</ul>);
}

describe("StatBlock", () => {
  it("renders the value and the label text", () => {
    renderInList(<StatBlock value="5+ yrs" label="shipping production" />);

    expect(screen.getByText("5+ yrs")).toBeInTheDocument();
    expect(screen.getByText("shipping production")).toBeInTheDocument();
  });

  it("renders as a single list item (`<li>`)", () => {
    renderInList(<StatBlock value="10" label="projects" />);

    const item = screen.getByRole("listitem");
    expect(item.tagName).toBe("LI");
  });

  it("renders the value inside a <strong> element with the value class tokens", () => {
    renderInList(<StatBlock value="42" label="commits" />);

    const value = screen.getByText("42");
    expect(value.tagName).toBe("STRONG");
    expect(value).toHaveClass(...statBlockValueClass.split(" "));
  });

  it("renders the label inside a <span> element with the label class tokens", () => {
    renderInList(<StatBlock value="42" label="commits" />);

    const label = screen.getByText("commits");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass(...statBlockLabelClass.split(" "));
  });

  it("applies the base container class tokens to the <li>", () => {
    renderInList(<StatBlock value="99" label="uptime" />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass(...statBlockClass.split(" "));
  });

  it("merges a consumer-supplied className while keeping the base classes", () => {
    renderInList(
      <StatBlock value="1" label="extra" className="custom-class" />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("custom-class");
    // base tokens are still present alongside the override
    expect(item).toHaveClass(...statBlockClass.split(" "));
  });

  it("renders ReactNode values and labels, not just strings", () => {
    renderInList(
      <StatBlock
        value={<span data-testid="node-value">99%</span>}
        label={<em data-testid="node-label">success rate</em>}
      />,
    );

    const item = screen.getByRole("listitem");
    const nodeValue = within(item).getByTestId("node-value");
    const nodeLabel = within(item).getByTestId("node-label");

    expect(nodeValue).toHaveTextContent("99%");
    expect(nodeLabel).toHaveTextContent("success rate");
    // The custom node label is an <em>, confirming ReactNode is passed through.
    expect(nodeLabel.tagName).toBe("EM");
  });

  it("spreads arbitrary props (id, data-*, aria-*) onto the <li> root", () => {
    renderInList(
      <StatBlock
        value="7"
        label="teams"
        id="stat-teams"
        data-analytics="stat"
        aria-label="seven teams"
      />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("id", "stat-teams");
    expect(item).toHaveAttribute("data-analytics", "stat");
    expect(item).toHaveAttribute("aria-label", "seven teams");
  });

  it("forwards event handlers to the root element", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    renderInList(<StatBlock value="3" label="clickable" onClick={onClick} />);

    await user.click(screen.getByRole("listitem"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders value and label in DOM order (value before label)", () => {
    renderInList(<StatBlock value="first" label="second" />);

    const value = screen.getByText("first");
    const label = screen.getByText("second");

    // value precedes label in document order
    expect(
      value.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("keeps the value and label as separate elements (does not concatenate)", () => {
    renderInList(<StatBlock value="12" label="12" />);

    const item = screen.getByRole("listitem");
    // Both a <strong> and a <span> exist, each containing "12"
    expect(item.querySelector("strong")).toHaveTextContent("12");
    expect(item.querySelector("span")).toHaveTextContent("12");
  });
});
