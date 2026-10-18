import { defineField, defineType } from "sanity";
import { apiVersion } from "../../env";
import { languageTitle } from "../../languages";
import { languageField, sameLanguageFilter } from "../fields";

// Páginas fijas del sitio cuyo contenido viene de otros documentos (equipo,
// servicios, guía, testimonios, artículos): aquí van sus textos propios.
export const sections = [
  { title: "Le Cabinet", value: "firm" },
  { title: "Socios fundadores", value: "founders" },
  { title: "Abogados colaboradores", value: "associates" },
  { title: "Expertises (índice)", value: "expertise" },
  { title: "Guía del inversor (índice)", value: "invest" },
  { title: "Expériences", value: "experiences" },
  { title: "Actualité", value: "news" },
  { title: "Contact", value: "contact" },
] as const;

export type Section = (typeof sections)[number]["value"];

const sectionTitle = (value?: string) =>
  sections.find((section) => section.value === value)?.title ?? value ?? "";

export const sectionPage = defineType({
  name: "sectionPage",
  title: "Página de sección",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "section",
      title: "Sección",
      type: "string",
      options: { list: sections.map(({ title, value }) => ({ title, value })) },
      validation: (rule) => [
        rule.required(),
        // Una sola página por sección e idioma.
        rule.custom(async (section, { document, getClient }) => {
          if (!section || !document) return true;
          const id = document._id.replace(/^drafts\./, "");
          const duplicate = await getClient({ apiVersion }).fetch<boolean>(
            `defined(*[_type == "sectionPage" && section == $section && language == $language &&
              _id != $id && !(_id in path($otherVersions))][0]._id)`,
            { section, language: document.language ?? null, id, otherVersions: `**.${id}` },
          );
          return duplicate ? "Ya existe una página para esta sección en este idioma" : true;
        }),
      ],
    }),
    defineField({
      name: "eyebrow",
      title: "Etiqueta",
      type: "string",
      description: "Texto pequeño en mayúsculas sobre el título.",
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "lead", title: "Introducción", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Imagen", type: "accessibleImage" }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "blockContent",
      description: "Opcional. Texto largo de la página (p. ej. la presentación del cabinet).",
    }),
    defineField({
      name: "featuredService",
      title: "Servicio destacado",
      type: "reference",
      to: [{ type: "service" }],
      options: { filter: sameLanguageFilter },
      description: "Opcional. Recuadro que lleva a un servicio (p. ej. en la guía del inversor).",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { section: "section", language: "language", media: "image" },
    prepare: ({ section, language, media }) => ({
      title: sectionTitle(section),
      subtitle: languageTitle(language),
      media,
    }),
  },
});
