import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Icon } from "./Icon";
import { iconClass } from "./Icon.styles";

/**
 * A representative inline SVG used as the icon's children. `data-testid` is only
 * used here to grab the raw SVG node for assertions — never to query the Icon
 * root itself (that is queried by role / accessible name).
 */
const Svg = () => (
  <svg data-testid="svg" viewBox="0 0 24 24" aria-hidden>
    <rect x="4" y="4" width="9" height="9" />
  </svg>
);

describe("Icon", () => {
  describe("semantic element + default (decorative) render", () => {
    it("renders a <span> as the root element", () => {
      const { container } = render(
        <Icon>
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild;
      expect(root).not.toBeNull();
      expect(root?.tagName).toBe("SPAN");
    });

    it("is decorative by default: aria-hidden and no img role", () => {
      const { container } = render(
        <Icon>
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute("aria-hidden", "true");
      expect(root).not.toHaveAttribute("role");
      expect(root).not.toHaveAttribute("aria-label");
      // A decorative icon is hidden from the accessibility tree.
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders its SVG children", () => {
      render(
        <Icon>
          <Svg />
        </Icon>,
      );

      expect(screen.getByTestId("svg")).toBeInTheDocument();
    });
  });

  describe("labelled (image) render", () => {
    it("exposes role=img and the accessible name when given a label", () => {
      render(
        <Icon label="Dashboard">
          <Svg />
        </Icon>,
      );

      const img = screen.getByRole("img", { name: "Dashboard" });
      expect(img.tagName).toBe("SPAN");
      expect(img).toHaveAttribute("aria-label", "Dashboard");
      expect(img).toHaveAccessibleName("Dashboard");
    });

    it("is NOT aria-hidden when labelled", () => {
      render(
        <Icon label="Dashboard">
          <Svg />
        </Icon>,
      );

      expect(screen.getByRole("img")).not.toHaveAttribute("aria-hidden");
    });

    it("treats an empty-string label as decorative (falsy → hidden)", () => {
      const { container } = render(
        <Icon label="">
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      // "" is falsy, so the component falls back to the decorative branch.
      expect(root).toHaveAttribute("aria-hidden", "true");
      expect(root).not.toHaveAttribute("role");
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("styling / class tokens", () => {
    it("applies the base iconClass tokens", () => {
      const { container } = render(
        <Icon>
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      // Assert against the real token string rather than hardcoding.
      for (const token of iconClass.split(" ")) {
        expect(root).toHaveClass(token);
      }
    });

    it("merges an incoming className alongside the base tokens", () => {
      const { container } = render(
        <Icon className="size-10 text-brand-violet">
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      // Custom classes are present...
      expect(root).toHaveClass("size-10", "text-brand-violet");
      // ...and the base tokens are still there.
      for (const token of iconClass.split(" ")) {
        expect(root).toHaveClass(token);
      }
    });

    it("keeps only the base tokens when no className is passed", () => {
      const { container } = render(
        <Icon>
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.getAttribute("class")).toBe(iconClass);
    });
  });

  describe("prop spreading", () => {
    it("spreads arbitrary DOM props (id, data-*) onto the root", () => {
      const { container } = render(
        <Icon id="grid-icon" data-analytics="nav">
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute("id", "grid-icon");
      expect(root).toHaveAttribute("data-analytics", "nav");
    });

    it("spreads aria-* attributes onto the root", () => {
      render(
        <Icon label="Menu" aria-describedby="tip">
          <Svg />
        </Icon>,
      );

      expect(screen.getByRole("img")).toHaveAttribute(
        "aria-describedby",
        "tip",
      );
    });

    it("forwards event handlers to the root", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(
        <Icon label="Clickable" onClick={onClick}>
          <Svg />
        </Icon>,
      );

      await user.click(screen.getByRole("img"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("lets a consumer-supplied aria-hidden override the default on a decorative icon", () => {
      const { container } = render(
        <Icon aria-hidden={false}>
          <Svg />
        </Icon>,
      );

      const root = container.firstElementChild as HTMLElement;
      // props are spread AFTER the default aria-hid={true}, so consumer wins.
      expect(root).toHaveAttribute("aria-hidden", "false");
    });
  });
});
