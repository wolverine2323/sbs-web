import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import legacyRedirects from "./i18n/legacy-redirects.json";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

// Direcciones del sitio Joomla → las nuevas (npm run migrate:redirects).
const legacy: Record<string, string> = legacyRedirects;

const permanent = (request: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, request.url), 301);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Sin barra final ni el /index.php de Joomla delante.
  const path = pathname.replace(/^\/index\.php(?=\/|$)/, "").replace(/\/+$/, "") || "/";

  // Una dirección vieja va en un solo salto a la nueva (sin sus parámetros).
  const target = legacy[path];
  if (target) return permanent(request, target);
  if (path !== pathname) return permanent(request, path + search);

  return handleLocale(request);
}

export const config = {
  // Todo excepto rutas internas (_next, _vercel, api), el Studio y archivos
  // con extensión; más las direcciones viejas con /index.php.
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)", "/index.php", "/index.php/:path*"],
};
