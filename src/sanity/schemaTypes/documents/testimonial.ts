import { defineField, defineType } from "sanity";
import { orderField, orderings } from "../fields";
import { requireAllLanguages } from "../objects/localized";

// Un solo documento por testimonio, con la cita en los tres idiomas.
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Cita",
      type: "localeText",
      validation: (rule) => rule.custom(requireAllLanguages),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Cargo u origen",
      type: "localeString",
      description: "P. ej. «CEO · Trigicom, USA – Israël» o «Cassis, France».",
    }),
    orderField,
    defineField({
      name: "published",
      title: "Publicado",
      type: "boolean",
      description: "Desmarca para ocultarlo del sitio sin borrarlo.",
      initialValue: true,
    }),
  ],
  orderings,
  preview: {
    select: { title: "author", subtitle: "quote.fr", published: "published" },
    prepare: ({ title, subtitle, published }) => ({
      title: published === false ? `${title} (oculto)` : title,
      subtitle,
    }),
  },
});
