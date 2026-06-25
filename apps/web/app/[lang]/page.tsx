import {
  About,
  Contact,
  Footer,
  Hero,
  Link,
  SkillCategory,
  Tag,
  Toolbox,
  WorkGrid,
} from "@portfolio/ui";

import type { Locale } from "../../i18n-config";
import { ContactForm } from "./ContactForm";
import { getDictionary } from "./dictionaries";
import { heroTabs } from "./heroTabs";
import { SiteNav } from "./SiteNav";
import { getEntriesSafe, getHeroSafe } from "@/lib/contentful";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Pull content from Contentful. The Hero text comes from the "project" content
  // type; both helpers fall back safely (no creds / no network / invalid token)
  // so the production build stays green.
  const hero = await getHeroSafe();
  const entries = await getEntriesSafe();
  const entryCount = entries ? entries.items.length : null;

  return (
    <>
      <SiteNav
        brand={dict.nav.brand}
        brandHref="#top"
        items={dict.nav.links}
        cta={
          <Link href={dict.nav.cta.href} variant="cta">
            {dict.nav.cta.label}
          </Link>
        }
      />

      <main className="min-h-screen bg-paper">
        {/* #top — hero (the brand wordmark / return target) */}
        <Hero
          id="top"
          badge={dict.hero.badge}
          title={hero.title}
          intro={hero.description}
          tabs={heroTabs}
        >
          <Link href={hero.resume} variant="primary">
            {dict.hero.resumeLabel}
            <span aria-hidden="true">↗</span>
          </Link>
        </Hero>

        {/* #work */}
        <WorkGrid id="work" projects={dict.work.projects} />

        {/* #stack */}
        <Toolbox id="stack">
          {dict.toolbox.categories.map((category) => (
            <SkillCategory key={category.title} title={category.title}>
              {category.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </SkillCategory>
          ))}
        </Toolbox>

        {/* #about */}
        <About id="about" bio={dict.about.bio} stats={dict.about.stats} />

        {/* #contact */}
        <Contact
          id="contact"
          eyebrow={dict.contact.eyebrow}
          title={dict.contact.title}
          intro={dict.contact.intro}
          socials={dict.contact.socials}
        >
          <ContactForm
            fields={dict.contact.fields}
            errors={dict.contact.errors}
            submitLabel={dict.contact.submitLabel}
            clearLabel={dict.contact.clearLabel}
            successTitle={dict.contact.successTitle}
            successMessage={dict.contact.successMessage}
            sendAnotherLabel={dict.contact.sendAnotherLabel}
          />
        </Contact>

        <Footer>
          {entryCount === null
            ? dict.footer.contentfulNotConfigured
            : dict.footer.contentfulEntries.replace(
                "{count}",
                String(entryCount),
              )}
          {dict.footer.colophon}
        </Footer>
      </main>
    </>
  );
}
