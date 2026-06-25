import type { Locale } from "../../i18n-config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

/**
 * Resolve the dictionary straight from a route segment's `params`, so server
 * components and `generateMetadata` don't repeat the await-params + cast each
 * time. The server-side counterpart to next-intl's `getTranslations` — our pages
 * are Server Components, so this is an async function, not a `use*` hook. It
 * returns the typed dictionary object (`dict.hero.badge`), not a `t()` function.
 */
export async function getTranslations(
  params: Promise<{ lang: string }>,
): Promise<Dictionary> {
  const { lang } = await params;
  return getDictionary(lang as Locale);
}
