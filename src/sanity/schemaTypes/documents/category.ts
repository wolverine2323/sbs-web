import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, slugField } from "../fields";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({ title, subtitle: languageTitle(language) }),
  },
});
