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
import { ContactForm } from "../components/ContactForm/ContactForm";
import { SiteNav } from "../components/SiteNav/SiteNav";
import { getDictionary } from "./dictionaries";
import { heroTabs } from "../data/heroTabs";
import { getEntryCount, getHero } from "@/lib/contentful";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Server-side Contentful data access (services -> mappers -> here). Both
  // helpers fall back safely (no creds / network / invalid token) so the build
  // stays green.
  const hero = await getHero();
  const entryCount = await getEntryCount();

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
          <Link href={hero.resumeUrl} variant="primary">
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
