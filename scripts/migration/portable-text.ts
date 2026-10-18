// HTML del sitio viejo → Portable Text con los estilos de blockContent
// (src/sanity/schemaTypes/objects/blockContent.ts). Las imágenes quedan como
// marcadores { _type: "accessibleImage", src, alt } que import.ts sustituye
// por la imagen subida a Sanity.
import { randomUUID } from "node:crypto";
import { htmlToPortableText } from "@portabletext/html";
import { compileSchema, defineSchema } from "@portabletext/schema";
import { JSDOM } from "jsdom";

export type ImageMarker = { _type: "accessibleImage"; _key?: string; src: string; alt: string };
export type PortableBlock = { _type: string; _key: string; [key: string]: unknown };

const schema = compileSchema(
  defineSchema({
    styles: [{ name: "normal" }, { name: "h2" }, { name: "h3" }, { name: "blockquote" }],
    lists: [{ name: "bullet" }, { name: "number" }],
    decorators: [{ name: "strong" }, { name: "em" }],
    annotations: [{ name: "link", fields: [{ name: "href", type: "string" }] }],
    blockObjects: [
      {
        name: "accessibleImage",
        fields: [
          { name: "src", type: "string" },
          { name: "alt", type: "string" },
        ],
      },
    ],
  }),
);

const key = () => randomUUID().replaceAll("-", "").slice(0, 12);
const BLOCK_PARENTS = "p, li, h1, h2, h3, h4, h5, h6, blockquote";

// Ajustes previos: niveles de título (los h3 del sitio viejo pasan a h2, el
// nivel más alto dentro de la página) e imágenes fuera de los párrafos.
function prepare(html: string) {
  const { document } = new JSDOM(`<body>${html}</body>`).window;
  const rename = (el: Element, tag: string) => {
    const next = document.createElement(tag);
    next.append(...Array.from(el.childNodes));
    el.replaceWith(next);
  };
  document.querySelectorAll("h1, h2, h3").forEach((el) => rename(el, "h2"));
  document.querySelectorAll("h4, h5, h6").forEach((el) => rename(el, "h3"));
  document.querySelectorAll("b").forEach((el) => rename(el, "strong"));
  document.querySelectorAll("i").forEach((el) => rename(el, "em"));
  for (const img of Array.from(document.querySelectorAll("img"))) {
    const parent = img.parentElement?.closest(BLOCK_PARENTS);
    if (!parent) continue;
    let anchor: Element = parent;
    while (anchor.parentElement?.closest(BLOCK_PARENTS)) anchor = anchor.parentElement.closest(BLOCK_PARENTS)!;
    anchor.after(img);
  }
  // <br> sobrantes al principio o al final de un bloque.
  for (const el of Array.from(document.querySelectorAll(BLOCK_PARENTS))) {
    while (el.lastChild?.nodeName === "BR") el.lastChild.remove();
    while (el.firstChild?.nodeName === "BR") el.firstChild.remove();
  }
  return document.body.innerHTML;
}

export function toPortableText(html: string): PortableBlock[] {
  const blocks = htmlToPortableText(prepare(html), {
    schema,
    keyGenerator: key,
    whitespaceMode: "normalize",
    parseHtml: (source) => new JSDOM(source).window.document,
    types: {
      image: ({ value }) =>
        value.src ? { _key: key(), _type: "accessibleImage", src: value.src, alt: value.alt ?? "" } : undefined,
    },
  }) as PortableBlock[];
  return blocks.filter((block) => block._type !== "block" || blockText(block).trim());
}

export function blockText(block: PortableBlock) {
  const children = (block.children ?? []) as { text?: string }[];
  return children.map((child) => child.text ?? "").join("");
}

export const isImage = (block: PortableBlock): block is PortableBlock & ImageMarker =>
  block._type === "accessibleImage" && typeof block.src === "string";
