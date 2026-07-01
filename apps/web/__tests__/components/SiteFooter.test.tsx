// The Footer organism is ESM in @portfolio/ui (skipped by next/jest); mock it
// down to a plain <footer> so this suite exercises SiteFooter's own wiring.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    Footer: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => React.createElement("footer", { className }, children),
  };
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { SiteFooter } from "@/app/components/SiteFooter/SiteFooter";
import { CookieConsentProvider } from "@/app/components/CookieConsentProvider/CookieConsentProvider";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { NECESSARY_ONLY, writeConsent } from "@/lib/cookieConsent";

const links = {
  privacyLabel: "Privacy policy",
  privacyHref: "/en/privacy",
  termsLabel: "Terms",
  termsHref: "/en/terms",
  cookieSettingsLabel: "Cookie settings",
};

/** Surfaces the banner state so tests can observe re-opening + the target view. */
function BannerProbe() {
  const { isBannerOpen, bannerView } = useCookieConsent();
  return (
    <>
      <div data-testid="banner-open">{String(isBannerOpen)}</div>
      <div data-testid="banner-view">{bannerView}</div>
    </>
  );
}

function renderFooter(children?: ReactNode) {
  return render(
    <CookieConsentProvider>
      <SiteFooter colophon="@ciaranmccullough {year}" links={links} />
      {children}
    </CookieConsentProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("SiteFooter", () => {
  it("links Privacy and Terms to their localised routes", () => {
    renderFooter();

    expect(
      screen.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/en/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/en/terms",
    );
  });

  it("fills the live copyright year into the colophon", () => {
    renderFooter();
    // The {year} placeholder is replaced client-side with a 4-digit year.
    expect(screen.getByText(/@ciaranmccullough \d{4}/)).toBeInTheDocument();
  });

  it("re-opens the cookie banner on the preferences view when 'Cookie settings' is clicked", async () => {
    // A prior decision means the banner starts closed.
    writeConsent(NECESSARY_ONLY);
    const user = userEvent.setup();
    renderFooter(<BannerProbe />);

    expect(screen.getByTestId("banner-open")).toHaveTextContent("false");

    await user.click(screen.getByRole("button", { name: "Cookie settings" }));

    expect(screen.getByTestId("banner-open")).toHaveTextContent("true");
    // "Cookie settings" jumps straight to the manage-preferences view.
    expect(screen.getByTestId("banner-view")).toHaveTextContent("preferences");
  });
});
