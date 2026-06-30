import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";

import { i18n } from "../../i18n-config";
import { getTranslations } from "./dictionaries";

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
  const dict = await getTranslations(params);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
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
  return (
    <html lang={lang} className={fontVariables}>
      <body className="bg-paper">
        <div className="page-texture" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
