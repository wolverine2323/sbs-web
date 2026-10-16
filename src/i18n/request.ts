import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `locale` llega cuando se pasa explícitamente, p. ej. getTranslations({ locale }).
  // Si no, se toma del segmento [locale] de la URL.
  if (!locale) {
    const segment = await rootLocale();
    locale = hasLocale(routing.locales, segment)
      ? segment
      : routing.defaultLocale;
  }

  return {
    locale,
    timeZone: "America/Costa_Rica",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
