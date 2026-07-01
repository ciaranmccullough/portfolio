import { render, screen, within } from "@testing-library/react";

import { Contact } from "./Contact";
import {
  contactClass,
  contactIntroClass,
  contactSocialsClass,
  contactTitleClass,
} from "./Contact.styles";
import type { ContactProps } from "./Contact.types";

const baseProps: ContactProps = {
  eyebrow: "05 — Say hello",
  title: "Let's build something together.",
  intro:
    "Open to frontend web, hybrid mobile, Android and full-stack roles, freelance, and the odd side quest.",
  socials: [
    { label: "GitHub ↗", href: "https://github.com/example" },
    { label: "LinkedIn ↗", href: "https://linkedin.com/in/example" },
  ],
  children: <p>Contact form slot</p>,
};

const renderContact = (overrides: Partial<ContactProps> = {}) =>
  render(<Contact {...baseProps} {...overrides} />);

describe("Contact", () => {
  it("mounts without crashing and renders a section landmark wrapper", () => {
    const { container } = renderContact();

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(...contactClass.split(" "));
  });

  it("renders the title as a level-2 heading", () => {
    renderContact();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Let's build something together.",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass(...contactTitleClass.split(" "));
  });

  it("renders the eyebrow kicker text", () => {
    renderContact();

    expect(screen.getByText("05 — Say hello")).toBeInTheDocument();
  });

  it("renders the intro copy with its intro styling", () => {
    renderContact();

    const intro = screen.getByText(baseProps.intro as string);
    expect(intro).toBeInTheDocument();
    expect(intro).toHaveClass(...contactIntroClass.split(" "));
  });

  it("renders the children (form slot)", () => {
    renderContact({ children: <p>Contact form slot</p> });

    expect(screen.getByText("Contact form slot")).toBeInTheDocument();
  });

  it("renders social links as a list with one item per datum", () => {
    renderContact();

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list).toHaveClass(...contactSocialsClass.split(" "));

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(baseProps.socials!.length);

    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(baseProps.socials!.length);
  });

  it("exposes each social link with the correct accessible name and href", () => {
    renderContact();

    const github = screen.getByRole("link", { name: "GitHub ↗" });
    expect(github).toHaveAttribute("href", "https://github.com/example");

    const linkedin = screen.getByRole("link", { name: "LinkedIn ↗" });
    expect(linkedin).toHaveAttribute("href", "https://linkedin.com/in/example");
  });

  it("omits the eyebrow when not provided", () => {
    renderContact({ eyebrow: undefined });

    expect(screen.queryByText("05 — Say hello")).not.toBeInTheDocument();
    // The heading still renders as the only required piece of copy.
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: baseProps.title as string,
      }),
    ).toBeInTheDocument();
  });

  it("omits the intro when not provided", () => {
    renderContact({ intro: undefined });

    expect(
      screen.queryByText(baseProps.intro as string),
    ).not.toBeInTheDocument();
  });

  it("omits the socials list when socials is empty", () => {
    renderContact({ socials: [] });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("omits the socials list when socials is undefined", () => {
    renderContact({ socials: undefined });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("forwards native section props and merges an incoming className", () => {
    const { container } = renderContact({
      id: "contact",
      "aria-label": "Get in touch",
      className: "custom-section",
    });

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "contact");
    expect(section).toHaveAccessibleName("Get in touch");
    // Merges consumer className alongside the base class.
    expect(section).toHaveClass("custom-section");
    expect(section).toHaveClass(...contactClass.split(" "));
  });
});
