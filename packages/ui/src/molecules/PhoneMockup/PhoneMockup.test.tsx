import { render, screen } from "@testing-library/react";

import { PhoneMockup } from "./PhoneMockup";
import {
  phoneMockupSegmentActiveClass,
  phoneMockupSegmentInactiveClass,
} from "./PhoneMockup.styles";
import type { PhoneMockupStep } from "./PhoneMockup.types";

const steps: PhoneMockupStep[] = [
  { label: "Onboarding" },
  { label: "Home" },
  { label: "Scores" },
];

describe("PhoneMockup", () => {
  it("mounts without crashing", () => {
    const { container } = render(<PhoneMockup />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the provided image inside the screen", () => {
    render(<PhoneMockup image={<img src="/shot.png" alt="Home screen" />} />);
    expect(
      screen.getByRole("img", { name: "Home screen" }),
    ).toBeInTheDocument();
  });

  it("renders the fallback content when image is omitted", () => {
    render(<PhoneMockup fallback="Preview coming soon" />);
    expect(screen.getByText("Preview coming soon")).toBeInTheDocument();
  });

  it("renders neither an image nor fallback text without crashing when both are omitted", () => {
    const { container } = render(<PhoneMockup />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("");
  });

  it("prefers the image over the fallback when both are provided", () => {
    render(
      <PhoneMockup
        image={<img src="/shot.png" alt="Home screen" />}
        fallback="Preview coming soon"
      />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByText("Preview coming soon")).not.toBeInTheDocument();
  });

  it("omits the progress row entirely when steps is not provided", () => {
    render(<PhoneMockup />);
    expect(screen.queryByText(/\d{2} \/ \d{2}/)).not.toBeInTheDocument();
  });

  it("renders the active step's label and an NN / total counter", () => {
    render(<PhoneMockup steps={steps} activeStep={1} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
  });

  it("defaults activeStep to 0", () => {
    render(<PhoneMockup steps={steps} />);
    expect(screen.getByText("Onboarding")).toBeInTheDocument();
    expect(screen.getByText("01 / 03")).toBeInTheDocument();
  });

  it("marks segments up to and including the active step as visited", () => {
    const { container } = render(<PhoneMockup steps={steps} activeStep={1} />);

    const segments = container.querySelectorAll("ul[aria-hidden='true'] li");
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveClass(phoneMockupSegmentActiveClass);
    expect(segments[1]).toHaveClass(phoneMockupSegmentActiveClass);
    expect(segments[2]).not.toHaveClass(phoneMockupSegmentActiveClass);
    // exactly one background utility per segment — stacking both would leave
    // the painted colour to the stylesheet's emission order (see styles file)
    expect(segments[0]).not.toHaveClass(phoneMockupSegmentInactiveClass);
    expect(segments[1]).not.toHaveClass(phoneMockupSegmentInactiveClass);
    expect(segments[2]).toHaveClass(phoneMockupSegmentInactiveClass);
  });

  it("hides the decorative segment row from the accessibility tree", () => {
    const { container } = render(<PhoneMockup steps={steps} />);
    const segmentsList = container.querySelector("ul");
    expect(segmentsList).toHaveAttribute("aria-hidden", "true");
  });

  it("merges a consumer className while keeping the base class", () => {
    const { container } = render(<PhoneMockup className="custom-class" />);
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  it("spreads arbitrary props (id, data-*) onto the root", () => {
    render(<PhoneMockup id="phone" data-testid="phone-mockup" />);
    expect(screen.getByTestId("phone-mockup")).toHaveAttribute("id", "phone");
  });
});
