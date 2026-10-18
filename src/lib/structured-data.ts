import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { DEFAULT_OG_IMAGE, siteUrl } from "./site";

// Datos estructurados (schema.org, JSON-LD) para Google: la firma como
// LegalService, artículos, personas y migas de pan.

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
type Thing = Record<string, unknown>;

// La firma tiene un único @id: el resto de datos la cita como editor o empleador.
export const ORGANIZATION_ID = `${siteUrl}/#organization`;
const organization = { "@id": ORGANIZATION_ID };

const absolute = (url: string) => (url.startsWith("http") ? url : `${siteUrl}${url}`);

// "(506) 4000 3322" → "+50640003322"
const e164 = (phone: string) => `+${phone.replace(/\D/g, "")}`;

type LegalServiceOptions = {
  settings: Settings;
  name: string;
  legalName: string;
  description: string;
  url: string;
  languages: readonly string[];
};

export function legalService({ settings, name, legalName, description, url, languages }: LegalServiceOptions): Thing {
  const address = settings.postalAddress;
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": ORGANIZATION_ID,
    name,
    legalName,
    description,
    url: absolute(url),
    logo: absolute("/monogram-temp.png"),
    image: absolute(DEFAULT_OG_IMAGE),
    telephone: e164(settings.phone),
    email: settings.email,
    address: address && {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    openingHoursSpecification: settings.openingHours?.map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.days?.map((day) => `https://schema.org/${day}`),
      opens: item.opens,
      closes: item.closes,
    })),
    knowsLanguage: languages,
    areaServed: { "@type": "Country", name: "Costa Rica" },
    sameAs: settings.social?.flatMap((link) => (link.url ? [link.url] : [])),
  };
}

export function breadcrumbList(items: { name: string; url?: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      // La página actual va sin dirección.
      ...(item.url && { item: absolute(item.url) }),
    })),
  };
}

type ArticleOptions = {
  type?: "Article" | "BlogPosting";
  headline: string;
  description?: string | null;
  url: string;
  image?: string | null;
  language: string;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: { name: string; url?: string } | null;
};

export function article({ type = "Article", headline, description, url, image, language, datePublished, dateModified, author }: ArticleOptions): Thing {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    description: description || undefined,
    url: absolute(url),
    mainEntityOfPage: absolute(url),
    image: absolute(image || DEFAULT_OG_IMAGE),
    inLanguage: language,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: author ? { "@type": "Person", name: author.name, url: author.url && absolute(author.url) } : organization,
    publisher: organization,
  };
}

type PersonOptions = {
  name: string;
  jobTitle?: string | null;
  email?: string | null;
  image?: string | null;
  url: string;
  languages?: string[] | null;
};

export function person({ name, jobTitle, email, image, url, languages }: PersonOptions): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: jobTitle || undefined,
    email: email || undefined,
    image: image || undefined,
    url: absolute(url),
    knowsLanguage: languages?.length ? languages : undefined,
    worksFor: organization,
  };
}
