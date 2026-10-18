/**
 * Fase 7: comprueba que cada dirección vieja del inventario llega en un solo
 * 301 a su dirección nueva (tal cual, con barra final y con /index.php
 * delante) y anota si la página de destino responde (200) o aún no está
 * publicada (404). Escribe migration/redirects-report.csv.
 *
 *   npm run migrate:check-redirects -- --base=http://localhost:3000
 *
 * Para una versión de Vercel protegida, la cookie de acceso va en CHECK_COOKIE.
 */
import { writeFileSync } from "node:fs";
import { INVENTORY_FILE } from "./pages";
import { oldPath, readCsv } from "./legacy";

const args = process.argv.slice(2);
const base = (args.find((arg) => arg.startsWith("--base="))?.slice(7) ?? "http://localhost:3000").replace(/\/$/, "");
const REPORT_FILE = "migration/redirects-report.csv";
const headers: Record<string, string> = process.env.CHECK_COOKIE ? { cookie: process.env.CHECK_COOKIE } : {};

type Result = {
  url: string;
  lang: string;
  variant: string;
  status: number;
  location: string;
  expected: string;
  ok: boolean;
  targetStatus: number;
};

async function head(path: string) {
  const response = await fetch(base + path, { redirect: "manual", headers });
  const location = response.headers.get("location");
  const resolved = location ? new URL(location, base + path) : null;
  return { status: response.status, location: resolved ? resolved.pathname + resolved.hash : "" };
}

// De 8 en 8 para no saturar el servidor.
async function inBatches<T, R>(items: T[], run: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += 8) results.push(...(await Promise.all(items.slice(i, i + 8).map(run))));
  return results;
}

async function main() {
  const rows = readCsv(INVENTORY_FILE);
  const targets = new Map<string, number>();
  const results = (
    await inBatches(rows, async (row) => {
      const path = oldPath(row.url_vieja);
      const expected = row.slug_nuevo;
      const moved = path !== expected.split("#")[0];
      const withSlash = path === "/" ? "/" : `${path}/`;
      const variants: [string, string][] = [
        ["tal cual", path],
        ["con barra final", withSlash],
        ["con /index.php", `/index.php${path === "/" ? "" : path}`],
      ];
      const targetPath = expected.split("#")[0];
      if (!targets.has(targetPath)) targets.set(targetPath, (await head(targetPath)).status);
      return Promise.all(
        variants.map(async ([variant, from]): Promise<Result> => {
          const { status, location } = await head(from);
          // La dirección que no cambia no redirige (salvo sus variantes).
          const ok =
            !moved && variant === "tal cual"
              ? status < 300 || status === 404
              : status === 301 && location === expected;
          return {
            url: base + from,
            lang: row.idioma,
            variant,
            status,
            location,
            expected: !moved && variant === "tal cual" ? "(sin redirección)" : expected,
            ok,
            targetStatus: targets.get(targetPath)!,
          };
        }),
      );
    })
  ).flat();

  const cell = (value: string | number | boolean) => {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const header = ["url_vieja", "idioma", "variante", "estado", "redirige_a", "esperado", "correcto", "estado_destino"];
  const lines = results.map((r) =>
    [r.url, r.lang, r.variant, r.status, r.location, r.expected, r.ok ? "sí" : "NO", r.targetStatus].map(cell).join(","),
  );
  writeFileSync(REPORT_FILE, `﻿${[header.join(","), ...lines].join("\n")}\n`);

  const failed = results.filter((r) => !r.ok);
  const live = [...targets.values()].filter((status) => status === 200).length;
  console.log(`${results.length} comprobaciones (${rows.length} direcciones × 3 variantes) contra ${base}`);
  console.log(`  Correctas: ${results.length - failed.length}. Fallan: ${failed.length}.`);
  console.log(`  Destinos: ${targets.size} (responden 200: ${live}; sin publicar o con error: ${targets.size - live})`);
  for (const r of failed.slice(0, 20)) console.log(`  ✗ ${r.url} → ${r.status} ${r.location} (esperado ${r.expected})`);
  console.log(`Reporte en ${REPORT_FILE}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
