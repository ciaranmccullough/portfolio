import {
  About,
  ArrowUpRightIcon,
  Contact,
  Hero,
  Link,
  SkillCategory,
  Tag,
  Toolbox,
  WorkGrid,
} from "@portfolio/ui";
import { Fragment } from "react";
import Image from "next/image";

import { ContactForm } from "../components/ContactForm/ContactForm";
import { ErrorScreen } from "../components/ErrorScreen/ErrorScreen";
import { SiteFooter } from "../components/SiteFooter/SiteFooter";
import { SiteNav } from "../components/SiteNav/SiteNav";
import { getTranslations } from "./dictionaries";
import { heroTabs } from "../data/heroTabs";
import { getAbout, getContact, getHero, getProjects } from "@/lib/contentful";

// Toolbox cards cycle the brand accents in order (the colour is positional
// presentation, not category data — see SkillCategory `tone`).
const TOOLBOX_TONES = ["violet", "orange", "green", "amber"] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const dict = await getTranslations(params);

  // Server-side Contentful data access (services -> mappers -> here), fetched in
  // parallel. getHero returns null when Contentful is unreachable; show an error
  // screen rather than fake fallback content.
  const [hero, about, contact, projects] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getProjects(),
  ]);
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
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Hero>

        {/* #work */}
        <WorkGrid
          id="work"
          eyebrow={dict.work.eyebrow}
          title={dict.work.title}
          meta={dict.work.meta.replace(
            "{count}",
            String(projects?.length ?? 0),
          )}
          projects={(projects ?? []).map((project) => ({
            title: project.title,
            description: project.description,
            href: project.href,
            tags: project.tags,
            media: project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : undefined,
          }))}
        />

        {/* #stack */}
        <Toolbox
          id="stack"
          eyebrow={dict.toolbox.eyebrow}
          title={dict.toolbox.title}
        >
          {dict.toolbox.categories.map((category, index) => (
            <SkillCategory
              key={category.title}
              title={category.title}
              tone={TOOLBOX_TONES[index % TOOLBOX_TONES.length]}
            >
              {category.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </SkillCategory>
          ))}
        </Toolbox>

        {/* #about */}
        {about ? (
          <About
            id="about"
            eyebrow={dict.about.eyebrow}
            title={about.title}
            description={about.description}
            sticker={dict.about.sticker}
            tabs={about.tabs}
            portrait={
              <Image
                src={about.imageUrl}
                alt={dict.about.imageAlt}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            }
          />
        ) : null}

        {/* #contact */}
        <Contact
          id="contact"
          eyebrow={dict.contact.eyebrow}
          title={contact?.title ?? dict.contact.title}
          intro={contact?.intro ?? dict.contact.intro}
          socials={contact?.socials}
        >
          <ContactForm
            endpoint={process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? ""}
            fields={dict.contact.fields}
            errors={dict.contact.errors}
            submitLabel={dict.contact.submitLabel}
            sendingLabel={dict.contact.sendingLabel}
            clearLabel={dict.contact.clearLabel}
            successTitle={dict.contact.successTitle}
            successMessage={dict.contact.successMessage}
            errorTitle={dict.contact.errorTitle}
            submitError={dict.contact.submitError}
            dismissToastLabel={dict.contact.dismissToastLabel}
          />
        </Contact>
      </main>
      <SiteFooter colophon={dict.footer.colophon} />
    </>
  );
}
