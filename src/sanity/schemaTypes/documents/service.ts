import { defineArrayMember, defineField, defineType } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, orderField, orderings, slugField } from "../fields";

// Elementos de lista con título y texto (pasos, puntos de ayuda).
const titledItem = (name: string, title: string) =>
  defineArrayMember({
    type: "object",
    name,
    title,
    fields: [
      defineField({
        name: "title",
        title: "Título",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "description", title: "Descripción", type: "text", rows: 3 }),
    ],
  });

export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "audiences", title: "Públicos" },
    { name: "faq", title: "Preguntas y aviso" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Título corto",
      type: "string",
      group: "main",
      description: "Opcional. Se usa en el menú y en el pie si este servicio aparece ahí.",
      validation: (rule) => rule.max(28).warning("Mejor 28 caracteres o menos para que quepa en el menú"),
    }),
    { ...slugField(), group: "main" },
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 3,
      group: "main",
      description: "Una o dos frases. Se muestra en la lista de servicios de la portada.",
      validation: (rule) => [
        rule.required(),
        rule.max(240).warning("Mejor 240 caracteres o menos"),
      ],
    }),
    defineField({ name: "image", title: "Imagen", type: "accessibleImage", group: "main" }),
    defineField({ name: "body", title: "Contenido", type: "blockContent", group: "main" }),
    defineField({
      name: "audiences",
      title: "Públicos",
      type: "array",
      group: "audiences",
      description:
        "Opcional. Una sección por tipo de cliente (p. ej. quien pide un crédito y quien invierte), con cifras clave y pasos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "audience",
          fields: [
            defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "lead", title: "Introducción", type: "text", rows: 4 }),
            defineField({
              name: "facts",
              title: "Cifras clave",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "fact",
                  fields: [
                    defineField({
                      name: "value",
                      title: "Cifra",
                      type: "string",
                      description: "P. ej. «50 % máx.»",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({ name: "label", title: "Explicación", type: "string" }),
                  ],
                  preview: { select: { title: "value", subtitle: "label" } },
                }),
              ],
              validation: (rule) => rule.max(4),
            }),
            defineField({
              name: "steps",
              title: "Pasos",
              type: "array",
              of: [titledItem("step", "Paso")],
              validation: (rule) => rule.max(8),
            }),
            defineField({
              name: "ctaLabel",
              title: "Texto del botón de cita",
              type: "string",
              description: "El botón abre la agenda de SBS (Ajustes del sitio).",
            }),
          ],
          preview: { select: { title: "title", subtitle: "eyebrow" } },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "helpPoints",
      title: "Cómo le ayudamos",
      type: "array",
      group: "main",
      description: "Lo que hace el cabinet en este ámbito, en puntos cortos.",
      of: [titledItem("helpPoint", "Punto")],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "faq",
      title: "Preguntas frecuentes",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Pregunta",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Respuesta",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({
      name: "disclaimer",
      title: "Aviso legal",
      type: "text",
      rows: 5,
      group: "faq",
      description: "Opcional. Texto pequeño al final de la página (p. ej. rendimientos no garantizados).",
    }),
    defineField({
      name: "testimonial",
      title: "Testimonio relacionado",
      type: "reference",
      group: "main",
      to: [{ type: "testimonial" }],
      options: { filter: "published != false" },
    }),
    { ...orderField, group: "main" },
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
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
