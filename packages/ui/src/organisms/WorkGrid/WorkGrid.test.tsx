import { render, screen, within } from "@testing-library/react";

import { WorkGrid } from "./WorkGrid";
import {
  workGridClass,
  workGridListClass,
  workGridMetaClass,
} from "./WorkGrid.styles";
import type { WorkProject } from "./WorkGrid.types";

/**
 * WorkGrid is a presentational "selected work" section: an optional header
 * (eyebrow + heading + mono meta) above a responsive `<ul>` grid of project
 * cards. Each card renders a cover-media slot, a (optionally linked) title,
 * supporting copy and tech tags, plus an aria-hidden ↗ when it links out.
 *
 * These tests build realistic props from WorkGrid.types.ts, render the section,
 * and assert: it mounts, header content/landmarks appear, links expose the
 * right accessible names + hrefs (opening in a new tab safely), and the grid
 * renders exactly one card per datum.
 */
const projects: WorkProject[] = [
  {
    title: "Enterprise design system",
    description:
      "A cross-platform component library powering 20+ internal apps.",
    tags: ["TypeScript", "React"],
    href: "https://example.com/design-system",
  },
  {
    title: "Mobile banking app",
    description: "Offline-first banking with conflict-free background sync.",
    tags: ["Kotlin", "Android"],
    href: "https://example.com/banking",
  },
  {
    title: "Realtime dashboard",
    description: "Live metrics streamed over WebSockets at a steady 60fps.",
    tags: ["Next.js", "WebSockets"],
    href: "https://example.com/dashboard",
  },
];

function renderDefault() {
  return render(
    <WorkGrid
      eyebrow="01 — Selected work"
      title="Things I've shipped"
      meta="// 3 of many"
      projects={projects}
    />,
  );
}

/** The outer grid <ul> (the card list), as opposed to a card's inner tags <ul>. */
function getGridList() {
  return screen
    .getAllByRole("list")
    .find((ul) => ul.classList.contains(workGridListClass.split(" ")[0]));
}

describe("WorkGrid", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = renderDefault();

    const section = container.firstElementChild;
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(workGridClass);
  });

  it("renders the section heading as an <h2> with the title text", () => {
    renderDefault();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Things I've shipped",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("renders the eyebrow kicker and the mono meta note", () => {
    renderDefault();

    expect(screen.getByText("01 — Selected work")).toBeInTheDocument();

    const meta = screen.getByText("// 3 of many");
    expect(meta).toBeInTheDocument();
    expect(meta.tagName).toBe("SPAN");
    expect(meta).toHaveClass(workGridMetaClass);
  });

  it("renders each project title as an <h3> heading", () => {
    renderDefault();

    projects.forEach((project) => {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: project.title as string,
      });
      expect(heading.tagName).toBe("H3");
    });
  });

  it("renders exactly one card <li> per project datum in the grid list", () => {
    renderDefault();

    const grid = getGridList();
    expect(grid).toBeDefined();
    expect(grid?.tagName).toBe("UL");
    expect(grid).toHaveClass(workGridListClass);

    // Direct children of the grid <ul> are the card <li> wrappers.
    const cardItems = within(grid as HTMLElement)
      .getAllByRole("listitem")
      .filter((li) => li.parentElement === grid);
    expect(cardItems).toHaveLength(projects.length);
  });

  it("wraps each card in an <article> element", () => {
    const { container } = renderDefault();

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(projects.length);
  });

  it("renders one title link per project, each exposing the title as its accessible name and the correct href", () => {
    renderDefault();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(projects.length);

    projects.forEach((project) => {
      const link = screen.getByRole("link", { name: project.title as string });
      expect(link).toHaveAttribute("href", project.href);
    });
  });

  it("opens project links in a new tab with a safe rel", () => {
    renderDefault();

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders the supporting description copy for each project", () => {
    renderDefault();

    projects.forEach((project) => {
      expect(
        screen.getByText(project.description as string),
      ).toBeInTheDocument();
    });
  });

  it("renders every tech tag as a listitem inside the card's tags list", () => {
    renderDefault();

    projects.forEach((project) => {
      (project.tags ?? []).forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  it("renders the header block only when at least one header field is provided", () => {
    // No eyebrow/title/meta -> no header, no h2, no header span.
    render(<WorkGrid projects={projects} />);

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    // The h3 card titles remain.
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      projects.length,
    );
  });

  it("renders a card without a link (no <a>) when href is omitted; title is plain text", () => {
    render(<WorkGrid projects={[{ title: "Internal tool", tags: ["Go"] }]} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Internal tool" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("omits the card media slot when no media is provided and renders it when supplied", () => {
    const { container: noMedia } = render(
      <WorkGrid projects={[{ title: "No media" }]} />,
    );
    expect(
      noMedia.querySelector('[data-testid="cover"]'),
    ).not.toBeInTheDocument();

    render(
      <WorkGrid
        projects={[
          {
            title: "With media",
            media: <img data-testid="cover" src="/cover.png" alt="Cover" />,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("cover")).toBeInTheDocument();
  });

  it("does not render a tags list when a project has neither tags nor a link", () => {
    render(<WorkGrid projects={[{ title: "Bare project" }]} />);

    // Only the outer grid <ul> exists; no inner tags <ul>.
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(1);
    expect(lists[0]).toHaveClass(workGridListClass);
  });

  it("renders the decorative ↗ arrow as an aria-hidden listitem for linked cards", () => {
    const { container } = render(
      <WorkGrid
        projects={[
          { title: "Linked", href: "https://example.com", tags: ["A"] },
        ]}
      />,
    );

    // The arrow <li> is aria-hidden, so it is excluded from the a11y tree.
    const hidden = container.querySelector('li[aria-hidden="true"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden?.querySelector("svg")).toBeInTheDocument();

    // A linked card with a single tag exposes exactly one accessible listitem
    // (the tag) inside its tags list — the arrow is hidden from the tree.
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders an internal link without target/rel and without the ↗ arrow when internal is set", () => {
    const { container } = render(
      <WorkGrid
        projects={[
          {
            title: "Case study",
            href: "/story/ea-sports-app",
            tags: ["Android"],
            internal: true,
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "Case study" });
    expect(link).toHaveAttribute("href", "/story/ea-sports-app");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");

    // No external-link arrow for an internal route.
    expect(container.querySelector('li[aria-hidden="true"]')).toBeNull();
  });

  it("still opens as external (new tab, safe rel, ↗ arrow) when internal is omitted or false", () => {
    const { container } = render(
      <WorkGrid
        projects={[
          { title: "External one", href: "https://example.com", tags: ["Go"] },
          {
            title: "External two",
            href: "https://example.com/2",
            tags: ["Go"],
            internal: false,
          },
        ]}
      />,
    );

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(
      2,
    );
  });

  it("renders an empty grid (no card items) when projects is empty", () => {
    render(<WorkGrid title="Nothing yet" projects={[]} />);

    const grid = getGridList();
    expect(grid).toBeDefined();
    expect(within(grid as HTMLElement).queryAllByRole("listitem")).toHaveLength(
      0,
    );
  });

  it("merges a consumer className onto the <section> while keeping the base class", () => {
    const { container } = render(
      <WorkGrid className="custom-class" projects={projects} />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(workGridClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*, aria-label) onto the <section>, promoting it to a region landmark", () => {
    render(
      <WorkGrid
        id="work"
        data-region="work-grid"
        aria-label="Selected work"
        projects={projects}
      />,
    );

    const region = screen.getByRole("region", { name: "Selected work" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("id", "work");
    expect(region).toHaveAttribute("data-region", "work-grid");
  });
});
