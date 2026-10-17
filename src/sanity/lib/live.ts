import "server-only";

import { cacheLife } from "next/cache";
import { cookies, draftMode } from "next/headers";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from "next-sanity/live";
import { client } from "./client";

// Token Viewer: permite al servidor leer borradores en la vista previa del Studio.
const token = process.env.SANITY_API_READ_TOKEN || false;

// sanityFetch guarda cada consulta en la caché de Next.js; <SanityLive /> la
// renueva en cuanto se publica un cambio (y el webhook /api/revalidate cubre
// el caso en que nadie tiene el sitio abierto).
// browserToken: false → el token nunca llega al navegador. Dentro de la
// pestaña «Vista previa» del Studio los borradores se actualizan igual.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: false,
  strict: true,
});

// Único límite 'use cache' para las consultas a Sanity. Además de Sanity Live
// y el webhook, la caché se renueva como mucho cada 60 s, para que lo que se
// publique sin nadie en el sitio también aparezca (gana el plazo más corto
// frente al de un año que fija sanityFetch).
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 60, expire: 31_536_000 });
  return sanityFetch(options);
};

export type DynamicFetchOptions = {
  perspective: LivePerspective;
  variant?: string;
  stega: boolean;
};

// Opciones de la vista previa; se resuelven fuera de 'use cache'.
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return { perspective: "published", stega: false };

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  const variant = await resolveVariantFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", variant, stega: true };
}
