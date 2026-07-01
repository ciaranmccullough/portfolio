import { act, render } from "@testing-library/react";

import { CookieConsentProvider } from "@/app/components/CookieConsentProvider/CookieConsentProvider";
import { HomeAnalytics } from "@/app/components/HomeAnalytics/HomeAnalytics";
import type { HomeSection } from "@/app/components/HomeAnalytics/HomeAnalytics.types";
import { track } from "@/lib/analytics/mixpanel";
import { writeConsent } from "@/lib/cookieConsent";

// Spy on the shared tracker; the real one no-ops without a token.
jest.mock("@/lib/analytics/mixpanel", () => ({ track: jest.fn() }));
const mockedTrack = track as jest.MockedFunction<typeof track>;

const SECTIONS: HomeSection[] = [
  { id: "top", feature: "hero" },
  { id: "work", feature: "project" },
  { id: "contact", feature: "contact" },
];

// jsdom has no IntersectionObserver — capture the callback so tests can drive it.
let ioCallback: IntersectionObserverCallback;
const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

beforeEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = "";
  class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      ioCallback = cb;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
    takeRecords = () => [];
  }
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

/** Render the section elements the tracker looks up by id, plus a project link. */
function setupDom() {
  for (const { id } of SECTIONS) {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
  }
  const link = document.createElement("a");
  link.href = "https://example.com/project-a";
  link.textContent = "Project A";
  document.getElementById("work")!.appendChild(link);
  return { link };
}

function intersect(id: string) {
  const target = document.getElementById(id)!;
  act(() => {
    ioCallback(
      [
        {
          isIntersecting: true,
          target,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
  });
  return target;
}

function renderWithConsent(granted: boolean) {
  if (granted) {
    writeConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  }
  return render(
    <CookieConsentProvider>
      <HomeAnalytics sections={SECTIONS} />
    </CookieConsentProvider>,
  );
}

describe("HomeAnalytics", () => {
  it("fires feature_viewed once when a section scrolls into view", () => {
    setupDom();
    renderWithConsent(true);

    expect(observe).toHaveBeenCalledTimes(SECTIONS.length);

    const top = intersect("top");
    expect(mockedTrack).toHaveBeenCalledWith("feature_viewed", {
      feature: "hero",
    });
    // Stops watching after the first impression, so it can't fire twice.
    expect(unobserve).toHaveBeenCalledWith(top);
  });

  it("fires project_clicked with the project title and URL", () => {
    const { link } = setupDom();
    renderWithConsent(true);

    act(() => {
      link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockedTrack).toHaveBeenCalledWith("project_clicked", {
      project: "Project A",
      project_url: "https://example.com/project-a",
    });
  });

  it("does nothing until analytics consent is granted", () => {
    setupDom();
    renderWithConsent(false);

    expect(observe).not.toHaveBeenCalled();
    expect(mockedTrack).not.toHaveBeenCalled();
  });
});
