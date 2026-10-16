import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

// Une páginas del sitio y documentos para la pestaña «Vista previa» del Studio:
// qué documento se edita al abrir una URL y en qué URL se ve cada documento.
// Las rutas de artículos cambiarán en la Fase 5 (slugs traducidos por idioma).
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    {
      route: "/:language",
      filter: `_type == "homePage" && language == $language`,
      params: ({ params }) => params,
    },
    {
      route: "/:language/actualite/:slug",
      filter: `_type == "post" && language == $language && slug.current == $slug`,
      params: ({ params }) => params,
    },
  ]),
  locations: {
    homePage: defineLocations({
      select: { language: "language" },
      resolve: (doc) =>
        doc?.language ? { locations: [{ title: "Portada", href: `/${doc.language}` }] } : null,
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) =>
        doc?.slug && doc.language
          ? {
              locations: [
                { title: doc.title || "Artículo", href: `/${doc.language}/actualite/${doc.slug}` },
              ],
            }
          : null,
    }),
  },
};
