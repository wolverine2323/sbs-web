import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Lo cacheado se renueva con Sanity Live y el webhook, no por tiempo.
  cacheLife: { default: sanity },
  partialPrefetching: true,
  // La barra final la quita src/proxy.ts, junto con las redirecciones del
  // sitio viejo: así cada dirección vieja llega a la nueva en un solo salto.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Lee la configuración de idiomas desde src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
