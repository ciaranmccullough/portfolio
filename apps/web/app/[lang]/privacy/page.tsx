import type { Metadata } from "next";

import { LegalPage } from "../../components/LegalPage/LegalPage";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter";
import { getTranslations } from "../dictionaries";
import { buildFooterLinks } from "@/lib/footerLinks";
import { localePath } from "@/lib/localePath";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { legal } = await getTranslations(params);
  return { title: legal.privacy.title };
}

export default async function PrivacyPage({
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
        eyebrow={legal.privacy.eyebrow}
        title={legal.privacy.title}
        updatedLabel={legal.updatedLabel}
        updatedValue={legal.privacy.updated}
        lead={legal.privacy.lead}
        body={legal.placeholder}
        backLabel={legal.backLabel}
        backHref={localePath(lang, "/")}
      />
      <SiteFooter
        colophon={footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
    </>
  );
}
