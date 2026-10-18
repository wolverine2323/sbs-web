/**
 * Fase 8: crea la política de privacidad (scripts/content/privacy.ts) como
 * BORRADOR de «Página general» en fr, es y en, con sus traducciones
 * enlazadas, y la elige en Ajustes del sitio → Política de privacidad. El
 * enlace del pie y del banner de cookies aparece cuando se publica.
 *
 *   npm run privacy              crea lo que falta (no toca un borrador ya editado)
 *   npm run privacy -- --dry-run muestra qué haría, sin escribir nada
 *
 * Necesita SANITY_API_WRITE_TOKEN (token «Editor»).
 */
import { getCliClient } from "sanity/cli";
import { apiVersion } from "../src/sanity/env";
import { privacy, type PrivacyText } from "./content/privacy";

const dryRun = process.argv.includes("--dry-run");
type Lang = keyof typeof privacy;
const LANGS = Object.keys(privacy) as Lang[];
const id = (lang: Lang) => `page-${lang}-privacy`;

// Texto → Portable Text: párrafos, títulos h2 y listas con viñetas.
function body(text: PrivacyText) {
  let n = 0;
  const key = () => `p${(n++).toString(36)}`;
  const block = (value: string, extra: Record<string, unknown> = {}) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text: value, marks: [] }],
    ...extra,
  });
  return [
    ...text.intro.map((paragraph) => block(paragraph)),
    ...text.sections.flatMap((section) => [
      block(section.heading, { style: "h2" }),
      ...(section.paragraphs ?? []).map((paragraph) => block(paragraph)),
      ...(section.bullets ?? []).map((item) => block(item, { listItem: "bullet", level: 1 })),
      ...(section.after ?? []).map((paragraph) => block(paragraph)),
    ]),
  ];
}

const weakRef = (ref: string, type: string) => ({
  _type: "reference",
  _ref: ref,
  _weak: true,
  _strengthenOnPublish: { type },
});

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Falta SANITY_API_WRITE_TOKEN (token «Editor»)");
  const client = getCliClient({ apiVersion }).withConfig({ token, useCdn: false });

  const ids = LANGS.flatMap((lang) => [id(lang), `drafts.${id(lang)}`]);
  const present = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }, { perspective: "raw" }));
  const transaction = client.transaction();
  const created: string[] = [];
  for (const lang of LANGS) {
    if (present.has(id(lang)) || present.has(`drafts.${id(lang)}`)) continue;
    const text = privacy[lang];
    transaction.create({
      _id: `drafts.${id(lang)}`,
      _type: "page",
      language: lang,
      title: text.title,
      slug: { _type: "slug", current: text.slug },
      body: body(text),
    });
    created.push(id(lang));
  }
  transaction.createIfNotExists({
    _id: "translations-page-privacy",
    _type: "translation.metadata",
    schemaTypes: ["page"],
    translations: LANGS.map((lang) => ({
      _key: lang,
      _type: "internationalizedArrayReferenceValue",
      language: lang,
      value: weakRef(id(lang), "page"),
    })),
  });
  transaction.patch("siteSettings", (patch) =>
    patch.setIfMissing({ privacyPage: { _type: "reference", _ref: id("fr"), _weak: true } }),
  );
  const result = await transaction.commit({ dryRun, visibility: "sync" });
  console.log(
    `${dryRun ? "Prueba en seco: " : ""}borradores nuevos: ${created.join(", ") || "ninguno (ya existían)"}; ` +
      `${result.results.length} operaciones${dryRun ? " (no se guardó nada)" : ""}.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
