import { stegaClean } from "next-sanity";

// Datos estructurados para Google. Sin marcas de edición de la vista previa,
// y con «<» escapado para que el texto no pueda cerrar la etiqueta.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(stegaClean(data)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
