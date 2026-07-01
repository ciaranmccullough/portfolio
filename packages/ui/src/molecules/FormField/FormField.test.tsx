import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FormField } from "./FormField";
import {
  formFieldCaptionClass,
  formFieldControlInvalidClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from "./FormField.styles";

describe("FormField", () => {
  describe("structure & child atoms", () => {
    it("renders a single-line <input> control by default", () => {
      render(<FormField label="Email" />);

      const control = screen.getByRole("textbox", { name: "Email" });
      expect(control).toBeInTheDocument();
      expect(control.tagName).toBe("INPUT");
    });

    it("renders a multi-line <textarea> control when `multiline` is set", () => {
      render(<FormField label="Enquiry" multiline />);

      const control = screen.getByRole("textbox", { name: "Enquiry" });
      expect(control).toBeInTheDocument();
      expect(control.tagName).toBe("TEXTAREA");
    });

    it("wraps the control in a <label> element carrying the label class", () => {
      const { container } = render(<FormField label="Email" />);

      const label = container.querySelector("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass(...formFieldLabelClass.split(" "));
    });

    it("renders the label caption text with the caption class tokens", () => {
      render(<FormField label="Full name" />);

      const caption = screen.getByText("Full name");
      expect(caption.tagName).toBe("SPAN");
      expect(caption).toHaveClass(...formFieldCaptionClass.split(" "));
    });

    it("renders a ReactNode label (not just a string)", () => {
      render(<FormField label={<em>Emphasised</em>} aria-label="fallback" />);

      // The caption node renders its children.
      expect(screen.getByText("Emphasised").tagName).toBe("EM");
    });
  });

  describe("label <-> control association", () => {
    it("associates the label with the control (getByLabelText resolves it)", () => {
      render(<FormField label="Email" />);

      const control = screen.getByLabelText("Email");
      expect(control).toBeInstanceOf(HTMLInputElement);
      expect(control).toHaveAccessibleName("Email");
    });

    it("uses a supplied `id` for the control and the label's htmlFor", () => {
      const { container } = render(
        <FormField label="Email" id="email-field" />,
      );

      const control = screen.getByLabelText("Email");
      expect(control).toHaveAttribute("id", "email-field");

      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "email-field");
    });

    it("falls back to a generated id that links the label and control", () => {
      const { container } = render(<FormField label="Email" />);

      const control = screen.getByLabelText("Email");
      const generatedId = control.getAttribute("id");
      expect(generatedId).toBeTruthy();

      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", generatedId);
    });

    it("associates label and control for the multiline variant too", () => {
      render(<FormField label="Enquiry" multiline />);

      const control = screen.getByLabelText("Enquiry");
      expect(control).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe("error handling & aria wiring", () => {
    it("renders the error message text", () => {
      render(<FormField label="Email" error="Invalid email address" />);

      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    it("flags the control invalid and links it to the error via aria-describedby", () => {
      render(<FormField label="Email" id="email" error="Bad value" />);

      // NOTE: the error <span> lives *inside* the <label>, so its text folds
      // into the control's accessible name ("Email Bad value") — see the
      // documented product-behaviour test at the end of this block.
      const control = screen.getByRole("textbox");
      expect(control).toHaveAttribute("aria-invalid", "true");

      const describedBy = control.getAttribute("aria-describedby");
      expect(describedBy).toBe("email-error");

      // The referenced element exists and holds the error text.
      const errorNode = document.getElementById(describedBy as string);
      expect(errorNode).toHaveTextContent("Bad value");
    });

    it("derives the error node id from the control id", () => {
      render(<FormField label="Email" id="custom-id" error="Nope" />);

      const control = screen.getByRole("textbox");
      const errorNode = document.getElementById("custom-id-error");
      expect(errorNode).toBeInTheDocument();
      expect(control).toHaveAttribute("aria-describedby", "custom-id-error");
    });

    it("applies the invalid class token to the control when in error", () => {
      render(<FormField label="Email" error="Bad" />);

      const control = screen.getByRole("textbox");
      expect(control).toHaveClass(formFieldControlInvalidClass);
    });

    it("announces the error politely via an aria-live region with the error class", () => {
      render(<FormField label="Email" error="Announce me" />);

      const errorNode = screen.getByText("Announce me");
      expect(errorNode).toHaveAttribute("aria-live", "polite");
      expect(errorNode).toHaveClass(...formFieldErrorClass.split(" "));
    });

    it("omits aria-invalid and aria-describedby when there is no error", () => {
      render(<FormField label="Email" />);

      const control = screen.getByRole("textbox", { name: "Email" });
      expect(control).not.toHaveAttribute("aria-invalid");
      expect(control).not.toHaveAttribute("aria-describedby");
    });

    it("does not apply the invalid class when there is no error", () => {
      render(<FormField label="Email" />);

      const control = screen.getByRole("textbox", { name: "Email" });
      expect(control).not.toHaveClass(formFieldControlInvalidClass);
    });

    it("always reserves the error slot (present even without a message) so layout never jumps", () => {
      const { container } = render(<FormField label="Email" />);

      // The space-reserving error slot always exists, even when empty.
      const errorSlot = container.querySelector('[aria-live="polite"]');
      expect(errorSlot).toBeInTheDocument();
      expect(errorSlot).toHaveClass(...formFieldErrorClass.split(" "));
      expect(errorSlot).toBeEmptyDOMElement();
    });

    it("wires error aria attributes for the multiline variant too", () => {
      render(<FormField label="Enquiry" multiline id="enq" error="Required" />);

      const control = screen.getByRole("textbox");
      expect(control.tagName).toBe("TEXTAREA");
      expect(control).toHaveAttribute("aria-invalid", "true");
      expect(control).toHaveAttribute("aria-describedby", "enq-error");
    });

    // Documents a genuine accessibility quirk (see notes): because both the
    // caption AND the error <span> live inside the wrapping <label>, the error
    // text is concatenated into the control's accessible NAME, not just its
    // description. With an error present the field is announced as
    // "Email <error>" rather than "Email", described-by "Email".
    it("folds the error text into the control's accessible name (label-nesting quirk)", () => {
      render(<FormField label="Email" error="Bad value" />);

      const control = screen.getByRole("textbox");
      expect(control).toHaveAccessibleName("Email Bad value");
      // The same field with no error is announced cleanly as just "Email".
    });

    it("announces a clean accessible name of just the label when there is no error", () => {
      render(<FormField label="Email" />);

      expect(
        screen.getByRole("textbox", { name: "Email" }),
      ).toHaveAccessibleName("Email");
    });
  });

  describe("className merging & prop pass-through", () => {
    it("merges an incoming className onto the control", () => {
      render(<FormField label="Email" className="mt-4 custom" />);

      const control = screen.getByRole("textbox", { name: "Email" });
      expect(control).toHaveClass("mt-4", "custom");
    });

    it("keeps the invalid token alongside a custom className when in error", () => {
      render(<FormField label="Email" className="custom" error="Bad" />);

      const control = screen.getByRole("textbox");
      expect(control).toHaveClass("custom");
      expect(control).toHaveClass(formFieldControlInvalidClass);
    });

    it("spreads native attributes through to the control", () => {
      render(
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />,
      );

      const control = screen.getByRole("textbox", { name: "Email" });
      expect(control).toHaveAttribute("name", "email");
      expect(control).toHaveAttribute("type", "email");
      expect(control).toHaveAttribute("placeholder", "you@example.com");
      expect(control).toBeRequired();
    });

    it("spreads textarea-specific attributes through in the multiline variant", () => {
      render(<FormField label="Enquiry" multiline rows={6} name="enquiry" />);

      const control = screen.getByRole("textbox", { name: "Enquiry" });
      expect(control).toHaveAttribute("rows", "6");
      expect(control).toHaveAttribute("name", "enquiry");
    });

    it("forwards a ref to the underlying input (React 19 ref-as-prop)", () => {
      const ref = createRef<HTMLInputElement>();
      render(<FormField label="Email" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByRole("textbox", { name: "Email" }));
    });

    it("forwards a ref to the underlying textarea in the multiline variant", () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<FormField label="Enquiry" multiline ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current).toBe(
        screen.getByRole("textbox", { name: "Enquiry" }),
      );
    });
  });

  describe("uncontrolled value & user interactions", () => {
    it("supports uncontrolled usage via defaultValue", () => {
      render(<FormField label="Email" defaultValue="ada@example.com" />);

      expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
        "ada@example.com",
      );
    });

    it("accepts user typing into the input", async () => {
      const user = userEvent.setup();
      render(<FormField label="Email" />);

      const control = screen.getByRole("textbox", { name: "Email" });
      await user.type(control, "hello@world.dev");

      expect(control).toHaveValue("hello@world.dev");
    });

    it("accepts user typing into the multiline textarea", async () => {
      const user = userEvent.setup();
      render(<FormField label="Enquiry" multiline />);

      const control = screen.getByRole("textbox", { name: "Enquiry" });
      await user.type(control, "A short project brief");

      expect(control).toHaveValue("A short project brief");
    });

    it("fires onChange as the user types", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<FormField label="Email" onChange={onChange} />);

      await user.type(screen.getByRole("textbox", { name: "Email" }), "hi");

      expect(onChange).toHaveBeenCalled();
    });

    it("focuses the control when the user clicks the label caption", async () => {
      const user = userEvent.setup();
      render(<FormField label="Email" />);

      await user.click(screen.getByText("Email"));

      expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();
    });

    it("reflects the native disabled state", () => {
      render(<FormField label="Email" disabled />);

      expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
    });
  });
});
