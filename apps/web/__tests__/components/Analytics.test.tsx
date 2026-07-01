import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { Analytics } from "@/app/components/Analytics/Analytics";
import { CookieConsentProvider } from "@/app/components/CookieConsentProvider/CookieConsentProvider";
import { setAnalyticsConsent, track } from "@/lib/analytics/mixpanel";
import { writeConsent } from "@/lib/cookieConsent";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/lib/analytics/mixpanel", () => ({
  track: jest.fn(),
  setAnalyticsConsent: jest.fn(),
}));

const mockedTrack = track as jest.MockedFunction<typeof track>;
const mockedSetConsent = setAnalyticsConsent as jest.MockedFunction<
  typeof setAnalyticsConsent
>;
const mockedUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;

function grantConsent() {
  writeConsent({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });
}

function tree() {
  return (
    <CookieConsentProvider>
      <Analytics />
    </CookieConsentProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  mockedUsePathname.mockReturnValue("/en");
});

describe("Analytics navigation", () => {
  it("omits previous_screen on the first navigation of a session", () => {
    grantConsent();
    render(tree());

    expect(mockedTrack).toHaveBeenCalledWith("navigation", { screen: "home" });
  });

  it("reports the previous screen on a later navigation", () => {
    grantConsent();
    const { rerender } = render(tree());
    mockedTrack.mockClear();

    mockedUsePathname.mockReturnValue("/en/privacy");
    rerender(tree());

    expect(mockedTrack).toHaveBeenCalledWith("navigation", {
      screen: "privacy",
      previous_screen: "home",
    });
  });

  it("mirrors consent into Mixpanel and fires nothing before it is granted", () => {
    render(tree());

    expect(mockedSetConsent).toHaveBeenCalledWith(false);
    expect(mockedTrack).not.toHaveBeenCalled();
  });
});
