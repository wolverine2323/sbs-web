import {
  defineField,
  type ReferenceFilterResolverContext,
  type SlugValidationContext,
} from "sanity";
import { apiVersion } from "../env";

// Campo que usa @sanity/document-internationalization; lo rellena el plugin.
export const languageField = defineField({
  name: "language",
  type: "string",
  readOnly: true,
  hidden: true,
});

// "Propriété & droits immobiliers" → "propriete-droits-immobiliers"
function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// El mismo slug puede repetirse en otro idioma (p. ej. "contact"), pero no
// en dos documentos del mismo tipo e idioma.
async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  if (!document) return true;
  const id = document._id.replace(/^drafts\./, "");
  return getClient({ apiVersion }).fetch<boolean>(
    `!defined(*[
      _type == $type && language == $language && slug.current == $slug &&
      _id != $id && !(_id in path($otherVersions))
    ][0]._id)`,
    {
      type: document._type,
      language: document.language ?? null,
      slug,
      id,
      otherVersions: `**.${id}`,
    },
  );
}

export function slugField(source = "title") {
  return defineField({
    name: "slug",
    title: "Dirección (slug)",
    type: "slug",
    description: "Parte final de la dirección web. Se genera desde el título con el botón «Generate».",
    options: { source, slugify, isUnique: isUniqueInLanguage },
    validation: (rule) => rule.required().error("Genera la dirección de la página"),
  });
}

// Para referencias: solo documentos del mismo idioma que el que se edita.
export function sameLanguageFilter({ document }: ReferenceFilterResolverContext) {
  return {
    filter: "language == $language",
    params: { language: document.language ?? null },
  };
}

export const orderField = defineField({
  name: "order",
  title: "Orden",
  type: "number",
  description: "Los números más bajos aparecen primero.",
});

export const orderings = [
  { title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" as const }] },
];
