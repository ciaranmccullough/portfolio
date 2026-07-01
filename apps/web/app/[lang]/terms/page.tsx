import type { Metadata } from "next";

import { LegalPage } from "../../components/LegalPage/LegalPage";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter";
import { getTranslations } from "../dictionaries";
import { buildFooterLinks } from "@/lib/footerLinks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { legal } = await getTranslations(params);
  return { title: legal.terms.title };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getTranslations(params);
  const { legal, footer } = dict;

  return (
    <>
      <LegalPage
        eyebrow={legal.terms.eyebrow}
        title={legal.terms.title}
        updatedLabel={legal.updatedLabel}
        updatedValue={legal.terms.updated}
        lead={legal.terms.lead}
        body={legal.placeholder}
        backLabel={legal.backLabel}
        backHref={`/${lang}`}
      />
      <SiteFooter
        colophon={footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
    </>
  );
}
