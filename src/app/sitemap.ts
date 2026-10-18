import type { MetadataRoute } from "next";
import { hasLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { sectionRoutes } from "@/i18n/paths";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/metadata";
import { cachedSanity } from "@/sanity/lib/live";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

// sitemap.xml: cada página publicada en su idioma, con sus traducciones
// (hreflang) y x-default → la versión francesa. Sin los temas de la guía aún
// vacíos (llevan noindex).

type Href = Parameters<typeof getPathname>[0]["href"];
type Doc = { language: string | null; _updatedAt: string };
type Translation = { language: string | null; slug: string | null; parentSlug?: string | null };

const TAGS = ["homePage", "sectionPage", "service", "investGuide", "caseStudy", "post", "category", "page", "translation.metadata"];

const isLocale = (value: string | null): value is Locale => !!value && hasLocale(routing.locales, value);

// Una entrada con la URL de la página y la de cada traducción que exista.
function entry(locale: Locale, updatedAt: string, versions: Partial<Record<Locale, Href>>) {
  const languages: Record<string, string> = {};
  for (const code of routing.locales) {
    const href = versions[code];
    if (href) languages[code] = absoluteUrl(getPathname({ locale: code, href }));
  }
  if (languages.fr) languages["x-default"] = languages.fr;
  return {
    url: languages[locale],
    lastModified: new Date(updatedAt),
    alternates: { languages },
  } satisfies MetadataRoute.Sitemap[number];
}

// Páginas con slug: la propia y sus traducciones vinculadas en Sanity.
function bySlug<T extends Doc & { slug: string | null; translations: (Translation | null)[] | null }>(
  docs: T[],
  href: (doc: Translation) => Href | null,
) {
  return docs.flatMap((doc) => {
    if (!isLocale(doc.language) || !doc.slug) return [];
    const versions: Partial<Record<Locale, Href>> = {};
    for (const translation of doc.translations ?? []) {
      if (!translation || !isLocale(translation.language)) continue;
      const target = href(translation);
      if (target) versions[translation.language] = target;
    }
    const self = href(doc);
    if (!self) return [];
    versions[doc.language] = self;
    return [entry(doc.language, doc._updatedAt, versions)];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await cachedSanity({
    query: SITEMAP_QUERY,
    tags: TAGS,
    perspective: "published",
    stega: false,
  });

  // Portada y páginas de sección: la misma ruta en cada idioma.
  const fixed = [
    ...data.home.map((doc) => ({ doc, href: "/" as Href })),
    ...data.sections.flatMap((doc) => {
      const route = sectionRoutes[doc.section as keyof typeof sectionRoutes];
      return route ? [{ doc, href: route as Href }] : [];
    }),
  ].flatMap(({ doc, href }) => {
    if (!isLocale(doc.language)) return [];
    const versions = Object.fromEntries(routing.locales.map((code) => [code, href]));
    return [entry(doc.language, doc._updatedAt, versions)];
  });

  return [
    ...fixed,
    ...bySlug(data.services, ({ slug }) => (slug ? { pathname: "/expertises/[slug]", params: { slug } } : null)),
    ...bySlug(data.guides, ({ slug, parentSlug }) => {
      if (!slug) return null;
      return parentSlug
        ? { pathname: "/investir-au-costa-rica/[topic]/[subtopic]", params: { topic: parentSlug, subtopic: slug } }
        : { pathname: "/investir-au-costa-rica/[topic]", params: { topic: slug } };
    }),
    ...bySlug(data.cases, ({ slug }) => (slug ? { pathname: "/experiences/[slug]", params: { slug } } : null)),
    ...bySlug(data.posts, ({ slug }) => (slug ? { pathname: "/actualite/[slug]", params: { slug } } : null)),
    ...bySlug(data.categories, ({ slug }) =>
      slug ? { pathname: "/actualite/categorie/[category]", params: { category: slug } } : null,
    ),
    ...bySlug(data.pages, ({ slug }) => (slug ? { pathname: "/[slug]", params: { slug } } : null)),
  ];
}
