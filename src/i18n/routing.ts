import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "es", "en"],
  defaultLocale: "fr",
  // Todas las rutas llevan prefijo: /fr, /es, /en.
  localePrefix: "always",
  // La raíz / siempre redirige a /fr, sin mirar el idioma del navegador.
  localeDetection: false,
  // Sin detección no hace falta recordar el idioma: ninguna cookie NEXT_LOCALE.
  localeCookie: false,
  // Sin cabecera Link con hreflang: con slugs traducidos sería incorrecta en
  // las páginas de Sanity. Los hreflang por página llegan en la Fase 7.
  alternateLinks: false,
  // Direcciones traducidas. La clave es la ruta interna (la carpeta dentro de
  // src/app/[locale]), que coincide con la francesa.
  pathnames: {
    "/": "/",
    "/le-cabinet": { fr: "/le-cabinet", es: "/la-firma", en: "/the-firm" },
    "/le-cabinet/associes-fondateurs": {
      fr: "/le-cabinet/associes-fondateurs",
      es: "/la-firma/socios-fundadores",
      en: "/the-firm/founding-partners",
    },
    "/le-cabinet/avocats-collaborateurs": {
      fr: "/le-cabinet/avocats-collaborateurs",
      es: "/la-firma/abogados-colaboradores",
      en: "/the-firm/associate-attorneys",
    },
    "/expertises": { fr: "/expertises", es: "/areas-de-practica", en: "/practice-areas" },
    "/expertises/[slug]": {
      fr: "/expertises/[slug]",
      es: "/areas-de-practica/[slug]",
      en: "/practice-areas/[slug]",
    },
    "/investir-au-costa-rica": {
      fr: "/investir-au-costa-rica",
      es: "/invertir-en-costa-rica",
      en: "/invest-in-costa-rica",
    },
    "/investir-au-costa-rica/[topic]": {
      fr: "/investir-au-costa-rica/[topic]",
      es: "/invertir-en-costa-rica/[topic]",
      en: "/invest-in-costa-rica/[topic]",
    },
    "/investir-au-costa-rica/[topic]/[subtopic]": {
      fr: "/investir-au-costa-rica/[topic]/[subtopic]",
      es: "/invertir-en-costa-rica/[topic]/[subtopic]",
      en: "/invest-in-costa-rica/[topic]/[subtopic]",
    },
    "/experiences": { fr: "/experiences", es: "/experiencias", en: "/experiences" },
    "/experiences/[slug]": {
      fr: "/experiences/[slug]",
      es: "/experiencias/[slug]",
      en: "/experiences/[slug]",
    },
    "/actualite": { fr: "/actualite", es: "/actualidad", en: "/news" },
    "/actualite/page/[page]": {
      fr: "/actualite/page/[page]",
      es: "/actualidad/pagina/[page]",
      en: "/news/page/[page]",
    },
    "/actualite/categorie/[category]": {
      fr: "/actualite/categorie/[category]",
      es: "/actualidad/categoria/[category]",
      en: "/news/category/[category]",
    },
    "/actualite/categorie/[category]/page/[page]": {
      fr: "/actualite/categorie/[category]/page/[page]",
      es: "/actualidad/categoria/[category]/pagina/[page]",
      en: "/news/category/[category]/page/[page]",
    },
    "/actualite/[slug]": { fr: "/actualite/[slug]", es: "/actualidad/[slug]", en: "/news/[slug]" },
    "/contact": { fr: "/contact", es: "/contacto", en: "/contact" },
    // Páginas generales (política de privacidad…), contenido en la Fase 8.
    "/[slug]": "/[slug]",
    // Catálogo de componentes, solo en desarrollo.
    "/_kit": "/_kit",
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;

// Índice de cada sección con slugs de Sanity: adonde lleva el selector de
// idioma mientras la página no ha indicado sus traducciones, o si le falta
// alguna.
export const sectionIndex: Partial<Record<Pathname, Pathname>> = {
  "/expertises/[slug]": "/expertises",
  "/investir-au-costa-rica/[topic]": "/investir-au-costa-rica",
  "/investir-au-costa-rica/[topic]/[subtopic]": "/investir-au-costa-rica",
  "/actualite/categorie/[category]": "/actualite",
  "/actualite/categorie/[category]/page/[page]": "/actualite",
  "/experiences/[slug]": "/experiences",
  "/actualite/[slug]": "/actualite",
  "/[slug]": "/",
};
