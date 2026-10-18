// Direcciones viejas de Joomla → nuevas, leídas de migration/inventory.csv.
// Lo usan redirects.ts (genera la tabla del proxy) y check-redirects.ts.
import { readFileSync } from "node:fs";
import { INVENTORY_FILE } from "./pages";

export const REDIRECTS_FILE = "src/i18n/legacy-redirects.json";

// CSV sencillo: comas, comillas dobles y "" dentro de las comillas.
export function readCsv(file: string) {
  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (cell || row.length) rows.push([...row, cell]);
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((name, i) => [name, values[i] ?? ""])));
}

// "https://www.sbs.cr/fr/le-cabinet/" → "/fr/le-cabinet"
export const oldPath = (url: string) => new URL(url).pathname.replace(/\/+$/, "") || "/";

export function legacyRedirects() {
  const redirects: Record<string, string> = {};
  for (const row of readCsv(INVENTORY_FILE)) {
    const from = oldPath(row.url_vieja);
    const to = row.slug_nuevo;
    if (!to.startsWith("/")) throw new Error(`Dirección nueva no válida para ${row.url_vieja}: «${to}»`);
    if (from !== to.split("#")[0]) redirects[from] = to;
  }
  return redirects;
}
