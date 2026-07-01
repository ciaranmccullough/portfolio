import { Text } from "@portfolio/ui";
import type { Metadata } from "next";

import { LegalPage } from "../../components/LegalPage/LegalPage";
import {
  legalBodyClass,
  legalPageWrapperClass,
} from "../../components/LegalPage/LegalPage.styles";
import { RichText } from "../../components/RichText/RichText";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter";
import { getTranslations } from "../dictionaries";
import { getTermsAndConditions } from "@/lib/contentful";
import { buildFooterLinks } from "@/lib/footerLinks";
import { localePath } from "@/lib/localePath";

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
  const content = await getTermsAndConditions();

  return (
    <div className={legalPageWrapperClass}>
      <LegalPage
        eyebrow={legal.terms.eyebrow}
        title={legal.terms.title}
        backLabel={legal.backLabel}
        backHref={localePath(lang, "/")}
      >
        {content ? (
          <RichText document={content} />
        ) : (
          <div className={legalBodyClass}>
            {legal.placeholder.map((paragraph, index) => (
              <Text key={index}>{paragraph}</Text>
            ))}
          </div>
        )}
      </LegalPage>
      <SiteFooter
        colophon={footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
    </div>
  );
}
