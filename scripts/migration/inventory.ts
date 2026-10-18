/**
 * Fase 6 — paso 2: escribe migration/inventory.csv a partir de
 * migration/pages.json: cada URL vieja con su idioma, tipo, título, dirección
 * nueva (slug_nuevo), documento de Sanity, qué hace la importación, sus
 * imágenes y notas. La Fase 7 lo usa para las redirecciones 301.
 *
 *   npm run migrate:inventory
 *
 * Solo lee de Sanity (los slugs actuales de servicios y guía).
 */
import { writeFileSync } from "node:fs";
import { INVENTORY_FILE } from "./pages";
import { buildPlan, loadPages } from "./plan";
import { existingFrom, fetchPublished, migrationClient } from "./sanity";

const HEADER = ["url_vieja", "idioma", "tipo", "título", "slug_nuevo", "documento_sanity", "accion", "imagenes", "notas"];

const cell = (value: string) => (/[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

async function main() {
  const client = migrationClient({ write: false });
  const plan = buildPlan(loadPages(), existingFrom(await fetchPublished(client)));
  const lines = plan.rows.map((row) =>
    [
      row.url,
      row.lang,
      row.tipo,
      row.title,
      row.newPath,
      row.document,
      row.action,
      row.images.map((src) => src.replace("https://www.sbs.cr", "")).join(" "),
      row.notes.join(". "),
    ]
      .map(cell)
      .join(","),
  );
  // Con BOM para que Excel abra bien las tildes.
  writeFileSync(INVENTORY_FILE, `﻿${[HEADER.join(","), ...lines].join("\n")}\n`);

  const count = (key: "tipo" | "action") =>
    Object.entries(Object.groupBy(plan.rows, (row) => row[key]))
      .map(([value, rows]) => `${value}: ${rows!.length}`)
      .join(", ");
  console.log(`${plan.rows.length} páginas en ${INVENTORY_FILE}`);
  console.log(`  Por tipo: ${count("tipo")}`);
  console.log(`  Por acción: ${count("action")}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
