import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

// URL de una imagen de Sanity (respeta el recorte y el punto de interés).
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

// Ancho y alto originales, leídos del id del archivo:
// "image-abc123-1200x800-jpg" → { width: 1200, height: 800 }
export function imageDimensions(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}
