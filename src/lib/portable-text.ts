import { slugify } from "./slugify";

// Bloque de Portable Text (solo lo que se lee aquí).
export type TextBlock = {
  _type: string;
  style?: string;
  children?: { text?: string }[];
};

export function blockText(block: TextBlock) {
  return block.children?.map((child) => child.text ?? "").join("") ?? "";
}

// Ancla de un título: "Le régime fiscal" → "le-regime-fiscal".
export function headingId(block: TextBlock) {
  return slugify(blockText(block));
}

// Títulos h2 del texto, para el índice lateral de la guía.
export function tableOfContents(body?: TextBlock[] | null) {
  return (body ?? [])
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => ({ id: headingId(block), text: blockText(block) }))
    .filter((heading) => heading.id);
}

// Minutos de lectura, a 200 palabras por minuto.
export function readingMinutes(words?: number | null) {
  return Math.max(1, Math.round((words ?? 0) / 200));
}
