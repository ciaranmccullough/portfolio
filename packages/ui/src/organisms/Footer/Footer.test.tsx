import { render, screen } from "@testing-library/react";

import { Footer } from "./Footer";
import { footerClass } from "./Footer.styles";

describe("Footer", () => {
  it("mounts without crashing and renders a <footer> contentinfo landmark", () => {
    render(<Footer>Colophon</Footer>);

    // A top-level <footer> exposes the implicit `contentinfo` role.
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe("FOOTER");
  });

  it("renders its children content", () => {
    const text = "Component Library · Ciaran — companion to the portfolio";
    render(<Footer>{text}</Footer>);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent(text);
  });

  it("applies the base footerClass tokens", () => {
    render(<Footer>colophon</Footer>);

    const footer = screen.getByRole("contentinfo");
    // Assert against the real tokens from the styles record, not hardcoded strings.
    expect(footer).toHaveClass(...footerClass.split(" "));
  });

  it("merges an incoming className with the base class (stays overridable)", () => {
    render(<Footer className="custom-extra">colophon</Footer>);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("custom-extra");
    // Base tokens are still present alongside the override.
    expect(footer).toHaveClass("font-mono");
    expect(footer).toHaveClass("text-fg-soft");
  });

  it("spreads arbitrary props (id, aria-*, data-*) onto the <footer> root", () => {
    render(
      <Footer id="site-footer" aria-label="Site footer" data-testid="footer">
        colophon
      </Footer>,
    );

    const footer = screen.getByRole("contentinfo", { name: "Site footer" });
    expect(footer).toHaveAttribute("id", "site-footer");
    expect(footer).toHaveAttribute("data-testid", "footer");
    expect(footer).toHaveAccessibleName("Site footer");
  });

  it("renders headings and links passed as children with accessible names and correct hrefs", () => {
    render(
      <Footer>
        <h2>Elsewhere</h2>
        <a href="https://github.com/ciaran">GitHub</a>
        <a href="mailto:ciaran@example.com">Email</a>
      </Footer>,
    );

    expect(
      screen.getByRole("heading", { name: "Elsewhere", level: 2 }),
    ).toBeInTheDocument();

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/ciaran");

    const email = screen.getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", "mailto:ciaran@example.com");
  });

  it("renders one list item per datum when a list is passed as children", () => {
    const links = [
      { label: "GitHub", href: "https://github.com/ciaran" },
      { label: "LinkedIn", href: "https://linkedin.com/in/ciaran" },
      { label: "Email", href: "mailto:ciaran@example.com" },
    ];

    render(
      <Footer>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </Footer>,
    );

    // One <li> node per datum.
    expect(screen.getAllByRole("listitem")).toHaveLength(links.length);

    // Every link exposes its accessible name and correct href.
    for (const link of links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });

  it("renders empty (no children) without crashing", () => {
    render(<Footer data-testid="empty-footer" />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toBeEmptyDOMElement();
  });
});
