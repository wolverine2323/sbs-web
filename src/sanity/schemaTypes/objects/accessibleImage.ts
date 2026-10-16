import { defineField, defineType } from "sanity";

// Imagen con recorte inteligente (hotspot) y texto alternativo obligatorio.
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description:
        "Describe la imagen para quien no puede verla (lectores de pantalla y Google). Ej.: «Los socios fundadores en la oficina de La Unión».",
      validation: (rule) =>
        rule.custom((alt, context) => {
          const image = context.parent as { asset?: unknown } | undefined;
          return image?.asset && !alt?.trim() ? "Escribe el texto alternativo" : true;
        }),
    }),
  ],
});
