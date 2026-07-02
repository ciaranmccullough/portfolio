import { fireEvent, render, screen, within } from "@testing-library/react";

import { RepoRow } from "./RepoRow";
import {
  repoRowDescClass,
  repoRowDotBase,
  repoRowDotTone,
  repoRowItemClass,
  repoRowLangClass,
  repoRowLinkClass,
  repoRowNameClass,
  repoRowStarsClass,
} from "./RepoRow.styles";

/**
 * RepoRow renders an `<li>` that must live inside a `<ul>`. Render it into a
 * `<ul>` container so the list semantics are valid and queries by `listitem`
 * resolve.
 */
function renderRow(ui: React.ReactElement) {
  return render(<ul>{ui}</ul>);
}

describe("RepoRow", () => {
  it("renders an <li> as its root element", () => {
    renderRow(
      <RepoRow name="ciaran/enterprise-ui" href="https://example.com" />,
    );

    const item = screen.getByRole("listitem");
    expect(item.tagName).toBe("LI");
    expect(item).toHaveClass(repoRowItemClass);
  });

  it("renders an anchor pointing at href, containing the repo name", () => {
    renderRow(
      <RepoRow
        name="ciaran/enterprise-ui"
        href="https://github.com/ciaran/enterprise-ui"
      />,
    );

    const link = screen.getByRole("link", { name: /ciaran\/enterprise-ui/ });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/ciaran/enterprise-ui",
    );
    expect(link).toHaveClass(repoRowLinkClass);
  });

  it("renders the repo name in a styled span child atom", () => {
    renderRow(<RepoRow name="ciaran/enterprise-ui" href="https://x.dev" />);

    const nameEl = screen.getByText("ciaran/enterprise-ui");
    expect(nameEl.tagName).toBe("SPAN");
    expect(nameEl).toHaveClass(repoRowNameClass);
  });

  it("renders a decorative status dot that is hidden from assistive tech", () => {
    const { container } = renderRow(
      <RepoRow name="repo" href="https://x.dev" />,
    );

    const dot = container.querySelector(`.${repoRowDotBase.split(" ")[0]}`);
    expect(dot).not.toBeNull();
    expect(dot).toHaveClass(repoRowDotBase);
    // Defaults to the violet tone.
    expect(dot).toHaveClass(repoRowDotTone.violet);
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("colours the status dot from the tone prop", () => {
    const { container } = renderRow(
      <RepoRow name="repo" href="https://x.dev" tone="amber" />,
    );

    const dot = container.querySelector(`.${repoRowDotBase.split(" ")[0]}`);
    expect(dot).toHaveClass(repoRowDotTone.amber);
    expect(dot).not.toHaveClass(repoRowDotTone.violet);
  });

  it("renders the description when provided, inside the link", () => {
    renderRow(
      <RepoRow
        name="repo"
        href="https://x.dev"
        description="A tiny, tree-shakeable UI kit"
      />,
    );

    const descEl = screen.getByText("A tiny, tree-shakeable UI kit");
    expect(descEl.tagName).toBe("SPAN");
    expect(descEl).toHaveClass(repoRowDescClass);
    expect(screen.getByRole("link")).toContainElement(descEl);
  });

  it("does not render the description element when it is omitted", () => {
    const { container } = renderRow(
      <RepoRow name="repo" href="https://x.dev" />,
    );

    expect(
      container.querySelector(`.${repoRowDescClass.split(" ")[0]}`),
    ).toBeNull();
  });

  it("renders the language with its own decorative tone dot", () => {
    const { container } = renderRow(
      <RepoRow
        name="repo"
        href="https://x.dev"
        lang="TypeScript"
        tone="green"
      />,
    );

    const langEl = screen.getByText("TypeScript");
    expect(langEl).toHaveClass(repoRowLangClass);
    // Both the leading dot and the language dot pick up the tone → two dots.
    const dots = container.querySelectorAll(`.${repoRowDotBase.split(" ")[0]}`);
    expect(dots).toHaveLength(2);
    dots.forEach((dot) => {
      expect(dot).toHaveClass(repoRowDotTone.green);
      expect(dot).toHaveAttribute("aria-hidden", "true");
    });
    // The language label is part of the link's accessible name; the dot is not.
    expect(screen.getByRole("link")).toHaveAccessibleName("repo TypeScript");
  });

  it("does not render the language element when it is omitted", () => {
    const { container } = renderRow(
      <RepoRow name="repo" href="https://x.dev" />,
    );

    // With no language there is no language dot — only the single leading dot.
    expect(
      container.querySelectorAll(`.${repoRowDotBase.split(" ")[0]}`),
    ).toHaveLength(1);
  });

  it("renders the star count and its decorative star glyph when stars is provided", () => {
    renderRow(<RepoRow name="repo" href="https://x.dev" stars="1.2k" />);

    // The stars container holds a hidden "★ " glyph plus the count text.
    const link = screen.getByRole("link");
    const starsEl = within(link).getByText("1.2k", { exact: false });
    expect(starsEl).toHaveClass(repoRowStarsClass);

    // The star glyph is decorative (aria-hidden) so it is not part of the name.
    const glyph = within(starsEl).getByText("★", { exact: false });
    expect(glyph).toHaveAttribute("aria-hidden", "true");

    // Accessible name excludes the decorative glyph.
    expect(link).toHaveAccessibleName("repo 1.2k");
  });

  it("does not render the stars element when stars is omitted", () => {
    renderRow(<RepoRow name="repo" href="https://x.dev" />);

    expect(screen.queryByText("★", { exact: false })).not.toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("repo");
    expect(
      link.querySelector(`.${repoRowStarsClass.split(" ")[0]}`),
    ).toBeNull();
  });

  it("renders stars when the count is the numeric zero (not null-ish)", () => {
    // stars != null is the guard, so 0 must still render.
    renderRow(<RepoRow name="repo" href="https://x.dev" stars={0} />);

    const link = screen.getByRole("link");
    const starsEl = link.querySelector(`.${repoRowStarsClass.split(" ")[0]}`);
    expect(starsEl).not.toBeNull();
    expect(starsEl).toHaveTextContent("0");
    expect(link).toHaveAccessibleName("repo 0");
  });

  it("treats stars={undefined} as absent", () => {
    renderRow(<RepoRow name="repo" href="https://x.dev" stars={undefined} />);

    const link = screen.getByRole("link");
    expect(
      link.querySelector(`.${repoRowStarsClass.split(" ")[0]}`),
    ).toBeNull();
    expect(link).toHaveAccessibleName("repo");
  });

  it("accepts a ReactNode name and renders it", () => {
    renderRow(
      <RepoRow
        name={<em data-testid="rich-name">fancy-repo</em>}
        href="https://x.dev"
      />,
    );

    const rich = screen.getByTestId("rich-name");
    expect(rich).toBeInTheDocument();
    expect(rich.tagName).toBe("EM");
    expect(screen.getByRole("link")).toHaveAccessibleName("fancy-repo");
  });

  it("accepts a ReactNode stars label and renders it", () => {
    renderRow(
      <RepoRow
        name="repo"
        href="https://x.dev"
        stars={<strong data-testid="rich-stars">9k</strong>}
      />,
    );

    const rich = screen.getByTestId("rich-stars");
    expect(rich).toBeInTheDocument();
    expect(rich.tagName).toBe("STRONG");
  });

  it("merges a consumer className onto the <li> root while keeping the base class", () => {
    renderRow(
      <RepoRow name="repo" href="https://x.dev" className="custom-class" />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveClass(repoRowItemClass);
    expect(item).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*, aria-*) onto the <li> root", () => {
    renderRow(
      <RepoRow
        name="repo"
        href="https://x.dev"
        id="repo-1"
        data-index="3"
        aria-label="Repository row"
      />,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("id", "repo-1");
    expect(item).toHaveAttribute("data-index", "3");
    expect(item).toHaveAttribute("aria-label", "Repository row");
  });

  it("forwards event handlers (onClick) placed on the <li> root", () => {
    const onClick = jest.fn();

    renderRow(<RepoRow name="repo" href="https://x.dev" onClick={onClick} />);

    // Click the <li> directly. Using fireEvent here (rather than a real click
    // on the <a>) avoids jsdom's unimplemented navigation while still proving
    // the handler is wired onto the root via {...props}.
    fireEvent.click(screen.getByRole("listitem"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders exactly one link per row", () => {
    renderRow(<RepoRow name="repo" href="https://x.dev" stars="7" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
