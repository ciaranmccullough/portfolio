import { render, screen, within } from "@testing-library/react";

import { RepoRow } from "../../molecules";
import { OpenSource } from "./OpenSource";
import { openSourceClass, openSourcePanelClass } from "./OpenSource.styles";

/**
 * OpenSource is a presentational section that wraps its children in one
 * bordered `<ul>` panel. Its children in real usage are `RepoRow` `<li>`
 * items, so most tests render a realistic set of repo rows and assert the
 * section landmark, list semantics, and per-datum link rendering.
 */
const repos = [
  { name: "ciaran/enterprise-ui", href: "https://github.com/a", stars: "1.2k" },
  { name: "ciaran/design-tokens", href: "https://github.com/b", stars: "640" },
  { name: "ciaran/cli-kit", href: "https://github.com/c", stars: "312" },
] as const;

function renderWithRepos() {
  return render(
    <OpenSource aria-label="Open source">
      {repos.map((r) => (
        <RepoRow key={r.name} name={r.name} href={r.href} stars={r.stars} />
      ))}
    </OpenSource>,
  );
}

describe("OpenSource", () => {
  it("mounts without crashing and renders a <section> landmark root", () => {
    const { container } = render(
      <OpenSource>
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    const section = container.firstElementChild;
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(openSourceClass);
  });

  it("renders a single <ul> panel wrapping the children", () => {
    renderWithRepos();

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list).toHaveClass(openSourcePanelClass);
  });

  it("renders one list item per repo datum", () => {
    renderWithRepos();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(repos.length);
  });

  it("renders one link per repo, each exposing the repo name and href", () => {
    renderWithRepos();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(repos.length);

    repos.forEach((repo) => {
      const link = screen.getByRole("link", {
        name: new RegExp(repo.name.replace("/", "\\/")),
      });
      expect(link).toHaveAttribute("href", repo.href);
      // Accessible name includes the name and the (non-decorative) star count.
      expect(link).toHaveAccessibleName(`${repo.name} ${repo.stars}`);
    });
  });

  it("scopes the repo rows inside the single panel list", () => {
    renderWithRepos();

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(repos.length);
    expect(within(list).getAllByRole("link")).toHaveLength(repos.length);
  });

  it("renders plain children content (e.g. heading text) verbatim", () => {
    render(
      <OpenSource>
        <li>
          <h2>Open Source</h2>
        </li>
      </OpenSource>,
    );

    expect(
      screen.getByRole("heading", { name: "Open Source", level: 2 }),
    ).toBeInTheDocument();
  });

  it("merges a consumer className onto the <section> root while keeping the base class", () => {
    const { container } = render(
      <OpenSource className="custom-class">
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(openSourceClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*, aria-label) onto the <section> root", () => {
    render(
      <OpenSource id="oss" data-region="open-source" aria-label="Open source">
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    // aria-label promotes the <section> to an accessible region landmark.
    const region = screen.getByRole("region", { name: "Open source" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("id", "oss");
    expect(region).toHaveAttribute("data-region", "open-source");
  });

  it("renders an empty panel when no children are provided", () => {
    render(<OpenSource />);

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders the eyebrow and title in the section header when provided", () => {
    render(
      <OpenSource eyebrow="In the open" title="Open source">
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    expect(screen.getByText("In the open")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Open source", level: 2 }),
    ).toBeInTheDocument();
  });

  it("renders the action node (e.g. a GitHub link) opposite the heading", () => {
    render(
      <OpenSource
        title="Open source"
        action={<a href="https://github.com/ciaran">github.com/ciaran ↗</a>}
      >
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    const action = screen.getByRole("link", { name: /github\.com\/ciaran/ });
    expect(action).toHaveAttribute("href", "https://github.com/ciaran");
  });

  it("omits the header entirely when no eyebrow, title or action is given", () => {
    render(
      <OpenSource>
        <RepoRow name="repo" href="https://x.dev" />
      </OpenSource>,
    );

    // No section heading is emitted; only the repo row's link is present.
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
