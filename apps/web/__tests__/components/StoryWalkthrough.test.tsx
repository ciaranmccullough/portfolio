// Eyebrow/PhoneMockup/Text/Walkthrough/WalkthroughPanel are ESM in
// @portfolio/ui (skipped by next/jest); stub them down to plain elements
// that surface the props this test cares about.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    Eyebrow: ({ children }: { children: React.ReactNode }) =>
      React.createElement("p", { "data-testid": "eyebrow" }, children),
    Text: ({ as, children }: { as?: string; children: React.ReactNode }) =>
      React.createElement(as ?? "p", null, children),
    // The reduced-motion/static fallback — StoryWalkthrough must render this
    // completely untouched, with the same props it received.
    Walkthrough: ({
      eyebrow,
      title,
      items,
      imageFallback,
    }: {
      eyebrow?: React.ReactNode;
      title?: React.ReactNode;
      items: Array<{ eyebrow?: React.ReactNode }>;
      imageFallback?: React.ReactNode;
    }) =>
      React.createElement(
        "div",
        { "data-testid": "static-walkthrough" },
        React.createElement("p", null, eyebrow),
        React.createElement("h2", null, title),
        React.createElement(
          "span",
          { "data-testid": "item-count" },
          String(items.length),
        ),
        React.createElement(
          "span",
          { "data-testid": "fallback" },
          imageFallback,
        ),
      ),
    PhoneMockup: ({
      image,
      steps,
      activeStep,
    }: {
      image?: React.ReactNode;
      steps?: Array<{ label: React.ReactNode }>;
      activeStep?: number;
    }) =>
      React.createElement(
        "div",
        {
          "data-testid": "phone-mockup",
          "data-steps": steps?.length ?? 0,
          "data-active-step": activeStep,
          "data-step-labels": steps?.map((s) => s.label).join(","),
        },
        image,
      ),
    WalkthroughPanel: ({ title }: { title: React.ReactNode }) =>
      React.createElement(
        "article",
        { "data-testid": "walkthrough-panel" },
        React.createElement("h3", null, title),
      ),
  };
});

// motion/react is ESM (skipped by next/jest). `motion.li`/`motion.div` are
// tagged with a `data-motion` marker so structure can be asserted without
// needing real scroll/layout. useTransform returns a stable, inert stand-in
// regardless of call shape (range-based or single-transformer) — this suite
// checks structure and DOM presence, not animated values (unverifiable in
// jsdom — see design-spec guidance).
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
    useMotionValueEvent: () => {},
  };
});

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import type { WalkthroughItem } from "@portfolio/ui";

import { StoryWalkthrough } from "@/app/components/StoryWalkthrough/StoryWalkthrough";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

const mockEnabled = useScrollAnimationsEnabled as jest.MockedFunction<
  typeof useScrollAnimationsEnabled
>;

const ITEMS: WalkthroughItem[] = [
  { eyebrow: "ONBOARDING", title: "Beat the empty feed", description: "d1" },
  {
    eyebrow: "HOME",
    title: "One feed, every content type",
    description: "d2",
    image: <span>home-image</span>,
  },
  { eyebrow: "SCORES", title: "Live, without the jank", description: "d3" },
];

describe("StoryWalkthrough — reduced motion / not yet mounted", () => {
  beforeEach(() => {
    mockEnabled.mockReturnValue(false);
  });

  it("renders the plain Walkthrough organism untouched, with the same props", () => {
    render(
      <StoryWalkthrough
        eyebrow="// The walkthrough"
        title="Five surfaces, one story"
        items={ITEMS}
        imageFallback="Preview coming soon"
      />,
    );

    expect(screen.getByTestId("static-walkthrough")).toBeInTheDocument();
    expect(screen.getByText("// The walkthrough")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Five surfaces, one story" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("item-count")).toHaveTextContent("3");
    expect(screen.getByTestId("fallback")).toHaveTextContent(
      "Preview coming soon",
    );
  });

  it("renders no pinned/tall-scroll structure at all", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    expect(screen.queryByTestId("phone-mockup")).not.toBeInTheDocument();
    expect(screen.queryByTestId("walkthrough-panel")).not.toBeInTheDocument();
  });
});

describe("StoryWalkthrough — scroll animations enabled", () => {
  beforeEach(() => {
    mockEnabled.mockReturnValue(true);
  });

  it("renders the header", () => {
    render(
      <StoryWalkthrough
        eyebrow="// The walkthrough"
        title="Five surfaces, one story"
        items={ITEMS}
      />,
    );
    expect(screen.getByTestId("eyebrow")).toHaveTextContent(
      "// The walkthrough",
    );
    expect(
      screen.getByRole("heading", { name: "Five surfaces, one story" }),
    ).toBeInTheDocument();
  });

  it("sizes the tall scroll region to items.length * 100vh", () => {
    const { container } = render(<StoryWalkthrough items={ITEMS} />);
    const tall = container.querySelector<HTMLElement>('[style*="height"]');
    expect(tall).not.toBeNull();
    expect(tall?.style.height).toBe("300vh");
  });

  it("passes one step (with its eyebrow as the label) per item to the phone", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    const phone = screen.getByTestId("phone-mockup");
    expect(phone).toHaveAttribute("data-steps", "3");
    expect(phone).toHaveAttribute("data-step-labels", "ONBOARDING,HOME,SCORES");
  });

  it("renders every panel, all mounted simultaneously (never unmounted)", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    const panels = screen.getAllByTestId("walkthrough-panel");
    expect(panels).toHaveLength(3);
    expect(panels[0]).toHaveTextContent("Beat the empty feed");
    expect(panels[1]).toHaveTextContent("One feed, every content type");
    expect(panels[2]).toHaveTextContent("Live, without the jank");
  });

  it("wraps each panel in its own motion.li crossfade layer", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    const layers = document.querySelectorAll('[data-motion="li"]');
    expect(layers).toHaveLength(3);
    for (const layer of Array.from(layers)) {
      expect(
        layer.querySelector('[data-testid="walkthrough-panel"]'),
      ).not.toBeNull();
    }
  });

  it("only renders an image crossfade layer for items that actually have an image", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    const phone = screen.getByTestId("phone-mockup");
    const imageLayers = phone.querySelectorAll('[data-motion="div"]');
    // Only ITEMS[1] ("HOME") has an `image`.
    expect(imageLayers).toHaveLength(1);
    expect(imageLayers[0]).toHaveTextContent("home-image");
  });

  it("marks exactly one panel as the active step", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    const current = document.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
  });
});
