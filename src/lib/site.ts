// Dirección pública del sitio, para enlaces absolutos (compartir en redes).
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.sbs.cr").replace(/\/$/, "");

// Imagen de marca por defecto al compartir en redes (1200 × 630), hecha con
// design/og-default.html.
export const DEFAULT_OG_IMAGE = "/og-default.png";
