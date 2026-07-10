import { render, screen, within } from "@testing-library/react";

import { Walkthrough } from "./Walkthrough";
import { walkthroughClass } from "./Walkthrough.styles";
import type { WalkthroughItem } from "./Walkthrough.types";

const items: WalkthroughItem[] = [
  {
    eyebrow: "ONBOARDING",
    title: "Beat the empty feed",
    description: "Seeds the feed from your picks before the first render.",
    callout: { label: "THE CALL —", body: "Cached favourites on-device." },
  },
  {
    eyebrow: "HOME",
    title: "One feed, every content type",
    description: "A typed schema with one renderer per card type.",
  },
  {
    eyebrow: "SCORES",
    title: "Live, without the jank",
    description: "A virtualised list that stays smooth under load.",
  },
];

describe("Walkthrough", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(<Walkthrough items={items} />);

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(walkthroughClass);
  });

  it("renders the eyebrow and heading when provided", () => {
    render(
      <Walkthrough
        eyebrow="// The walkthrough"
        title="Five surfaces, one story"
        items={items}
      />,
    );

    expect(screen.getByText("// The walkthrough")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Five surfaces, one story",
      }),
    ).toBeInTheDocument();
  });

  it("renders one panel <article> per item, in an ordered list", () => {
    const { container } = render(<Walkthrough items={items} />);

    const list = container.querySelector("ol");
    expect(list).not.toBeNull();
    const articles = within(list as HTMLElement).getAllByRole("article");
    expect(articles).toHaveLength(items.length);
  });

  it("renders every panel's heading simultaneously (the static, no-JS fallback shows all panels, not just one)", () => {
    render(<Walkthrough items={items} />);

    items.forEach((item) => {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: item.title as string,
      });
      // No panel is hidden from the accessibility tree or display:none'd —
      // this is the required "all panels visible" static fallback.
      expect(heading).toBeVisible();
    });
  });

  it("tags each panel with stable data-walkthrough-panel(-index) hooks for a later client wrapper", () => {
    const { container } = render(<Walkthrough items={items} />);

    const panels = container.querySelectorAll("[data-walkthrough-panel]");
    expect(panels).toHaveLength(items.length);
    panels.forEach((panel, index) => {
      expect(panel).toHaveAttribute(
        "data-walkthrough-panel-index",
        String(index),
      );
    });
  });

  it("renders extra per-item content (e.g. a poll widget) inside its own panel", () => {
    const withExtra: WalkthroughItem[] = [
      ...items,
      {
        eyebrow: "PLAY",
        title: "Make the vote worth casting",
        extra: <div data-testid="poll-widget">Poll</div>,
      },
    ];
    render(<Walkthrough items={withExtra} />);

    expect(screen.getByTestId("poll-widget")).toBeInTheDocument();
  });

  it("derives the phone's progress row from every item's eyebrow as the step label", () => {
    render(<Walkthrough items={items} />);

    // The phone's progress counter reflects the total step count.
    expect(
      screen.getByText(`01 / ${String(items.length).padStart(2, "0")}`),
    ).toBeInTheDocument();
    // "ONBOARDING" appears twice: once as panel 1's own eyebrow, once as the
    // phone's active step label.
    expect(screen.getAllByText("ONBOARDING")).toHaveLength(2);
  });

  it("shows the imageFallback in the phone screen when the featured item has no image", () => {
    render(<Walkthrough items={items} imageFallback="Preview coming soon" />);

    expect(screen.getByText("Preview coming soon")).toBeInTheDocument();
  });

  it("renders no panels and a graceful, empty phone when items is empty", () => {
    const { container } = render(<Walkthrough items={[]} />);

    expect(container.querySelectorAll("article")).toHaveLength(0);
    expect(container.querySelector("ol")?.children).toHaveLength(0);
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <Walkthrough items={items} className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(walkthroughClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(
      <Walkthrough items={items} id="walkthrough" aria-label="Walkthrough" />,
    );

    const region = screen.getByRole("region", { name: "Walkthrough" });
    expect(region).toHaveAttribute("id", "walkthrough");
  });
});
