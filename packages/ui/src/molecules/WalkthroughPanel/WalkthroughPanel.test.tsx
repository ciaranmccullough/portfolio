import { render, screen } from "@testing-library/react";

import { WalkthroughPanel } from "./WalkthroughPanel";
import { walkthroughPanelClass } from "./WalkthroughPanel.styles";

describe("WalkthroughPanel", () => {
  it("renders an <article> root with the base class", () => {
    const { container } = render(
      <WalkthroughPanel title="Beat the empty feed" />,
    );

    const article = container.firstElementChild;
    expect(article?.tagName).toBe("ARTICLE");
    expect(article).toHaveClass(walkthroughPanelClass);
  });

  it("renders the title as an <h3> heading", () => {
    render(<WalkthroughPanel title="Beat the empty feed" />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Beat the empty feed" }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and description when provided", () => {
    render(
      <WalkthroughPanel
        title="Beat the empty feed"
        eyebrow="ONBOARDING"
        description="A personalised feed is useless if it loads empty."
      />,
    );

    expect(screen.getByText("ONBOARDING")).toBeInTheDocument();
    expect(
      screen.getByText("A personalised feed is useless if it loads empty."),
    ).toBeInTheDocument();
  });

  it("renders the decorative numeral hidden from the accessibility tree", () => {
    render(<WalkthroughPanel title="Title" index="01" />);

    const numeral = screen.getByText("01");
    expect(numeral).toHaveAttribute("aria-hidden", "true");
  });

  it("omits the numeral when index is not provided", () => {
    render(<WalkthroughPanel title="Title" />);

    expect(screen.queryByText(/^0\d$/)).not.toBeInTheDocument();
  });

  it("renders the callout label and body when provided", () => {
    render(
      <WalkthroughPanel
        title="Title"
        callout={{ label: "THE CALL —", body: "Cached favourites on-device." }}
      />,
    );

    expect(screen.getByText("THE CALL —")).toBeInTheDocument();
    expect(
      screen.getByText("Cached favourites on-device."),
    ).toBeInTheDocument();
  });

  it("omits the callout block entirely when not provided", () => {
    render(<WalkthroughPanel title="Title" />);

    expect(screen.queryByText(/THE CALL/)).not.toBeInTheDocument();
  });

  it("renders extra children content (e.g. a poll widget) below the callout", () => {
    render(
      <WalkthroughPanel title="Title">
        <div data-testid="poll-widget">Poll goes here</div>
      </WalkthroughPanel>,
    );

    expect(screen.getByTestId("poll-widget")).toBeInTheDocument();
  });

  it("omits the extra content wrapper when no children are given", () => {
    const { container } = render(<WalkthroughPanel title="Title" />);
    // Only heading content renders — no trailing empty wrapper div.
    expect(container.querySelectorAll("article > div")).toHaveLength(0);
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(
      <WalkthroughPanel title="Title" className="custom-class" />,
    );

    const article = container.firstElementChild;
    expect(article).toHaveClass(walkthroughPanelClass);
    expect(article).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*) onto the <article> root", () => {
    render(
      <WalkthroughPanel
        title="Title"
        id="panel-1"
        data-walkthrough-panel-index={0}
      />,
    );

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("id", "panel-1");
    expect(article).toHaveAttribute("data-walkthrough-panel-index", "0");
  });
});
