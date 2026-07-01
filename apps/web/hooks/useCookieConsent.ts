"use client";

import { useContext } from "react";

import { CookieConsentContext } from "@/app/components/CookieConsentProvider/CookieConsentProvider";

/**
 * Access the shared cookie-consent state (current consent, accept/reject/save,
 * open/close the banner, and reset). Must be called from within a
 * {@link CookieConsentProvider}; throws otherwise so the misuse is caught early.
 */
export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider",
    );
  }
  return context;
}
