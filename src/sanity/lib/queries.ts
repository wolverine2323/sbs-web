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
    gaId,
    social[]{ platform, url },
    "footerBody": ${localized("footerBody")},
    "footerRights": ${localized("footerRights")},
    ogImage
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(slug.current)].slug.current
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    image,
    body,
    "author": author->{ name, role },
    "category": category->title,
    seo,
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{ language, "slug": slug.current }
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

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && published != false] | order(order asc){
    _id,
    author,
    "quote": ${localized("quote")},
    "role": ${localized("role")}
  }
`);
