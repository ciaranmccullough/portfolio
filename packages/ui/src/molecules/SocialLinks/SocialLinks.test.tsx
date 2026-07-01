import { render, screen, within } from "@testing-library/react";

import { SocialLinks } from "./SocialLinks";
import {
  socialLinksAnchorClass,
  socialLinksListClass,
} from "./SocialLinks.styles";
import type { SocialLink } from "./SocialLinks.types";

const items: SocialLink[] = [
  { href: "https://github.com", label: "GitHub ↗" },
  { href: "https://linkedin.com", label: "LinkedIn ↗" },
];

describe("SocialLinks", () => {
  it("renders a list containing one link per item", () => {
    render(<SocialLinks items={items} />);

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");

    const listItems = within(list).getAllByRole("listitem");
    expect(listItems).toHaveLength(items.length);

    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(items.length);
  });

  it("renders each link with the correct href and accessible name", () => {
    render(<SocialLinks items={items} />);

    const github = screen.getByRole("link", { name: "GitHub ↗" });
    expect(github).toHaveAttribute("href", "https://github.com");

    const linkedin = screen.getByRole("link", { name: "LinkedIn ↗" });
    expect(linkedin).toHaveAttribute("href", "https://linkedin.com");
  });

  it("wraps each anchor in its own list item", () => {
    render(<SocialLinks items={items} />);

    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((li) => {
      expect(within(li).getByRole("link")).toBeInTheDocument();
    });
  });

  it("applies the list style token to the <ul>", () => {
    render(<SocialLinks items={items} />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass(...socialLinksListClass.split(" "));
  });

  it("applies the anchor style token to every link", () => {
    render(<SocialLinks items={items} />);

    const anchorClasses = socialLinksAnchorClass.split(" ");
    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveClass(...anchorClasses);
    });
  });

  it("merges a consumer className onto the <ul> while keeping the base tokens", () => {
    render(<SocialLinks items={items} className="custom-class" />);

    const list = screen.getByRole("list");
    expect(list).toHaveClass("custom-class");
    expect(list).toHaveClass(...socialLinksListClass.split(" "));
  });

  it("spreads arbitrary props (id, aria-label, data-*) onto the <ul>", () => {
    render(
      <SocialLinks
        items={items}
        id="social"
        aria-label="Social media"
        data-testid="social-links"
      />,
    );

    const list = screen.getByRole("list", { name: "Social media" });
    expect(list).toHaveAttribute("id", "social");
    expect(list).toHaveAttribute("data-testid", "social-links");
  });

  it("renders an empty list with no links when items is empty", () => {
    render(<SocialLinks items={[]} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a single item correctly", () => {
    render(<SocialLinks items={[{ href: "/cv", label: "Résumé" }]} />);

    const link = screen.getByRole("link", { name: "Résumé" });
    expect(link).toHaveAttribute("href", "/cv");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("supports ReactNode labels (not just plain strings)", () => {
    const nodeItems: SocialLink[] = [
      { href: "https://x.com", label: <span data-testid="x-label">X</span> },
    ];
    render(<SocialLinks items={nodeItems} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://x.com");
    expect(within(link).getByTestId("x-label")).toHaveTextContent("X");
  });

  it("supports mailto and relative hrefs", () => {
    const mixed: SocialLink[] = [
      { href: "mailto:me@example.com", label: "Email" },
      { href: "/contact", label: "Contact" },
    ];
    render(<SocialLinks items={mixed} />);

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:me@example.com",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
