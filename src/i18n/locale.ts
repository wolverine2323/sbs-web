import { hasLocale } from "next-intl";
import { locale as rootLocale } from "next/root-params";
import { routing, type Locale } from "./routing";

// Idioma de la URL (/fr, /es, /en). El proxy garantiza que es válido; si no,
// el francés.
export async function currentLocale(): Promise<Locale> {
  const segment = await rootLocale();
  return hasLocale(routing.locales, segment) ? segment : routing.defaultLocale;
}
