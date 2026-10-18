import {
  defineDocuments,
  defineLocations,
  type DocumentLocation,
  type PresentationPluginOptions,
} from "sanity/presentation";
import { isLocale, localizedPath, sectionRoutes } from "../i18n/paths";
import { routing, type Locale, type Pathname } from "../i18n/routing";

// Une páginas del sitio y documentos para la pestaña «Vista previa» del Studio:
// qué documento se edita al abrir una URL y en qué URLs se ve cada documento.
// Las direcciones están traducidas (src/i18n/routing.ts).

const pattern = (locale: Locale, route: Pathname) => localizedPath(locale, route, {}, true);

// Una ubicación por idioma del documento (o ninguna si no tiene idioma).
const at = (language: unknown, title: string, route: Pathname, params?: Record<string, string>) =>
  isLocale(language) ? [{ title, href: localizedPath(language, route, params) }] : [];

const list = (locations: DocumentLocation[]) => (locations.length ? { locations } : null);

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    {
      route: "/:language",
      filter: `_type == "homePage" && language == $language`,
      params: ({ params }) => params,
    },
    ...routing.locales.flatMap((locale) => [
      ...Object.entries(sectionRoutes).map(([section, route]) => ({
        route: pattern(locale, route),
        filter: `_type == "sectionPage" && language == $language && section == $section`,
        params: () => ({ language: locale, section }),
      })),
      {
        route: pattern(locale, "/expertises/[slug]"),
        filter: `_type == "service" && language == $language && slug.current == $slug`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, slug: params.slug }),
      },
      {
        route: pattern(locale, "/investir-au-costa-rica/[topic]"),
        filter: `_type == "investGuide" && language == $language && slug.current == $topic && !defined(parent)`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, topic: params.topic }),
      },
      {
        route: pattern(locale, "/investir-au-costa-rica/[topic]/[subtopic]"),
        filter: `_type == "investGuide" && language == $language && slug.current == $subtopic && parent->slug.current == $topic`,
        params: ({ params }: { params: Record<string, string> }) => ({
          language: locale,
          topic: params.topic,
          subtopic: params.subtopic,
        }),
      },
      {
        route: pattern(locale, "/experiences/[slug]"),
        filter: `_type == "caseStudy" && language == $language && slug.current == $slug`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, slug: params.slug }),
      },
      {
        route: pattern(locale, "/actualite/categorie/[category]"),
        filter: `_type == "category" && language == $language && slug.current == $category`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, category: params.category }),
      },
      {
        route: pattern(locale, "/actualite/[slug]"),
        filter: `_type == "post" && language == $language && slug.current == $slug`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, slug: params.slug }),
      },
      // Al final: "/fr/:slug" coincidiría también con las secciones.
      {
        route: pattern(locale, "/[slug]"),
        filter: `_type == "page" && language == $language && slug.current == $slug`,
        params: ({ params }: { params: Record<string, string> }) => ({ language: locale, slug: params.slug }),
      },
    ]),
  ]),
  locations: {
    homePage: defineLocations({
      select: { language: "language" },
      resolve: (doc) => list(at(doc?.language, "Portada", "/")),
    }),
    sectionPage: defineLocations({
      select: { title: "title", section: "section", language: "language" },
      resolve: (doc) => {
        const route = sectionRoutes[doc?.section as keyof typeof sectionRoutes];
        return route ? list(at(doc?.language, doc?.title || "Página", route)) : null;
      },
    }),
    service: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug
          ? list([
              ...at(doc.language, doc.title || "Servicio", "/expertises/[slug]", { slug: doc.slug }),
              ...at(doc.language, "Expertises", "/expertises"),
              ...at(doc.language, "Portada", "/"),
            ])
          : null,
    }),
    investGuide: defineLocations({
      select: { title: "title", slug: "slug.current", parent: "parent.slug.current", language: "language" },
      resolve: (doc) => {
        if (!doc?.slug) return null;
        const article = doc.parent
          ? at(doc.language, doc.title || "Subtema", "/investir-au-costa-rica/[topic]/[subtopic]", {
              topic: doc.parent,
              subtopic: doc.slug,
            })
          : at(doc.language, doc.title || "Tema", "/investir-au-costa-rica/[topic]", { topic: doc.slug });
        return list([...article, ...at(doc.language, "Guía del inversor", "/investir-au-costa-rica")]);
      },
    }),
    caseStudy: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug
          ? list([
              ...at(doc.language, doc.title || "Experiencia", "/experiences/[slug]", { slug: doc.slug }),
              ...at(doc.language, "Expériences", "/experiences"),
            ])
          : null,
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug
          ? list([
              ...at(doc.language, doc.title || "Artículo", "/actualite/[slug]", { slug: doc.slug }),
              ...at(doc.language, "Actualité", "/actualite"),
            ])
          : null,
    }),
    category: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug
          ? list(at(doc.language, doc.title || "Categoría", "/actualite/categorie/[category]", { category: doc.slug }))
          : null,
    }),
    page: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug ? list(at(doc.language, doc.title || "Página", "/[slug]", { slug: doc.slug })) : null,
    }),
    teamMember: defineLocations({
      select: { name: "name", kind: "kind", language: "language" },
      resolve: (doc) =>
        list(
          at(
            doc?.language,
            doc?.name || "Equipo",
            doc?.kind === "founder" ? "/le-cabinet/associes-fondateurs" : "/le-cabinet/avocats-collaborateurs",
          ),
        ),
    }),
    // Un testimonio tiene los tres idiomas: se ve en Expériences y en la portada.
    testimonial: defineLocations({
      select: { author: "author" },
      resolve: () =>
        list(
          routing.locales.flatMap((locale) => [
            ...at(locale, `Expériences (${locale})`, "/experiences"),
            ...at(locale, `Portada (${locale})`, "/"),
          ]),
        ),
    }),
  },
};
