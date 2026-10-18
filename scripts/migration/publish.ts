/**
 * Fase 9: publica los borradores de la migración, como «Publicar» en el
 * Studio: el contenido del borrador pasa a la versión publicada (la crea o la
 * reemplaza) y el borrador desaparece. Todo en una sola transacción, así las
 * referencias entre documentos nuevos (subtemas de la guía) son válidas.
 * La política de privacidad sigue en borrador hasta que la firma la apruebe.
 *
 *   npm run migrate:publish              publica
 *   npm run migrate:publish -- --dry-run muestra qué publicaría, sin escribir nada
 *
 * Necesita SANITY_API_WRITE_TOKEN (token «Editor»).
 */
import type { SanityDocument } from "@sanity/client";
import { migrationClient } from "./sanity";

const dryRun = process.argv.includes("--dry-run");
// Se quedan en borrador: la política de privacidad (scripts/privacy-policy.ts).
const KEEP_DRAFT = /^page-[a-z]{2}-privacy$/;

async function main() {
  const client = migrationClient({ write: true });
  const drafts = await client.fetch<SanityDocument[]>(
    `*[_id in path("drafts.**")] | order(_type asc, _id asc)`,
    {},
    { perspective: "raw" },
  );
  const toPublish = drafts.filter((draft) => !KEEP_DRAFT.test(draft._id.replace(/^drafts\./, "")));

  // Las referencias «débiles hasta publicar» las resuelve el Studio; si
  // aparece alguna, mejor publicar ese documento desde allí.
  const weak = toPublish.filter((draft) => JSON.stringify(draft).includes("_strengthenOnPublish"));
  if (weak.length) {
    throw new Error(`Publícalos desde el Studio (tienen referencias débiles): ${weak.map((d) => d._id).join(", ")}`);
  }

  const transaction = client.transaction();
  const counts = new Map<string, number>();
  for (const draft of toPublish) {
    const { _rev, _updatedAt, ...content } = draft;
    void _rev;
    void _updatedAt;
    transaction.createOrReplace({ ...content, _id: draft._id.replace(/^drafts\./, "") });
    transaction.delete(draft._id);
    counts.set(draft._type, (counts.get(draft._type) ?? 0) + 1);
  }
  if (!dryRun && toPublish.length) await transaction.commit({ visibility: "sync" });

  const summary = [...counts].map(([type, n]) => `${type} ${n}`).join(", ");
  console.log(
    `${dryRun ? "Prueba en seco: publicaría" : "Publicados"} ${toPublish.length} documentos (${summary || "ninguno"}); ` +
      `siguen en borrador ${drafts.length - toPublish.length}.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
