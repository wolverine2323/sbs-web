// Configuración de la CLI de Sanity (npx sanity …), p. ej. para generar tipos.
import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
});
