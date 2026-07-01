import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Link } from "./Link";
import { linkBase, linkVariant } from "./Link.styles";
import type { LinkVariant } from "./Link.types";

describe("Link", () => {
  describe("default rendering", () => {
    it("renders a native anchor element by default", () => {
      render(<Link href="https://example.com">Work</Link>);

      const link = screen.getByRole("link", { name: "Work" });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("renders its children as the accessible name", () => {
      render(<Link href="/about">About me</Link>);

      expect(
        screen.getByRole("link", { name: "About me" }),
      ).toHaveAccessibleName("About me");
    });

    it("applies the base classes", () => {
      render(<Link href="/x">Base</Link>);

      const link = screen.getByRole("link", { name: "Base" });
      expect(link).toHaveClass(...linkBase.split(" "));
    });

    it("defaults to the 'nav' variant when no variant is given", () => {
      render(<Link href="/x">Nav default</Link>);

      const link = screen.getByRole("link", { name: "Nav default" });
      expect(link).toHaveClass(...linkVariant.nav.split(" "));
    });
  });

  describe("variants", () => {
    const variants: LinkVariant[] = [
      "nav",
      "inline",
      "cta",
      "primary",
      "social",
    ];

    it.each(variants)(
      "maps the '%s' variant to its class tokens",
      (variant) => {
        render(
          <Link href="/x" variant={variant}>
            {variant} link
          </Link>,
        );

        const link = screen.getByRole("link", { name: `${variant} link` });
        // base classes always present
        expect(link).toHaveClass(...linkBase.split(" "));
        // the specific variant's tokens
        expect(link).toHaveClass(...linkVariant[variant].split(" "));
      },
    );

    it("does not apply another variant's tokens", () => {
      render(
        <Link href="/x" variant="primary">
          Primary only
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Primary only" });
      expect(link).toHaveClass(...linkVariant.primary.split(" "));
      // 'nav' has a unique token that primary lacks
      expect(link).not.toHaveClass("text-fg-muted");
    });
  });

  describe("className merging", () => {
    it("keeps base + variant classes alongside a custom className", () => {
      render(
        <Link href="/x" className="custom-class another-one">
          Merged
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Merged" });
      expect(link).toHaveClass("custom-class");
      expect(link).toHaveClass("another-one");
      expect(link).toHaveClass(...linkBase.split(" "));
      expect(link).toHaveClass(...linkVariant.nav.split(" "));
    });
  });

  describe("prop spreading", () => {
    it("spreads arbitrary native anchor attributes onto the root", () => {
      render(
        <Link
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          id="lnk"
        >
          External
        </Link>,
      );

      const link = screen.getByRole("link", { name: "External" });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveAttribute("id", "lnk");
    });

    it("spreads aria-* attributes onto the root", () => {
      render(
        <Link href="/x" aria-label="Go home" aria-current="page">
          Home
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Go home" });
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link).toHaveAccessibleName("Go home");
    });

    it("forwards event handlers", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Link href="/x" onClick={onClick}>
          Click me
        </Link>,
      );

      await user.click(screen.getByRole("link", { name: "Click me" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
