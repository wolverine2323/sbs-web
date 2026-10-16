import { defineArrayMember, defineField, defineType } from "sanity";

// Texto enriquecido (Portable Text) para cuerpos de artículos y páginas.
export const blockContent = defineType({
  name: "blockContent",
  title: "Texto",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Título 2", value: "h2" },
        { title: "Título 3", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Cursiva", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Enlace",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Dirección",
                type: "url",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "accessibleImage" }),
  ],
});
