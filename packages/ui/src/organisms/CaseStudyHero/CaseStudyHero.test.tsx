import { render, screen } from "@testing-library/react";

import { CaseStudyHero } from "./CaseStudyHero";
import { caseStudyHeroClass } from "./CaseStudyHero.styles";
import type { CaseStudyHeroMetaItem } from "./CaseStudyHero.types";

const meta: CaseStudyHeroMetaItem[] = [
  { label: "ROLE", value: "Software Engineer" },
  { label: "PLATFORM", value: "Android | Jetpack Compose" },
  { label: "YEAR", value: "2024 - Now" },
];

describe("CaseStudyHero", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(
      <CaseStudyHero title="Bringing fans closer" />,
    );

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(caseStudyHeroClass);
  });

  it("renders the title as an <h1> heading", () => {
    render(<CaseStudyHero title="Bringing fans closer" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Bringing fans closer" }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and description when provided", () => {
    render(
      <CaseStudyHero
        title="Title"
        eyebrow="// Case study"
        description="A companion app."
      />,
    );

    expect(screen.getByText("// Case study")).toBeInTheDocument();
    expect(screen.getByText("A companion app.")).toBeInTheDocument();
  });

  it("omits the background layer entirely when backgroundImage is not provided", () => {
    const { container } = render(<CaseStudyHero title="Title" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("renders the provided backgroundImage inside a decorative, hidden wrapper", () => {
    render(
      <CaseStudyHero
        title="Title"
        backgroundImage={<img src="/bg.png" alt="" data-testid="hero-bg" />}
      />,
    );

    const bg = screen.getByTestId("hero-bg");
    expect(bg.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("renders the meta row as a single definition list with one term/description pair per item", () => {
    const { container } = render(<CaseStudyHero title="Title" meta={meta} />);

    expect(container.querySelectorAll("dl")).toHaveLength(1);
    meta.forEach((item) => {
      expect(screen.getByText(item.label as string)).toBeInTheDocument();
      expect(screen.getByText(item.value as string)).toBeInTheDocument();
    });
  });

  it("omits the meta row when meta is not provided or empty", () => {
    const { container: withoutMeta } = render(<CaseStudyHero title="Title" />);
    expect(withoutMeta.querySelector("dl")).toBeNull();

    const { container: emptyMeta } = render(
      <CaseStudyHero title="Title" meta={[]} />,
    );
    expect(emptyMeta.querySelector("dl")).toBeNull();
  });

  it("renders the scroll cue label with a decorative, hidden arrow", () => {
    render(<CaseStudyHero title="Title" scrollCueLabel="Scroll to begin" />);

    const cue = screen.getByText("Scroll to begin");
    expect(cue).toBeInTheDocument();

    const arrow = screen.getByText("↓");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("omits the scroll cue when scrollCueLabel is not provided", () => {
    render(<CaseStudyHero title="Title" />);
    expect(screen.queryByText("↓")).not.toBeInTheDocument();
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <CaseStudyHero title="Title" className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(caseStudyHeroClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(<CaseStudyHero title="Title" id="hero" aria-label="Case study" />);

    const region = screen.getByRole("region", { name: "Case study" });
    expect(region).toHaveAttribute("id", "hero");
  });
});
