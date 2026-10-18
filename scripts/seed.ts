/**
 * Carga en Sanity el contenido de la portada a partir del dict() de
 * design/nocturne-reference.html (textos FR/ES/EN), los textos de las
 * páginas de sección (Le Cabinet, índices, Contact) y el servicio
 * «Crédit & investissement» (scripts/content/lending.ts).
 *
 *   npm run seed              crea lo que falta; no toca lo que ya existe
 *   npm run seed -- --dry-run muestra qué haría, sin escribir nada
 *   npm run seed -- --force   sobrescribe los documentos (¡pierde cambios del Studio!)
 *
 * Necesita SANITY_API_WRITE_TOKEN (token «Editor»).
 */
import { readFileSync } from "node:fs";
import type { Patch, SanityClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";
import { apiVersion } from "../src/sanity/env";
import { languages } from "../src/sanity/languages";
import { slugify } from "../src/lib/slugify";
import { lending } from "./content/lending";

type Lang = (typeof languages)[number]["id"];
type Doc = { _id: string; _type: string; [key: string]: unknown };

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

// Datos de la firma que no están en el dict() (ver CLAUDE.md).
const PHONE = "(506) 4000 3322";
const EMAIL = "info@sbs.cr";
const BOOKING_URL = "https://calendar.app.google/oU4teZWLHRAWEcy67";
const DISTINCTIONS_LINE = "Chambers & Partners · LACCA";
const DISTINCTIONS = ["Chambers & Partners", "LACCA Approved"];

// «Crédit & investissement» es el quinto servicio (ids service-xx-5), así que
// los textos «Quatre pôles…» de la referencia pasan a «Cinq pôles…».
const LENDING = 5;
const FIVE: Record<Lang, [from: string, to: string]> = {
  fr: ["Quatre", "Cinq"],
  es: ["Cuatro", "Cinco"],
  en: ["Four", "Five"],
};
const servicesLead = (lang: Lang, lead: string) => lead.replace(...FIVE[lang]);
// Horario de atención (José Luis, 18/10/2026) y dirección por partes, para
// los datos estructurados.
const OPENING_HOURS = [
  {
    _key: "weekdays",
    _type: "openingHoursItem",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
];
const POSTAL_ADDRESS = {
  street: "Terra Campus Corporativo, Torre uno, segundo piso, No. 202",
  locality: "La Unión",
  region: "Cartago",
  country: "CR",
};
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Terra+Campus+Corporativo%2C+La+Uni%C3%B3n%2C+Costa+Rica";
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Terra+Campus+Corporativo%2C+La+Uni%C3%B3n%2C+Costa+Rica&output=embed";

// Textos de las páginas de sección que no están en la referencia.
// Provisionales: el contenido real llega con la migración (Fase 6).
const SECTION_TEXTS: Record<Lang, Record<"founders" | "associates" | "experiences" | "news", { title?: string; lead: string }>> = {
  fr: {
    founders: {
      title: "Les associés fondateurs",
      lead: "Les avocats et notaires qui ont fondé SBS Abogados et dirigent le cabinet.",
    },
    associates: {
      title: "Les avocats collaborateurs",
      lead: "L’équipe d’avocats qui accompagne nos clients au quotidien, en français, en espagnol et en anglais.",
    },
    experiences: { lead: "Ce que nos clients disent de leur expérience avec SBS Abogados." },
    news: {
      title: "Actualité juridique au Costa Rica",
      lead: "Analyses et nouvelles de nos avocats sur le droit, l’investissement et la vie des affaires au Costa Rica.",
    },
  },
  es: {
    founders: {
      title: "Los socios fundadores",
      lead: "Los abogados y notarios que fundaron SBS Abogados y dirigen la firma.",
    },
    associates: {
      title: "Los abogados colaboradores",
      lead: "El equipo de abogados que acompaña a nuestros clientes día a día, en francés, español e inglés.",
    },
    experiences: { lead: "Lo que nuestros clientes dicen de su experiencia con SBS Abogados." },
    news: {
      title: "Actualidad jurídica en Costa Rica",
      lead: "Análisis y novedades de nuestros abogados sobre el derecho, la inversión y los negocios en Costa Rica.",
    },
  },
  en: {
    founders: {
      title: "The founding partners",
      lead: "The attorneys and notaries who founded SBS Abogados and lead the firm.",
    },
    associates: {
      title: "Our associate attorneys",
      lead: "The team of attorneys who support our clients every day, in French, Spanish and English.",
    },
    experiences: { lead: "What our clients say about working with SBS Abogados." },
    news: {
      title: "Legal news from Costa Rica",
      lead: "Analysis and updates from our attorneys on law, investment and business in Costa Rica.",
    },
  },
};

// --- Leer el dict() de la referencia -----------------------------------------

// Campos del dict() que usa este script.
type Pair = [string, string];
type TextKey =
  | "heroEyebrow" | "heroTitle1" | "heroTitle2" | "heroLead" | "heroCta2" | "heroNote"
  | "recoLabel" | "countriesLine" | "distLabel" | "memberLabel" | "members"
  | "firmEyebrow" | "firmTitle" | "firmBody" | "firmMore" | "firmPhoto"
  | "servEyebrow" | "servTitle" | "servLead"
  | "investTitle" | "investLead" | "investCta"
  | "testiEyebrow" | "testiTitle"
  | "procEyebrow" | "procTitle"
  | "bookTag" | "bookTitle" | "bookBody" | "bookBtn" | "bookAlt"
  | "recoEyebrow" | "recoTitle" | "distTitle"
  | "contactTitle" | "contactBody" | "address" | "footerBody" | "rights";
type ReferenceTexts = Record<TextKey, string> & {
  nav: { firm: string; invest: string; news: string; contact: string };
  firmList: string[];
  investTopics: string[];
  services: Pair[];
  steps: Pair[];
  embassies: Pair[];
  testimonials: [quote: string, author: string, role: string][];
};

function readReferenceDict(): Record<Lang, ReferenceTexts> {
  const html = readFileSync("design/nocturne-reference.html", "utf8");
  const start = html.indexOf("return {", html.indexOf("dict() {"));
  const end = html.lastIndexOf("};", html.indexOf("renderVals()"));
  if (start < 0 || end < start) throw new Error("No encuentro dict() en la referencia");
  // Es un literal de objeto de nuestro propio archivo de diseño.
  return new Function(`return ${html.slice(start + "return ".length, end + 1)}`)();
}

// --- Construir los documentos -------------------------------------------------

const ids = {
  service: (lang: Lang, n: number) => `service-${lang}-${n}`,
  guide: (lang: Lang, n: number) => `investGuide-${lang}-${n}`,
  home: (lang: Lang) => `homePage-${lang}`,
  section: (section: string, lang: Lang) => `sectionPage-${section}-${lang}`,
};

const ref = (id: string, key?: string) => ({
  _type: "reference",
  _ref: id,
  ...(key && { _key: key }),
});

const keyed = <T extends object>(items: T[]) =>
  items.map((item, i) => ({ _key: `k${i + 1}`, ...item }));

const localized = (type: "localeString" | "localeText", pick: (lang: Lang) => string) => ({
  _type: type,
  ...Object.fromEntries(languages.map(({ id }) => [id, pick(id)])),
});

// Documento translation.metadata como lo crea @sanity/document-internationalization.
// Sin puntos en el _id: los ids con punto no son públicos.
function translations(id: string, schemaType: string, docId: (lang: Lang) => string): Doc {
  return {
    _id: id,
    _type: "translation.metadata",
    schemaTypes: [schemaType],
    translations: languages.map(({ id: lang }) => ({
      _key: lang,
      _type: "internationalizedArrayReferenceValue",
      language: lang,
      value: ref(docId(lang)),
    })),
  };
}

function buildDocuments(dict: Record<Lang, ReferenceTexts>): Doc[] {
  const docs: Doc[] = [];
  const t = (lang: Lang) => dict[lang];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    phone: PHONE,
    email: EMAIL,
    address: localized("localeText", (lang) => t(lang).address),
    bookingUrl: BOOKING_URL,
    mapsUrl: MAPS_URL,
    mapsEmbedUrl: MAPS_EMBED_URL,
    openingHours: OPENING_HOURS,
    postalAddress: POSTAL_ADDRESS,
    featuredService: ref(ids.service("fr", LENDING)),
    footerBody: localized("localeText", (lang) => t(lang).footerBody),
    footerRights: localized("localeString", (lang) => t(lang).rights),
  });

  // Servicios (4 por idioma) y temas de la guía (9 por idioma).
  const serviceCount = t("fr").services.length;
  const guideCount = t("fr").investTopics.length;
  for (const { id: lang } of languages) {
    t(lang).services.forEach(([title, summary], i) =>
      docs.push({
        _id: ids.service(lang, i + 1),
        _type: "service",
        language: lang,
        title,
        slug: { _type: "slug", current: slugify(title) },
        summary,
        order: i + 1,
      }),
    );
    t(lang).investTopics.forEach((title, i) =>
      docs.push({
        _id: ids.guide(lang, i + 1),
        _type: "investGuide",
        language: lang,
        title,
        slug: { _type: "slug", current: slugify(title) },
        order: i + 1,
      }),
    );
  }
  for (const { id: lang } of languages) docs.push(lendingService(lang));
  for (let n = 1; n <= serviceCount + 1; n++) {
    docs.push(translations(`translations-service-${n}`, "service", (lang) => ids.service(lang, n)));
  }
  for (let n = 1; n <= guideCount; n++) {
    docs.push(translations(`translations-investGuide-${n}`, "investGuide", (lang) => ids.guide(lang, n)));
  }

  // Testimonios: uno por persona, con la cita en los tres idiomas.
  t("fr").testimonials.forEach(([, author], i) =>
    docs.push({
      _id: `testimonial-${i + 1}`,
      _type: "testimonial",
      quote: localized("localeText", (lang) => t(lang).testimonials[i][0]),
      author,
      role: localized("localeString", (lang) => t(lang).testimonials[i][2]),
      order: i + 1,
      published: true,
    }),
  );

  // Portada, una por idioma.
  for (const { id: lang } of languages) {
    const d = t(lang);
    docs.push({
      _id: ids.home(lang),
      _type: "homePage",
      language: lang,
      hero: {
        eyebrow: d.heroEyebrow,
        title1: d.heroTitle1,
        title2: d.heroTitle2,
        lead: d.heroLead,
        callLabel: d.heroCta2,
        note: d.heroNote,
        recognitionLabel: d.recoLabel,
        countries: d.countriesLine,
        distinctionsLabel: d.distLabel,
        distinctions: DISTINCTIONS_LINE,
        membershipsLabel: d.memberLabel,
        memberships: d.members,
      },
      firm: {
        eyebrow: d.firmEyebrow,
        title: d.firmTitle,
        body: d.firmBody,
        highlights: d.firmList,
        moreLabel: d.firmMore,
        photoLabel: d.firmPhoto,
      },
      services: {
        eyebrow: d.servEyebrow,
        title: d.servTitle,
        lead: servicesLead(lang, d.servLead),
        items: Array.from({ length: serviceCount + 1 }, (_, i) =>
          ref(ids.service(lang, i + 1), `s${i + 1}`),
        ),
      },
      guide: {
        eyebrow: d.nav.invest,
        title: d.investTitle,
        lead: d.investLead,
        ctaLabel: d.investCta,
        topics: Array.from({ length: guideCount }, (_, i) => ref(ids.guide(lang, i + 1), `g${i + 1}`)),
      },
      testimonials: { eyebrow: d.testiEyebrow, title: d.testiTitle },
      steps: {
        eyebrow: d.procEyebrow,
        title: d.procTitle,
        items: keyed(
          d.steps.map(([title, description]) => ({ _type: "step", title, description })),
        ),
      },
      booking: {
        tag: d.bookTag,
        title: d.bookTitle,
        body: d.bookBody,
        buttonLabel: d.bookBtn,
        alternative: d.bookAlt,
      },
      recognition: {
        eyebrow: d.recoEyebrow,
        title: d.recoTitle,
        embassies: keyed(
          d.embassies.map(([name, caption]) => ({ _type: "seal", name, caption })),
        ),
        distinctions: keyed(
          DISTINCTIONS.map((name) => ({ _type: "seal", name, caption: d.distTitle })),
        ),
      },
      contact: { eyebrow: d.nav.contact, title: d.contactTitle, body: d.contactBody },
    });
  }
  docs.push(translations("translations-homePage", "homePage", ids.home));

  // Páginas de sección, una por sección e idioma.
  const sectionTexts = (lang: Lang) => {
    const d = t(lang);
    const extra = SECTION_TEXTS[lang];
    return {
      firm: { eyebrow: d.nav.firm, title: d.firmTitle, lead: `SBS Abogados ${d.firmBody}` },
      founders: { eyebrow: d.nav.firm, title: extra.founders.title, lead: extra.founders.lead },
      associates: { eyebrow: d.nav.firm, title: extra.associates.title, lead: extra.associates.lead },
      expertise: { eyebrow: d.servEyebrow, title: d.servTitle, lead: servicesLead(lang, d.servLead) },
      invest: {
        eyebrow: d.nav.invest,
        title: d.investTitle,
        lead: d.investLead,
        featuredService: ref(ids.service(lang, LENDING)),
      },
      experiences: { eyebrow: d.testiEyebrow, title: d.testiTitle, lead: extra.experiences.lead },
      news: { eyebrow: d.nav.news, title: extra.news.title, lead: extra.news.lead },
      contact: { eyebrow: d.nav.contact, title: d.contactTitle, lead: d.contactBody },
    };
  };
  for (const section of Object.keys(sectionTexts("fr"))) {
    for (const { id: lang } of languages) {
      docs.push({
        _id: ids.section(section, lang),
        _type: "sectionPage",
        language: lang,
        section,
        ...sectionTexts(lang)[section as keyof ReturnType<typeof sectionTexts>],
      });
    }
    docs.push(
      translations(`translations-sectionPage-${section}`, "sectionPage", (lang) =>
        ids.section(section, lang),
      ),
    );
  }

  return docs;
}

// Servicio «Crédit & investissement» en un idioma.
function lendingService(lang: Lang): Doc {
  const c = lending[lang];
  const items = (list: [string, string][], type: string) =>
    list.map(([title, description], i) => ({ _key: `${type}${i + 1}`, _type: type, title, description }));
  return {
    _id: ids.service(lang, LENDING),
    _type: "service",
    language: lang,
    title: c.title,
    shortTitle: c.shortTitle,
    slug: { _type: "slug", current: c.slug },
    summary: c.summary,
    audiences: c.audiences.map((audience, i) => ({
      _key: `audience${i + 1}`,
      _type: "audience",
      eyebrow: audience.eyebrow,
      title: audience.title,
      lead: audience.lead,
      facts: audience.facts.map(([value, label], j) => ({ _key: `fact${j + 1}`, _type: "fact", value, label })),
      steps: items(audience.steps, "step"),
      ctaLabel: audience.ctaLabel,
    })),
    helpPoints: items(c.helpPoints, "helpPoint"),
    faq: c.faq.map(([question, answer], i) => ({ _key: `faq${i + 1}`, _type: "faqItem", question, answer })),
    disclaimer: c.disclaimer,
    order: LENDING,
    seo: { _type: "seo", ...c.seo },
  };
}

// Campos añadidos después del primer seed: se rellenan en los documentos que
// ya existen solo si están vacíos (setIfMissing), sin tocar lo editado.
const newFields: { id: string; fields: Record<string, unknown> }[] = [
  {
    id: "siteSettings",
    fields: {
      mapsUrl: MAPS_URL,
      mapsEmbedUrl: MAPS_EMBED_URL,
      featuredService: ref(ids.service("fr", LENDING)),
      openingHours: OPENING_HOURS,
      postalAddress: POSTAL_ADDRESS,
    },
  },
  ...languages.map(({ id: lang }) => ({
    id: ids.section("invest", lang),
    fields: { featuredService: ref(ids.service(lang, LENDING)) },
  })),
];

type Edit = { id: string; label: string; apply: (patch: Patch) => Patch };

// Ediciones en documentos que ya existen, solo si siguen como los dejó el
// seed: el quinto servicio en la portada y «Cinq pôles» en lugar de «Quatre».
async function plannedEdits(client: SanityClient, dict: Record<Lang, ReferenceTexts>) {
  const current = await client.fetch<{
    homes: { _id: string; language: Lang; lead?: string; refs?: string[] }[];
    pages: { _id: string; language: Lang; lead?: string }[];
  }>(
    `{
      "homes": *[_id in $homeIds]{ _id, language, "lead": services.lead, "refs": services.items[]._ref },
      "pages": *[_id in $pageIds]{ _id, language, lead }
    }`,
    {
      homeIds: languages.map(({ id }) => ids.home(id)),
      pageIds: languages.map(({ id }) => ids.section("expertise", id)),
    },
  );
  const edits: Edit[] = [];
  for (const home of current.homes) {
    const serviceId = ids.service(home.language, LENDING);
    if (!home.refs?.includes(serviceId)) {
      edits.push({
        id: home._id,
        label: "portada: quinto servicio",
        apply: (patch) =>
          patch.setIfMissing({ "services.items": [] }).append("services.items", [ref(serviceId, `s${LENDING}`)]),
      });
    }
    if (home.lead === dict[home.language].servLead) {
      edits.push({
        id: home._id,
        label: "portada: cinco áreas",
        apply: (patch) => patch.set({ "services.lead": servicesLead(home.language, home.lead!) }),
      });
    }
  }
  for (const page of current.pages) {
    if (page.lead === dict[page.language].servLead) {
      edits.push({
        id: page._id,
        label: "Expertises: cinco áreas",
        apply: (patch) => patch.set({ lead: servicesLead(page.language, page.lead!) }),
      });
    }
  }
  return edits;
}

// --- Escribir en Sanity -------------------------------------------------------

async function main() {
  const dict = readReferenceDict();
  const docs = buildDocuments(dict);
  const count = (type: string) => docs.filter((doc) => doc._type === type).length;
  console.log(
    `Documentos preparados: ${docs.length} (` +
      ["siteSettings", "homePage", "sectionPage", "service", "investGuide", "testimonial", "translation.metadata"]
        .map((type) => `${type}: ${count(type)}`)
        .join(", ") +
      ")",
  );

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Falta SANITY_API_WRITE_TOKEN (token «Editor»)");
  const client = getCliClient({ apiVersion }).withConfig({ token, useCdn: false });

  const existing = new Set(
    await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((doc) => doc._id) }),
  );
  const toWrite = force ? docs : docs.filter((doc) => !existing.has(doc._id));
  const toPatch = force ? [] : newFields.filter(({ id }) => existing.has(id));
  const edits = force ? [] : await plannedEdits(client, dict);
  console.log(
    `Ya existen: ${existing.size}. ${force ? "Se sobrescriben todos (--force)" : "Se crean"}: ${toWrite.length}.` +
      (toPatch.length ? ` Campos nuevos (si están vacíos) en: ${toPatch.map(({ id }) => id).join(", ")}.` : "") +
      (edits.length ? ` Ediciones: ${edits.map(({ id, label }) => `${id} (${label})`).join(", ")}.` : ""),
  );
  if (!toWrite.length && !toPatch.length && !edits.length) return;

  // Una transacción: o se escribe todo, o nada (las referencias fuertes lo exigen).
  const transaction = client.transaction();
  for (const doc of toWrite) {
    if (force) transaction.createOrReplace(doc);
    else transaction.createIfNotExists(doc);
  }
  for (const { id, fields } of toPatch) {
    transaction.patch(id, (patch) => patch.setIfMissing(fields));
  }
  for (const { id, apply } of edits) {
    transaction.patch(id, apply);
  }
  const result = await transaction.commit({ dryRun, visibility: "sync" });
  console.log(dryRun ? `Prueba en seco correcta: ${result.results.length} documentos (no se guardó nada).` : `Guardados: ${result.results.length} documentos.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
