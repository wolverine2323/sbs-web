import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description: "Opcional. Si se deja vacío se usan el título y el resumen de la página.",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título para Google",
      type: "string",
      validation: (rule) => rule.max(60).warning("Mejor 60 caracteres o menos"),
    }),
    defineField({
      name: "description",
      title: "Descripción para Google",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Mejor 160 caracteres o menos"),
    }),
    defineField({
      name: "image",
      title: "Imagen al compartir en redes",
      type: "image",
      description: "1200 × 630 px recomendado.",
    }),
  ],
});
