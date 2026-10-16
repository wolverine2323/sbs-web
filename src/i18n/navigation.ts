import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Versiones de Link, redirect, usePathname, etc. que conservan el idioma activo.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
