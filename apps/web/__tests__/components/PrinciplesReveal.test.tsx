// Eyebrow/PrincipleCard/Text are ESM in @portfolio/ui (skipped by
// next/jest); stub them down to plain elements that surface the props this
// test cares about (including `style`, so the per-card computed opacity/
// transform can be inspected without needing real scroll/layout — jsdom
// can't simulate that, see design-spec guidance: test structure and the
// math, not scrub values end-to-end).
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    Eyebrow: ({ children }: { children: React.ReactNode }) =>
      React.createElement("p", { "data-testid": "eyebrow" }, children),
    Text: ({ as, children }: { as?: string; children: React.ReactNode }) =>
      React.createElement(as ?? "p", null, children),
    PrincipleCard: ({
      index,
      title,
      description,
      tone,
      style,
    }: {
      index: React.ReactNode;
      title: React.ReactNode;
      description?: React.ReactNode;
      tone?: string;
      style?: React.CSSProperties;
    }) =>
      React.createElement(
        "li",
        {
          "data-testid": "principle-card",
          "data-tone": tone,
          "data-opacity": style?.opacity ?? "none",
          "data-transform": style?.transform ?? "none",
        },
        React.createElement("span", null, index),
        React.createElement("h3", null, title),
        description ? React.createElement("p", null, description) : null,
      ),
  };
});

// motion/react is ESM (skipped by next/jest) — mock useScroll/
// useMotionValueEvent with a controllable, stable-reference stub (mirrors
// useHideOnScroll.test.tsx's pattern).
const motionState: {
  value: number;
  cb: ((latest: number) => void) | null;
} = { value: 0, cb: null };
const scrollYProgress = { get: () => motionState.value };
jest.mock("motion/react", () => ({
  useScroll: () => ({ scrollYProgress }),
  useMotionValueEvent: (
    _value: unknown,
    _event: string,
    cb: (latest: number) => void,
  ) => {
    motionState.cb = cb;
  },
}));

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import type { Principle } from "@portfolio/ui";

import { PrinciplesReveal } from "@/app/components/PrinciplesReveal/PrinciplesReveal";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

const mockEnabled = useScrollAnimationsEnabled as jest.MockedFunction<
  typeof useScrollAnimationsEnabled
>;

const PRINCIPLES: Principle[] = [
  { title: "Instant, even on launch", description: "Perceived speed." },
  { title: "One system, many surfaces", description: "Shared components." },
  { title: "Real time, no jank", description: "Live data." },
];

beforeEach(() => {
  motionState.value = 0;
  motionState.cb = null;
  mockEnabled.mockReturnValue(false);
});

describe("PrinciplesReveal", () => {
  it("renders the eyebrow and heading", () => {
    render(
      <PrinciplesReveal
        eyebrow="// Principles"
        title="Three ideas held it together"
        principles={PRINCIPLES}
      />,
    );
    expect(screen.getByTestId("eyebrow")).toHaveTextContent("// Principles");
    expect(
      screen.getByRole("heading", { name: "Three ideas held it together" }),
    ).toBeInTheDocument();
  });

  it("renders one PrincipleCard per principle, in order, with the right content", () => {
    render(<PrinciplesReveal principles={PRINCIPLES} />);
    const cards = screen.getAllByTestId("principle-card");
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent("Instant, even on launch");
    expect(cards[1]).toHaveTextContent("One system, many surfaces");
    expect(cards[2]).toHaveTextContent("Real time, no jank");
  });

  it("cycles the violet/orange/green tone by position", () => {
    render(<PrinciplesReveal principles={PRINCIPLES} />);
    const cards = screen.getAllByTestId("principle-card");
    expect(cards[0]).toHaveAttribute("data-tone", "violet");
    expect(cards[1]).toHaveAttribute("data-tone", "orange");
    expect(cards[2]).toHaveAttribute("data-tone", "green");
  });

  it("renders every card with no inline style at all when scroll animations are disabled", () => {
    mockEnabled.mockReturnValue(false);
    render(<PrinciplesReveal principles={PRINCIPLES} />);
    for (const card of screen.getAllByTestId("principle-card")) {
      expect(card).toHaveAttribute("data-opacity", "none");
      expect(card).toHaveAttribute("data-transform", "none");
    }
  });

  it("applies a computed opacity/transform to every card once scroll animations are enabled", () => {
    mockEnabled.mockReturnValue(true);
    render(<PrinciplesReveal principles={PRINCIPLES} />);
    for (const card of screen.getAllByTestId("principle-card")) {
      expect(card).not.toHaveAttribute("data-opacity", "none");
      expect(card.getAttribute("data-transform")).toMatch(
        /^translateY\(-?\d+(\.\d+)?px\)$/,
      );
    }
  });

  it("later cards are not more revealed than earlier ones at the same scroll position (stagger)", () => {
    mockEnabled.mockReturnValue(true);
    motionState.value = 0.3;
    render(<PrinciplesReveal principles={PRINCIPLES} />);
    const cards = screen.getAllByTestId("principle-card");
    const opacities = cards.map((c) => Number(c.getAttribute("data-opacity")));
    expect(opacities[0]).toBeGreaterThanOrEqual(opacities[1]);
    expect(opacities[1]).toBeGreaterThanOrEqual(opacities[2]);
  });
});
