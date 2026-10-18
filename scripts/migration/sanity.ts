// Cliente de Sanity para la migración y lectura de los documentos publicados
// que la importación completa (Le Cabinet, servicios y temas de la guía).
import type { SanityClient, SanityDocument } from "@sanity/client";
import { getCliClient } from "sanity/cli";
import { apiVersion } from "../../src/sanity/env";
import { GROUPS, type Existing } from "./plan";

export function migrationClient({ write }: { write: boolean }) {
  const token = write
    ? process.env.SANITY_API_WRITE_TOKEN
    : (process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN);
  if (!token) {
    throw new Error(write ? "Falta SANITY_API_WRITE_TOKEN (token «Editor»)" : "Falta SANITY_API_READ_TOKEN");
  }
  return getCliClient({ apiVersion }).withConfig({ token, useCdn: false, perspective: "published" });
}

// _id de los documentos publicados que el plan necesita.
function existingIds() {
  return GROUPS.flatMap((group) => {
    const langs = Object.keys(group.paths);
    switch (group.kind) {
      case "section":
        return group.section === "firm" ? langs.map((lang) => `sectionPage-firm-${lang}`) : [];
      case "service":
        return langs.map((lang) => `service-${lang}-${group.n}`);
      case "guide":
        return langs.map((lang) => `investGuide-${lang}-${group.n}`);
      default:
        return [];
    }
  });
}

export async function fetchPublished(client: SanityClient) {
  const docs = await client.fetch<SanityDocument[]>(`*[_id in $ids]`, { ids: existingIds() });
  return new Map(docs.map((doc) => [doc._id, doc]));
}

// Lo que el plan necesita saber de cada documento publicado: el slug como texto y sus campos.
export function existingFrom(published: Map<string, SanityDocument>): Existing {
  return Object.fromEntries(
    Array.from(published, ([id, doc]) => [id, { ...doc, slug: (doc.slug as { current?: string } | undefined)?.current }]),
  );
}
