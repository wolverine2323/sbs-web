import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, slugField } from "../fields";

// Páginas genéricas: política de privacidad, aviso legal…
export const page = defineType({
  name: "page",
  title: "Página general",
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
    defineField({ name: "body", title: "Contenido", type: "blockContent" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({ title, subtitle: languageTitle(language) }),
  },
});
