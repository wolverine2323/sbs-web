import { defineField, defineType } from "sanity";
import { languages } from "../../languages";

// Un mismo campo con su texto en fr, es y en (para documentos que no se
// duplican por idioma: testimonios y ajustes del sitio).

export const localeString = defineType({
  name: "localeString",
  title: "Texto corto (fr / es / en)",
  type: "object",
  fields: languages.map(({ id, title }) =>
    defineField({ name: id, title, type: "string" }),
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Texto (fr / es / en)",
  type: "object",
  fields: languages.map(({ id, title }) =>
    defineField({ name: id, title, type: "text", rows: 3 }),
  ),
});

// Validación: exige los tres idiomas.
export function requireAllLanguages(value?: Record<string, string | undefined>) {
  const missing = languages.filter(({ id }) => !value?.[id]?.trim());
  return missing.length
    ? `Falta el texto en: ${missing.map(({ title }) => title).join(", ")}`
    : true;
}
