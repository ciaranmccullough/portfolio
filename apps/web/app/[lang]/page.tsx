import {
  About,
  Contact,
  Hero,
  Link,
  OpenSource,
  RepoRow,
  SkillCategory,
  Tag,
  Toolbox,
  WorkGrid,
} from "@portfolio/ui";
import { Fragment } from "react";
import Image from "next/image";

import { ContactForm } from "../components/ContactForm/ContactForm";
import { ErrorScreen } from "../components/ErrorScreen/ErrorScreen";
import { HomeAnalytics } from "../components/HomeAnalytics/HomeAnalytics";
import type { HomeSection } from "../components/HomeAnalytics/HomeAnalytics.types";
import { ResumeLink } from "../components/ResumeLink/ResumeLink";
import { SiteFooter } from "../components/SiteFooter/SiteFooter";
import { SiteNav } from "../components/SiteNav/SiteNav";
import { getTranslations } from "./dictionaries";
import { heroTabs } from "../data/heroTabs";
import {
  getAbout,
  getContact,
  getHero,
  getOpenSource,
  getProjects,
} from "@/lib/contentful";
import { buildFooterLinks } from "@/lib/footerLinks";
import { SITE_NAME, SITE_URL } from "@/site-config";

// Toolbox cards — and Open Source repo dots — cycle the brand accents in order
// (the colour is positional presentation, not data — see SkillCategory `tone`).
const TOOLBOX_TONES = ["violet", "orange", "green", "amber"] as const;
const REPO_TONES = ["violet", "orange", "green", "amber"] as const;

// Home-page sections tracked as `feature_viewed` impressions — ids must match
// the `id` props on the sections below (About and Open Source are only present
// when they render; the observer simply never fires for an absent id).
const HOME_SECTIONS: HomeSection[] = [
  { id: "top", feature: "hero" },
  { id: "work", feature: "project" },
  { id: "stack", feature: "toolbox" },
  { id: "about", feature: "about" },
  { id: "oss", feature: "open_source" },
  { id: "contact", feature: "contact" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getTranslations(params);

  // Server-side Contentful data access (services -> mappers -> here), fetched in
  // parallel. getHero returns null when Contentful is unreachable; show an error
  // screen rather than fake fallback content.
  const [hero, about, contact, projects, openSource] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getProjects(),
    getOpenSource(),
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

  // Person structured data (JSON-LD) for richer search results; `sameAs` links
  // out to the social profiles from Contentful so engines can connect them.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Software Engineer",
    ...(contact?.socials?.length
      ? {
          sameAs: contact.socials
            .map((social) => social.href)
            .filter((href) => href.startsWith("http")),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
          <ResumeLink href={hero.resumeUrl} label={dict.hero.resumeLabel} />
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

        {/* #oss — open-source repos (only when the CMS entry has any) */}
        {openSource?.length ? (
          <OpenSource
            id="oss"
            eyebrow={dict.openSource.eyebrow}
            title={dict.openSource.title}
            action={
              <Link href={dict.openSource.actionHref} variant="inline">
                {dict.openSource.action}
              </Link>
            }
          >
            {openSource.map((repo, index) => (
              <RepoRow
                key={repo.href}
                name={repo.name}
                href={repo.href}
                description={repo.description}
                lang={repo.lang}
                stars={repo.stars}
                tone={repo.tone ?? REPO_TONES[index % REPO_TONES.length]}
              />
            ))}
          </OpenSource>
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
      <SiteFooter
        colophon={dict.footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
      {/* Consent-gated home-page tracking (feature_viewed + project_clicked). */}
      <HomeAnalytics sections={HOME_SECTIONS} />
    </>
  );
}
