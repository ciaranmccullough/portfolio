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
import { Fragment } from "react";

import { ContactForm } from "../components/ContactForm/ContactForm";
import { ErrorScreen } from "../components/ErrorScreen/ErrorScreen";
import { SiteNav } from "../components/SiteNav/SiteNav";
import { getTranslations } from "./dictionaries";
import { heroTabs } from "../data/heroTabs";
import { getEntryCount, getHero } from "@/lib/contentful";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const dict = await getTranslations(params);

  // Server-side Contentful data access (services -> mappers -> here). getHero
  // returns null when Contentful is unreachable; show an error screen rather
  // than fake fallback content.
  const hero = await getHero();
  if (!hero) {
    return (
      <ErrorScreen
        eyebrow={dict.error.eyebrow}
        title={dict.error.title}
        message={dict.error.message}
        retryLabel={dict.error.retry}
      />
    );
  }

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

      <main className="relative z-10 min-h-screen">
        {/* #top — hero (the brand wordmark / return target) */}
        <Hero
          id="top"
          title={hero.title.map((segment, index) =>
            segment.highlight ? (
              <span key={index} className="text-brand-violet">
                {segment.text}
              </span>
            ) : (
              <Fragment key={index}>{segment.text}</Fragment>
            ),
          )}
          intro={hero.description}
          tabs={heroTabs}
        >
          <Link
            href={hero.resumeUrl}
            variant="primary"
            target="_blank"
            rel="noopener noreferrer"
          >
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
