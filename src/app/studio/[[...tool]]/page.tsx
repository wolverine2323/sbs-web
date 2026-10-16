import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Sanity Studio en /studio. Solo entran los miembros del proyecto con su
// cuenta de Sanity; metadata incluye noindex.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
