import { Brief, Link, Reflection, Role, StoryHeader } from "@portfolio/ui";
import type { Metadata } from "next";
import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ErrorScreen } from "../../../components/ErrorScreen/ErrorScreen";
import { HeroParallax } from "../../../components/HeroParallax/HeroParallax";
import { PrinciplesReveal } from "../../../components/PrinciplesReveal/PrinciplesReveal";
import { RichText } from "../../../components/RichText/RichText";
import { ScrollProgress } from "../../../components/ScrollProgress/ScrollProgress";
import { ScrollReveal } from "../../../components/ScrollReveal/ScrollReveal";
import { SiteFooter } from "../../../components/SiteFooter/SiteFooter";
import { StoryWalkthrough } from "../../../components/StoryWalkthrough/StoryWalkthrough";
import { getTranslations } from "../../dictionaries";
import { getProjects, getStory, STORY_FETCH_ERROR } from "@/lib/contentful";
import { buildFooterLinks } from "@/lib/footerLinks";
import { localePath } from "@/lib/localePath";
import { MAIN_CONTENT_ID } from "@/lib/mainContentId";

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
  const [story, projects] = await Promise.all([
    getStoryForRequest(id),
    getProjects(),
  ]);

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

  // Composes the eyebrow with the matching Home "projects" card's title (e.g.
  // "// Case study — EA Sports App") when one exists for this story id — see
  // PRODUCT.md design-doc fidelity: the mock's eyebrow reads "// CASE STUDY —
  // EA SPORTS". `projects` has no native Contentful reference to `story`, only
  // the shared `id` string, and `getProjects` fails soft to `null`, so a
  // missing/unmatched project just falls back to the eyebrow exactly as
  // before. A dedicated CMS field on the story content type (rather than this
  // cross-lookup) would be the cleaner long-term source.
  const project = projects?.find((item) => item.id === id);
  const heroEyebrow = project
    ? `${dict.story.hero.eyebrow} — ${project.title}`
    : dict.story.hero.eyebrow;

  return (
    <>
      <ScrollProgress label={dict.story.progressLabel} />

      <StoryHeader
        brand={dict.nav.brand}
        brandHref={homeHref}
        backLabel={dict.story.backLabel}
        backHref={`${homeHref}#work`}
      />

      <main id={MAIN_CONTENT_ID} className="relative z-10 min-h-screen">
        <HeroParallax
          eyebrow={heroEyebrow}
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
                className="object-cover object-[center_24%]"
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

        <ScrollReveal>
          <Brief
            eyebrow={dict.story.brief.eyebrow}
            body={<RichText document={story.brief} variant="statement" />}
          />
        </ScrollReveal>

        {story.principles.length ? (
          <PrinciplesReveal
            eyebrow={dict.story.principles.eyebrow}
            title={story.titlePrinciples}
            principles={story.principles}
          />
        ) : null}

        {story.walkthroughs.length ? (
          <StoryWalkthrough
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
          <ScrollReveal>
            <Reflection
              eyebrow={dict.story.reflection.eyebrow}
              title={story.titleReflection}
              reflections={story.reflections}
            />
          </ScrollReveal>
        ) : null}

        <ScrollReveal variant="scale">
          <Role
            eyebrow={dict.story.role.eyebrow}
            title={story.titleRole}
            description={story.descriptionRole}
          >
            {/* Primary CTA reuses the matching Home "projects" card's real
                href (looked up above for the hero eyebrow suffix) — the
                project's actual live/external destination, not an in-app
                anchor. Omitted entirely when that project has no href (a
                genuinely missing/blank CMS field), rather than rendering a
                dead "View the project" button — see `projectsMapper`'s
                `href: project.link ?? ""` fallback. External-link semantics
                match how `WorkGrid` treats a project's own external href. */}
            {project?.href ? (
              <Link
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                buttonVariant="light"
                buttonSize="lg"
              >
                {dict.story.role.viewProjectCta}
              </Link>
            ) : null}
            <Link
              as={NextLink}
              href={`${homeHref}#work`}
              buttonVariant="ghost-dark"
              buttonSize="lg"
            >
              {dict.story.role.backToWorkCta}
            </Link>
          </Role>
        </ScrollReveal>
      </main>

      <SiteFooter
        colophon={dict.footer.colophon}
        links={buildFooterLinks(dict, lang)}
      />
    </>
  );
}
