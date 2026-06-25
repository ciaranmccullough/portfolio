import type { Metadata } from "next";
import type { ReactNode } from "react";

import { i18n, type Locale } from "../../i18n-config";
import { getDictionary } from "./dictionaries";

import "../globals.css";

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
  const dict = await getDictionary(lang as Locale);
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
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
