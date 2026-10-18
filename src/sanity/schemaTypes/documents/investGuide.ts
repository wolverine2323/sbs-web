import { defineField, defineType } from "sanity";
import { apiVersion } from "../../env";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings, slugField } from "../fields";

// Artículo de la guía «Investir au Costa Rica». Un subtema apunta a su tema
// padre, p. ej. «Acquérir la propriété» → «Propriété et droits immobiliers».
// Dos niveles como máximo: tema › subtema.
export const investGuide = defineType({
  name: "investGuide",
  title: "Guía del inversor",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 3,
      description: "Opcional. Una o dos frases para el índice de la guía y para Google.",
      validation: (rule) => rule.max(240).warning("Mejor 240 caracteres o menos"),
    }),
    defineField({
      name: "parent",
      title: "Tema padre",
      type: "reference",
      to: [{ type: "investGuide" }],
      description: "Déjalo vacío si es un tema principal.",
      options: {
        // Solo temas principales del mismo idioma.
        filter: ({ document }) => {
          const id = document._id.replace(/^drafts\./, "");
          return {
            filter:
              "language == $language && !defined(parent) && _id != $id && !(_id in path($versions))",
            params: { language: document.language ?? null, id, versions: `**.${id}` },
          };
        },
      },
      validation: (rule) =>
        rule.custom(async (parent, { document, getClient }) => {
          if (!parent?._ref || !document) return true;
          const id = document._id.replace(/^drafts\./, "");
          const { parentHasParent, hasChildren } = await getClient({ apiVersion }).fetch<{
            parentHasParent: boolean;
            hasChildren: boolean;
          }>(
            `{
              "parentHasParent": defined(*[_id == $parent][0].parent),
              "hasChildren": count(*[_type == "investGuide" && parent._ref == $id]) > 0
            }`,
            { parent: parent._ref, id },
          );
          if (parentHasParent) return "Elige un tema principal: la guía tiene dos niveles como máximo";
          if (hasChildren) return "Este tema tiene subtemas: no puede ser a su vez un subtema";
          return true;
        }),
    }),
    orderField,
    defineField({ name: "body", title: "Contenido", type: "blockContent" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings,
  preview: {
    select: { title: "title", language: "language", parent: "parent.title" },
    prepare: ({ title, language, parent }) => ({
      title,
      subtitle: [languageTitle(language), parent && `↳ ${parent}`].filter(Boolean).join(" · "),
    }),
  },
});
