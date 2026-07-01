import { i18n } from "@/i18n-config";

const LOCALES: readonly string[] = i18n.locales;

/**
 * Map a Next.js pathname to the coarse `screen` name used by the `navigation`
 * event. Strips the leading locale segment, so `/en` and `/` both become
 * `"home"`, `/en/privacy` becomes `"privacy"`, `/en/terms` becomes `"terms"`.
 */
export function screenFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) segments.shift();
  return segments[0] ?? "home";
}
