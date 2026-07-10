import {
  Brief,
  CaseStudyHero,
  Link,
  Principles,
  Reflection,
  Role,
  StoryHeader,
  Walkthrough,
} from "@portfolio/ui";
import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ErrorScreen } from "../../../components/ErrorScreen/ErrorScreen";
import { RichText } from "../../../components/RichText/RichText";
import { SiteFooter } from "../../../components/SiteFooter/SiteFooter";
import { getTranslations } from "../../dictionaries";
import { getStory, STORY_FETCH_ERROR } from "@/lib/contentful";
import { buildFooterLinks } from "@/lib/footerLinks";
import { localePath } from "@/lib/localePath";

/**
 * Dedupe the Story fetch across `generateMetadata` and the page body — both
 * need it, and `getStory`'s own ISR cache (`unstable_cache`) only helps
 * across requests, not within one, since the Contentful SDK doesn't run
 * through `fetch` (Next's built-in request memoization doesn't apply here).
 */
const getStoryForRequest = cache(getStory);

/**
 * Request a hero-appropriate rendition from Contentful's Images API. The
 * linked `backgroundImage` asset is a fixed 877×766 source (the CMS's
 * `easa.webp` upload) — capping `w` at that native width asks for exactly
 * what the asset can give, so `next/image` is never upscaling a soft source.
 */
function heroBackgroundImageUrl(url: string): string {
  return `${url}?w=877&q=80&fm=webp`;
}

type StoryPageParams = { lang: string; id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<StoryPageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const dict = await getTranslations(params);
  const story = await getStoryForRequest(id);

  if (story === null) return { title: dict.story.notFound.title };
  if (story === STORY_FETCH_ERROR) return { title: dict.error.title };
  return { title: story.title, description: story.description };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<StoryPageParams>;
}) {
  const { lang, id } = await params;
  const dict = await getTranslations(params);
  const homeHref = localePath(lang, "/");
  const story = await getStoryForRequest(id);

  if (story === null) return notFound();

  if (story === STORY_FETCH_ERROR) {
    return (
      <ErrorScreen
        eyebrow={dict.error.eyebrow}
        title={dict.error.title}
        message={dict.error.message}
        retryLabel={dict.error.retry}
        retryHref={homeHref}
      />
    );
  }

  return (
    <>
      <StoryHeader
        brand={dict.nav.brand}
        brandHref={homeHref}
        backLabel={dict.story.backLabel}
        backHref={`${homeHref}#work`}
      />

      <main className="relative z-10 min-h-screen">
        <CaseStudyHero
          eyebrow={dict.story.hero.eyebrow}
          title={story.title}
          description={story.description}
          backgroundImage={
            story.backgroundImageUrl ? (
              <Image
                src={heroBackgroundImageUrl(story.backgroundImageUrl)}
                alt=""
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            ) : undefined
          }
          meta={[
            { label: dict.story.hero.roleLabel, value: story.role },
            { label: dict.story.hero.platformLabel, value: story.platform },
            { label: dict.story.hero.yearLabel, value: story.year },
          ]}
          scrollCueLabel={dict.story.hero.scrollCueLabel}
        />

        <Brief
          eyebrow={dict.story.brief.eyebrow}
          body={<RichText document={story.brief} />}
        />

        {story.principles.length ? (
          <Principles
            eyebrow={dict.story.principles.eyebrow}
            title={story.titlePrinciples}
            principles={story.principles}
          />
        ) : null}

        {story.walkthroughs.length ? (
          <Walkthrough
            eyebrow={dict.story.walkthrough.eyebrow}
            title={story.titleWalkthrough}
            items={story.walkthroughs.map((walkthrough) => ({
              // The CMS's per-item `title` is the short screen name (e.g.
              // "Onboarding") — it doubles as the panel kicker and the phone
              // mockup's step label. `subtitle` is the punchy headline, so it
              // maps to the panel's required `title`.
              eyebrow: walkthrough.title,
              title: walkthrough.subtitle,
              description: walkthrough.description,
              image: walkthrough.image ? (
                <Image
                  src={walkthrough.image}
                  alt={walkthrough.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : undefined,
            }))}
            imageFallback={dict.story.walkthrough.imageFallback}
          />
        ) : null}

        {story.reflections.length ? (
          <Reflection
            eyebrow={dict.story.reflection.eyebrow}
            title={story.titleReflection}
            reflections={story.reflections}
          />
        ) : null}

        <Role
          eyebrow={dict.story.role.eyebrow}
          title={story.titleRole}
          description={story.descriptionRole}
        >
          <Link as={NextLink} href={`${homeHref}#contact`} variant="primary">
            {dict.nav.cta.label}
          </Link>
          <Link as={NextLink} href={`${homeHref}#work`} variant="social">
            {dict.story.role.backToWorkCta}
          </Link>
        </Role>
      </main>

      <SiteFooter
        colophon={dict.footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
    </>
  );
}
