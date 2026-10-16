import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

// Cliente de lectura: contenido publicado desde la CDN de Sanity.
// En vista previa, stega añade marcas invisibles para hacer clic y editar.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl },
});
