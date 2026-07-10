import { render, screen, within } from "@testing-library/react";

import { Principles } from "./Principles";
import { principlesClass } from "./Principles.styles";
import type { Principle } from "./Principles.types";

const principles: Principle[] = [
  { title: "Instant, even on launch", description: "Performance first." },
  { title: "One system, many surfaces", description: "Shared system." },
  { title: "Real time, no jank", description: "Live data, no dropped frames." },
];

describe("Principles", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(<Principles principles={principles} />);

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(principlesClass);
  });

  it("renders the eyebrow and heading when provided", () => {
    render(
      <Principles
        eyebrow="// Principles"
        title="Three ideas held it together"
        principles={principles}
      />,
    );

    expect(screen.getByText("// Principles")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Three ideas held it together",
      }),
    ).toBeInTheDocument();
  });

  it("omits the header block when neither eyebrow nor title is given", () => {
    render(<Principles principles={principles} />);

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders one PrincipleCard <li> per principle, in an ordered list", () => {
    const { container } = render(<Principles principles={principles} />);

    const list = container.querySelector("ol");
    expect(list).not.toBeNull();
    expect(within(list as HTMLElement).getAllByRole("listitem")).toHaveLength(
      principles.length,
    );
  });

  it("renders each principle's title as an <h3> and its description as body copy", () => {
    render(<Principles principles={principles} />);

    principles.forEach((p) => {
      expect(
        screen.getByRole("heading", { level: 3, name: p.title as string }),
      ).toBeInTheDocument();
      expect(screen.getByText(p.description as string)).toBeInTheDocument();
    });
  });

  it("numbers the cards 01, 02, 03 by position", () => {
    render(<Principles principles={principles} />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("cycles the violet/orange/green tone by position", () => {
    render(<Principles principles={principles} />);

    expect(screen.getByText("01")).toHaveClass("text-brand-violet");
    expect(screen.getByText("02")).toHaveClass("text-brand-orange-deep");
    expect(screen.getByText("03")).toHaveClass("text-brand-green-deep");
  });

  it("wraps the tone cycle for a 4th+ card", () => {
    render(
      <Principles
        principles={[...principles, { title: "Fourth principle" }]}
      />,
    );

    expect(screen.getByText("04")).toHaveClass("text-brand-violet");
  });

  it("renders a card without a description when omitted (e.g. the CMS typo case)", () => {
    render(
      <Principles principles={[{ title: "Real time, optimistic updates" }]} />,
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Real time, optimistic updates",
      }),
    ).toBeInTheDocument();
  });

  it("renders an empty grid when principles is empty", () => {
    const { container } = render(<Principles principles={[]} />);

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <Principles principles={principles} className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(principlesClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(
      <Principles
        principles={principles}
        aria-label="Principles"
        id="principles"
      />,
    );

    const region = screen.getByRole("region", { name: "Principles" });
    expect(region).toHaveAttribute("id", "principles");
  });
});
