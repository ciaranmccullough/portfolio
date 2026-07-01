import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

import { CookieConsentProvider } from "@/app/components/CookieConsentProvider/CookieConsentProvider";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import {
  CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
} from "@/lib/cookieConsent";

function wrapper({ children }: { children: ReactNode }) {
  return <CookieConsentProvider>{children}</CookieConsentProvider>;
}

function renderConsent() {
  return renderHook(() => useCookieConsent(), { wrapper });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("useCookieConsent", () => {
  it("throws when used outside a provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCookieConsent())).toThrow(
      /CookieConsentProvider/,
    );
    spy.mockRestore();
  });

  it("opens the banner for a first-time visitor (no stored choice)", () => {
    const { result } = renderConsent();

    expect(result.current.isBannerOpen).toBe(true);
    expect(result.current.consent).toBeNull();
    expect(result.current.hasConsented).toBe(false);
  });

  it("hydrates from a stored choice and keeps the banner closed", () => {
    writeConsent({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    });

    const { result } = renderConsent();

    expect(result.current.isBannerOpen).toBe(false);
    expect(result.current.hasConsented).toBe(true);
    expect(result.current.consent).toEqual({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    });
  });

  it("accepts all: persists, closes and reports every category on", () => {
    const { result } = renderConsent();

    act(() => result.current.acceptAll());

    expect(result.current.isBannerOpen).toBe(false);
    expect(result.current.consent).toEqual({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    expect(readConsent()).toEqual(result.current.consent);
  });

  it("rejects all non-essential categories", () => {
    const { result } = renderConsent();

    act(() => result.current.rejectAll());

    expect(result.current.consent).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  });

  it("saves an explicit set of preferences", () => {
    const { result } = renderConsent();

    act(() =>
      result.current.savePreferences({
        necessary: true,
        functional: false,
        analytics: true,
        marketing: false,
      }),
    );

    expect(result.current.consent).toEqual({
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    });
    expect(result.current.isBannerOpen).toBe(false);
  });

  it("re-opens the banner without changing the stored choice", () => {
    const { result } = renderConsent();

    act(() => result.current.rejectAll());
    expect(result.current.isBannerOpen).toBe(false);

    act(() => result.current.openBanner());
    expect(result.current.isBannerOpen).toBe(true);
    // The persisted choice is untouched by re-opening.
    expect(result.current.consent).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  });

  it("resets: clears storage, forgets the choice and re-opens", () => {
    const { result } = renderConsent();

    act(() => result.current.acceptAll());
    act(() => result.current.reset());

    expect(result.current.consent).toBeNull();
    expect(result.current.hasConsented).toBe(false);
    expect(result.current.isBannerOpen).toBe(true);
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
});
