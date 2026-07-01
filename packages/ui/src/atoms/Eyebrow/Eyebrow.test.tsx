import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Eyebrow } from "./Eyebrow";
import { eyebrowBase, eyebrowTone, eyebrowToneOnDark } from "./Eyebrow.styles";
import type { EyebrowTone } from "./Eyebrow.types";

const TONES: EyebrowTone[] = ["violet", "orange", "green"];

/** Split a space-joined class string into an array for `toHaveClass(...)`. */
const classesOf = (value: string): string[] => value.split(" ");

describe("Eyebrow", () => {
  describe("rendering + semantics", () => {
    it("renders its children as text", () => {
      render(<Eyebrow>01 — Selected work</Eyebrow>);

      expect(screen.getByText("01 — Selected work")).toBeInTheDocument();
    });

    it("renders a <p> element", () => {
      render(<Eyebrow>Kicker</Eyebrow>);

      expect(screen.getByText("Kicker").tagName).toBe("P");
    });

    it("applies the base typography classes", () => {
      render(<Eyebrow>Kicker</Eyebrow>);

      expect(screen.getByText("Kicker")).toHaveClass(...classesOf(eyebrowBase));
    });
  });

  describe("tone (default light-surface palette)", () => {
    it("defaults to the violet tone", () => {
      render(<Eyebrow>Kicker</Eyebrow>);

      expect(screen.getByText("Kicker")).toHaveClass(eyebrowTone.violet);
    });

    it.each(TONES)("maps tone=%s to its light-surface class", (tone) => {
      render(<Eyebrow tone={tone}>Kicker</Eyebrow>);

      expect(screen.getByText("Kicker")).toHaveClass(eyebrowTone[tone]);
    });

    it("uses the darker -deep shade for orange on a light surface", () => {
      render(<Eyebrow tone="orange">Kicker</Eyebrow>);

      const el = screen.getByText("Kicker");
      expect(el).toHaveClass("text-brand-orange-deep");
      expect(el).not.toHaveClass("text-brand-orange");
    });

    it("uses the darker -deep shade for green on a light surface", () => {
      render(<Eyebrow tone="green">Kicker</Eyebrow>);

      const el = screen.getByText("Kicker");
      expect(el).toHaveClass("text-brand-green-deep");
      expect(el).not.toHaveClass("text-brand-green");
    });
  });

  describe("onDark (dark-surface palette)", () => {
    it.each(TONES)(
      "maps tone=%s to its on-dark class when onDark is set",
      (tone) => {
        render(
          <Eyebrow tone={tone} onDark>
            Kicker
          </Eyebrow>,
        );

        expect(screen.getByText("Kicker")).toHaveClass(eyebrowToneOnDark[tone]);
      },
    );

    it("uses the bright accent for orange on a dark surface", () => {
      render(
        <Eyebrow tone="orange" onDark>
          Kicker
        </Eyebrow>,
      );

      const el = screen.getByText("Kicker");
      expect(el).toHaveClass("text-brand-orange");
      expect(el).not.toHaveClass("text-brand-orange-deep");
    });

    it("uses the bright accent for green on a dark surface", () => {
      render(
        <Eyebrow tone="green" onDark>
          Kicker
        </Eyebrow>,
      );

      const el = screen.getByText("Kicker");
      expect(el).toHaveClass("text-brand-green");
      expect(el).not.toHaveClass("text-brand-green-deep");
    });

    it("defaults onDark to false (light palette) when omitted", () => {
      render(<Eyebrow tone="orange">Kicker</Eyebrow>);

      expect(screen.getByText("Kicker")).toHaveClass("text-brand-orange-deep");
    });
  });

  describe("className merging", () => {
    it("keeps the base + tone classes alongside a custom className", () => {
      render(
        <Eyebrow tone="green" className="mb-4 custom-eyebrow">
          Kicker
        </Eyebrow>,
      );

      const el = screen.getByText("Kicker");
      expect(el).toHaveClass("mb-4", "custom-eyebrow");
      expect(el).toHaveClass(...classesOf(eyebrowBase));
      expect(el).toHaveClass(eyebrowTone.green);
    });
  });

  describe("prop spreading", () => {
    it("spreads arbitrary native <p> props onto the root", () => {
      render(
        <Eyebrow id="kicker-1" data-section="work" title="Section kicker">
          Kicker
        </Eyebrow>,
      );

      const el = screen.getByText("Kicker");
      expect(el).toHaveAttribute("id", "kicker-1");
      expect(el).toHaveAttribute("data-section", "work");
      expect(el).toHaveAttribute("title", "Section kicker");
    });

    it("spreads aria-* attributes and exposes an accessible name via role", () => {
      render(
        <Eyebrow role="note" aria-label="Selected work">
          Kicker
        </Eyebrow>,
      );

      const el = screen.getByRole("note", { name: "Selected work" });
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe("P");
    });

    it("forwards an onClick handler to the underlying element", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Eyebrow onClick={onClick}>Kicker</Eyebrow>);
      await user.click(screen.getByText("Kicker"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
