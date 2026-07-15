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
    // The reduced-motion/no-JS/mobile fallback — StoryWalkthrough must
    // render this completely untouched, with the same props it received.
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
// needing real scroll/layout. Motion-only props (`animate`/`initial`/
// `transition`) are dropped rather than spread onto the real DOM tag they
// stand in for — this suite checks structure, DOM presence and the discrete
// step-index state machine, not animated values (unverifiable in jsdom —
// see design-spec guidance; the spring crossfade itself is proven via
// puppeteer against the live page instead).
jest.mock("motion/react", () => {
  const React = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_target: unknown, tag: string) =>
          ({
            children,
            animate: _animate,
            initial: _initial,
            transition: _transition,
            ...props
          }: {
            children?: React.ReactNode;
            animate?: unknown;
            initial?: unknown;
            transition?: unknown;
          }) =>
            React.createElement(
              tag,
              { "data-motion": tag, ...props },
              children,
            ),
      },
    ),
    useScroll: () => ({
      scrollYProgress: { get: () => 0, on: () => () => {} },
    }),
    useMotionValueEvent: () => {},
  };
});

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { fireEvent, render, screen } from "@testing-library/react";
import type { WalkthroughItem } from "@portfolio/ui";

import { StoryWalkthrough } from "@/app/components/StoryWalkthrough/StoryWalkthrough";
import { storyWalkthroughStickyClass } from "@/app/components/StoryWalkthrough/StoryWalkthrough.styles";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

/** The pinned viewport `StoryWalkthrough` attaches its native wheel/touch
 *  listeners to — located by its own styles.ts class (stable across markup
 *  refactors) rather than a parentElement chain from a panel layer. */
function getStickyViewport(): HTMLElement {
  const selector = `.${storyWalkthroughStickyClass.split(" ")[0]}`;
  const node = document.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Sticky viewport not found via ${selector}`);
  return node;
}

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

/** Reads which panel currently carries `aria-current="step"` — there must be
 *  exactly one. */
function currentPanelIndex(): number {
  const current = document.querySelectorAll('[aria-current="step"]');
  expect(current).toHaveLength(1);
  const layers = Array.from(document.querySelectorAll('[data-motion="li"]'));
  return layers.indexOf(current[0] as Element);
}

beforeEach(() => {
  // jsdom doesn't implement `window.scrollTo` — the stepper calls it
  // (harmlessly, per `syncScrollPosition`'s own doc comment: it's a no-op
  // page-scrollbar bookkeeping call, not something these structural/state
  // tests assert on) every time it accepts a step.
  window.scrollTo = jest.fn();
});

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

  it("starts on the first panel and marks exactly one panel as the active step", () => {
    render(<StoryWalkthrough items={ITEMS} />);
    expect(currentPanelIndex()).toBe(0);
  });

  describe("snap-stepper: wheel gestures", () => {
    it("advances exactly one panel on a single downward wheel gesture", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      fireEvent.wheel(getStickyViewport(), { deltaY: 120 });
      expect(currentPanelIndex()).toBe(1);
    });

    it("never advances more than one panel for a single gesture, even a huge delta", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      fireEvent.wheel(getStickyViewport(), { deltaY: 5000 });
      expect(currentPanelIndex()).toBe(1);
    });

    it("swallows a second wheel gesture inside the debounce window (still one step)", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      const sticky = getStickyViewport();
      fireEvent.wheel(sticky, { deltaY: 120 });
      fireEvent.wheel(sticky, { deltaY: 120 }); // immediately after — same tick
      expect(currentPanelIndex()).toBe(1);
    });

    it("steps backward on an upward wheel gesture", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      const sticky = getStickyViewport();
      fireEvent.wheel(sticky, { deltaY: 120 }); // -> panel 1
      expect(currentPanelIndex()).toBe(1);
      fireEvent.wheel(sticky, { deltaY: -120, timeStamp: Date.now() + 1000 });
      // jsdom's fireEvent doesn't advance real time, so the second gesture
      // is still inside the debounce window and correctly swallowed —
      // asserting it stays at 1 (not 0, not -1) is the meaningful check
      // here: a boundary-adjacent reversal never *skips past* panel 0.
      expect(currentPanelIndex()).toBe(1);
    });

    it("releases (does not preventDefault) scrolling up from the first panel", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      // `fireEvent.*` returns `false` when the dispatched event's
      // `preventDefault()` was called (standard DOM `dispatchEvent`
      // semantics) — the return value alone proves whether the gesture was
      // released to native scroll or intercepted, no manual Event() needed.
      const notPrevented = fireEvent.wheel(getStickyViewport(), {
        deltaY: -120,
      });
      expect(notPrevented).toBe(true);
      expect(currentPanelIndex()).toBe(0);
    });

    it("intercepts (preventDefault) scrolling down from an interior panel", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      const notPrevented = fireEvent.wheel(getStickyViewport(), {
        deltaY: 120,
      });
      expect(notPrevented).toBe(false);
    });

    it("holds the pin at the last panel through the same gesture's inertial tail, releasing only a second gesture", () => {
      // The stepper reads Date.now() directly (not the event timestamp), so
      // drive a controllable clock to step past the debounce window.
      let now = 100_000;
      const nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
      try {
        render(<StoryWalkthrough items={ITEMS} />);
        const sticky = getStickyViewport();

        // Step to the last panel, one deliberate gesture at a time.
        for (let step = 1; step < ITEMS.length; step++) {
          now += 1000;
          fireEvent.wheel(sticky, { deltaY: 120 });
        }
        expect(currentPanelIndex()).toBe(ITEMS.length - 1);

        // The same gesture's inertial tail keeps delivering wheel events —
        // still inside the cooldown, so the pin holds (preventDefault) and
        // the phone stays in situ instead of scrolling straight past.
        now += 100;
        const heldNotPrevented = fireEvent.wheel(sticky, { deltaY: 120 });
        expect(heldNotPrevented).toBe(false);
        expect(currentPanelIndex()).toBe(ITEMS.length - 1);

        // A second, deliberate gesture after the cooldown releases the page.
        now += 1000;
        const releasedNotPrevented = fireEvent.wheel(sticky, { deltaY: 120 });
        expect(releasedNotPrevented).toBe(true);
      } finally {
        nowSpy.mockRestore();
      }
    });

    it("holds the pin at the first panel too when a reversal gesture just landed there", () => {
      let now = 100_000;
      const nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
      try {
        render(<StoryWalkthrough items={ITEMS} />);
        const sticky = getStickyViewport();

        now += 1000;
        fireEvent.wheel(sticky, { deltaY: 120 }); // -> panel 1
        now += 1000;
        fireEvent.wheel(sticky, { deltaY: -120 }); // -> panel 0 (boundary)
        expect(currentPanelIndex()).toBe(0);

        // Inertial tail upward: held, not released.
        now += 100;
        const heldNotPrevented = fireEvent.wheel(sticky, { deltaY: -120 });
        expect(heldNotPrevented).toBe(false);

        // Second deliberate upward gesture: released.
        now += 1000;
        const releasedNotPrevented = fireEvent.wheel(sticky, { deltaY: -120 });
        expect(releasedNotPrevented).toBe(true);
      } finally {
        nowSpy.mockRestore();
      }
    });
  });

  describe("snap-stepper: touch gestures", () => {
    it("advances one panel on a swipe past the move threshold", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      const sticky = getStickyViewport();
      fireEvent.touchStart(sticky, { touches: [{ clientY: 400 }] });
      fireEvent.touchMove(sticky, { touches: [{ clientY: 340 }] }); // dy=60 up-swipe -> next
      expect(currentPanelIndex()).toBe(1);
    });

    it("does nothing for a swipe under the move threshold", () => {
      render(<StoryWalkthrough items={ITEMS} />);
      const sticky = getStickyViewport();
      fireEvent.touchStart(sticky, { touches: [{ clientY: 400 }] });
      fireEvent.touchMove(sticky, { touches: [{ clientY: 390 }] }); // dy=10, below 36px
      expect(currentPanelIndex()).toBe(0);
    });
  });
});
