import { render, screen } from "@testing-library/react";

import { Tag } from "./Tag";
import { tagClass } from "./Tag.styles";

/**
 * Renders a Tag inside a <ul> so the <li> has a valid list-item context and
 * `getByRole("listitem")` resolves. Returns the RTL result for further queries.
 */
function renderTag(ui: React.ReactElement) {
  return render(<ul>{ui}</ul>);
}

describe("Tag", () => {
  it("renders an <li> element (correct list-item semantics)", () => {
    renderTag(<Tag>TypeScript</Tag>);

    const tag = screen.getByRole("listitem");
    expect(tag).toBeInTheDocument();
    expect(tag.tagName).toBe("LI");
  });

  it("renders its children as the accessible content", () => {
    renderTag(<Tag>TypeScript</Tag>);

    const tag = screen.getByRole("listitem");
    expect(tag).toHaveTextContent("TypeScript");
    expect(screen.getByText("TypeScript")).toBe(tag);
  });

  it("applies the base tag class tokens from the styles record", () => {
    renderTag(<Tag>React</Tag>);

    const tag = screen.getByRole("listitem");
    // Assert against the real tokens rather than hardcoding the string.
    expect(tag).toHaveClass(...tagClass.split(" "));
  });

  it("includes the expected individual utility tokens", () => {
    renderTag(<Tag>React</Tag>);

    const tag = screen.getByRole("listitem");
    expect(tag).toHaveClass(
      "inline-flex",
      "list-none",
      "items-center",
      "rounded-sm",
      "border",
      "border-line",
      "bg-chip",
      "px-2",
      "py-1",
      "font-mono",
      "text-xs",
      "font-medium",
      "text-fg-muted",
    );
  });

  it("merges an incoming className alongside the base tokens", () => {
    renderTag(<Tag className="custom-class another-one">Vite</Tag>);

    const tag = screen.getByRole("listitem");
    // Custom classes are present...
    expect(tag).toHaveClass("custom-class", "another-one");
    // ...and the base tokens are preserved.
    expect(tag).toHaveClass(...tagClass.split(" "));
  });

  it("orders base tokens before the incoming className", () => {
    renderTag(<Tag className="custom-class">Vite</Tag>);

    const tag = screen.getByRole("listitem");
    expect(tag.className).toBe(`${tagClass} custom-class`);
  });

  it("still renders the base tokens when no className is provided", () => {
    renderTag(<Tag>Node</Tag>);

    const tag = screen.getByRole("listitem");
    // cn drops the undefined className without leaving trailing whitespace.
    expect(tag.className).toBe(tagClass);
  });

  it("spreads arbitrary DOM props onto the root <li>", () => {
    renderTag(
      <Tag id="lang-tag" data-testid="tag-node" title="A language">
        Go
      </Tag>,
    );

    const tag = screen.getByRole("listitem");
    expect(tag).toHaveAttribute("id", "lang-tag");
    expect(tag).toHaveAttribute("data-testid", "tag-node");
    expect(tag).toHaveAttribute("title", "A language");
  });

  it("spreads aria-* attributes and supports an accessible name via aria-label", () => {
    renderTag(<Tag aria-label="Programming language: Rust">Rust</Tag>);

    const tag = screen.getByRole("listitem", {
      name: "Programming language: Rust",
    });
    expect(tag).toHaveAttribute("aria-label", "Programming language: Rust");
    expect(tag).toHaveAccessibleName("Programming language: Rust");
  });

  it("forwards an event handler prop that fires on interaction", () => {
    const handleClick = jest.fn();
    renderTag(<Tag onClick={handleClick}>Click me</Tag>);

    screen.getByRole("listitem").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("lets a consumer override the role via spread props", () => {
    renderTag(
      <Tag role="note" aria-label="status">
        Beta
      </Tag>,
    );

    // The explicit role wins over the implicit listitem role.
    const tag = screen.getByRole("note", { name: "status" });
    expect(tag.tagName).toBe("LI");
  });

  it("renders multiple tags as sibling list items", () => {
    render(
      <ul>
        <Tag>One</Tag>
        <Tag>Two</Tag>
        <Tag>Three</Tag>
      </ul>,
    );

    const tags = screen.getAllByRole("listitem");
    expect(tags).toHaveLength(3);
    tags.forEach((tag) => expect(tag).toHaveClass(...tagClass.split(" ")));
  });

  it("renders with no children (empty chip) without crashing", () => {
    renderTag(<Tag data-testid="empty" />);

    const tag = screen.getByRole("listitem");
    expect(tag).toBeInTheDocument();
    expect(tag).toBeEmptyDOMElement();
  });
});
