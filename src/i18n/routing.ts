import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "es", "en"],
  defaultLocale: "fr",
  // Todas las rutas llevan prefijo: /fr, /es, /en.
  localePrefix: "always",
  // La raíz / siempre redirige a /fr, sin mirar el idioma del navegador.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
