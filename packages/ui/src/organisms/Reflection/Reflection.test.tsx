import { render, screen } from "@testing-library/react";

import { Reflection } from "./Reflection";
import {
  reflectionClass,
  reflectionTitleAccentClass,
} from "./Reflection.styles";
import type { ReflectionItem } from "./Reflection.types";

const reflections: ReflectionItem[] = [
  { title: "Perceived speed is a feature.", description: "Caching helped." },
  {
    title: "Boring infrastructure wins.",
    description: "Shared system.",
    accent: true,
  },
  { title: "The small stuff is the story.", description: "Two-second reveal." },
];

describe("Reflection", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(<Reflection reflections={reflections} />);

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(reflectionClass);
  });

  it("renders the eyebrow and heading when provided", () => {
    render(
      <Reflection
        eyebrow="// Reflection"
        title="What it taught me"
        reflections={reflections}
      />,
    );

    expect(screen.getByText("// Reflection")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What it taught me" }),
    ).toBeInTheDocument();
  });

  it("omits the header block when neither eyebrow nor title is given", () => {
    render(<Reflection reflections={reflections} />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("renders one card <li> per reflection, each with an <h3> title and description", () => {
    render(<Reflection reflections={reflections} />);

    reflections.forEach((item) => {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title as string }),
      ).toBeInTheDocument();
      expect(screen.getByText(item.description as string)).toBeInTheDocument();
    });
  });

  it("renders a card without a description when omitted", () => {
    render(<Reflection reflections={[{ title: "No description here" }]} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "No description here" }),
    ).toBeInTheDocument();
  });

  it("applies the accent colour only to items marked accent", () => {
    render(<Reflection reflections={reflections} />);

    const accented = screen.getByRole("heading", {
      level: 3,
      name: "Boring infrastructure wins.",
    });
    const plain = screen.getByRole("heading", {
      level: 3,
      name: "Perceived speed is a feature.",
    });

    expect(accented).toHaveClass(reflectionTitleAccentClass);
    expect(plain).not.toHaveClass(reflectionTitleAccentClass);
  });

  it("renders an empty grid when reflections is empty", () => {
    const { container } = render(<Reflection reflections={[]} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <Reflection reflections={reflections} className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(reflectionClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(
      <Reflection
        reflections={reflections}
        id="reflection"
        aria-label="Reflection"
      />,
    );

    const region = screen.getByRole("region", { name: "Reflection" });
    expect(region).toHaveAttribute("id", "reflection");
  });
});
