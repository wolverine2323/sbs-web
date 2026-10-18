import "server-only";

import type { Metadata } from "next";
import { currentLocale } from "@/i18n/locale";
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

// Título y descripción para Google (SEO de la página, o título e introducción).
export async function sectionMetadata(section: Section): Promise<Metadata> {
  const page = await getSectionPage(section, published);
  if (!page) return {};
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.lead || undefined,
  };
}
