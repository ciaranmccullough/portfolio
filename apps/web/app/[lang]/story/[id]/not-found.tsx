import { ErrorScreen } from "../../../components/ErrorScreen/ErrorScreen";
import { getDictionary } from "../../dictionaries";
import { i18n } from "../../../../i18n-config";

/**
 * Rendered when `getStory` resolves `null` (no CMS entry for this `id`) via
 * `notFound()` in `page.tsx`. Next's `not-found.js` convention receives no
 * `params`, so unlike the page itself this can't read the requested `lang` —
 * it falls back to the default locale, which is the only one the site serves
 * today (`i18n-config.ts`). Reuses the same `ErrorScreen` chrome as every
 * other full-page fallback rather than inventing new markup.
 */
export default async function StoryNotFound() {
  const dict = await getDictionary(i18n.defaultLocale);

  return (
    <ErrorScreen
      eyebrow={dict.story.notFound.eyebrow}
      title={dict.story.notFound.title}
      message={dict.story.notFound.message}
      retryLabel={dict.story.notFound.backLabel}
      retryHref="/"
    />
  );
}
