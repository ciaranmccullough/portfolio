import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Textarea } from "./Textarea";
import { textareaClass } from "./Textarea.styles";

describe("Textarea", () => {
  it("renders a native <textarea> element", () => {
    render(<Textarea aria-label="Message" />);

    const el = screen.getByRole("textbox", { name: "Message" });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("TEXTAREA");
  });

  it("applies the base textarea class tokens", () => {
    render(<Textarea aria-label="Message" />);

    const el = screen.getByRole("textbox", { name: "Message" });
    // Assert against the real style record rather than hardcoded strings.
    expect(el).toHaveClass(...textareaClass.split(" "));
  });

  it("merges an incoming className alongside the base classes", () => {
    render(<Textarea aria-label="Message" className="custom-class mt-4" />);

    const el = screen.getByRole("textbox", { name: "Message" });
    // Custom class present…
    expect(el).toHaveClass("custom-class", "mt-4");
    // …and the base tokens are preserved.
    expect(el).toHaveClass(...textareaClass.split(" "));
  });

  it("spreads arbitrary props and aria-* attributes onto the root element", () => {
    render(
      <Textarea
        aria-label="Message"
        name="message"
        rows={6}
        placeholder="Say hi"
        aria-describedby="hint"
        data-testid="ignored-by-query"
      />,
    );

    const el = screen.getByRole("textbox", { name: "Message" });
    expect(el).toHaveAttribute("name", "message");
    expect(el).toHaveAttribute("rows", "6");
    expect(el).toHaveAttribute("placeholder", "Say hi");
    expect(el).toHaveAttribute("aria-describedby", "hint");
  });

  it("forwards the ref to the underlying <textarea> (React 19 ref-as-prop)", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Message" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Message" }));
  });

  it("supports uncontrolled usage via defaultValue", () => {
    render(<Textarea aria-label="Message" defaultValue="hello world" />);

    const el = screen.getByRole("textbox", { name: "Message" });
    expect(el).toHaveValue("hello world");
  });

  it("accepts user typing when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Message" />);

    const el = screen.getByRole("textbox", { name: "Message" });
    await user.type(el, "a new line");

    expect(el).toHaveValue("a new line");
  });

  it("reflects the native disabled state", () => {
    render(<Textarea aria-label="Message" disabled />);

    const el = screen.getByRole("textbox", { name: "Message" });
    expect(el).toBeDisabled();
  });

  it("exposes an accessible name via aria-label", () => {
    render(<Textarea aria-label="Your feedback" />);

    const el = screen.getByRole("textbox", { name: "Your feedback" });
    expect(el).toHaveAccessibleName("Your feedback");
  });

  it("is programmatically labellable via a linked <label>", () => {
    render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" />
      </>,
    );

    const el = screen.getByRole("textbox", { name: "Bio" });
    expect(el).toHaveAccessibleName("Bio");
    expect(el).toHaveAttribute("id", "bio");
  });
});
