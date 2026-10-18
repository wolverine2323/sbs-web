import "server-only";

import { cachedSanity } from "./live";
import { SITE_SETTINGS_QUERY } from "./queries";

// Ajustes del sitio. Se usan en enlaces (cita, teléfono, mapa): siempre lo
// publicado y sin marcas de edición, también en la vista previa.
export async function getSiteSettings(language: string) {
  const { data } = await cachedSanity({
    query: SITE_SETTINGS_QUERY,
    params: { language },
    tags: ["siteSettings"],
    perspective: "published",
    stega: false,
  });
  return data;
}
