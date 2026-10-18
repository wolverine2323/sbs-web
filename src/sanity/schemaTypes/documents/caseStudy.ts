import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings, slugField } from "../fields";

// Caso de la firma (Expériences): un proyecto o asunto que el cabinet llevó.
// Se lista en la página Expériences junto a los testimonios y tiene su página.
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Experiencia (caso)",
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
      description: "Una o dos frases para la tarjeta de la página Expériences y para Google.",
      validation: (rule) => rule.max(240).warning("Mejor 240 caracteres o menos"),
    }),
    defineField({ name: "image", title: "Imagen", type: "accessibleImage" }),
    defineField({ name: "body", title: "Contenido", type: "blockContent" }),
    orderField,
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings,
  preview: {
    select: { title: "title", language: "language", media: "image" },
    prepare: ({ title, language, media }) => ({ title, subtitle: languageTitle(language), media }),
  },
});
