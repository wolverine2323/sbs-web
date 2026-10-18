import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing, type Locale, type Pathname } from "./routing";

// "/expertises/[slug]" coincide con "/expertises/droit-corporatif".
function matches(template: string, path: string) {
  const pattern = template
    .split("/")
    .map((segment) =>
      segment.startsWith("[") ? "[^/]+" : segment.replace(/[.*+?^${}()|\\]/g, "\\$&"),
    )
    .join("/");
  return new RegExp(`^${pattern}$`).test(path);
}

// Primero las rutas con menos segmentos dinámicos: "/contact" antes que "/[slug]".
const dynamicSegments = (route: string) => route.split("[").length - 1;
const routes = (Object.keys(routing.pathnames) as Pathname[]).sort(
  (a, b) => dynamicSegments(a) - dynamicSegments(b),
);

// Ruta interna de la página actual, p. ej. "/le-cabinet" en /es/la-firma.
// Acepta la dirección traducida (la del navegador) y la interna (la que ve
// el servidor al prerenderizar), para que ambos generen los mismos enlaces.
export function useRoute(): Pathname | null {
  const locale = useLocale() as Locale;
  const path = usePathname().replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  return (
    routes.find((route) => {
      const config = routing.pathnames[route];
      const localized = typeof config === "string" ? config : config[locale];
      return matches(localized, path) || matches(route, path);
    }) ?? null
  );
}
