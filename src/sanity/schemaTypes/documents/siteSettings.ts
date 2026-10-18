import { defineArrayMember, defineField, defineType, type StringRule } from "sanity";
import { requireAllLanguages } from "../objects/localized";

// Días de la semana con su nombre en schema.org (datos estructurados).
const weekDays = [
  { title: "Lunes", value: "Monday" },
  { title: "Martes", value: "Tuesday" },
  { title: "Miércoles", value: "Wednesday" },
  { title: "Jueves", value: "Thursday" },
  { title: "Viernes", value: "Friday" },
  { title: "Sábado", value: "Saturday" },
  { title: "Domingo", value: "Sunday" },
];

const time = (rule: StringRule) =>
  rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "hora" }).error("Escribe la hora como 08:00");

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
      name: "openingHours",
      title: "Horario de atención",
      type: "array",
      group: "contact",
      description: "Para Google (datos estructurados). Una fila por cada horario distinto.",
      of: [
        defineArrayMember({
          type: "object",
          name: "openingHoursItem",
          fields: [
            defineField({
              name: "days",
              title: "Días",
              type: "array",
              of: [{ type: "string" }],
              options: { list: weekDays, layout: "grid" },
              validation: (rule) => rule.required().min(1),
            }),
            defineField({ name: "opens", title: "Abre", type: "string", description: "P. ej. 08:00", validation: time }),
            defineField({ name: "closes", title: "Cierra", type: "string", description: "P. ej. 17:00", validation: time }),
          ],
          preview: {
            select: { days: "days", opens: "opens", closes: "closes" },
            prepare: ({ days, opens, closes }) => ({
              title: ((days as string[] | undefined) ?? [])
                .map((day) => weekDays.find(({ value }) => value === day)?.title ?? day)
                .join(", "),
              subtitle: `${opens ?? "?"} – ${closes ?? "?"}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "postalAddress",
      title: "Dirección por partes",
      type: "object",
      group: "contact",
      description: "La misma dirección, separada, para Google (datos estructurados).",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "street", title: "Calle y edificio", type: "string" }),
        defineField({ name: "locality", title: "Ciudad o cantón", type: "string" }),
        defineField({ name: "region", title: "Provincia", type: "string" }),
        defineField({ name: "postalCode", title: "Código postal", type: "string" }),
        defineField({
          name: "country",
          title: "País (código de 2 letras)",
          type: "string",
          description: "CR para Costa Rica.",
          validation: (rule) => rule.length(2).uppercase(),
        }),
      ],
    }),
    defineField({
      name: "mapsUrl",
      title: "Enlace a Google Maps",
      type: "url",
      group: "contact",
      description: "Se abre al pulsar «Ver en Google Maps» en la página de contacto.",
    }),
    defineField({
      name: "mapsEmbedUrl",
      title: "Mapa insertado",
      type: "url",
      group: "contact",
      description:
        "En Google Maps: Compartir → Insertar un mapa, y copia solo la dirección que va en src=\"…\". El mapa se carga cuando el visitante lo pide.",
      validation: (rule) =>
        rule.custom((url) =>
          !url || url.startsWith("https://www.google.com/maps")
            ? true
            : "Debe empezar por https://www.google.com/maps",
        ),
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
      name: "featuredService",
      title: "Servicio en el menú",
      type: "reference",
      group: "links",
      to: [{ type: "service" }],
      options: { filter: 'language == "fr"' },
      description:
        "Opcional. Aparece en el menú y en el pie con su «Título corto». Se elige la versión francesa; cada idioma muestra su traducción.",
    }),
    defineField({
      name: "gaId",
      title: "ID de Google Analytics 4",
      type: "string",
      group: "links",
      description: "Formato G-XXXXXXXXXX. Solo se carga si el visitante acepta las cookies de medición.",
      validation: (rule) =>
        rule.regex(/^G-[A-Z0-9]+$/, { name: "ID de GA4" }).error("Debe empezar por G-"),
    }),
    defineField({
      name: "adsId",
      title: "ID de Google Ads",
      type: "string",
      group: "links",
      description: "Formato AW-XXXXXXXXXX. Solo se carga si el visitante acepta las cookies de publicidad.",
      validation: (rule) =>
        rule.regex(/^AW-\d+$/, { name: "ID de Google Ads" }).error("Debe empezar por AW- seguido de números"),
    }),
    defineField({
      name: "adsConversionLabel",
      title: "Etiqueta de conversión «cita»",
      type: "string",
      group: "links",
      description:
        "Google Ads → Objetivos → Conversiones → la acción de la cita → Configuración de etiquetas: es lo que va después de la barra en send_to «AW-…/etiqueta». Cada clic en «Agendar una cita» cuenta como conversión.",
    }),
    defineField({
      name: "privacyPage",
      title: "Política de privacidad",
      type: "reference",
      group: "links",
      to: [{ type: "page" }],
      // Débil: puede apuntar a la política aún en borrador; el enlace del pie
      // y del banner aparece cuando se publica.
      weak: true,
      options: { filter: 'language == "fr"' },
      description: "Página general enlazada en el pie y en el banner de cookies. Se elige la versión francesa; cada idioma muestra su traducción.",
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
