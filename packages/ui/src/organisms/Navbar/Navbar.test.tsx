import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { NavItem } from "../../molecules";
import { Navbar } from "./Navbar";
import {
  navbarBrandClass,
  navbarClass,
  navbarToggleClass,
} from "./Navbar.styles";

const items: NavItem[] = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
];

describe("Navbar", () => {
  it("mounts as a banner/header landmark without crashing", () => {
    const { container } = render(<Navbar items={items} />);

    // <header> exposes the implicit `banner` landmark role.
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(container.querySelector("header")).toBe(header);
    expect(header).toHaveClass(...navbarClass.split(" "));
  });

  it("renders the brand as plain text when no brandHref is given", () => {
    render(<Navbar items={items} brand="Ciaran" />);

    const brand = screen.getByText("Ciaran");
    expect(brand.tagName).toBe("SPAN");
    expect(brand).toHaveClass(...navbarBrandClass.split(" "));
    // No brandHref → the brand is not a link.
    expect(brand).not.toHaveAttribute("href");
  });

  it("renders the brand as a link pointing at brandHref when provided", () => {
    render(<Navbar items={items} brand="Ciaran" brandHref="#top" />);

    const brandLink = screen.getByRole("link", { name: "Ciaran" });
    expect(brandLink.tagName).toBe("A");
    expect(brandLink).toHaveAttribute("href", "#top");
    expect(brandLink).toHaveClass(...navbarBrandClass.split(" "));
  });

  it("renders the desktop Primary nav landmark with one link per item", () => {
    render(<Navbar items={items} brand="Ciaran" />);

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    expect(primaryNav).toBeInTheDocument();

    // One <li> (and one link) per datum.
    const listItems = within(primaryNav).getAllByRole("listitem");
    expect(listItems).toHaveLength(items.length);

    const links = within(primaryNav).getAllByRole("link");
    expect(links).toHaveLength(items.length);

    items.forEach((item, index) => {
      const link = links[index];
      expect(link).toHaveTextContent(String(item.label));
      expect(link).toHaveAccessibleName(String(item.label));
      expect(link).toHaveAttribute("href", item.href);
    });
  });

  it("does not render the Mobile nav or the CTA sheet until the toggle is pressed", () => {
    render(
      <Navbar
        items={items}
        brand="Ciaran"
        cta={<a href="#contact">Get in touch</a>}
      />,
    );

    // Only the desktop Primary landmark exists on first render.
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("navigation")).toHaveLength(1);

    // The single CTA lives in the (always-rendered) desktop cluster.
    expect(
      screen.getByRole("link", { name: "Get in touch" }),
    ).toBeInTheDocument();
  });

  it("exposes an accessible, collapsed toggle button", () => {
    render(<Navbar items={items} brand="Ciaran" />);

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveClass(...navbarToggleClass.split(" "));
  });

  it("opens the mobile sheet on toggle, duplicating the nav and CTA, then closes it", async () => {
    const user = userEvent.setup();
    render(
      <Navbar
        items={items}
        brand="Ciaran"
        cta={<a href="#contact">Get in touch</a>}
      />,
    );

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });

    await user.click(toggle);

    // aria-expanded reflects the open state.
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // The Mobile landmark now exists alongside the Primary one.
    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    const mobileLinks = within(mobileNav).getAllByRole("link");
    expect(mobileLinks).toHaveLength(items.length);
    expect(screen.getAllByRole("navigation")).toHaveLength(2);

    // The CTA is duplicated into the sheet → two "Get in touch" links total.
    expect(screen.getAllByRole("link", { name: "Get in touch" })).toHaveLength(
      2,
    );

    // Toggling again collapses the sheet.
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });

  it("spreads through header props and merges an incoming className", () => {
    render(
      <Navbar
        items={items}
        brand="Ciaran"
        id="site-nav"
        className="custom-x"
      />,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("id", "site-nav");
    expect(header).toHaveClass("custom-x");
    // Base classes remain alongside the custom one.
    expect(header).toHaveClass(...navbarClass.split(" "));
  });

  it("renders no nav links when items is empty but still mounts safely", () => {
    render(<Navbar items={[]} brand="Ciaran" />);

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(primaryNav).queryAllByRole("listitem")).toHaveLength(0);
    expect(within(primaryNav).queryAllByRole("link")).toHaveLength(0);
    // Toggle is still present so the component remains operable.
    expect(
      screen.getByRole("button", { name: "Toggle navigation" }),
    ).toBeInTheDocument();
  });
});
