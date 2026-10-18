/**
 * Fase 7: genera src/i18n/legacy-redirects.json a partir de
 * migration/inventory.csv: cada dirección vieja de Joomla que cambia → su
 * dirección nueva. src/proxy.ts responde con un 301 directo (con o sin barra
 * final y con /index.php delante).
 *
 *   npm run migrate:redirects
 *
 * Volver a ejecutarlo si cambia el inventario (npm run migrate:inventory).
 */
import { writeFileSync } from "node:fs";
import { legacyRedirects, REDIRECTS_FILE } from "./legacy";

const redirects = legacyRedirects();
const sorted = Object.fromEntries(Object.entries(redirects).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(REDIRECTS_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${Object.keys(sorted).length} redirecciones en ${REDIRECTS_FILE}`);
