import { defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, sameLanguageFilter, slugField } from "../fields";

// Artículo del blog (Actualité).
export const post = defineType({
  name: "post",
  title: "Artículo",
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
      name: "publishedAt",
      title: "Fecha",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      description: "Resumen corto para la lista de artículos y para Google.",
      validation: (rule) => rule.max(300).warning("Mejor 300 caracteres o menos"),
    }),
    defineField({ name: "image", title: "Imagen principal", type: "accessibleImage" }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "teamMember" }],
      options: { filter: sameLanguageFilter },
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      options: { filter: sameLanguageFilter },
    }),
    defineField({ name: "body", title: "Contenido", type: "blockContent" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    { title: "Más recientes", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", language: "language", date: "publishedAt", media: "image" },
    prepare: ({ title, language, date, media }) => ({
      title,
      subtitle: [languageTitle(language), date?.slice(0, 10)].filter(Boolean).join(" · "),
      media,
    }),
  },
});
