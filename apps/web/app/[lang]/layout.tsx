import type { CookieCategory } from "@portfolio/ui";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";

import { SITE_NAME, SITE_URL } from "@/site-config";

import { Analytics } from "../components/Analytics/Analytics";
import { CookieConsent } from "../components/CookieConsent/CookieConsent";
import { CookieConsentProvider } from "../components/CookieConsentProvider/CookieConsentProvider";
import { SkipLink } from "../components/SkipLink/SkipLink";
import { i18n } from "../../i18n-config";
import { MAIN_CONTENT_ID } from "@/lib/mainContentId";
import { getTranslations } from "./dictionaries";
import { localePath } from "@/lib/localePath";

import "../globals.css";

// Self-host the brand fonts (downloaded at build, no runtime Google request, no
// layout shift). Each exposes a CSS variable the design tokens consume — so the
// fonts render for every visitor, not just machines that happen to have them
// installed (theme.css falls back to the named family, then a generic).
const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const fontBody = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const fontVariables = `${fontHeading.variable} ${fontBody.variable} ${fontMono.variable}`;

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { title, description } = (await getTranslations(params)).metadata;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    // The home canonical. This is a layout-level default, so every route that
    // isn't the homepage must declare its own `alternates.canonical` in its
    // page `generateMetadata` — otherwise it inherits this one and tells
    // crawlers it's a duplicate of the homepage (a Lighthouse SEO failure).
    alternates: { canonical: localePath(lang, "/") },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { cookies, nav } = await getTranslations(params);
  return (
    <html lang={lang} className={fontVariables}>
      <body className="bg-paper">
        <SkipLink label={nav.skipToContent} targetId={MAIN_CONTENT_ID} />
        <div className="page-texture" aria-hidden="true" />
        <CookieConsentProvider>
          {children}
          {/* Consent-gated Mixpanel — inits and page-view tracking once the
              visitor grants the `analytics` cookie category. Renders nothing. */}
          <Analytics />
          {/* Site-wide consent banner (its own `open` flag gates visibility).
              `categories` is a typed cast of the JSON dictionary — its keys match
              CookieCategoryKey. */}
          <CookieConsent
            copy={cookies.copy}
            categories={cookies.categories as CookieCategory[]}
            privacyHref={localePath(lang, "/privacy")}
          />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
