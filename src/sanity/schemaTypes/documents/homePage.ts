import { defineArrayMember, defineField, defineType, type FieldDefinition } from "sanity";
import { languageTitle } from "../../languages";
import { languageField, sameLanguageFilter } from "../fields";

// Portada: un documento por idioma con todos los bloques de
// design/nocturne-reference.html, en el mismo orden.

const text = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "string", description });

const longText = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: "text", rows: 3, description });

const block = (
  name: string,
  title: string,
  fields: FieldDefinition[],
  description?: string,
) => defineField({ name, title, type: "object", group: name, fields, description });

export const homePage = defineType({
  name: "homePage",
  title: "Portada",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "firm", title: "Firma" },
    { name: "services", title: "Servicios" },
    { name: "guide", title: "Guía" },
    { name: "testimonials", title: "Testimonios" },
    { name: "steps", title: "Pasos" },
    { name: "booking", title: "Reserva" },
    { name: "recognition", title: "Reconocimientos" },
    { name: "contact", title: "Contacto" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    block("hero", "Hero", [
      text("eyebrow", "Etiqueta superior", "«Avocats & Notaires · Costa Rica»"),
      defineField({
        name: "title1",
        title: "Título (línea 1)",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      text("title2", "Título (línea 2, en itálica)"),
      longText("lead", "Introducción"),
      text("callLabel", "Botón de llamada", "«Appeler le cabinet»"),
      text("note", "Nota bajo los botones", "«Consultation en français, espagnol ou anglais»"),
      text("recognitionLabel", "Franja · etiqueta de embajadas"),
      text("countries", "Franja · países", "«France · Suisse · Canada»"),
      text("distinctionsLabel", "Franja · etiqueta de distinciones"),
      text("distinctions", "Franja · distinciones", "«Chambers & Partners · LACCA»"),
      text("membershipsLabel", "Franja · etiqueta de membresías"),
      longText("memberships", "Franja · membresías"),
    ]),
    block("firm", "Firma", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      longText("body", "Texto", "Va después de «SBS Abogados» en negrita."),
      defineField({
        name: "highlights",
        title: "Áreas destacadas",
        type: "array",
        of: [{ type: "string" }],
        validation: (rule) => rule.max(6),
      }),
      text("moreLabel", "Enlace «En savoir plus»"),
      defineField({ name: "photo", title: "Foto", type: "accessibleImage" }),
      text("photoLabel", "Rótulo mientras no hay foto", "«Photo · Les associés fondateurs»"),
    ]),
    block("services", "Servicios destacados", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      longText("lead", "Introducción"),
      defineField({
        name: "items",
        title: "Servicios",
        type: "array",
        of: [
          defineArrayMember({
            type: "reference",
            to: [{ type: "service" }],
            options: { filter: sameLanguageFilter },
          }),
        ],
        validation: (rule) => rule.unique().max(6),
      }),
    ]),
    block("guide", "Guía del inversor", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      longText("lead", "Introducción"),
      text("ctaLabel", "Botón", "«Parler de mon projet»"),
      defineField({
        name: "topics",
        title: "Temas",
        type: "array",
        of: [
          defineArrayMember({
            type: "reference",
            to: [{ type: "investGuide" }],
            options: { filter: sameLanguageFilter },
          }),
        ],
        validation: (rule) => rule.unique(),
      }),
    ]),
    block(
      "testimonials",
      "Testimonios",
      [text("eyebrow", "Etiqueta"), text("title", "Título")],
      "Se muestran los testimonios publicados de la sección «Testimonios», por orden.",
    ),
    block("steps", "Pasos", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      defineField({
        name: "items",
        title: "Pasos",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "step",
            fields: [text("title", "Título"), longText("description", "Descripción")],
          }),
        ],
        validation: (rule) => rule.max(4),
      }),
    ]),
    block("booking", "Reserva", [
      text("tag", "Etiqueta", "«Agenda en ligne»"),
      text("title", "Título"),
      longText("body", "Texto"),
      text("buttonLabel", "Botón", "«Choisir un créneau»"),
      text("alternative", "Texto sobre el teléfono", "«Vous préférez nous appeler ou nous écrire ?»"),
    ]),
    block("recognition", "Reconocimientos", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      defineField({
        name: "embassies",
        title: "Embajadas",
        type: "array",
        description: "Solo texto: no se usan escudos de embajadas.",
        of: [
          defineArrayMember({
            type: "object",
            name: "seal",
            fields: [
              text("name", "Texto del sello", "«Canada»"),
              text("caption", "Leyenda", "«Ambassade du Canada»"),
            ],
          }),
        ],
      }),
      defineField({
        name: "distinctions",
        title: "Distinciones",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "seal",
            fields: [
              text("name", "Texto del sello", "«Chambers & Partners»"),
              text("caption", "Leyenda", "«Distinction d’excellence»"),
            ],
          }),
        ],
      }),
    ]),
    block("contact", "Contacto", [
      text("eyebrow", "Etiqueta"),
      text("title", "Título"),
      longText("body", "Texto"),
    ]),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: "Portada", subtitle: languageTitle(language) }),
  },
});
