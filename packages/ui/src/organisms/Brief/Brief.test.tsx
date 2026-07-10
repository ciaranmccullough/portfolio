import { render, screen } from "@testing-library/react";

import { Brief } from "./Brief";
import { briefClass } from "./Brief.styles";

describe("Brief", () => {
  it("mounts without crashing and renders a <section> root with the base class", () => {
    const { container } = render(<Brief body={<p>A statement.</p>} />);

    const section = container.firstElementChild;
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass(briefClass);
  });

  it("renders the eyebrow when provided", () => {
    render(<Brief eyebrow="// The brief" body={<p>A statement.</p>} />);
    expect(screen.getByText("// The brief")).toBeInTheDocument();
  });

  it("omits the eyebrow when not provided", () => {
    render(<Brief body={<p>A statement.</p>} />);
    expect(screen.queryByText(/^\/\//)).not.toBeInTheDocument();
  });

  it("renders arbitrary rich-text-like body content verbatim, including nested marks", () => {
    const { container } = render(
      <Brief
        body={
          <p data-testid="statement">
            A <strong>purpose built</strong> experience.
          </p>
        }
      />,
    );

    expect(screen.getByText("purpose built").tagName).toBe("STRONG");
    expect(
      container.querySelector('[data-testid="statement"]'),
    ).toHaveTextContent("A purpose built experience.");
  });

  it("renders multiple body blocks (e.g. several stacked paragraphs) when passed a fragment", () => {
    render(
      <Brief
        body={
          <>
            <p>Line one.</p>
            <p>Line two.</p>
          </>
        }
      />,
    );

    expect(screen.getByText("Line one.")).toBeInTheDocument();
    expect(screen.getByText("Line two.")).toBeInTheDocument();
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <Brief body={<p>A statement.</p>} className="custom-class" />,
    );

    const section = container.firstElementChild;
    expect(section).toHaveClass(briefClass);
    expect(section).toHaveClass("custom-class");
  });

  it("spreads arbitrary props onto the <section>, promoting it to a region landmark", () => {
    render(
      <Brief body={<p>A statement.</p>} id="brief" aria-label="The brief" />,
    );

    const region = screen.getByRole("region", { name: "The brief" });
    expect(region).toHaveAttribute("id", "brief");
  });
});
