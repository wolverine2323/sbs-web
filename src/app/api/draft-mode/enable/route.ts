import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

// La pestaña «Vista previa» del Studio llama aquí para activar el modo
// borrador; next-sanity comprueba que la petición viene de un usuario del Studio.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
