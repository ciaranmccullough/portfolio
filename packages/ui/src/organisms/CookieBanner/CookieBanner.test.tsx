import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CookieBanner } from "./CookieBanner";

function setup(props?: Partial<Parameters<typeof CookieBanner>[0]>) {
  const onAcceptAll = jest.fn();
  const onRejectAll = jest.fn();
  const onSavePreferences = jest.fn();
  const utils = render(
    <CookieBanner
      open
      onAcceptAll={onAcceptAll}
      onRejectAll={onRejectAll}
      onSavePreferences={onSavePreferences}
      {...props}
    />,
  );
  return { onAcceptAll, onRejectAll, onSavePreferences, ...utils };
}

describe("CookieBanner", () => {
  it("renders a labelled dialog in the summary view when open", () => {
    setup();

    const dialog = screen.getByRole("dialog", { name: "Cookie consent" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "false");
    expect(
      screen.getByRole("heading", { name: "We value your privacy" }),
    ).toBeInTheDocument();
    // Summary view shows no category switches yet.
    expect(screen.queryAllByRole("switch")).toHaveLength(0);
  });

  it("renders nothing (no dialog) when closed", () => {
    setup({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onAcceptAll and surfaces a status message", async () => {
    const user = userEvent.setup();
    const { onAcceptAll } = setup();

    await user.click(screen.getByRole("button", { name: "Accept all" }));
    expect(onAcceptAll).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent(
      "All cookies accepted",
    );
  });

  it("calls onRejectAll", async () => {
    const user = userEvent.setup();
    const { onRejectAll } = setup();

    await user.click(screen.getByRole("button", { name: "Reject all" }));
    expect(onRejectAll).toHaveBeenCalledTimes(1);
  });

  it("expands into a modal preferences view listing every category", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getByRole("button", { name: "Manage preferences" }),
    );

    expect(
      screen.getByRole("heading", { name: "Manage your cookies" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(4);
    // Strictly necessary is locked on.
    expect(
      screen.getByRole("switch", { name: "Strictly necessary" }),
    ).toBeDisabled();
  });

  it("persists the edited draft via onSavePreferences", async () => {
    const user = userEvent.setup();
    const { onSavePreferences } = setup();

    await user.click(
      screen.getByRole("button", { name: "Manage preferences" }),
    );
    await user.click(
      screen.getByRole("switch", { name: "Performance & analytics" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Save my preferences" }),
    );

    expect(onSavePreferences).toHaveBeenCalledTimes(1);
    expect(onSavePreferences).toHaveBeenCalledWith({
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    });
  });

  it("seeds the toggles from the supplied preferences", async () => {
    const user = userEvent.setup();
    setup({
      preferences: {
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      },
    });

    await user.click(
      screen.getByRole("button", { name: "Manage preferences" }),
    );

    expect(screen.getByRole("switch", { name: "Functional" })).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Performance & analytics" }),
    ).not.toBeChecked();
  });

  it("saves a seeded-on toggle that was never touched (reads it from the DOM)", async () => {
    const user = userEvent.setup();
    const { onSavePreferences } = setup({
      preferences: {
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      },
    });

    await user.click(
      screen.getByRole("button", { name: "Manage preferences" }),
    );
    // Save without touching any switch — the seeded `functional: true` must
    // survive because handleSave reads the live DOM state, not a default.
    await user.click(
      screen.getByRole("button", { name: "Save my preferences" }),
    );

    expect(onSavePreferences).toHaveBeenCalledWith({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    });
  });

  it("links the privacy policy from the body", () => {
    setup({ privacyHref: "/en/privacy" });

    const link = screen.getByRole("link", { name: "Privacy policy" });
    expect(link).toHaveAttribute("href", "/en/privacy");
  });

  it("collapses back to the summary view on Escape", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getByRole("button", { name: "Manage preferences" }),
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
    expect(screen.queryAllByRole("switch")).toHaveLength(0);
  });
});
