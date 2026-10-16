import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings, slugField } from "../fields";

// Artículo de la guía «Investir au Costa Rica». Un subtema apunta a su tema
// padre, p. ej. «Acquérir la propriété» → «Propriété et droits immobiliers».
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
      name: "parent",
      title: "Tema padre",
      type: "reference",
      to: [{ type: "investGuide" }],
      description: "Déjalo vacío si es un tema principal.",
      options: {
        filter: ({ document }) => {
          const id = document._id.replace(/^drafts\./, "");
          return {
            filter: "language == $language && _id != $id && !(_id in path($versions))",
            params: { language: document.language ?? null, id, versions: `**.${id}` },
          };
        },
      },
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
