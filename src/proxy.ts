import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Todo excepto rutas internas (_next, _vercel, api), el Studio y archivos
  // con extensión.
  matcher: "/((?!api|studio|_next|_vercel|.*\\..*).*)",
};
