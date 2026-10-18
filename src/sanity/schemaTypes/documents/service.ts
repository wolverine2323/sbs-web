import { defineArrayMember, defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings, slugField } from "../fields";

export const service = defineType({
  name: "service",
  title: "Servicio",
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
      description: "Una o dos frases. Se muestra en la lista de servicios de la portada.",
      validation: (rule) => [
        rule.required(),
        rule.max(240).warning("Mejor 240 caracteres o menos"),
      ],
    }),
    defineField({ name: "image", title: "Imagen", type: "accessibleImage" }),
    defineField({ name: "body", title: "Contenido", type: "blockContent" }),
    defineField({
      name: "helpPoints",
      title: "Cómo le ayudamos",
      type: "array",
      description: "Lo que hace el cabinet en este ámbito, en puntos cortos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "helpPoint",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
          ],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "testimonial",
      title: "Testimonio relacionado",
      type: "reference",
      to: [{ type: "testimonial" }],
      options: { filter: "published != false" },
    }),
    orderField,
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings,
  preview: {
    select: { title: "title", language: "language", media: "image" },
    prepare: ({ title, language, media }) => ({
      title,
      subtitle: languageTitle(language),
      media,
    }),
  },
});
