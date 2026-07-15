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
import { getPrivacyPolicy } from "@/lib/contentful";
import { buildFooterLinks } from "@/lib/footerLinks";
import { localePath } from "@/lib/localePath";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { legal } = await getTranslations(params);
  return {
    title: legal.privacy.title,
    // Own canonical, or the layout's homepage canonical is inherited.
    alternates: { canonical: localePath(lang, "/privacy") },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getTranslations(params);
  const { legal, footer } = dict;
  const content = await getPrivacyPolicy();

  return (
    <div className={legalPageWrapperClass}>
      <LegalPage
        eyebrow={legal.privacy.eyebrow}
        title={legal.privacy.title}
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
