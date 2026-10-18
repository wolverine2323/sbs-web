/**
 * Fase 6 — paso 3: importa a Sanity el contenido del sitio viejo
 * (migration/pages.json) según scripts/migration/plan.ts. Convierte el HTML a
 * Portable Text y sube las imágenes. Todo queda como BORRADOR (drafts.*):
 * no se publica nada; se revisa y publica desde el Studio.
 *
 *   npm run migrate:import              crea los borradores que falten
 *   npm run migrate:import -- --dry-run muestra qué haría, sin subir ni escribir nada
 *   npm run migrate:import -- --force   rehace también los borradores que ya existen
 *                                       (¡pierde lo editado en ellos!)
 *   npm run migrate:import -- --only=teamMember   solo los documentos de ese tipo
 *
 * Los documentos que ya estaban publicados (Le Cabinet, servicios, temas de la
 * guía) reciben un borrador con su contenido actual más los campos vacíos que
 * trae el sitio viejo. Necesita SANITY_API_WRITE_TOKEN (token «Editor»).
 */
import type { SanityClient, SanityDocument } from "@sanity/client";
import { buildPlan, loadPages, type Draft } from "./plan";
import type { ImageMarker } from "./portable-text";
import { existingFrom, fetchPublished, migrationClient } from "./sanity";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const only = args.find((arg) => arg.startsWith("--only="))?.slice("--only=".length);

const SOURCE = "sbs.cr";

const isMarker = (value: unknown): value is ImageMarker =>
  !!value && typeof value === "object" && (value as ImageMarker)._type === "accessibleImage" && typeof (value as ImageMarker).src === "string";

// Todas las imágenes pendientes de subir dentro de un valor (campos y cuerpos).
function collectImages(value: unknown, found: Set<string>) {
  if (isMarker(value)) found.add(value.src);
  else if (Array.isArray(value)) value.forEach((item) => collectImages(item, found));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectImages(item, found));
  return found;
}

// Cambia cada marcador por la imagen subida: { _type, asset, alt }.
function withAssets(value: unknown, assets: Map<string, string>): unknown {
  if (isMarker(value)) {
    const { src, ...image } = value;
    const assetId = assets.get(src);
    return assetId ? { ...image, asset: { _type: "reference", _ref: assetId } } : image;
  }
  if (Array.isArray(value)) return value.map((item) => withAssets(item, assets));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withAssets(item, assets)]));
  }
  return value;
}

async function uploadImages(client: SanityClient, urls: string[]) {
  // Las ya subidas en una ejecución anterior se reconocen por su origen.
  const uploaded = await client.fetch<{ _id: string; url: string }[]>(
    `*[_type == "sanity.imageAsset" && source.name == $source]{ _id, "url": source.url }`,
    { source: SOURCE },
  );
  const assets = new Map(uploaded.map(({ url, _id }) => [url, _id]));
  const missing = urls.filter((url) => !assets.has(url));
  console.log(`Imágenes: ${urls.length} (ya en Sanity: ${urls.length - missing.length}, por subir: ${missing.length})`);
  const failed: string[] = [];
  for (const [i, url] of missing.entries()) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const path = new URL(url).pathname;
      const asset = await client.assets.upload("image", Buffer.from(await response.arrayBuffer()), {
        filename: decodeURIComponent(path.split("/").pop()!),
        source: { name: SOURCE, id: path, url },
      });
      assets.set(url, asset._id);
      process.stdout.write(`\r  subidas ${i + 1}/${missing.length}`);
    } catch (error) {
      failed.push(`${url} (${error instanceof Error ? error.message : error})`);
    }
  }
  if (missing.length) process.stdout.write("\n");
  if (failed.length) console.warn(`  No se pudieron subir (quedan sin imagen):\n  ${failed.join("\n  ")}`);
  return assets;
}

// Copia del documento publicado, sin los campos de sistema, para el borrador.
function publishedCopy(doc: SanityDocument) {
  const copy: Record<string, unknown> = { ...doc };
  for (const key of ["_rev", "_createdAt", "_updatedAt"]) delete copy[key];
  return copy;
}

function draftDocument(draft: Draft, published: Map<string, SanityDocument>, assets: Map<string, string>) {
  const fields = withAssets(draft.fields, assets) as Record<string, unknown>;
  const base = draft.base === "existing" ? publishedCopy(published.get(draft.id)!) : { _type: draft.type };
  return { ...base, ...fields, _id: `drafts.${draft.id}`, _type: draft.type };
}

async function main() {
  const client = migrationClient({ write: true });
  const published = await fetchPublished(client);
  const plan = buildPlan(loadPages(), existingFrom(published));

  // No se pisa lo que ya existe: borradores (salvo --force) ni documentos nuevos ya publicados.
  const ids = plan.drafts.flatMap(({ id }) => [id, `drafts.${id}`]);
  const present = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }, { perspective: "raw" }));
  const skipped: string[] = [];
  const todo = plan.drafts.filter(({ id, base, type }) => {
    if (only && type !== only) return false;
    const blocked = (present.has(`drafts.${id}`) && !force) || (base === "new" && present.has(id));
    if (blocked) skipped.push(id);
    return !blocked;
  });
  const count = (type: string) => todo.filter((draft) => draft.type === type).length;
  console.log(
    `Borradores preparados: ${todo.length} de ${plan.drafts.length} (` +
      ["sectionPage", "service", "investGuide", "teamMember", "post", "caseStudy", "page"]
        .map((type) => `${type}: ${count(type)}`)
        .join(", ") +
      ")",
  );
  if (skipped.length) console.log(`Ya existen, no se tocan${force ? " (publicados)" : " (usa --force para rehacer los borradores)"}: ${skipped.join(", ")}`);
  if (!todo.length) return;

  const urls = Array.from(collectImages(todo.map(({ fields }) => fields), new Set()));
  const assets = dryRun ? new Map<string, string>() : await uploadImages(client, urls);
  if (dryRun) console.log(`Imágenes: ${urls.length} (no se suben en la prueba en seco)`);

  // Una transacción: o se escribe todo, o nada.
  const transaction = client.transaction();
  for (const draft of todo) transaction.createOrReplace(draftDocument(draft, published, assets));
  for (const doc of plan.metadata) {
    if (!only || (doc.schemaTypes as string[]).includes(only)) {
      transaction.createIfNotExists(doc as { _id: string; _type: string });
    }
  }
  const result = await transaction.commit({ dryRun, visibility: "sync" });
  console.log(
    dryRun
      ? `Prueba en seco correcta: ${result.results.length} documentos (no se guardó nada).`
      : `Guardados ${result.results.length} documentos (borradores + traducciones). Revísalos y publícalos en el Studio.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
