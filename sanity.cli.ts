// Configuración de la CLI de Sanity (npx sanity …), p. ej. para generar tipos.
import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // npm run typegen escribe los tipos de las consultas en src/sanity/types.ts.
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "./src/sanity/types.ts",
  },
});
