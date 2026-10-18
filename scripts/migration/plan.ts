// Fase 6 — qué se hace con cada página del sitio viejo: a qué documento de
// Sanity va, con qué campos y cuál es su dirección nueva. Lo usan
// inventory.ts (migration/inventory.csv) e import.ts (borradores en Sanity).
import { readFileSync } from "node:fs";
import { localizedPath, sectionRoutes } from "../../src/i18n/paths";
import type { Pathname } from "../../src/i18n/routing";
import { slugify } from "../../src/lib/slugify";
import { PAGES_FILE, type Block, type Lang, type OldPage } from "./pages";
import { blockText, isImage, toPortableText, type ImageMarker, type PortableBlock } from "./portable-text";

type Section = keyof typeof sectionRoutes;
type Paths = Partial<Record<Lang, string>>;

// Cada grupo reúne las versiones fr/es/en de una página (según sus hreflang,
// o a mano cuando Joomla no las enlazaba: Angel Edmundo y los artículos).
type Group =
  | { kind: "home"; paths: Paths }
  | { kind: "section"; section: Section; paths: Paths }
  | { kind: "service"; n: number; paths: Paths }
  | { kind: "guide"; n: number; paths: Paths }
  | { kind: "subtopic"; n: number; paths: Paths; title?: string }
  | { kind: "team"; n: number; founder: boolean; paths: Paths }
  | { kind: "news"; n: number; paths: Paths }
  | { kind: "experience"; n: number; paths: Paths }
  | { kind: "page"; key: string; paths: Paths };

// Primer número libre para los subtemas de la guía (los temas son 1…9).
const GUIDE_SUBTOPIC_FIRST = 10;
const PROPERTY_TOPIC = 2;

// Casos que en realidad son testimonios largos (su versión corta ya está en «Testimonios»).
const LONG_TESTIMONIALS: Record<number, string> = { 1: "François Tary", 3: "Catherinne Gallardo" };

// Nombre de la categoría de artículos para los casos de Expériences.
const EXPERIENCES_CATEGORY: Record<Lang, string> = { fr: "Expériences", es: "Experiencias", en: "Experiences" };

// Fotos que no se importan: logos de embajadas (CLAUDE.md: solo texto) y de
// reconocimientos (ya están como texto en la portada), y logos de empresas.
const SKIP_IMAGE = /\/images\/general\/(canada|suiza|francia|lacca|chambers)\.|\/images\/logos\//;

// Qué pasa con el contenido de las páginas de sección que no se importan.
const SECTION_NOTES: Partial<Record<Section, string>> = {
  founders: "Cada persona se importa como «Miembro del equipo»",
  associates: "Cada persona se importa como «Miembro del equipo»",
  expertise: "Índice: se arma con los servicios",
  experiences: "Índice: los casos se importan como artículos de la categoría «Expériences»; los testimonios ya están en Sanity",
  news: "Índice: se arma con los artículos",
  contact: "Dirección, teléfono y email ya están en Ajustes del sitio; el formulario no se migra (el botón lleva a la agenda)",
};

const p = (fr?: string, es?: string, en?: string): Paths => ({ fr, es, en });

export const GROUPS: Group[] = [
  { kind: "home", paths: p("/fr/", "/es/", "/en/") },
  { kind: "section", section: "firm", paths: p("/fr/le-cabinet", "/es/la-firma", "/en/our-firm") },
  {
    kind: "section",
    section: "founders",
    paths: p("/fr/le-cabinet/les-associes-fondateurs", "/es/la-firma/socios-fundadores", "/en/our-firm/founding-partners"),
  },
  {
    kind: "section",
    section: "associates",
    paths: p(
      "/fr/le-cabinet/les-avocats-collaborateurs",
      "/es/la-firma/asociados-y-abogados-colaboradores",
      "/en/our-firm/associates-lawyers",
    ),
  },
  { kind: "section", section: "expertise", paths: p("/fr/domaines-dexpertises", "/es/areas-de-servicio", "/en/service-areas") },
  { kind: "section", section: "experiences", paths: p("/fr/experiences", "/es/experiencias", "/en/experiences") },
  { kind: "section", section: "news", paths: p("/fr/actualite", "/es/actualidad", "/en/actuality") },
  { kind: "section", section: "contact", paths: p("/fr/contact", "/es/contacto", "/en/contact") },

  // Servicios: los mismos números que service-xx-n en Sanity.
  ...[
    p(
      "/fr/domaines-dexpertises/affaires-et-investissement-immobilier",
      "/es/areas-de-servicio/negocios-e-inversion-inmobiliaria",
      "/en/service-areas/business-real-estate-investment",
    ),
    p("/fr/domaines-dexpertises/droit-corporatif", "/es/areas-de-servicio/derecho-corporativo", "/en/service-areas/corporate-law"),
    p("/fr/domaines-dexpertises/droit-du-travail", "/es/areas-de-servicio/derecho-laboral", "/en/service-areas/labor-law"),
    p(
      "/fr/domaines-dexpertises/concurrence-et-telecommunications",
      "/es/areas-de-servicio/competencia-y-telecomunicaciones",
      "/en/service-areas/competition-telecommunications",
    ),
  ].map((paths, i): Group => ({ kind: "service", n: i + 1, paths })),

  // Guía del inversor: solo en francés en el sitio viejo. Temas = investGuide-fr-1…9.
  ...[
    "climat-dinvestissement",
    "propriete-et-droits-immobiliers",
    "commerce-entreprises-societes",
    "droit-du-travail",
    "migration",
    "centre-daffaires",
    "fiscalite",
    "concurrence-et-marches-regules",
    "accord-dassociation-ue-ac",
  ].map((slug, i): Group => ({ kind: "guide", n: i + 1, paths: p(`/fr/investir-au-costa-rica/${slug}`) })),

  // Subtemas de «Propriété et droits immobiliers» (nuevos: investGuide-fr-10…15).
  ...[
    { slug: "acquerir-la-propriete-immobiliere" },
    { slug: "louer-un-inmeuble", title: "Louer un immeuble" },
    { slug: "fiscalite-fonciere" },
    { slug: "fiscalite-fonciere-2" },
    { slug: "financement-de-projet-dinvestissement" },
    { slug: "successions" },
  ].map(({ slug, title }, i): Group => ({
    kind: "subtopic",
    n: GUIDE_SUBTOPIC_FIRST + i,
    title,
    paths: p(`/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/${slug}`),
  })),

  // Equipo, en el orden de la página «Le Cabinet»; los tres primeros son los socios fundadores.
  ...[
    p("/fr/angel-edmundo-solano-calderon", "/es/angel-edmundo-solano-calderon", "/en/angel-edmundo-solano-calderon"),
    p("/fr/kattia-bermudez-montenegro", "/es/kattia-bermudez-montenegro", "/en/kattia-bermudez-montenegro"),
    p("/fr/dr-david-solano-ortiz", "/es/david-solano-ortiz", "/en/phd-david-solano-ortiz"),
    p("/fr/lilliana-garcia-barrantes", "/es/lilliana-garcia-barrantes", "/en/lilliana-garcia-barrantes"),
    p("/fr/andrea-hernandez-bermudez", "/es/andrea-hernandez-bermudez", "/en/andrea-hernandez-bermudez"),
    p("/fr/maxime-bargain", "/es/maxime-bargain", "/en/maxime-bargain"),
    p("/fr/leticia-monge-castillo", "/es/leticia-monge-castillo", "/en/leticia-monge-castillo"),
  ].map((paths, i): Group => ({ kind: "team", n: i + 1, founder: i < 3, paths })),

  // Actualité.
  {
    kind: "news",
    n: 1,
    paths: p(
      "/fr/actualite/les-obligations-legales-pour-les-societes-locales-au-costa-rica",
      "/es/actualidad/obligaciones-legales-para-sociedades-en-costa-rica",
      "/en/actuality/general-obligations-of-a-corporation-in-costa-rica",
    ),
  },
  {
    kind: "news",
    n: 2,
    paths: p(
      "/fr/actualite/david-solano-participe-en-qualite-dexpert-dans-le-webinaire-zones-franches-et-dispositifs-medicaux-au-costa-rica",
      "/es/actualidad/david-solano-participa-como-experto-en-el-webinar-sobre-zonas-francas-y-dispositivos-medicos-en-costa-rica",
      "/en/actuality/david-solano-participates-as-an-expert-in-the-free-zones-and-medical-devices-webinar-in-costa-rica",
    ),
  },

  // Expériences: casos de la firma, en el orden de la página Expériences.
  ...[
    p(
      "/fr/note-dappreciation-a-legard-dinvestisseurs-francais",
      "/es/calificacion-para-inversores-franceses",
      "/en/experiences-rating-for-francophone-investors",
    ),
    p(
      "/fr/etude-de-la-regulation-de-la-concurrence-pour-loperateur-mobile",
      "/es/estudio-en-regulacion-de-la-competencia-para-operador-movil",
      "/en/experiences-study-on-competition-regulation-for-mobile-operator",
    ),
    p(
      "/fr/experiences-expatries-notre-experience-de-service",
      "/es/expatriados-nuestra-experiencia-de-servicio",
      "/en/experiences-expats-our-service-experiences",
    ),
    p(
      "/fr/experiences-role-protagoniste-lors-de-louverture-du-secteur-des-telecommunications",
      "/es/protagonismo-durante-la-apertura-del-sector-telecomunicaciones",
      "/en/experiences-leadership-during-the-opening-of-the-telecommunications-sector",
    ),
    p(
      "/fr/experiences-culmination-reussie-du-projet-condominium-capannori",
      "/es/culminacion-exitosa-del-proyecto-condominio-capannori",
      "/en/experiences-successful-completion-of-the-capannori-condominium-project",
    ),
    p(
      "/fr/experiences-projet-immobilier-montana-del-mar",
      "/es/proyecto-inmobiliario-montana-del-mar",
      "/en/experiences-real-estate-project-montana-del-mar",
    ),
    p(
      "/fr/experiences-telecommunications-litige-reussi",
      "/es/telecomunicaciones-litigio-exitoso",
      "/en/experiences-telecommunications-successful-litigation",
    ),
    p(
      "/fr/experiences-the-sanctuary-resort-and-condos",
      "/es/the-sanctuary-resort-and-condos",
      "/en/experiences-the-sanctuary-resort-and-condos",
    ),
    p(
      "/fr/experiences-corporatif-entreprise-en-zone-franche",
      "/es/corporativo-empresa-en-zona-franca",
      "/en/experiences-corporate-company-in-free-zone",
    ),
    p("/fr/experiences-hotel-royal-corin", "/es/hotel-royal-corin", "/en/experiences-hotel-royal-corin"),
    p(
      "/fr/experiences-secteur-financier-credit-et-recouvrement",
      "/es/sector-financiero-credito-y-cobro",
      "/en/experiences-financial-sector-credit-and-collection",
    ),
    p(
      "/fr/experiences-fintech-litige-reussi-dans-le-secteur-technologique",
      "/es/fintech-litigio-exitoso-en-sector-tecnologia",
      "/en/experiences-fintech-successful-arbitration-in-the-technology-sector",
    ),
    p(
      "/fr/experiences-affaires-dans-le-secteur-productif-des-caraibes",
      "/es/negocios-en-sector-productivo-del-caribe",
      "/en/experiences-business-in-the-productive-sector-of-the-caribbean",
    ),
  ].map((paths, i): Group => ({ kind: "experience", n: i + 1, paths })),

  {
    kind: "page",
    key: "company-formation",
    paths: p(
      "/fr/constitution-d-une-societe-a-responsabilite-limitee",
      "/es/creacion-de-sociedad-de-responsabilidad-limitada",
      "/en/creation-of-a-limited-liability-company",
    ),
  },
];


// --- Tipos del plan -------------------------------------------------------------

// Lo que hay hoy en Sanity (publicado) de los documentos que se completan.
export type Existing = Record<string, { slug?: string; [field: string]: unknown }>;

export type Draft = {
  id: string; // _id publicado; el borrador será drafts.<id>
  type: string;
  // "existing": se copia el documento publicado y se le añaden los campos
  // vacíos; "new": documento nuevo, solo como borrador.
  base: "existing" | "new";
  fields: Record<string, unknown>;
};

export type Row = {
  url: string;
  lang: Lang;
  tipo: string;
  title: string;
  newPath: string;
  document: string;
  action: string;
  images: string[];
  notes: string[];
};

export type Plan = { rows: Row[]; drafts: Draft[]; metadata: Record<string, unknown>[] };

// --- Ayudas -----------------------------------------------------------------------

export function loadPages(): OldPage[] {
  return JSON.parse(readFileSync(PAGES_FILE, "utf8"));
}

const ORIGIN = "https://www.sbs.cr";
const sitePath = (url: string) => url.replace(ORIGIN, "");
const isContent = (block: Block) => block.kind !== "html" || (block.repeated ?? 1) < 3;

const htmlOf = (blocks: Block[]) =>
  blocks
    .filter(isContent)
    .map((block) => {
      if (block.kind === "html") return block.html;
      if (block.kind === "image" && !SKIP_IMAGE.test(block.src)) return `<img src="${block.src}" alt="${escapeAttr(block.alt)}">`;
      return "";
    })
    .join("");

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const imagesOf = (page: OldPage) =>
  page.blocks.flatMap((block) => {
    if (block.kind === "image" || block.kind === "person") return block.src ? [block.src] : [];
    if (block.kind === "html") return Array.from(block.html.matchAll(/<img src="([^"]+)"/g), (m) => m[1]);
    return [];
  });

// «Droit Corporatif - SBS Abogados» → «Droit Corporatif»; vacío o genérico → texto por defecto.
export function cleanAlt(alt: string, fallback: string) {
  const text = alt
    .replace(/\s*[-–]\s*SBS( Abogados)?( Costa Rica)?\s*$/i, "")
    .replace(/^SBS Abogados\s*[-–]\s*/i, "")
    .trim();
  return !text || /^(image|sbs abogados)$/i.test(text) ? fallback : text;
}

const marker = (src: string, alt: string, fallback: string): ImageMarker => ({
  _type: "accessibleImage",
  src,
  alt: cleanAlt(alt, fallback),
});

// Primer párrafo con algo de texto, recortado a ~240 caracteres en una frase.
export function summarize(blocks: PortableBlock[], max = 240) {
  const first = blocks.find((block) => block._type === "block" && !block.listItem && block.style === "normal" && blockText(block).length > 60);
  const text = first ? blockText(first).replace(/\s+/g, " ").trim() : "";
  if (text.length <= max) return text || undefined;
  const cut = text.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  return sentence > max / 2 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

// Los casos no tienen fecha: se usa la de creación de la página en Joomla (la
// más antigua de sus traducciones), restando n minutos para que la lista
// nueva conserve el orden de la página Expériences.
function experienceDate(versions: OldPage[], n: number) {
  const created = versions.flatMap((version) => (version.created ? [Date.parse(version.created)] : []));
  return created.length ? new Date(Math.min(...created) - n * 60_000).toISOString() : undefined;
}

// slugify corta a 96 caracteres: en los títulos muy largos, sin dejar una palabra a medias.
function slugFor(title: string) {
  const slug = slugify(title);
  return slug.length < 96 ? slug : slug.slice(0, slug.lastIndexOf("-"));
}

// Las imágenes del cuerpo llevan como texto alternativo el título del documento si no tienen.
function bodyFrom(html: string, title: string) {
  return toPortableText(html).map((block) =>
    isImage(block) ? { ...block, alt: cleanAlt(block.alt, title) } : block,
  );
}

const weakRef = (id: string, type: string) => ({
  _type: "reference",
  _ref: id,
  _weak: true,
  _strengthenOnPublish: { type },
});

const strongRef = (id: string) => ({ _type: "reference", _ref: id });

function translations(id: string, type: string, ids: Partial<Record<Lang, string>>) {
  return {
    _id: id,
    _type: "translation.metadata",
    schemaTypes: [type],
    translations: Object.entries(ids).map(([lang, docId]) => ({
      _key: lang,
      _type: "internationalizedArrayReferenceValue",
      language: lang,
      value: weakRef(docId!, type),
    })),
  };
}

// «Me Kattia Bermúdez Montenegro» / «Licda. …» / «LLM. …» → «Kattia Bermúdez Montenegro».
const stripHonorific = (name: string) => name.replace(/^(Me|Lic\.|Licda\.|LLM\.)\s+/, "");

const LANGUAGE_WORDS: [RegExp, string][] = [
  [/fran[cç]/i, "fr"],
  [/espa[gñn]|spanish/i, "es"],
  [/angl|ingl|english/i, "en"],
  [/allem|alem|german/i, "de"],
  [/itali/i, "it"],
  [/portug/i, "pt"],
];
const LANGUAGE_LINE = /(langue|idioma|language)/i;
const EMAIL = /[\w.+-]+@sbs\.cr\b/;

// --- Construcción del plan -------------------------------------------------------

export function buildPlan(pages: OldPage[], existing: Existing): Plan {
  const byPath = new Map(pages.map((page) => [sitePath(page.url), page]));
  const rows: Row[] = [];
  const drafts: Draft[] = [];
  const metadata: Record<string, unknown>[] = [];
  const used = new Set<string>();

  const slugOf = (id: string) => {
    const slug = existing[id]?.slug;
    if (!slug) throw new Error(`Falta el documento publicado ${id} (o su slug) en Sanity`);
    return slug;
  };
  const isEmpty = (id: string, field: string) => {
    const value = existing[id]?.[field];
    return value === undefined || value === null || (Array.isArray(value) && !value.length) || value === "";
  };
  // Sobre un documento publicado solo se rellenan los campos vacíos.
  const fillEmpty = (id: string, fields: Record<string, unknown>, notes: string[]) => {
    const kept = Object.keys(fields).filter((field) => fields[field] !== undefined && !isEmpty(id, field));
    for (const field of kept) delete fields[field];
    if (kept.length) notes.push(`Ya tenía contenido, no se toca: ${kept.join(", ")}`);
    return fields;
  };

  for (const group of GROUPS) {
    const pagesOf = (Object.entries(group.paths) as [Lang, string | undefined][])
      .filter(([, path]) => path)
      .map(([lang, path]) => {
        const page = byPath.get(path!);
        if (!page) throw new Error(`No está en ${PAGES_FILE}: ${path}`);
        used.add(path!);
        return [lang, page] as const;
      });

    const translationIds: Partial<Record<Lang, string>> = {};

    for (const [lang, page] of pagesOf) {
      const notes: string[] = [];
      const images = imagesOf(page);
      const row = (tipo: string, title: string, newPath: string, document: string, action: string) =>
        rows.push({ url: page.url, lang, tipo, title, newPath, document, action, images, notes });
      const contentImages = page.blocks.filter(
        (block): block is Extract<Block, { kind: "image" }> => block.kind === "image" && !SKIP_IMAGE.test(block.src),
      );
      if (images.some((src) => /\/images\/general\/(canada|suiza|francia)\./.test(src))) {
        notes.push("Logos de embajadas no importados (CLAUDE.md: solo texto)");
      }

      switch (group.kind) {
        case "home": {
          notes.push("Portada rehecha con el diseño Nocturne (Fase 4): sus textos ya están en Sanity");
          row("portada", page.title, localizedPath(lang, "/"), `homePage-${lang}`, "sin cambios");
          break;
        }
        case "section": {
          const id = `sectionPage-${group.section}-${lang}`;
          const newPath = localizedPath(lang, sectionRoutes[group.section]);
          if (group.section !== "firm") {
            if (SECTION_NOTES[group.section]) notes.push(SECTION_NOTES[group.section]!);
            row("página de sección", page.title, newPath, id, "sin cambios");
            break;
          }
          // Le Cabinet: texto de la firma y política de servicio; la primera foto como imagen.
          const [main, ...rest] = contentImages;
          const title = String(existing[id]?.title ?? page.title);
          const body = bodyFrom(
            htmlOf(page.blocks.filter((block) => block.kind !== "person" && block !== main)),
            title,
          );
          notes.push("Fichas del equipo → «Miembro del equipo»; reconocimientos ya están como texto en la portada");
          if (rest.length) notes.push(`${rest.length} foto(s) dentro del texto`);
          drafts.push({
            id,
            type: "sectionPage",
            base: "existing",
            fields: fillEmpty(id, { image: main && marker(main.src, main.alt, title), body }, notes),
          });
          row("página de sección", page.title, newPath, id, "borrador (sobre el publicado)");
          break;
        }
        case "service": {
          // Introducción → Contenido; cada sección con título → «Comment nous vous aidons».
          const id = `service-${lang}-${group.n}`;
          const title = String(existing[id]?.title ?? page.title);
          const content = page.blocks.filter(isContent);
          const firstSection = content.findIndex((block) => block.kind === "html" && block.html.startsWith("<h3>"));
          const intro = content.slice(0, firstSection < 0 ? undefined : firstSection);
          const sections = firstSection < 0 ? [] : content.slice(firstSection);
          const [main, ...sectionImages] = contentImages;
          const helpPoints = sections.flatMap((block) => {
            if (block.kind !== "html") return [];
            const [heading, ...paragraphs] = toPortableText(block.html);
            return [
              {
                _key: `help${slugify(blockText(heading)).slice(0, 24)}`,
                _type: "helpPoint",
                title: blockText(heading).trim(),
                description: paragraphs.map(blockText).join("\n\n").trim() || undefined,
              },
            ];
          });
          if (sectionImages.length) {
            notes.push(
              `Fotos de cada sección no importadas (los puntos no llevan foto): ${sectionImages.map((image) => sitePath(image.src)).join(" ")}`,
            );
          }
          notes.push(`Introducción → Contenido; ${helpPoints.length} secciones → «Comment nous vous aidons»`);
          drafts.push({
            id,
            type: "service",
            base: "existing",
            fields: fillEmpty(
              id,
              {
                image: main && marker(main.src, main.alt, title),
                body: bodyFrom(htmlOf(intro.filter((block) => block.kind === "html")), title),
                helpPoints,
              },
              notes,
            ),
          });
          row("servicio", page.title, localizedPath(lang, "/expertises/[slug]", { slug: slugOf(id) }), id, "borrador (sobre el publicado)");
          break;
        }
        case "guide":
        case "subtopic": {
          const isTopic = group.kind === "guide";
          const id = `investGuide-${lang}-${group.n}`;
          const title = isTopic ? String(existing[id]?.title ?? page.title) : (group.title ?? page.title);
          const body = bodyFrom(htmlOf(page.blocks), title);
          const logos = images.filter((src) => src.includes("/images/logos/")).length;
          if (logos) notes.push(`${logos} logos de empresas extranjeras presentes en Costa Rica no importados (marcas de terceros)`);
          if (group.kind === "subtopic" && group.title) notes.push(`Título corregido: «${page.title}» → «${group.title}»`);
          notes.push("Solo existe en francés en el sitio viejo: ES y EN quedan por traducir");
          const topicSlug = slugOf(`investGuide-${lang}-${PROPERTY_TOPIC}`);
          if (isTopic) {
            drafts.push({
              id,
              type: "investGuide",
              base: "existing",
              fields: fillEmpty(id, { summary: summarize(body), body }, notes),
            });
            row("guía (tema)", page.title, localizedPath(lang, "/investir-au-costa-rica/[topic]", { topic: slugOf(id) }), id, "borrador (sobre el publicado)");
          } else {
            const slug = slugFor(title);
            drafts.push({
              id,
              type: "investGuide",
              base: "new",
              fields: {
                language: lang,
                title,
                slug: { _type: "slug", current: slug },
                summary: summarize(body),
                parent: strongRef(`investGuide-${lang}-${PROPERTY_TOPIC}`),
                order: group.n - GUIDE_SUBTOPIC_FIRST + 1,
                body,
              },
            });
            row(
              "guía (subtema)",
              title,
              localizedPath(lang, "/investir-au-costa-rica/[topic]/[subtopic]", { topic: topicSlug, subtopic: slug }),
              id,
              "borrador nuevo",
            );
          }
          break;
        }
        case "team": {
          const id = `teamMember-${lang}-${group.n}`;
          const person = page.blocks.find((block): block is Extract<Block, { kind: "person" }> => block.kind === "person");
          if (!person) throw new Error(`Sin ficha de persona: ${page.url}`);
          const name = stripHonorific(person.name);
          if (name !== person.name) notes.push(`Nombre sin el título «${person.name.slice(0, person.name.length - name.length).trim()}»`);
          // Idiomas: de la línea «Langues de travail / Idiomas / Work languages» de las tres versiones.
          const spoken = new Set<string>();
          for (const [, version] of pagesOf) {
            const line = version.blocks
              .flatMap((block) => (block.kind === "html" ? block.html.split("</p>") : []))
              .find((paragraph) => LANGUAGE_LINE.test(paragraph));
            for (const [pattern, code] of LANGUAGE_WORDS) if (line && pattern.test(line)) spoken.add(code);
          }
          // Biografía sin las líneas de idiomas y de email, que van en sus campos.
          const paragraphs = htmlOf(page.blocks.filter((block) => block.kind === "html")).split(/(?<=<\/p>)/);
          const email = paragraphs.join(" ").match(EMAIL)?.[0];
          const bioHtml = paragraphs
            .filter((paragraph) => !LANGUAGE_LINE.test(paragraph) && !EMAIL.test(paragraph))
            .join("");
          if (!group.founder) notes.push("La página de colaboradores muestra foto, cargo, idiomas y email; la biografía queda guardada");
          const photo = person.src ? marker(person.src, name, name) : undefined;
          drafts.push({
            id,
            type: "teamMember",
            base: "new",
            fields: {
              language: lang,
              name,
              role: person.role || undefined,
              email,
              kind: group.founder ? "founder" : "associate",
              photo,
              bio: bodyFrom(bioHtml, name),
              spokenLanguages: LANGUAGE_WORDS.map(([, code]) => code).filter((code) => spoken.has(code)),
              order: group.n,
            },
          });
          translationIds[lang] = id;
          const section: Pathname = group.founder ? sectionRoutes.founders : sectionRoutes.associates;
          row("miembro del equipo", name, `${localizedPath(lang, section)}#${slugify(name)}`, id, "borrador nuevo");
          break;
        }
        case "news":
        case "experience": {
          const isNews = group.kind === "news";
          const id = `post-${lang}-${isNews ? "news" : "exp"}-${group.n}`;
          const title = (page.headline || page.title).replace(/^(Expériences|Experiencias|Experiences)\s*:\s*/, "").trim();
          const [main] = contentImages;
          const body = bodyFrom(htmlOf(page.blocks.filter((block) => block !== main)), title);
          const slug = slugFor(title);
          const publishedAt = isNews ? page.date : experienceDate(pagesOf.map(([, version]) => version), group.n);
          if (!publishedAt) throw new Error(`Sin fecha: ${page.url}`);
          if (!isNews) notes.push("Fecha aproximada: creación de la página en Joomla");
          if (!isNews && LONG_TESTIMONIALS[group.n]) notes.push(`Testimonio largo de ${LONG_TESTIMONIALS[group.n]}: la versión corta ya está en «Testimonios»`);
          if (isNews && !Object.keys(page.alternates).length) notes.push("Traducciones emparejadas a mano (Joomla no las enlazaba)");
          drafts.push({
            id,
            type: "post",
            base: "new",
            fields: {
              language: lang,
              title,
              slug: { _type: "slug", current: slug },
              publishedAt,
              excerpt: (isNews && page.description) || summarize(body),
              image: main && marker(main.src, main.alt, title),
              category: isNews ? undefined : weakRef(`category-${lang}-experiences`, "category"),
              body,
            },
          });
          translationIds[lang] = id;
          row(isNews ? "artículo" : "experiencia (caso)", title, localizedPath(lang, "/actualite/[slug]", { slug }), id, "borrador nuevo");
          break;
        }
        case "page": {
          const id = `page-${lang}-${group.key}`;
          const title = page.title;
          const slug = slugFor(title);
          notes.push("En Joomla llevaba un formulario: no se migra (el botón de la página lleva a la agenda)");
          drafts.push({
            id,
            type: "page",
            base: "new",
            fields: {
              language: lang,
              title,
              slug: { _type: "slug", current: slug },
              body: bodyFrom(htmlOf(page.blocks), title),
            },
          });
          translationIds[lang] = id;
          row("página general", title, localizedPath(lang, "/[slug]", { slug }), id, "borrador nuevo");
          break;
        }
      }
    }

    // Traducciones enlazadas de los documentos nuevos.
    const meta =
      group.kind === "team" ? ["teamMember", `teamMember-${group.n}`]
      : group.kind === "news" ? ["post", `post-news-${group.n}`]
      : group.kind === "experience" ? ["post", `post-exp-${group.n}`]
      : group.kind === "page" ? ["page", `page-${group.key}`]
      : undefined;
    if (meta && Object.keys(translationIds).length > 1) {
      metadata.push(translations(`translations-${meta[1]}`, meta[0], translationIds));
    }
  }

  // Categoría «Expériences» para los casos.
  const categoryIds: Partial<Record<Lang, string>> = {};
  for (const lang of ["fr", "es", "en"] as const) {
    const id = `category-${lang}-experiences`;
    drafts.push({
      id,
      type: "category",
      base: "new",
      fields: {
        language: lang,
        title: EXPERIENCES_CATEGORY[lang],
        slug: { _type: "slug", current: slugify(EXPERIENCES_CATEGORY[lang]) },
      },
    });
    categoryIds[lang] = id;
  }
  metadata.push(translations("translations-category-experiences", "category", categoryIds));

  // Ninguna página sin destino, y ningún slug repetido.
  const missing = pages.filter((page) => !used.has(sitePath(page.url)));
  if (missing.length) throw new Error(`Páginas sin destino en GROUPS:\n${missing.map((page) => page.url).join("\n")}`);
  const slugs = new Set<string>();
  for (const draft of drafts) {
    const slug = (draft.fields.slug as { current?: string } | undefined)?.current;
    if (!slug) continue;
    const key = `${draft.type}|${draft.fields.language}|${slug}`;
    if (slugs.has(key)) throw new Error(`Slug repetido: ${key}`);
    slugs.add(key);
  }
  return { rows, drafts, metadata };
}
