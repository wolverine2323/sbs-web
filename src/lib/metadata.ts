import "server-only";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/lib/image";
import { getSiteSettings } from "@/sanity/lib/settings";
import { DEFAULT_OG_IMAGE, siteUrl } from "./site";

// Metadatos comunes de cada página: título y descripción (del campo SEO de
// Sanity si está relleno), dirección canónica, hreflang con x-default → /fr,
// Open Graph y tarjeta para redes.

type Href = Parameters<typeof getPathname>[0]["href"];
type SanityImage = Parameters<typeof urlFor>[0] & { asset?: unknown; alt?: string | null };

// Dirección de la página en cada idioma en que existe ("/es/la-firma").
export type Paths = Partial<Record<Locale, string>>;

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", es: "es_CR", en: "en_US" };

// La misma ruta en los tres idiomas (páginas fijas).
export function pathsFor(href: Href): Paths {
  return Object.fromEntries(routing.locales.map((locale) => [locale, getPathname({ locale, href })]));
}

// Las traducciones vinculadas en Sanity más la página actual (que puede no
// tenerlas, p. ej. un subtema de la guía solo en francés).
export function pathsWithSelf(locale: Locale, translations: Paths, href: Href): Paths {
  return { ...translations, [locale]: getPathname({ locale, href }) };
}

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;

type Options = {
  locale: Locale;
  paths: Paths;
  title?: string | null;
  // Para la portada: el título va sin «· SBS Abogados».
  absoluteTitle?: boolean;
  description?: string | null;
  seo?: { title?: string | null; description?: string | null; image?: SanityImage | null } | null;
  image?: SanityImage | null;
  article?: { publishedTime?: string | null; modifiedTime?: string | null };
  // Páginas sin contenido propio (p. ej. un tema de la guía aún sin traducir).
  noindex?: boolean;
};

export async function pageMetadata(options: Options): Promise<Metadata> {
  const { locale, paths, article, noindex } = options;
  const [settings, tCommon, tMeta] = await Promise.all([
    getSiteSettings(locale),
    getTranslations("Common"),
    getTranslations("Metadata"),
  ]);

  const title = options.seo?.title || options.title || undefined;
  // Sin descripción propia, la general del sitio (Google la pide siempre).
  const description = options.seo?.description || options.description || tMeta("description");
  // Una página con noindex no entra en el grupo de idiomas.
  const languages: Record<string, string> = noindex
    ? {}
    : Object.fromEntries(routing.locales.flatMap((code) => (paths[code] ? [[code, absoluteUrl(paths[code])]] : [])));
  if (languages.fr) languages["x-default"] = languages.fr;
  const canonical = paths[locale] ? absoluteUrl(paths[locale]) : undefined;

  // Imagen al compartir: la del campo SEO, la de la página, la de los ajustes o la de marca.
  const source = [options.seo?.image, options.image, settings?.ogImage].find((image) => image?.asset);
  const image = source
    ? { url: urlFor(source).width(1200).height(630).fit("crop").url(), alt: (source as SanityImage).alt || title }
    : { url: DEFAULT_OG_IMAGE, alt: tCommon("brand") };

  return {
    title: title && options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: article ? "article" : "website",
      siteName: tCommon("brand"),
      url: canonical,
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((code) => code !== locale && paths[code]).map((code) => OG_LOCALES[code]),
      images: [{ ...image, width: 1200, height: 630 }],
      ...(article && {
        publishedTime: article.publishedTime ?? undefined,
        modifiedTime: article.modifiedTime ?? undefined,
      }),
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
