import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// robots.txt: todo el sitio salvo el Studio, la API y el catálogo de
// componentes. Las versiones de prueba de Vercel no se indexan.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/*/_kit"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
