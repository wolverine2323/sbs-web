/**
 * Sube los logos de reconocimientos (scripts/content/logos) a Sanity y los
 * pone en los sellos de Portada → Reconocimientos en los 3 idiomas. No cambia
 * un sello que ya tenga logo (elegido en el Studio o en una ejecución anterior).
 * Logos de embajadas autorizados por la firma (José Luis, 18/10/2026).
 *
 * Los archivos van en un solo color (#4A4540, el texto sobre paper), con fondo
 * transparente, y salen de:
 *   Canada    firma del Gobierno de Canadá (GC Design System, @cdssnc/gcds-components 0.47)
 *   Suisse    logo de la Confederación (swiss-styleguide 3.0, logo-CH.svg)
 *   France    bloque-marca «République française» del DSFR (@gouvfr/dsfr 1.15:
 *             Marianne, divisa y tipografía Marianne Bold)
 *   Chambers & Partners, LACCA Approved: vectorizados de sbs.cr/images/general
 *
 *   npm run logos              sube y asigna lo que falta
 *   npm run logos -- --replace también cambia los que ya tienen logo
 *   npm run logos -- --dry-run muestra qué haría, sin escribir nada
 *
 * Necesita SANITY_API_WRITE_TOKEN (token «Editor»).
 */
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { apiVersion } from "../src/sanity/env";

const dryRun = process.argv.includes("--dry-run");
const replace = process.argv.includes("--replace");
const DIR = "scripts/content/logos";

// Cada logo y cómo reconocer su sello por el nombre, en fr, es o en.
const LOGOS = [
  { file: "canada.svg", match: /canad/i },
  { file: "suisse.svg", match: /suis|suiz|switz/i },
  { file: "france.svg", match: /fran/i },
  { file: "chambers.svg", match: /chambers/i },
  { file: "lacca.svg", match: /lacca/i },
];
const FIELDS = ["embassies", "distinctions"] as const;

type Seal = { _key: string; name?: string; logo?: unknown };
type Home = { _id: string } & Partial<Record<(typeof FIELDS)[number], Seal[]>>;

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Falta SANITY_API_WRITE_TOKEN (token «Editor»)");
  const client = getCliClient({ apiVersion }).withConfig({ token, useCdn: false });

  // Publicadas y borradores.
  const homes = await client.fetch<Home[]>(
    `*[_type == "homePage"]{ _id, "embassies": recognition.embassies, "distinctions": recognition.distinctions }`,
    {},
    { perspective: "raw" },
  );

  // Sellos sin logo (o todos, con --replace) → archivo que les toca.
  const pending = homes.flatMap((home) =>
    FIELDS.flatMap((field) =>
      (home[field] ?? [])
        .filter((seal) => replace || !seal.logo)
        .map((seal) => ({ home, field, seal, logo: LOGOS.find((l) => l.match.test(seal.name ?? "")) }))
        .filter((item) => item.logo),
    ),
  );
  if (!pending.length) return console.log("Todos los sellos ya tienen logo: nada que hacer.");

  // Sanity no duplica un archivo idéntico: devuelve el que ya existe.
  const assets = new Map<string, string>();
  for (const file of new Set(pending.map((item) => item.logo!.file))) {
    if (dryRun) assets.set(file, `(${file})`);
    else {
      const asset = await client.assets.upload("image", readFileSync(`${DIR}/${file}`), { filename: file });
      assets.set(file, asset._id);
    }
  }

  const transaction = client.transaction();
  for (const { home, field, seal, logo } of pending) {
    transaction.patch(home._id, (patch) =>
      patch.set({
        [`recognition.${field}[_key=="${seal._key}"].logo`]: {
          _type: "image",
          asset: { _type: "reference", _ref: assets.get(logo!.file) },
        },
      }),
    );
    console.log(`${home._id}: ${seal.name} ← ${logo!.file}`);
  }
  if (!dryRun) await transaction.commit({ visibility: "sync" });
  console.log(`${dryRun ? "Prueba en seco: " : ""}${pending.length} sellos con logo${dryRun ? " (no se guardó nada)" : ""}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
