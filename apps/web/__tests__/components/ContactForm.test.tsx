// ContactForm imports @portfolio/ui (ESM in node_modules) and motion/react
// (ESM) — both skipped by next/jest — so mock them with lightweight,
// accessible stubs. The stubs render real <input>/<textarea>/<button> elements
// (forwarding refs) so the form's uncontrolled reads and user interactions work.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    Button: ({
      children,
      variant: _variant,
      ...props
    }: Record<string, unknown>) =>
      React.createElement("button", props, children as React.ReactNode),
    FormField: React.forwardRef(function FormField(
      { label, error, multiline, ...props }: Record<string, unknown>,
      ref: React.Ref<HTMLElement>,
    ) {
      const Tag = multiline ? "textarea" : "input";
      return React.createElement(
        "div",
        null,
        React.createElement(Tag, { ref, "aria-label": label, ...props }),
        error
          ? React.createElement("span", { role: "alert" }, error as string)
          : null,
      );
    }),
    Toast: ({
      title,
      message,
      onDismiss,
      dismissLabel,
    }: Record<string, unknown>) =>
      React.createElement(
        "div",
        { role: "status" },
        React.createElement("p", null, title as string),
        React.createElement("p", null, message as string),
        React.createElement(
          "button",
          { onClick: onDismiss as () => void, "aria-label": dismissLabel },
          dismissLabel as string,
        ),
      ),
  };
});

jest.mock("motion/react", () => {
  const React = require("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    // motion.div (and any motion.*) → a plain div that ignores animation props.
    motion: new Proxy(
      {},
      {
        get:
          () =>
          ({ children }: { children: React.ReactNode }) =>
            React.createElement("div", null, children),
      },
    ),
  };
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContactForm } from "@/app/components/ContactForm/ContactForm";
import type { ContactFormProps } from "@/app/components/ContactForm/ContactForm.types";

const baseProps: ContactFormProps = {
  endpoint: "https://formspree.io/f/test",
  fields: {
    name: { label: "Name", placeholder: "Name" },
    email: { label: "Email", placeholder: "example@email.com" },
    message: { label: "Enquiry", placeholder: "Tell me a little…" },
  },
  errors: {
    name: "Please enter your name (at least 2 letters).",
    email: "Please enter a valid email address.",
    message: "Please tell me a little more (at least 10 characters).",
  },
  submitLabel: "Send enquiry",
  sendingLabel: "Sending…",
  clearLabel: "Clear",
  successTitle: "Message sent",
  successMessage: "Thanks — your enquiry just landed in my inbox.",
  errorTitle: "Couldn't send your message",
  submitError: "Something went wrong sending your message.",
  dismissToastLabel: "Dismiss",
};

function setup(props: Partial<ContactFormProps> = {}) {
  const user = userEvent.setup();
  render(<ContactForm {...baseProps} {...props} />);
  return {
    user,
    name: screen.getByLabelText("Name"),
    email: screen.getByLabelText("Email"),
    message: screen.getByLabelText("Enquiry"),
    submit: () => screen.getByRole("button", { name: baseProps.submitLabel }),
    clear: () => screen.getByRole("button", { name: baseProps.clearLabel }),
  };
}

/** Fill every field with valid content so the form is submittable. */
async function fillValid(
  user: ReturnType<typeof userEvent.setup>,
  els: { name: HTMLElement; email: HTMLElement; message: HTMLElement },
) {
  await user.type(els.name, "Ada Lovelace");
  await user.type(els.email, "ada@example.com");
  await user.type(els.message, "I would love to work together on a project.");
}

describe("ContactForm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    // jsdom has no global fetch; tests assign one, so clean it up between runs.
    delete (global as unknown as { fetch?: unknown }).fetch;
  });

  it("renders the three fields and both actions, with submit/clear disabled initially", () => {
    const f = setup();
    expect(f.name).toBeInTheDocument();
    expect(f.email).toBeInTheDocument();
    expect(f.message).toBeInTheDocument();
    expect(f.submit()).toBeDisabled();
    expect(f.clear()).toBeDisabled();
  });

  it("keeps submit disabled and shows a field error for invalid input", async () => {
    const f = setup();
    await f.user.type(f.name, "A"); // too short
    await f.user.tab(); // blur
    expect(await screen.findByRole("alert")).toHaveTextContent(
      baseProps.errors.name,
    );
    expect(f.submit()).toBeDisabled();
  });

  it("enables submit once every field is valid, and enables clear once anything is typed", async () => {
    const f = setup();
    await f.user.type(f.name, "A");
    expect(f.clear()).toBeEnabled(); // clear tracks "any content"
    await fillValid(f.user, f);
    await waitFor(() => expect(f.submit()).toBeEnabled());
  });

  it("POSTs JSON to the endpoint, shows the success toast, and resets the form", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200 } as Response);
    global.fetch = fetchMock as unknown as typeof fetch;
    const f = setup();
    await fillValid(f.user, f);
    await waitFor(() => expect(f.submit()).toBeEnabled());
    await f.user.click(f.submit());

    await screen.findByRole("status");
    expect(screen.getByText(baseProps.successTitle)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(baseProps.endpoint);
    expect(init).toMatchObject({ method: "POST" });
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would love to work together on a project.",
    });

    // Success resets the DOM form.
    expect(f.name).toHaveValue("");
    expect(f.message).toHaveValue("");
  });

  it("shows the error toast and does NOT reset when the request fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response) as unknown as typeof fetch;
    const f = setup();
    await fillValid(f.user, f);
    await waitFor(() => expect(f.submit()).toBeEnabled());
    await f.user.click(f.submit());

    await screen.findByRole("status");
    expect(screen.getByText(baseProps.errorTitle)).toBeInTheDocument();
    // Values are preserved so the visitor can retry.
    expect(f.name).toHaveValue("Ada Lovelace");
  });

  it("clears all fields when the clear button is pressed", async () => {
    const f = setup();
    await fillValid(f.user, f);
    await waitFor(() => expect(f.clear()).toBeEnabled());
    await f.user.click(f.clear());
    expect(f.name).toHaveValue("");
    expect(f.email).toHaveValue("");
    expect(f.message).toHaveValue("");
  });
});
