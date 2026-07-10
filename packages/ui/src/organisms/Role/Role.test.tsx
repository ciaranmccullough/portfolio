import { render, screen } from "@testing-library/react";

import { Role } from "./Role";
import { roleClass } from "./Role.styles";

describe("Role", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(<Role title="What I owned across the app" />);

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(roleClass);
  });

  it("renders the title as an <h2> heading", () => {
    render(<Role title="What I owned across the app" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "What I owned across the app",
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and description when provided", () => {
    render(
      <Role
        title="Title"
        eyebrow="// The role"
        description="I worked across the app as an engineer."
      />,
    );

    expect(screen.getByText("// The role")).toBeInTheDocument();
    expect(
      screen.getByText("I worked across the app as an engineer."),
    ).toBeInTheDocument();
  });

  it("renders action children (e.g. buttons) when provided", () => {
    render(
      <Role title="Title">
        <button type="button">View the project</button>
        <button type="button">Back to all work</button>
      </Role>,
    );

    expect(
      screen.getByRole("button", { name: "View the project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to all work" }),
    ).toBeInTheDocument();
  });

  it("omits the actions wrapper when no children are given", () => {
    const { container } = render(<Role title="Title" />);
    // Only the <h2> heading renders inside the panel — no trailing div wrapper.
    const panel = container.querySelector("section > div");
    expect(panel?.children).toHaveLength(1);
    expect(panel?.children[0]?.tagName).toBe("H2");
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <Role title="Title" className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(roleClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(<Role title="Title" id="role" aria-label="Role" />);

    const region = screen.getByRole("region", { name: "Role" });
    expect(region).toHaveAttribute("id", "role");
  });
});
