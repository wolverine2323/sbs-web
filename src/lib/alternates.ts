import { hasLocale } from "next-intl";
import { stegaClean } from "next-sanity";
import type { Alternates } from "@/components/LocaleAlternates";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

// Dirección de cada traducción vinculada en Sanity, para el selector de
// idioma. `href` devuelve null si a esa traducción le falta el slug.
export function alternatesFor<T extends { language: string | null }>(
  translations: (T | null)[] | null | undefined,
  href: (translation: T) => Href | null,
): Alternates {
  const alternates: Alternates = {};
  for (const translation of translations ?? []) {
    // En la vista previa los textos llevan marcas invisibles (stega).
    const locale = stegaClean(translation?.language);
    if (!translation || !locale || !hasLocale(routing.locales, locale)) continue;
    const target = href(translation);
    if (target) alternates[locale] = getPathname({ locale, href: target });
  }
  return alternates;
}
