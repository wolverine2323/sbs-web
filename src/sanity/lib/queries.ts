import { defineQuery } from "next-sanity";

// Campo fr/es/en en el idioma pedido; si falta, en francés. `as const` conserva
// el texto exacto para que TypeGen pueda tipar las consultas que lo usan.
const localized = <Field extends string>(field: Field) =>
  `select($language == "es" => ${field}.es, $language == "en" => ${field}.en, ${field}.fr)` as const;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    phone,
    email,
    "address": ${localized("address")},
    whatsapp,
    bookingUrl,
    mapsUrl,
    mapsEmbedUrl,
    // Servicio del menú y del pie, en el idioma pedido (la referencia apunta
    // a la versión francesa).
    "featuredService": coalesce(
      *[_type == "translation.metadata" && references(^.featuredService._ref)][0]
        .translations[language == $language][0].value->{ "label": coalesce(shortTitle, title), "slug": slug.current },
      select(featuredService->language == $language => featuredService->{ "label": coalesce(shortTitle, title), "slug": slug.current })
    ),
    gaId,
    social[]{ platform, url },
    "footerBody": ${localized("footerBody")},
    "footerRights": ${localized("footerRights")},
    ogImage
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && language == $language][0]{
    hero,
    firm,
    services{
      eyebrow,
      title,
      lead,
      "items": items[]->{ _id, title, summary, "slug": slug.current }
    },
    guide{
      eyebrow,
      title,
      lead,
      ctaLabel,
      "topics": topics[]->{ _id, title, "slug": slug.current }
    },
    testimonials,
    steps,
    booking,
    recognition,
    contact,
    seo
  }
`);

// Traducciones vinculadas por @sanity/document-internationalization.
const TRANSLATIONS = `*[_type == "translation.metadata" && references(^._id)][0].translations[].value->`;

// --- Páginas de sección y CTA final -------------------------------------------

export const SECTION_PAGE_QUERY = defineQuery(`
  *[_type == "sectionPage" && language == $language && section == $section][0]{
    eyebrow,
    title,
    lead,
    image,
    body,
    "featuredService": featuredService->{ title, summary, "slug": slug.current },
    seo
  }
`);

// CTA final de las páginas internas: los pasos y la reserva de la portada.
export const CLOSING_CTA_QUERY = defineQuery(`
  *[_type == "homePage" && language == $language][0]{ steps, booking }
`);

// --- Le Cabinet -------------------------------------------------------------

export const FIRM_EXTRAS_QUERY = defineQuery(`
  *[_type == "homePage" && language == $language][0]{
    "highlights": firm.highlights,
    "photoLabel": firm.photoLabel,
    recognition
  }
`);

export const TEAM_QUERY = defineQuery(`
  *[_type == "teamMember" && language == $language && kind == $kind]
    | order(order asc, name asc){
      _id,
      name,
      role,
      photo,
      bio,
      spokenLanguages
    }
`);

// --- Expertises -------------------------------------------------------------

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service" && language == $language && defined(slug.current)]
    | order(order asc, title asc){ _id, title, summary, "slug": slug.current }
`);

export const SERVICE_SLUGS_QUERY = defineQuery(`
  *[_type == "service" && language == $language && defined(slug.current)].slug.current
`);

export const SERVICE_QUERY = defineQuery(`
  *[_type == "service" && language == $language && slug.current == $slug][0]{
    _id,
    title,
    summary,
    image,
    body,
    audiences[]{
      _key,
      eyebrow,
      title,
      lead,
      facts[]{ _key, value, label },
      steps[]{ _key, title, description },
      ctaLabel
    },
    helpPoints[]{ _key, title, description },
    faq[]{ _key, question, answer },
    disclaimer,
    "testimonial": select(testimonial->published != false => testimonial->{
      author,
      "quote": ${localized("quote")},
      "role": ${localized("role")}
    }),
    seo,
    "others": *[_type == "service" && language == $language && _id != ^._id && defined(slug.current)]
      | order(order asc, title asc){ _id, title, "slug": slug.current },
    "translations": ${TRANSLATIONS}{ language, "slug": slug.current }
  }
`);

// --- Guía del inversor ------------------------------------------------------

export const GUIDE_INDEX_QUERY = defineQuery(`
  *[_type == "investGuide" && language == $language && !defined(parent) && defined(slug.current)]
    | order(order asc, title asc){
      _id,
      title,
      summary,
      "slug": slug.current,
      "children": *[_type == "investGuide" && parent._ref == ^._id && defined(slug.current)]
        | order(order asc, title asc){ _id, title, "slug": slug.current }
    }
`);

export const GUIDE_TOPIC_SLUGS_QUERY = defineQuery(`
  *[_type == "investGuide" && language == $language && !defined(parent) && defined(slug.current)]
    .slug.current
`);

export const GUIDE_SUBTOPIC_PARAMS_QUERY = defineQuery(`
  *[_type == "investGuide" && language == $language && defined(slug.current) && defined(parent->slug.current)]{
    "topic": parent->slug.current,
    "subtopic": slug.current
  }
`);

// Tema ($topic == "") o subtema de $topic.
export const GUIDE_ARTICLE_QUERY = defineQuery(`
  *[_type == "investGuide" && language == $language && slug.current == $slug &&
    select($topic == "" => !defined(parent), parent->slug.current == $topic)][0]{
    _id,
    title,
    summary,
    body,
    seo,
    "parent": parent->{ _id, title, "slug": slug.current },
    "children": *[_type == "investGuide" && parent._ref == ^._id && defined(slug.current)]
      | order(order asc, title asc){ _id, title, summary, "slug": slug.current },
    "siblings": *[_type == "investGuide" && defined(^.parent._ref) && parent._ref == ^.parent._ref && defined(slug.current)]
      | order(order asc, title asc){ _id, title, "slug": slug.current },
    "translations": ${TRANSLATIONS}{ language, "slug": slug.current, "parentSlug": parent->slug.current }
  }
`);

// --- Actualité --------------------------------------------------------------

const POST_CARD = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  image,
  "category": category->{ title, "slug": slug.current },
  "words": length(string::split(pt::text(body), " "))
`;

// Lista paginada; $category == "" para todas las categorías.
export const POSTS_PAGE_QUERY = defineQuery(`{
  "posts": *[_type == "post" && language == $language && defined(slug.current) &&
    ($category == "" || category->slug.current == $category)]
    | order(publishedAt desc)[$start...$end]{ ${POST_CARD} },
  "total": count(*[_type == "post" && language == $language && defined(slug.current) &&
    ($category == "" || category->slug.current == $category)]),
  "categories": *[_type == "category" && language == $language && defined(slug.current) &&
    count(*[_type == "post" && references(^._id)]) > 0]
    | order(title asc){ _id, title, "slug": slug.current },
  "category": *[_type == "category" && language == $language && slug.current == $category][0]{
    _id,
    title,
    "translations": ${TRANSLATIONS}{ language, "slug": slug.current }
  }
}`);

export const POST_COUNTS_QUERY = defineQuery(`{
  "total": count(*[_type == "post" && language == $language && defined(slug.current)]),
  "categories": *[_type == "category" && language == $language && defined(slug.current)]{
    "slug": slug.current,
    "total": count(*[_type == "post" && references(^._id) && defined(slug.current)])
  }
}`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(slug.current)].slug.current
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0]{
    ${POST_CARD},
    body,
    "author": author->{ name, role, kind, photo },
    seo,
    "related": *[_type == "post" && language == $language && _id != ^._id && defined(slug.current)]
      | order(select(category._ref == ^.category._ref => 1, 0) desc, publishedAt desc)[0...3]{ ${POST_CARD} },
    "translations": ${TRANSLATIONS}{ language, "slug": slug.current }
  }
`);

// --- Páginas generales ------------------------------------------------------

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && language == $language && defined(slug.current)].slug.current
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && language == $language && slug.current == $slug][0]{
    _id,
    title,
    body,
    seo,
    "translations": ${TRANSLATIONS}{ language, "slug": slug.current }
  }
`);

// --- Testimonios --------------------------------------------------------------

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && published != false] | order(order asc){
    _id,
    author,
    "quote": ${localized("quote")},
    "role": ${localized("role")}
  }
`);
