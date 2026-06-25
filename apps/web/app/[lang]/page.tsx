import {
  Button,
  CtaGroup,
  Footer,
  Hero,
  SkillCategory,
  Tag,
  Toolbox,
} from "@portfolio/ui";

import type { Locale } from "../../i18n-config";
import { getDictionary } from "./dictionaries";
import { getEntriesSafe } from "@/lib/contentful";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Pull content from Contentful. With no credentials the helper returns null
  // (no network at build time), so the production build stays green.
  const entries = await getEntriesSafe();
  const entryCount = entries ? entries.items.length : null;

  return (
    <main className="min-h-screen bg-paper">
      <Hero
        badge={dict.hero.badge}
        title={dict.hero.title}
        intro={dict.hero.intro}
      >
        <CtaGroup>
          <Button variant="primary">{dict.hero.viewWork}</Button>
          <Button variant="ghost">{dict.hero.resume}</Button>
        </CtaGroup>
      </Hero>

      <Toolbox>
        {dict.toolbox.categories.map((category) => (
          <SkillCategory key={category.title} title={category.title}>
            {category.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </SkillCategory>
        ))}
      </Toolbox>

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
  );
}
