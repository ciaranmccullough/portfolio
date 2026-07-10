import { render, screen } from "@testing-library/react";

import { Text } from "./Text";
import { textVariant, textVariantTag } from "./Text.styles";
import type { TextVariant } from "./Text.types";

const variants: TextVariant[] = [
  "display",
  "display-xl",
  "h1",
  "h2",
  "h3",
  "body",
  "small",
];

describe("Text", () => {
  it("defaults to the body variant, rendering a <p> with body tokens", () => {
    render(<Text>Body copy</Text>);

    const el = screen.getByText("Body copy");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass(...textVariant.body.split(" "));
  });

  describe("semantic element per variant", () => {
    it.each(variants)(
      "renders the %s variant with its default semantic tag",
      (variant) => {
        render(<Text variant={variant}>Content {variant}</Text>);

        const el = screen.getByText(`Content ${variant}`);
        expect(el.tagName).toBe(textVariantTag[variant].toUpperCase());
      },
    );
  });

  describe("variant class tokens", () => {
    it.each(variants)("applies the %s variant class tokens", (variant) => {
      render(<Text variant={variant}>Tokens {variant}</Text>);

      const el = screen.getByText(`Tokens ${variant}`);
      expect(el).toHaveClass(...textVariant[variant].split(" "));
    });
  });

  describe("the `as` override", () => {
    it("renders an explicit element, overriding the variant's default tag", () => {
      render(
        <Text variant="display" as="span">
          Display as span
        </Text>,
      );

      const el = screen.getByText("Display as span");
      // display normally maps to <h1>; `as` wins.
      expect(el.tagName).toBe("SPAN");
      expect(el).toHaveClass(...textVariant.display.split(" "));
    });

    it("keeps body tokens while rendering an <h3> via `as`", () => {
      render(<Text as="h3">Body text in an h3</Text>);

      const el = screen.getByRole("heading", { level: 3 });
      expect(el).toHaveTextContent("Body text in an h3");
      expect(el).toHaveClass(...textVariant.body.split(" "));
    });
  });

  it("merges an incoming className alongside the variant tokens", () => {
    render(
      <Text variant="h2" className="custom-class another">
        Merged
      </Text>,
    );

    const el = screen.getByText("Merged");
    expect(el).toHaveClass("custom-class", "another");
    expect(el).toHaveClass(...textVariant.h2.split(" "));
  });

  it("spreads arbitrary and aria-* props onto the root element", () => {
    render(
      <Text
        id="intro"
        data-analytics="hero-copy"
        aria-label="Introductory paragraph"
        lang="en"
      >
        Intro
      </Text>,
    );

    const el = screen.getByText("Intro");
    expect(el).toHaveAttribute("id", "intro");
    expect(el).toHaveAttribute("data-analytics", "hero-copy");
    expect(el).toHaveAttribute("lang", "en");
    expect(el).toHaveAccessibleName("Introductory paragraph");
  });

  it("exposes an accessible name for heading variants", () => {
    render(<Text variant="h1">Page title</Text>);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAccessibleName("Page title");
  });

  it("supports native handlers via spread props", () => {
    render(
      <Text as="span" title="tooltip text">
        Hover me
      </Text>,
    );

    const el = screen.getByText("Hover me");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("title", "tooltip text");
  });
});
