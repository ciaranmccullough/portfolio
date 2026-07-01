import { render, screen } from "@testing-library/react";

import { SkillPill } from "./SkillPill";
import { skillPillBase, skillPillTone } from "./SkillPill.styles";
import type { SkillPillTone } from "./SkillPill.types";

/**
 * Render a SkillPill inside a <ul> so the <li> lands in a valid list context
 * and is queryable via the accessible `listitem` role.
 */
function renderPill(ui: React.ReactElement) {
  return render(<ul>{ui}</ul>);
}

describe("SkillPill", () => {
  it("renders its children as an <li> (listitem role)", () => {
    renderPill(<SkillPill>Android</SkillPill>);

    const pill = screen.getByRole("listitem");
    expect(pill).toBeInTheDocument();
    expect(pill.tagName).toBe("LI");
    expect(pill).toHaveTextContent("Android");
  });

  it("exposes an accessible name from its text content", () => {
    renderPill(<SkillPill aria-label="Android skill">Android</SkillPill>);

    expect(screen.getByRole("listitem")).toHaveAccessibleName("Android skill");
  });

  it("always applies the base class tokens", () => {
    renderPill(<SkillPill>React Native</SkillPill>);

    // Split the base string into individual tokens so each is asserted.
    expect(screen.getByRole("listitem")).toHaveClass(
      ...skillPillBase.split(" "),
    );
  });

  it("defaults to the `android` tone when no tone is provided", () => {
    renderPill(<SkillPill>Android</SkillPill>);

    const pill = screen.getByRole("listitem");
    expect(pill).toHaveClass(skillPillTone.android);
    // The default must not leak another tone's background.
    expect(pill).not.toHaveClass(skillPillTone.react);
    expect(pill).not.toHaveClass(skillPillTone.violet);
  });

  describe("tone variants", () => {
    const tones = Object.keys(skillPillTone) as SkillPillTone[];

    it.each(tones)("maps tone=%s to its background class token", (tone) => {
      renderPill(<SkillPill tone={tone}>{tone}</SkillPill>);

      const pill = screen.getByRole("listitem");
      // The requested tone's class is present alongside the base classes.
      expect(pill).toHaveClass(skillPillBase, skillPillTone[tone]);

      // No other tone's class bleeds in.
      for (const other of tones) {
        if (other === tone) continue;
        expect(pill).not.toHaveClass(skillPillTone[other]);
      }
    });
  });

  it("renders a leading icon before the label", () => {
    renderPill(
      <SkillPill icon={<svg data-testid="glyph" aria-hidden="true" />}>
        React Native
      </SkillPill>,
    );

    const pill = screen.getByRole("listitem");
    const glyph = screen.getByTestId("glyph");
    expect(pill).toContainElement(glyph);
    // Icon comes before the text label in DOM order.
    expect(pill.firstChild).toBe(glyph);
    expect(pill).toHaveTextContent("React Native");
  });

  it("renders without an icon when none is supplied", () => {
    renderPill(<SkillPill>Plain</SkillPill>);

    const pill = screen.getByRole("listitem");
    expect(pill.querySelector("svg")).toBeNull();
    expect(pill).toHaveTextContent("Plain");
  });

  it("merges an incoming className alongside the base + tone classes", () => {
    renderPill(
      <SkillPill tone="violet" className="custom-class">
        Violet
      </SkillPill>,
    );

    const pill = screen.getByRole("listitem");
    expect(pill).toHaveClass("custom-class");
    // Custom class does not clobber the component's own classes.
    expect(pill).toHaveClass(skillPillBase, skillPillTone.violet);
  });

  it("spreads arbitrary and aria-* props onto the root <li>", () => {
    renderPill(
      <SkillPill
        id="pill-1"
        data-analytics="skill"
        aria-describedby="hint"
        title="A skill pill"
      >
        Green
      </SkillPill>,
    );

    const pill = screen.getByRole("listitem");
    expect(pill).toHaveAttribute("id", "pill-1");
    expect(pill).toHaveAttribute("data-analytics", "skill");
    expect(pill).toHaveAttribute("aria-describedby", "hint");
    expect(pill).toHaveAttribute("title", "A skill pill");
  });

  it("forwards native handlers/events via spread props", () => {
    const handleClick = jest.fn();

    renderPill(<SkillPill onClick={handleClick}>Clickable</SkillPill>);

    screen.getByRole("listitem").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("lets consumers override the tone background via className (last token wins in source order)", () => {
    // cn has no tailwind-merge; the incoming className is appended after the
    // tone class, so both tokens are present in the className string.
    renderPill(
      <SkillPill tone="android" className="bg-brand-orange">
        Override
      </SkillPill>,
    );

    const pill = screen.getByRole("listitem");
    expect(pill).toHaveClass(skillPillTone.android);
    expect(pill).toHaveClass("bg-brand-orange");
    // The override token is declared after the tone token in the class string.
    const classList = pill.className.split(" ");
    expect(classList.indexOf("bg-brand-orange")).toBeGreaterThan(
      classList.indexOf(skillPillTone.android),
    );
  });
});
