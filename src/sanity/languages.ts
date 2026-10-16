// Idiomas de los documentos traducibles; deben coincidir con src/i18n/routing.ts.
export const languages = [
  { id: "fr", title: "Français" },
  { id: "es", title: "Español" },
  { id: "en", title: "English" },
] as const;

export function languageTitle(id?: string) {
  return languages.find((language) => language.id === id)?.title ?? id ?? "";
}
