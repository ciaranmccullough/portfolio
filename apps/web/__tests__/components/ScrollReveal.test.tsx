// motion/react is ESM (skipped by next/jest). `motion.div` is tagged with a
// `data-motion` marker so tests can tell whether ScrollReveal wrapped its
// children, without asserting on the (unverifiable in jsdom) animated
// values themselves. useScroll/useTransform return stable, inert stand-ins;
// useTransform records the input ranges it was called with so the stagger
// math's *wiring* (not its visual result) can be checked.
const transformCalls: unknown[] = [];
jest.mock("motion/react", () => {
  const React = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_target: unknown, tag: string) =>
          ({ children, ...props }: { children?: React.ReactNode }) =>
            React.createElement(
              tag,
              { "data-motion": tag, ...props },
              children,
            ),
      },
    ),
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: (_value: unknown, inputRange: unknown) => {
      transformCalls.push(inputRange);
      return 0;
    },
  };
});

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { render, screen } from "@testing-library/react";

import { ScrollReveal } from "@/app/components/ScrollReveal/ScrollReveal";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

const mockEnabled = useScrollAnimationsEnabled as jest.MockedFunction<
  typeof useScrollAnimationsEnabled
>;

beforeEach(() => {
  transformCalls.length = 0;
});

describe("ScrollReveal", () => {
  it("renders children completely statically (no motion wrapper) when scroll animations are disabled", () => {
    mockEnabled.mockReturnValue(false);
    render(
      <ScrollReveal>
        <p>Brief statement</p>
      </ScrollReveal>,
    );
    expect(screen.getByText("Brief statement")).toBeInTheDocument();
    expect(document.querySelector("[data-motion]")).not.toBeInTheDocument();
  });

  it("wraps children in a motion.div once scroll animations are enabled", () => {
    mockEnabled.mockReturnValue(true);
    render(
      <ScrollReveal>
        <p>Brief statement</p>
      </ScrollReveal>,
    );
    const wrapper = document.querySelector('[data-motion="div"]');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toContainElement(screen.getByText("Brief statement"));
  });

  it("renders arbitrary children content unchanged either way", () => {
    mockEnabled.mockReturnValue(true);
    render(
      <ScrollReveal>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </ScrollReveal>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shifts the reveal window later for a larger staggerIndex", () => {
    mockEnabled.mockReturnValue(true);
    render(
      <ScrollReveal staggerIndex={2}>
        <p>Card three</p>
      </ScrollReveal>,
    );
    // Every useTransform call (opacity/y/scale) shares the same staggered
    // input range; a non-zero staggerIndex must not leave it at [0, 1].
    for (const range of transformCalls) {
      expect(range).not.toEqual([0, 1]);
      expect((range as [number, number])[0]).toBeGreaterThan(0);
      expect((range as [number, number])[1]).toBe(1);
    }
  });

  it("defaults to no stagger (input range [0, 1]) when staggerIndex is omitted", () => {
    mockEnabled.mockReturnValue(true);
    render(
      <ScrollReveal>
        <p>Card one</p>
      </ScrollReveal>,
    );
    for (const range of transformCalls) {
      expect(range).toEqual([0, 1]);
    }
  });
});
