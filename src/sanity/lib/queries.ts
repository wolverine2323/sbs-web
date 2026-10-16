import { defineQuery } from "next-sanity";

// Campo fr/es/en en el idioma pedido; si falta, en francés.
const localized = (field: string) =>
  `select($language == "es" => ${field}.es, $language == "en" => ${field}.en, ${field}.fr)`;

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
