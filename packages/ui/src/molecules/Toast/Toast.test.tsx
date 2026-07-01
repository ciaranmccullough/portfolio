import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toast } from "./Toast";
import { toastBadge, toastBase, toastCloseClass } from "./Toast.styles";

describe("Toast", () => {
  it("renders the title text", () => {
    render(<Toast variant="success" title="Message sent" />);

    expect(screen.getByText("Message sent")).toBeInTheDocument();
  });

  it("renders the optional message beneath the title", () => {
    render(
      <Toast
        variant="success"
        title="Message sent"
        message="Thanks — your enquiry just landed."
      />,
    );

    expect(screen.getByText("Message sent")).toBeInTheDocument();
    expect(
      screen.getByText("Thanks — your enquiry just landed."),
    ).toBeInTheDocument();
  });

  it("omits the message line when no message is provided", () => {
    render(<Toast variant="success" title="Saved" />);

    // Only the title paragraph should be present, no supporting line.
    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent("Saved");
  });

  describe("variant → ARIA role and live region", () => {
    it("announces success politely via role=status", () => {
      render(<Toast variant="success" title="Saved" />);

      const region = screen.getByRole("status");
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-live", "polite");
      // The assertive alert role must NOT be used for a success tone.
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("announces error assertively via role=alert", () => {
      render(<Toast variant="error" title="Couldn't send" />);

      const region = screen.getByRole("alert");
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-live", "assertive");
      // The polite status role must NOT be used for an error tone.
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("variant → badge styling and status icon", () => {
    it("applies the success badge tokens", () => {
      const { container } = render(<Toast variant="success" title="Saved" />);

      const badge = container.querySelector("span[class]");
      expect(badge).not.toBeNull();
      expect(badge).toHaveClass(...toastBadge.success.split(" "));
    });

    it("applies the error badge tokens", () => {
      const { container } = render(<Toast variant="error" title="Failed" />);

      const badge = container.querySelector("span[class]");
      expect(badge).not.toBeNull();
      expect(badge).toHaveClass(...toastBadge.error.split(" "));
    });

    it("renders a status icon svg inside the badge", () => {
      const { container } = render(<Toast variant="success" title="Saved" />);

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("dismiss button", () => {
    it("is not rendered when onDismiss is omitted", () => {
      render(<Toast variant="success" title="Saved" dismissLabel="Dismiss" />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders when onDismiss is provided and uses dismissLabel as its accessible name", () => {
      render(
        <Toast
          variant="success"
          title="Saved"
          dismissLabel="Dismiss notification"
          onDismiss={() => {}}
        />,
      );

      const button = screen.getByRole("button", {
        name: "Dismiss notification",
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass(...toastCloseClass.split(" "));
    });

    it("calls onDismiss when clicked", async () => {
      const user = userEvent.setup();
      const onDismiss = jest.fn();
      render(
        <Toast
          variant="error"
          title="Failed"
          dismissLabel="Close"
          onDismiss={onDismiss}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe("root element wiring", () => {
    it("applies the base toast classes and merges a custom className", () => {
      render(
        <Toast variant="success" title="Saved" className="custom-toast" />,
      );

      const region = screen.getByRole("status");
      expect(region).toHaveClass(...toastBase.split(" "));
      expect(region).toHaveClass("custom-toast");
    });

    it("forwards arbitrary div props (id, data-*) onto the root element", () => {
      render(
        <Toast
          variant="success"
          title="Saved"
          id="toast-1"
          data-testid="my-toast"
        />,
      );

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("id", "toast-1");
      expect(region).toHaveAttribute("data-testid", "my-toast");
    });
  });
});
