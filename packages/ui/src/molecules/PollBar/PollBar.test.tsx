import { render, screen } from "@testing-library/react";

import { PollBar } from "./PollBar";
import { pollBarClass, pollBarFillLeadingClass } from "./PollBar.styles";
import type { PollOption } from "./PollBar.types";

const options: PollOption[] = [
  { label: "Bellingham", value: 57, leading: true },
  { label: "Kane", value: 19 },
  { label: "Saka", value: 6 },
];

describe("PollBar", () => {
  it("renders a <ul> root with the base class", () => {
    render(<PollBar options={options} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list).toHaveClass(...pollBarClass.split(" "));
  });

  it("renders one <li> row per option", () => {
    render(<PollBar options={options} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(options.length);
  });

  it("renders each option's label and percentage as visible text", () => {
    render(<PollBar options={options} />);

    options.forEach((option) => {
      expect(screen.getByText(option.label as string)).toBeInTheDocument();
      expect(screen.getByText(`${option.value}%`)).toBeInTheDocument();
    });
  });

  it("hides the decorative fill track from the accessibility tree", () => {
    const { container } = render(<PollBar options={options} />);
    const tracks = container.querySelectorAll('[aria-hidden="true"]');
    expect(tracks).toHaveLength(options.length);
  });

  it("sets the fill width from the option's value via inline style", () => {
    const { container } = render(<PollBar options={options} />);
    const fills = container.querySelectorAll('[aria-hidden="true"] > div');
    expect(fills[0]).toHaveStyle({ width: "57%" });
    expect(fills[1]).toHaveStyle({ width: "19%" });
    expect(fills[2]).toHaveStyle({ width: "6%" });
  });

  it("applies the leading accent colour only to the leading option's fill", () => {
    const { container } = render(<PollBar options={options} />);
    const fills = container.querySelectorAll('[aria-hidden="true"] > div');
    expect(fills[0]).toHaveClass(pollBarFillLeadingClass);
    expect(fills[1]).not.toHaveClass(pollBarFillLeadingClass);
    expect(fills[2]).not.toHaveClass(pollBarFillLeadingClass);
  });

  it("clamps an out-of-range value into 0–100", () => {
    render(
      <PollBar
        options={[
          { label: "Over", value: 140 },
          { label: "Under", value: -20 },
        ]}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders an empty list when options is empty", () => {
    render(<PollBar options={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("merges a consumer className while keeping the base class", () => {
    render(<PollBar options={options} className="custom-class" />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("custom-class");
    expect(list).toHaveClass(...pollBarClass.split(" "));
  });

  it("spreads arbitrary props (id, data-*, aria-label) onto the <ul>", () => {
    render(<PollBar options={options} id="poll" aria-label="Poll results" />);
    const list = screen.getByRole("list", { name: "Poll results" });
    expect(list).toHaveAttribute("id", "poll");
  });
});
