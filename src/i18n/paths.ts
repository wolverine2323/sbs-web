import { routing, type Locale, type Pathname } from "./routing";

// Página de cada «Página de sección» de Sanity.
export const sectionRoutes = {
  firm: "/le-cabinet",
  founders: "/le-cabinet/associes-fondateurs",
  associates: "/le-cabinet/avocats-collaborateurs",
  expertise: "/expertises",
  invest: "/investir-au-costa-rica",
  experiences: "/experiences",
  news: "/actualite",
  contact: "/contact",
} as const satisfies Record<string, Pathname>;

export const isLocale = (value: unknown): value is Locale =>
  routing.locales.includes(value as Locale);

// Dirección con idioma, sin depender de Next.js (la usa también el Studio):
// ("es", "/expertises/[slug]", { slug }) → "/es/areas-de-practica/derecho-corporativo".
// Con `asPattern`, los parámetros quedan como ":slug" (rutas de la vista previa).
export function localizedPath(
  locale: Locale,
  route: Pathname,
  params: Record<string, string> = {},
  asPattern = false,
) {
  const config = routing.pathnames[route];
  const template = typeof config === "string" ? config : config[locale];
  const path = template.replace(/\[(\w+)\]/g, (_, key: string) =>
    asPattern ? `:${key}` : encodeURIComponent(params[key] ?? ""),
  );
  return `/${locale}${path === "/" ? "" : path}`;
}
