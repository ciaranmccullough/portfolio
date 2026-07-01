import {
  ALL_GRANTED,
  CONSENT_STORAGE_KEY,
  NECESSARY_ONLY,
  clearConsent,
  readConsent,
  writeConsent,
} from "@/lib/cookieConsent";

beforeEach(() => {
  window.localStorage.clear();
});

describe("cookieConsent storage", () => {
  it("returns null when nothing is stored", () => {
    expect(readConsent()).toBeNull();
  });

  it("round-trips written preferences", () => {
    const stored = writeConsent({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: true,
    });

    expect(stored).toEqual({
      necessary: true,
      functional: true,
      analytics: false,
      marketing: true,
    });
    expect(readConsent()).toEqual(stored);
  });

  it("stamps the persisted record with a numeric timestamp", () => {
    writeConsent(ALL_GRANTED);
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(typeof parsed.ts).toBe("number");
  });

  it("always forces `necessary` on, even if written false", () => {
    const stored = writeConsent({
      necessary: false,
      functional: false,
      analytics: false,
      marketing: false,
    });
    expect(stored.necessary).toBe(true);
    expect(readConsent()?.necessary).toBe(true);
  });

  it("coerces unknown / partial stored data to strict booleans", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ functional: "yes", analytics: 1, ts: 123 }),
    );

    expect(readConsent()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  });

  it("returns null on corrupt JSON", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{not valid json");
    expect(readConsent()).toBeNull();
  });

  it("clears a stored decision", () => {
    writeConsent(NECESSARY_ONLY);
    expect(readConsent()).not.toBeNull();

    clearConsent();
    expect(readConsent()).toBeNull();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it("exposes the two presets with necessary always granted", () => {
    expect(NECESSARY_ONLY).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    expect(ALL_GRANTED).toEqual({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  });
});
