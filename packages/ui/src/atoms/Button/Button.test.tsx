import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";
import {
  buttonBase,
  buttonPillClass,
  buttonRadius,
  buttonSize,
  buttonVariant,
} from "./Button.styles";
import type { ButtonSize, ButtonVariant } from "./Button.types";

describe("Button", () => {
  describe("default render", () => {
    it("renders a native <button> element", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("defaults type to 'button' so it never submits a form by accident", () => {
      render(<Button>Safe</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("applies the base classes and the default primary/md tokens", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(...buttonBase.split(" "));
      expect(button).toHaveClass(...buttonVariant.primary.split(" "));
      expect(button).toHaveClass(...buttonSize.md.split(" "));
    });

    it("has an accessible name derived from its children", () => {
      render(<Button>Send message</Button>);
      expect(
        screen.getByRole("button", { name: "Send message" }),
      ).toHaveAccessibleName("Send message");
    });
  });

  describe("variant prop maps to its class tokens", () => {
    const variants: ButtonVariant[] = [
      "primary",
      "dark",
      "ghost",
      "ghost-dark",
    ];

    it.each(variants)("variant='%s' applies its variant tokens", (variant) => {
      render(<Button variant={variant}>Variant</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(...buttonVariant[variant].split(" "));
    });

    it("does not apply other variants' distinctive tokens", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      // ghost carries a border; primary's solid violet background is absent.
      expect(button).toHaveClass("border", "border-line-strong");
      expect(button).not.toHaveClass("bg-brand-violet");
    });
  });

  describe("size prop maps to its class tokens", () => {
    const sizes: ButtonSize[] = ["sm", "md", "lg"];

    it.each(sizes)("size='%s' applies its size tokens", (size) => {
      render(<Button size={size}>Size</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(...buttonSize[size].split(" "));
    });

    it("applies only the requested size's radius token", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-xl");
      expect(button).not.toHaveClass("rounded-md");
      expect(button).not.toHaveClass("rounded-lg");
    });
  });

  describe("className merging", () => {
    it("merges an incoming className alongside the base and variant tokens", () => {
      render(<Button className="custom-class">Merged</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      // Base + default variant/size tokens are still present.
      expect(button).toHaveClass(...buttonBase.split(" "));
      expect(button).toHaveClass(...buttonVariant.primary.split(" "));
      expect(button).toHaveClass(...buttonSize.md.split(" "));
    });

    it("appends the custom class after the generated tokens", () => {
      render(
        <Button variant="dark" size="sm" className="mt-4">
          Ordered
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("mt-4");
      expect(button).toHaveClass(...buttonVariant.dark.split(" "));
      expect(button).toHaveClass(...buttonSize.sm.split(" "));
    });
  });

  describe("prop spreading", () => {
    it("spreads arbitrary and aria-* props onto the root element", () => {
      render(
        <Button
          id="my-btn"
          data-testid="ignored"
          aria-label="Close dialog"
          aria-pressed="true"
        >
          X
        </Button>,
      );
      // Queried by its aria-label, never by test id.
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toHaveAttribute("id", "my-btn");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveAccessibleName("Close dialog");
    });

    it("honours an explicit type override (e.g. submit)", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("forwards event handlers such as onClick", async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={onClick}>Press</Button>);
      await user.click(screen.getByRole("button", { name: "Press" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("pill prop", () => {
    it("defaults to the size's own radius (not a pill) when omitted", () => {
      render(<Button size="md">Default radius</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(...buttonRadius.md.split(" "));
      expect(button).not.toHaveClass(buttonPillClass);
    });

    it("swaps the size radius for a fully-rounded pill when pill is set", () => {
      render(
        <Button size="lg" pill>
          Pill
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(buttonPillClass);
      // The size's own radius token is not also applied alongside the pill.
      expect(button).not.toHaveClass(buttonRadius.lg);
    });

    it("keeps the size's padding/text tokens unaffected by pill", () => {
      render(
        <Button size="lg" pill>
          Pill
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(...buttonSize.lg.split(" "));
    });

    it("composes with variant so pill works on any visual style", () => {
      render(
        <Button variant="dark" pill>
          Dark pill
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(buttonPillClass);
      expect(button).toHaveClass(...buttonVariant.dark.split(" "));
    });
  });

  describe("native states", () => {
    it("reflects the disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button).toBeDisabled();
    });

    it("does not fire onClick while disabled", async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>,
      );
      await user.click(screen.getByRole("button", { name: "Disabled" }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("carries the disabled state-styling tokens from the base class", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
      );
    });
  });
});
