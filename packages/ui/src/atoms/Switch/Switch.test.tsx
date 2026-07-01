import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./Switch";
import { switchWrapperClass } from "./Switch.styles";

describe("Switch", () => {
  it("renders a switch-role checkbox input inside a label", () => {
    render(<Switch aria-label="Analytics" />);

    const toggle = screen.getByRole("switch", { name: "Analytics" });
    expect(toggle.tagName).toBe("INPUT");
    expect(toggle).toHaveAttribute("type", "checkbox");
    expect(toggle.closest("label")).not.toBeNull();
    expect(toggle).not.toBeChecked();
  });

  it("honours defaultChecked (uncontrolled initial state)", () => {
    render(<Switch aria-label="Analytics" defaultChecked />);
    expect(screen.getByRole("switch", { name: "Analytics" })).toBeChecked();
  });

  it("toggles on click and reflects the value through a ref (uncontrolled)", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(<Switch aria-label="Analytics" ref={ref} defaultChecked={false} />);

    const toggle = screen.getByRole("switch", { name: "Analytics" });
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.checked).toBe(false);

    await user.click(toggle);
    expect(ref.current?.checked).toBe(true);
    expect(toggle).toBeChecked();

    await user.click(toggle);
    expect(ref.current?.checked).toBe(false);
  });

  it("fires native onChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Switch aria-label="Analytics" onChange={onChange} />);

    await user.click(screen.getByRole("switch", { name: "Analytics" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is checked, disabled and non-toggleable when locked", async () => {
    const user = userEvent.setup();
    render(<Switch locked aria-label="Strictly necessary" />);

    const toggle = screen.getByRole("switch", { name: "Strictly necessary" });
    expect(toggle).toBeChecked();
    expect(toggle).toBeDisabled();
    // Shows the lock glyph.
    expect(toggle.closest("label")?.querySelector("svg")).not.toBeNull();

    await user.click(toggle);
    // Still checked — a disabled input can't be toggled.
    expect(toggle).toBeChecked();
  });

  it("forwards native input props (name) to the input", () => {
    render(<Switch aria-label="Analytics" name="analytics" />);
    expect(screen.getByRole("switch", { name: "Analytics" })).toHaveAttribute(
      "name",
      "analytics",
    );
  });

  it("merges an incoming className onto the label wrapper", () => {
    render(<Switch aria-label="X" className="custom-x" />);

    const label = screen.getByRole("switch", { name: "X" }).closest("label");
    expect(label).toHaveClass("custom-x");
    expect(label).toHaveClass(...switchWrapperClass.split(" "));
  });
});
