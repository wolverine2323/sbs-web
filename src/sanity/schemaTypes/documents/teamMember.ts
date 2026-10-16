import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings } from "../fields";

export const teamMember = defineType({
  name: "teamMember",
  title: "Miembro del equipo",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Cargo",
      type: "string",
      description: "P. ej. «Avocate et notaire, associée fondatrice».",
    }),
    defineField({
      name: "kind",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Socio fundador", value: "founder" },
          { title: "Abogado colaborador", value: "associate" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "photo", title: "Foto", type: "accessibleImage" }),
    defineField({ name: "bio", title: "Biografía", type: "blockContent" }),
    defineField({
      name: "spokenLanguages",
      title: "Idiomas que habla",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Francés", value: "fr" },
          { title: "Español", value: "es" },
          { title: "Inglés", value: "en" },
          { title: "Alemán", value: "de" },
          { title: "Italiano", value: "it" },
          { title: "Portugués", value: "pt" },
        ],
        layout: "grid",
      },
    }),
    orderField,
  ],
  orderings,
  preview: {
    select: { title: "name", role: "role", language: "language", media: "photo" },
    prepare: ({ title, role, language, media }) => ({
      title,
      subtitle: [languageTitle(language), role].filter(Boolean).join(" · "),
      media,
    }),
  },
});
