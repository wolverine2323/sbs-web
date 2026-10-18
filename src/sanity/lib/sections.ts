import "server-only";

import type { Metadata } from "next";
import { currentLocale } from "@/i18n/locale";
import { sectionRoutes } from "@/i18n/paths";
import { pageMetadata, pathsFor } from "@/lib/metadata";
import { cachedSanity, type DynamicFetchOptions } from "./live";
import { SECTION_PAGE_QUERY } from "./queries";

// Valores de «Sección» en el tipo sectionPage (src/sanity/schemaTypes).
export type Section =
  | "firm"
  | "founders"
  | "associates"
  | "expertise"
  | "invest"
  | "experiences"
  | "news"
  | "contact";

const published: DynamicFetchOptions = { perspective: "published", stega: false };

// Textos propios de una página de sección en el idioma de la URL.
export async function getSectionPage(section: Section, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: SECTION_PAGE_QUERY,
    params: { language: await currentLocale(), section },
    tags: ["sectionPage", "service"],
    ...fetchOptions,
  });
  return data;
}

// Metadatos de la página (SEO de la página, o título, introducción e imagen).
export async function sectionMetadata(section: Section): Promise<Metadata> {
  const page = await getSectionPage(section, published);
  if (!page) return {};
  return pageMetadata({
    locale: await currentLocale(),
    paths: pathsFor(sectionRoutes[section]),
    title: page.title,
    description: page.lead,
    image: page.image,
    seo: page.seo,
  });
}
