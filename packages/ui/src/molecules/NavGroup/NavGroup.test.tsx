import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { linkVariant } from "../../atoms/Link/Link.styles";
import { NavGroup } from "./NavGroup";
import { navGroupListClass } from "./NavGroup.styles";
import type { NavItem } from "./NavGroup.types";

const items: NavItem[] = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
];

describe("NavGroup", () => {
  describe("landmark + structure", () => {
    it("renders a <nav> landmark", () => {
      const { container } = render(<NavGroup items={items} />);

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
      // getByRole('navigation') resolves the same element
      expect(screen.getByRole("navigation")).toBe(nav);
    });

    it("names the landmark via aria-label", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      expect(
        screen.getByRole("navigation", { name: "Primary" }),
      ).toHaveAccessibleName("Primary");
    });

    it("wraps the links in a single <ul> list", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      const list = screen.getByRole("list");
      expect(list.tagName).toBe("UL");
      expect(list).toHaveClass(...navGroupListClass.split(" "));
    });

    it("renders one <li> per item", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(items.length);
    });
  });

  describe("child link atoms", () => {
    it("renders a link for every item", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(items.length);
    });

    it("renders each item's label as the link's accessible name and its href", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      for (const item of items) {
        const link = screen.getByRole("link", { name: item.label as string });
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe("A");
        expect(link).toHaveAttribute("href", item.href);
      }
    });

    it("renders the links inside the list, one per list item", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      const listItems = screen.getAllByRole("listitem");
      for (const li of listItems) {
        expect(within(li).getByRole("link")).toBeInTheDocument();
      }
    });

    it("styles the links with the Link atom's default 'nav' variant", () => {
      render(
        <NavGroup
          items={[{ href: "#work", label: "Work" }]}
          aria-label="Primary"
        />,
      );

      const link = screen.getByRole("link", { name: "Work" });
      expect(link).toHaveClass(...linkVariant.nav.split(" "));
    });

    it("preserves item order in the rendered link list", () => {
      render(<NavGroup items={items} aria-label="Primary" />);

      const renderedNames = screen
        .getAllByRole("link")
        .map((link) => link.textContent);
      expect(renderedNames).toEqual(["Work", "Stack", "About"]);
    });

    it("supports ReactNode labels, not just strings", () => {
      render(
        <NavGroup
          items={[{ href: "#work", label: <span>Fancy Work</span> }]}
          aria-label="Primary"
        />,
      );

      expect(
        screen.getByRole("link", { name: "Fancy Work" }),
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders an empty list (no links) when items is empty", () => {
      render(<NavGroup items={[]} aria-label="Primary" />);

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.queryAllByRole("link")).toHaveLength(0);
      expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    });

    it("renders a single item correctly", () => {
      render(
        <NavGroup
          items={[{ href: "/contact", label: "Contact" }]}
          aria-label="Primary"
        />,
      );

      const link = screen.getByRole("link", { name: "Contact" });
      expect(link).toHaveAttribute("href", "/contact");
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
  });

  describe("prop spreading", () => {
    it("applies a custom className to the <nav> root", () => {
      const { container } = render(
        <NavGroup items={items} className="my-nav" aria-label="Primary" />,
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("my-nav");
    });

    it("spreads arbitrary native nav attributes onto the root", () => {
      render(
        <NavGroup
          items={items}
          aria-label="Primary"
          id="primary-nav"
          data-testid="nav-root"
        />,
      );

      const nav = screen.getByRole("navigation", { name: "Primary" });
      expect(nav).toHaveAttribute("id", "primary-nav");
      expect(nav).toHaveAttribute("data-testid", "nav-root");
    });

    it("supports aria-labelledby to name the landmark from another element", () => {
      render(
        <>
          <span id="nav-heading">Site sections</span>
          <NavGroup items={items} aria-labelledby="nav-heading" />
        </>,
      );

      expect(
        screen.getByRole("navigation", { name: "Site sections" }),
      ).toBeInTheDocument();
    });
  });

  describe("interaction + accessibility", () => {
    it("lets each link be activated by the user", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <NavGroup
          items={items}
          aria-label="Primary"
          onClickCapture={onClick}
        />,
      );

      await user.click(screen.getByRole("link", { name: "Work" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("exposes all links as keyboard-focusable navigation targets", async () => {
      const user = userEvent.setup();
      render(<NavGroup items={items} aria-label="Primary" />);

      await user.tab();
      expect(screen.getByRole("link", { name: "Work" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: "Stack" })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: "About" })).toHaveFocus();
    });
  });
});
