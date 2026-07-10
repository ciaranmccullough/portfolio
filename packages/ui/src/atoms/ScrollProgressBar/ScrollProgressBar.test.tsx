import { render, screen } from "@testing-library/react";

import { ScrollProgressBar } from "./ScrollProgressBar";
import { scrollProgressBarClass } from "./ScrollProgressBar.styles";

describe("ScrollProgressBar", () => {
  it("renders a progressbar-role <div> with the base class", () => {
    render(<ScrollProgressBar />);
    const bar = screen.getByRole("progressbar");
    expect(bar.tagName).toBe("DIV");
    expect(bar).toHaveClass(...scrollProgressBarClass.split(" "));
  });

  it("defaults progress to 0", () => {
    render(<ScrollProgressBar />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveStyle({ transform: "scaleX(0)" });
  });

  it("reflects the progress prop in aria-valuenow and the scaleX transform", () => {
    render(<ScrollProgressBar progress={42} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveStyle({ transform: "scaleX(0.42)" });
  });

  it("exposes the static aria-valuemin/aria-valuemax bounds", () => {
    render(<ScrollProgressBar progress={42} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps progress above 100 down to 100", () => {
    render(<ScrollProgressBar progress={250} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveStyle({ transform: "scaleX(1)" });
  });

  it("clamps negative progress up to 0", () => {
    render(<ScrollProgressBar progress={-10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveStyle({ transform: "scaleX(0)" });
  });

  it("lets an explicit style.transform override the computed one", () => {
    render(
      <ScrollProgressBar progress={50} style={{ transform: "scaleX(0.9)" }} />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle({ transform: "scaleX(0.9)" });
  });

  it("merges a consumer className while keeping the base class", () => {
    render(<ScrollProgressBar className="custom-class" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveClass("custom-class");
    expect(bar).toHaveClass(...scrollProgressBarClass.split(" "));
  });

  it("spreads arbitrary props (id, data-*) onto the root", () => {
    render(<ScrollProgressBar id="scroll-progress" data-testid="bar" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("id", "scroll-progress");
    expect(bar).toHaveAttribute("data-testid", "bar");
  });
});
