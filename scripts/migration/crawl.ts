/**
 * Fase 6 — paso 1: recorre el sitio Joomla actual (https://www.sbs.cr) en
 * fr, es y en, partiendo del sitemap y de los menús y siguiendo los enlaces
 * internos. De cada página guarda el título, los bloques de contenido (HTML
 * limpio, imágenes, fichas de persona), las imágenes y sus traducciones.
 *
 *   npm run migrate:crawl     escribe migration/pages.json
 *
 * No escribe nada en Sanity. Después: npm run migrate:inventory.
 */
import { writeFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";
import { PAGES_FILE, type Block, type OldPage } from "./pages";

const ORIGIN = "https://www.sbs.cr";
const LANGS = ["fr", "es", "en"] as const;

// Etiquetas que se conservan al limpiar el HTML (el resto se desenvuelve).
const ALLOWED = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "strong", "b", "em", "i",
  "br", "blockquote", "img", "table", "thead", "tbody", "tr", "td", "th",
]);
const DROP = "script, style, noscript, iframe, button, form, input, select, textarea";
const SKIP_PATH = /\.(pdf|jpe?g|png|gif|webp|svg|docx?|xlsx?|zip|mp4)$|\/(images|media|templates|components|plugins)\//i;

// Sin avisos de jsdom sobre el CSS de la plantilla (no se usa).
const virtualConsole = new VirtualConsole();
const parse = (html: string, url: string) => new JSDOM(html, { url, virtualConsole }).window.document;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const squash = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

// Solo páginas del sitio en /fr, /es o /en, sin parámetros ni anclas.
function normalize(href: string, base: string): string | null {
  let url: URL;
  try {
    url = new URL(href, base);
  } catch {
    return null;
  }
  if (!["www.sbs.cr", "sbs.cr"].includes(url.hostname) || url.search) return null;
  if (!/^\/(fr|es|en)(\/|$)/.test(url.pathname) || SKIP_PATH.test(url.pathname)) return null;
  const path = url.pathname.replace(/\/+$/, "");
  return ORIGIN + (/^\/(fr|es|en)$/.test(path) ? `${path}/` : path);
}

// Las imágenes con carga diferida tienen la dirección real en data-src, a
// veces con un sufijo «#joomlaImage://…».
function imageSrc(img: Element, base: string) {
  const raw = img.getAttribute("src")?.startsWith("data:")
    ? img.getAttribute("data-src")
    : img.getAttribute("src") ?? img.getAttribute("data-src");
  return raw ? new URL(raw.split("#")[0], base).href : "";
}

// En la guía, los subtítulos son párrafos con letra grande en línea
// (<p><span style="font-size: 18pt">…</span></p>): pasan a ser títulos de
// verdad (18pt → h3 y 14pt → h4, como el resto de títulos del sitio viejo).
const HEADING_SIZES: Record<string, string> = { "18pt": "h3", "14pt": "h4" };

function promoteHeadings(root: Element) {
  for (const p of Array.from(root.querySelectorAll("p"))) {
    const text = squash(p.textContent);
    if (!text || text.length > 140) continue;
    const span = Array.from(p.querySelectorAll<HTMLElement>("span[style*=font-size]")).find(
      (el) => squash(el.textContent) === text,
    );
    const size = span?.style.fontSize.replace(/\s/g, "");
    const tag = size && HEADING_SIZES[size];
    if (!tag) continue;
    const heading = p.ownerDocument.createElement(tag);
    heading.append(...Array.from(p.childNodes));
    p.replaceWith(heading);
  }
}

// HTML mínimo: etiquetas semánticas, sin clases, estilos ni spans.
function cleanHtml(node: Element, base: string) {
  const root = node.cloneNode(true) as Element;
  root.querySelectorAll(DROP).forEach((el) => el.remove());
  promoteHeadings(root);
  for (const el of Array.from(root.querySelectorAll("*")).reverse()) {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED.has(tag)) {
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }
    const keep: Record<string, string> = {};
    if (tag === "a" && el.getAttribute("href")) keep.href = new URL(el.getAttribute("href")!, base).href;
    if (tag === "img") {
      keep.src = imageSrc(el, base);
      keep.alt = el.getAttribute("alt") ?? "";
    }
    for (const { name } of Array.from(el.attributes)) el.removeAttribute(name);
    for (const [name, value] of Object.entries(keep)) el.setAttribute(name, value);
  }
  return root.innerHTML
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/<(p|h\d|li)>\s*(&nbsp;| )?\s*<\/\1>/g, "")
    .trim();
}

// SP Page Builder numera sus secciones con la hora de creación (ms): la más
// antigua sirve de fecha aproximada para las páginas sin fecha propia.
function createdAt(html: string) {
  const stamps = Array.from(html.matchAll(/section-id-(1\d{12})\b/g), (m) => Number(m[1]));
  return stamps.length ? new Date(Math.min(...stamps)).toISOString() : undefined;
}

function pageBuilderBlocks(root: Element, base: string): Block[] {
  const blocks: Block[] = [];
  for (const addon of Array.from(root.querySelectorAll(".sppb-addon"))) {
    // Los módulos incrustados (p. ej. «Plus d'expériences…») son plantilla.
    if (addon.parentElement?.closest(".sppb-addon-module")) continue;
    const cls = addon.classList;
    if (cls.contains("sppb-addon-module")) {
      blocks.push({ kind: "module", text: squash(addon.textContent).slice(0, 200) });
    } else if (cls.contains("sppb-addon-single-image")) {
      const img = addon.querySelector("img");
      const src = img ? imageSrc(img, base) : "";
      if (src) blocks.push({ kind: "image", src, alt: squash(img!.getAttribute("alt")) });
    } else if (cls.contains("sppb-addon-person")) {
      const img = addon.querySelector("img");
      blocks.push({
        kind: "person",
        name: squash(addon.querySelector(".sppb-person-name")?.textContent),
        role: squash(addon.querySelector(".sppb-person-designation")?.textContent),
        src: img ? imageSrc(img, base) : "",
      });
    } else if (cls.contains("sppb-addon-text-block")) {
      const content = addon.querySelector(".sppb-addon-content") ?? addon;
      const title = squash(addon.querySelector(".sppb-addon-title")?.textContent);
      const text = squash(content.textContent);
      if (!text && !content.querySelector("img")) continue;
      const html = (title ? `<h3>${title}</h3>` : "") + cleanHtml(content, base);
      blocks.push({ kind: "html", html, text: squash(`${title} ${text}`) });
    }
  }
  return blocks;
}

function extract(url: string, html: string, document: Document): OldPage {
  const lang = url.slice(ORIGIN.length + 1, ORIGIN.length + 3) as OldPage["lang"];
  const alternates: OldPage["alternates"] = {};
  for (const link of Array.from(document.querySelectorAll("link[rel=alternate][hreflang]"))) {
    const code = link.getAttribute("hreflang")!.slice(0, 2) as OldPage["lang"];
    const href = normalize(link.getAttribute("href") ?? "", url);
    if (LANGS.includes(code) && href) alternates[code] = href;
  }
  const page: OldPage = {
    url,
    lang,
    title: squash(document.title).replace(/^SBS Abogados - /, ""),
    description: squash(document.querySelector("meta[name=description]")?.getAttribute("content")),
    alternates,
    created: createdAt(html),
    blocks: [],
  };
  const builder = document.querySelector("#sp-page-builder");
  if (builder) {
    page.blocks = pageBuilderBlocks(builder, url);
    return page;
  }
  // Artículos de Joomla (Actualité): título, fecha, imagen y cuerpo.
  const article = document.querySelector("article.item-page");
  if (article) {
    page.headline = squash(article.querySelector("[itemprop=headline]")?.textContent);
    page.date = article.querySelector("time[datetime]")?.getAttribute("datetime") ?? undefined;
    const img = article.querySelector(".entry-image img, .article-full-image img");
    if (img) page.blocks.push({ kind: "image", src: imageSrc(img, url), alt: squash(img.getAttribute("alt")) });
    const body = article.querySelector("[itemprop=articleBody]");
    if (body) page.blocks.push({ kind: "html", html: cleanHtml(body, url), text: squash(body.textContent) });
    return page;
  }
  // Listado de artículos: solo los enlaces.
  for (const link of Array.from(document.querySelectorAll("#sp-component [itemprop=blogPost] h2 a"))) {
    page.blocks.push({ kind: "link", text: squash(link.textContent), href: new URL(link.getAttribute("href")!, url).href });
  }
  return page;
}

// Bloques que se repiten en muchas páginas del mismo idioma = plantilla.
function markRepeated(pages: OldPage[]) {
  const count = new Map<string, number>();
  const key = (page: OldPage, text: string) => `${page.lang}|${text}`;
  for (const page of pages) {
    for (const block of page.blocks) {
      if (block.kind === "html") count.set(key(page, block.text), (count.get(key(page, block.text)) ?? 0) + 1);
    }
  }
  for (const page of pages) {
    for (const block of page.blocks) {
      if (block.kind === "html") block.repeated = count.get(key(page, block.text));
    }
  }
}

async function fetchText(url: string) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return { html: await response.text(), final: normalize(response.url, url) ?? url };
}

async function main() {
  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  const queue = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => normalize(m[1], ORIGIN))
    .filter((url): url is string => !!url);
  console.log(`Sitemap: ${queue.length} direcciones`);
  const seen = new Set<string>();
  const pages: OldPage[] = [];
  while (queue.length) {
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    seen.add(url);
    const { html, final } = await fetchText(url);
    if (final !== url) console.warn(`  ${url} → ${final}`);
    const document = parse(html, url);
    const page = extract(url, html, document);
    pages.push(page);
    // Menús, pie, enlaces del contenido y traducciones.
    for (const link of Array.from(document.querySelectorAll("a[href]"))) {
      const next = normalize(link.getAttribute("href")!, url);
      if (next && !seen.has(next)) queue.push(next);
    }
    queue.push(...Object.values(page.alternates).filter((alt) => !seen.has(alt)));
    process.stdout.write(".");
    await sleep(300);
  }
  markRepeated(pages);
  writeFileSync(PAGES_FILE, `${JSON.stringify(pages, null, 1)}\n`);
  console.log(`\n${pages.length} páginas guardadas en ${PAGES_FILE}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
