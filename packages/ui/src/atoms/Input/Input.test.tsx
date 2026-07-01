import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./Input";
import { inputClass } from "./Input.styles";

describe("Input", () => {
  it("renders a native <input> textbox element", () => {
    render(<Input aria-label="Full name" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("applies the base input class tokens from Input.styles", () => {
    render(<Input aria-label="Full name" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    // Assert against the real style record rather than hardcoded strings.
    expect(input).toHaveClass(...inputClass.split(" "));
  });

  it("merges an incoming className alongside the base tokens", () => {
    render(<Input aria-label="Full name" className="mt-4 custom-input" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    // Custom classes are present...
    expect(input).toHaveClass("mt-4", "custom-input");
    // ...and the base tokens remain (className does not replace them).
    expect(input).toHaveClass(...inputClass.split(" "));
  });

  it("does not render a className attribute for a falsy incoming className", () => {
    render(<Input aria-label="Full name" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    // cn drops falsy values, so only the base tokens are present (no stray
    // trailing/leading whitespace from an undefined className).
    expect(input).toHaveAttribute("class", inputClass);
  });

  it("spreads arbitrary native props onto the input element", () => {
    render(
      <Input
        aria-label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        defaultValue="ada@analytical.engine"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
    expect(input).toHaveValue("ada@analytical.engine");
  });

  it("spreads aria-* attributes onto the input element", () => {
    render(
      <Input
        aria-label="Search"
        aria-describedby="search-hint"
        aria-invalid="true"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toHaveAttribute("aria-describedby", "search-hint");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("exposes an accessible name via aria-label", () => {
    render(<Input aria-label="Full name" />);

    expect(screen.getByRole("textbox")).toHaveAccessibleName("Full name");
  });

  it("associates a <label htmlFor> with the input for its accessible name", () => {
    render(
      <>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Username" });
    expect(input).toHaveAttribute("id", "username");
    expect(input).toHaveAccessibleName("Username");
  });

  it("forwards ref to the underlying input element (React 19 ref-as-prop)", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Full name" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(
      screen.getByRole("textbox", { name: "Full name" }),
    );
  });

  it("supports uncontrolled usage: reads the value from the DOM via ref", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Full name" ref={ref} defaultValue="Ada" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    expect(ref.current?.value).toBe("Ada");

    await user.clear(input);
    await user.type(input, "Grace Hopper");

    expect(ref.current?.value).toBe("Grace Hopper");
    expect(input).toHaveValue("Grace Hopper");
  });

  it("honors the native disabled state", () => {
    render(<Input aria-label="Full name" disabled />);

    expect(screen.getByRole("textbox", { name: "Full name" })).toBeDisabled();
  });

  it("does not accept typing while disabled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Full name" disabled defaultValue="" />);

    const input = screen.getByRole("textbox", { name: "Full name" });
    await user.type(input, "should not appear");

    expect(input).toHaveValue("");
  });

  it("fires onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Input aria-label="Full name" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Full name" }), "abc");

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
