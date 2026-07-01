import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./Switch";
import { switchTrackBase, switchTrackState } from "./Switch.styles";

describe("Switch", () => {
  it("renders a switch-role button reflecting the checked state", () => {
    render(<Switch checked={false} aria-label="Analytics" />);

    const toggle = screen.getByRole("switch", { name: "Analytics" });
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveClass(...switchTrackBase.split(" "));
    expect(toggle).toHaveClass(switchTrackState.off);
  });

  it("reflects the on state with the on track colour", () => {
    render(<Switch checked aria-label="Analytics" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveClass(switchTrackState.on);
  });

  it("calls onCheckedChange with the negated value when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    render(
      <Switch
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Analytics"
      />,
    );

    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("is disabled, reads as on and never fires when locked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    render(
      <Switch
        checked={false}
        locked
        onCheckedChange={onCheckedChange}
        aria-label="Strictly necessary"
      />,
    );

    const toggle = screen.getByRole("switch");
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveClass(switchTrackState.locked);
    // Shows the lock glyph in the knob.
    expect(toggle.querySelector("svg")).not.toBeNull();

    await user.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("merges an incoming className alongside the base classes", () => {
    render(<Switch checked={false} className="custom-x" aria-label="X" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("custom-x");
    expect(toggle).toHaveClass(...switchTrackBase.split(" "));
  });
});
