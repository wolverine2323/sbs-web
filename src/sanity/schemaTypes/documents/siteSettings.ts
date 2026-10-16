import { defineArrayMember, defineField, defineType } from "sanity";
import { requireAllLanguages } from "../objects/localized";

// Documento único con los datos de la firma que se usan en todo el sitio.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  groups: [
    { name: "contact", title: "Contacto", default: true },
    { name: "links", title: "Enlaces" },
    { name: "footer", title: "Pie de página" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      group: "contact",
      description: "Tal como se muestra en el sitio, p. ej. (506) 4000 3322.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "localeText",
      group: "contact",
      validation: (rule) => rule.custom(requireAllLanguages),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contact",
      description:
        "Número con código de país, p. ej. +506 8888 8888. Si está vacío, el botón de WhatsApp no aparece.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Enlace para agendar cita",
      type: "url",
      group: "links",
      description: "Lo usan todos los botones «Prendre rendez-vous / Agendar una cita».",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gaId",
      title: "ID de Google Analytics 4",
      type: "string",
      group: "links",
      description: "Formato G-XXXXXXXXXX.",
      validation: (rule) =>
        rule.regex(/^G-[A-Z0-9]+$/, { name: "ID de GA4" }).error("Debe empezar por G-"),
    }),
    defineField({
      name: "social",
      title: "Redes sociales",
      type: "array",
      group: "links",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Red",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Dirección",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "footerBody",
      title: "Texto del pie",
      type: "localeText",
      group: "footer",
      validation: (rule) => rule.custom(requireAllLanguages),
    }),
    defineField({
      name: "footerRights",
      title: "Derechos (©)",
      type: "localeString",
      group: "footer",
      description: "P. ej. «© 2026 SBS Abogados. Tous droits réservés.»",
      validation: (rule) => rule.custom(requireAllLanguages),
    }),
    defineField({
      name: "ogImage",
      title: "Imagen por defecto al compartir en redes",
      type: "image",
      group: "seo",
      description: "Se usa cuando una página no tiene imagen propia. 1200 × 630 px.",
    }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del sitio" }) },
});
