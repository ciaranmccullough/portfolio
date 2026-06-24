import { tokens } from "@portfolio/tokens";
import { Text } from "@portfolio/ui";

import { getEntriesSafe } from "@/lib/contentful";

export default async function HomePage() {
  // Pull content from Contentful. With no credentials the helper returns null
  // (no network at build time), so the production build stays green; a real
  // fetch only happens — and may fail at runtime — once credentials are set.
  const entries = await getEntriesSafe();
  const entryCount = entries ? entries.items.length : null;

  return (
    <main
      style={{
        padding: tokens.spacing.xl,
        fontFamily: "system-ui, sans-serif",
        color: tokens.colors.text.primary,
      }}
    >
      <h1>Portfolio</h1>
      <Text>This paragraph is rendered by the Text atom from @portfolio/ui.</Text>
      <Text>
        {entryCount === null
          ? "Contentful: no API credentials configured (set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN)."
          : `Contentful: fetched ${entryCount} entries.`}
      </Text>
    </main>
  );
}
