/** The four standard cookie-consent categories. */
export type CookieCategoryKey =
  | "necessary"
  | "functional"
  | "analytics"
  | "marketing";

/** A per-category on/off consent map. `necessary` is always granted. */
export type CookiePreferences = Record<CookieCategoryKey, boolean>;

/** Which view the banner shows: the compact summary or the preferences panel. */
export type CookieBannerView = "summary" | "preferences";

/** A single consent category as shown in the preferences panel. */
export interface CookieCategory {
  /** Stable identifier — also the key into {@link CookiePreferences}. */
  key: CookieCategoryKey;
  /** Human title, e.g. "Performance & analytics". */
  title: string;
  /** Short status chip, e.g. "Always active" / "Opt-in". */
  tag: string;
  /** One-line explanation of what the category does. */
  description: string;
  /** Fine-print legal basis line shown under the row. */
  meta: string;
  /** Locked-on categories (strictly necessary) can't be switched off. */
  locked?: boolean;
}

/** Every user-facing string in the {@link CookieBanner}. */
export interface CookieBannerCopy {
  /** Mono kicker above the heading, e.g. "// Your privacy". */
  eyebrow: string;
  /** Heading for the summary view. */
  summaryHeading: string;
  /** Heading for the expanded preferences view. */
  preferencesHeading: string;
  /** Intro paragraph shown in both views. */
  description: string;
  /** Text of the inline privacy-policy link at the end of the description. */
  privacyLabel: string;
  /** Accept-all button label. */
  acceptAll: string;
  /** Reject-all button label. */
  rejectAll: string;
  /** "Manage preferences" link label (summary view). */
  manage: string;
  /** "Save my preferences" button label (preferences view). */
  save: string;
  /** Accessible name for the dialog. */
  dialogLabel: string;
}

/** Props for the {@link CookieBanner} organism. */
export interface CookieBannerProps {
  /** Whether the banner card is visible. Controlled by the consumer. */
  open: boolean;
  /**
   * Which view to show each time the banner opens. Defaults to `"summary"`; pass
   * `"preferences"` to open straight into the manage-preferences panel (e.g. a
   * footer "Cookie settings" link). The banner still switches views internally
   * afterwards (Manage / collapse).
   */
  initialView?: CookieBannerView;
  /** Current persisted preferences, used to seed the toggles when expanded. */
  preferences?: CookiePreferences;
  /** The consent categories rendered in the preferences view. */
  categories?: CookieCategory[];
  /** Called when the user accepts every category. */
  onAcceptAll: () => void;
  /** Called when the user rejects all non-essential categories. */
  onRejectAll: () => void;
  /** Called with the chosen preferences when the user saves them. */
  onSavePreferences: (preferences: CookiePreferences) => void;
  /** Copy overrides, merged over the built-in English defaults. */
  copy?: Partial<CookieBannerCopy>;
  /** Href of the privacy policy, linked from the banner body. */
  privacyHref?: string;
  /** Extra classes for the banner card. */
  className?: string;
}
