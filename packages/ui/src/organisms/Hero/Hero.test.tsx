import { render, screen, within } from "@testing-library/react";

import { Hero } from "./Hero";
import {
  heroActionsClass,
  heroBadgeClass,
  heroClass,
  heroIntroClass,
  heroTabAlign,
  heroTabClass,
  heroTabFloat,
  heroTabSlant,
  heroTabsClass,
  heroTitleClass,
} from "./Hero.styles";
import type { HeroTab } from "./Hero.types";

/** Split a space-joined class string into an array for `toHaveClass(...)`. */
const classesOf = (value: string): string[] => value.split(" ");

/** Realistic tabs, mirroring the app's floating tech tabs. */
const TABS: HeroTab[] = [
  { icon: <svg data-testid="icon-react" aria-hidden />, title: "React" },
  { icon: <svg data-testid="icon-ts" aria-hidden />, title: "TypeScript" },
  {
    icon: <svg data-testid="icon-node" aria-hidden />,
    title: "Node",
    className: "bg-brand-green",
  },
];

describe("Hero", () => {
  describe("smoke + key content", () => {
    it("mounts without crashing and renders the display heading as an <h1>", () => {
      render(<Hero title="Software engineer building polished product UI." />);

      const heading = screen.getByRole("heading", {
        level: 1,
        name: "Software engineer building polished product UI.",
      });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("renders the badge, title and intro together", () => {
      render(
        <Hero
          badge="Available for work"
          title="Polished product UI."
          intro="I design and ship accessible interfaces."
        />,
      );

      expect(screen.getByText("Available for work")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 1, name: "Polished product UI." }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("I design and ship accessible interfaces."),
      ).toBeInTheDocument();
    });

    it("renders a <section> landmark exposing an accessible name", () => {
      render(<Hero aria-label="Hero" title="Polished product UI." />);

      const region = screen.getByRole("region", { name: "Hero" });
      expect(region).toBeInTheDocument();
      expect(region.tagName).toBe("SECTION");
    });
  });

  describe("root <section>", () => {
    it("applies the hero layout classes and merges a custom className", () => {
      render(
        <Hero
          aria-label="Hero"
          className="custom-hero"
          title="Polished product UI."
        />,
      );

      const region = screen.getByRole("region", { name: "Hero" });
      expect(region).toHaveClass(...classesOf(heroClass));
      expect(region).toHaveClass("custom-hero");
    });

    it("spreads arbitrary native <section> props onto the root", () => {
      render(
        <Hero
          aria-label="Hero"
          id="hero"
          data-analytics="landing"
          title="Polished product UI."
        />,
      );

      const region = screen.getByRole("region", { name: "Hero" });
      expect(region).toHaveAttribute("id", "hero");
      expect(region).toHaveAttribute("data-analytics", "landing");
    });
  });

  describe("badge", () => {
    it("renders the badge as an Eyebrow <p> with the badge spacing class", () => {
      render(<Hero badge="Available for work" title="Title." />);

      const badge = screen.getByText("Available for work");
      expect(badge.tagName).toBe("P");
      expect(badge).toHaveClass(...classesOf(heroBadgeClass));
    });

    it("omits the badge when it is not provided", () => {
      render(<Hero title="Title." />);

      expect(screen.queryByText("Available for work")).not.toBeInTheDocument();
    });
  });

  describe("title", () => {
    it("applies the display title class to the heading", () => {
      render(<Hero title="Polished product UI." />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
        ...classesOf(heroTitleClass),
      );
    });
  });

  describe("intro", () => {
    it("renders the intro as a body <p> with the intro spacing class", () => {
      render(<Hero title="Title." intro="A tidy design system." />);

      const intro = screen.getByText("A tidy design system.");
      expect(intro.tagName).toBe("P");
      expect(intro).toHaveClass(...classesOf(heroIntroClass));
    });

    it("omits the intro when it is not provided", () => {
      render(<Hero title="Title." />);

      // Only the heading <p>? No — the only paragraph-less render still has
      // just the heading; there is no intro paragraph text.
      expect(
        screen.queryByText("A tidy design system."),
      ).not.toBeInTheDocument();
    });
  });

  describe("children (actions slot)", () => {
    it("wraps children in a div with the actions class", () => {
      render(
        <Hero title="Title.">
          <a href="/work">View work</a>
        </Hero>,
      );

      const action = screen.getByRole("link", { name: "View work" });
      expect(action).toHaveAttribute("href", "/work");

      const wrapper = action.parentElement;
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(...classesOf(heroActionsClass));
    });

    it("exposes CTA links with accessible names and correct hrefs", () => {
      render(
        <Hero title="Title.">
          <a href="/work">View work</a>
          <a href="/resume.pdf">Résumé</a>
        </Hero>,
      );

      expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute(
        "href",
        "/work",
      );
      expect(screen.getByRole("link", { name: "Résumé" })).toHaveAttribute(
        "href",
        "/resume.pdf",
      );
    });

    it("renders no actions wrapper when there are no children", () => {
      render(<Hero title="Title." />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("tabs", () => {
    it("renders a <ul> with one <li> per tab datum", () => {
      render(<Hero title="Title." tabs={TABS} />);

      const list = screen.getByRole("list");
      expect(list.tagName).toBe("UL");
      expect(list).toHaveClass(...classesOf(heroTabsClass));

      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(TABS.length);
    });

    it("renders each tab's title and icon", () => {
      render(<Hero title="Title." tabs={TABS} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node")).toBeInTheDocument();

      expect(screen.getByTestId("icon-react")).toBeInTheDocument();
      expect(screen.getByTestId("icon-ts")).toBeInTheDocument();
      expect(screen.getByTestId("icon-node")).toBeInTheDocument();
    });

    it("applies the base tab class plus cycled float/align/slant variants", () => {
      render(<Hero title="Title." tabs={TABS} />);

      const items = screen.getAllByRole("listitem");
      items.forEach((item, index) => {
        expect(item).toHaveClass(...classesOf(heroTabClass));
        expect(item).toHaveClass(heroTabFloat[index % heroTabFloat.length]);
        expect(item).toHaveClass(heroTabAlign[index % heroTabAlign.length]);
        expect(item).toHaveClass(heroTabSlant[index % heroTabSlant.length]);
      });
    });

    it("appends a per-tab className when provided", () => {
      render(<Hero title="Title." tabs={TABS} />);

      // The third tab (Node) carries a brand background class.
      const node = screen.getByText("Node").closest("li");
      expect(node).not.toBeNull();
      expect(node).toHaveClass("bg-brand-green");
    });

    it("renders no list when tabs is undefined", () => {
      render(<Hero title="Title." />);

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("renders no list when tabs is an empty array", () => {
      render(<Hero title="Title." tabs={[]} />);

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});
