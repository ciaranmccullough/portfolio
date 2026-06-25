import type { Metadata } from "next";
import type { ReactNode } from "react";

import { i18n } from "../../i18n-config";
import { getTranslations } from "./dictionaries";

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
    <html lang={lang}>
      <body className="bg-paper">
        <div className="page-texture" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
