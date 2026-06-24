import {
  Button,
  CtaGroup,
  Footer,
  Hero,
  SkillCategory,
  Tag,
  Toolbox,
} from "@portfolio/ui";

import { getEntriesSafe } from "@/lib/contentful";

export default async function HomePage() {
  // Pull content from Contentful. With no credentials the helper returns null
  // (no network at build time), so the production build stays green.
  const entries = await getEntriesSafe();
  const entryCount = entries ? entries.items.length : null;

  return (
    <main className="min-h-screen bg-paper">
      <Hero
        badge="Available for work"
        title="Software engineer building polished product UI."
        intro="I design and ship accessible interfaces with a focus on craft, performance, and a tidy design system."
      >
        <CtaGroup>
          <Button variant="primary">View work ↘</Button>
          <Button variant="ghost">Résumé</Button>
        </CtaGroup>
      </Hero>

      <Toolbox>
        <SkillCategory title="Languages">
          <Tag>TypeScript</Tag>
          <Tag>Kotlin</Tag>
        </SkillCategory>
        <SkillCategory title="Frameworks">
          <Tag>React</Tag>
          <Tag>Next.js</Tag>
        </SkillCategory>
        <SkillCategory title="Tooling">
          <Tag>Vite</Tag>
          <Tag>Storybook</Tag>
        </SkillCategory>
      </Toolbox>

      <Footer>
        {entryCount === null
          ? "Contentful: not configured"
          : `Contentful: ${entryCount} entries`}
        {" · Portfolio · Ciaran"}
      </Footer>
    </main>
  );
}
