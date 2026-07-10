// CaseStudyHero is ESM in @portfolio/ui (skipped by next/jest); stub it down
// to a minimal structure that exposes the props this test cares about.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    CaseStudyHero: ({
      title,
      backgroundImage,
    }: {
      title: React.ReactNode;
      backgroundImage?: React.ReactNode;
    }) =>
      React.createElement(
        "section",
        { "data-testid": "hero" },
        React.createElement("h1", null, title),
        React.createElement(
          "div",
          { "data-testid": "hero-bg" },
          backgroundImage ?? null,
        ),
      ),
  };
});

// motion/react is ESM (skipped by next/jest). `motion.div` is tagged with a
// `data-motion` marker so tests can tell whether HeroParallax wrapped its
// children in one, without asserting on the (unverifiable in jsdom) animated
// values themselves. useScroll/useTransform return stable, inert stand-ins.
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
    useTransform: () => 0,
  };
});

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { render, screen } from "@testing-library/react";

import { HeroParallax } from "@/app/components/HeroParallax/HeroParallax";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

const mockEnabled = useScrollAnimationsEnabled as jest.MockedFunction<
  typeof useScrollAnimationsEnabled
>;

describe("HeroParallax", () => {
  it("forwards title and other props straight through to CaseStudyHero", () => {
    mockEnabled.mockReturnValue(false);
    render(<HeroParallax title="Matchday, reimagined." />);
    expect(
      screen.getByRole("heading", { name: "Matchday, reimagined." }),
    ).toBeInTheDocument();
  });

  it("renders the background image unwrapped when scroll animations are disabled", () => {
    mockEnabled.mockReturnValue(false);
    render(
      <HeroParallax
        title="x"
        backgroundImage={<img alt="" src="/hero.png" />}
      />,
    );
    const bg = screen.getByTestId("hero-bg");
    // alt="" is deliberate (decorative background image, matching the real
    // page's usage) so it has no accessible "img" role — query by tag.
    expect(bg.querySelector("img")).toBeInTheDocument();
    expect(bg.querySelector("[data-motion]")).not.toBeInTheDocument();
  });

  it("wraps the background image in a motion layer once scroll animations are enabled", () => {
    mockEnabled.mockReturnValue(true);
    render(
      <HeroParallax
        title="x"
        backgroundImage={<img alt="" src="/hero.png" />}
      />,
    );
    const bg = screen.getByTestId("hero-bg");
    const wrapper = bg.querySelector('[data-motion="div"]');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector("img")).toBeInTheDocument();
  });

  it("renders no background layer at all when none is provided, enabled or not", () => {
    mockEnabled.mockReturnValue(true);
    render(<HeroParallax title="x" />);
    expect(screen.getByTestId("hero-bg")).toBeEmptyDOMElement();
  });
});
