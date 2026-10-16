// Datos públicos del proyecto Sanity (no son secretos). Se pueden cambiar
// con variables de entorno, p. ej. para probar con otro dataset.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "yxpe2eq3";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

export const studioUrl = "/studio";
