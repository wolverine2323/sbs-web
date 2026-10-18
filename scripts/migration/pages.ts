// Formato de migration/pages.json: lo que crawl.ts extrae de cada página del
// sitio Joomla, tal cual, sin decisiones sobre dónde va en Sanity.

export const PAGES_FILE = "migration/pages.json";
export const INVENTORY_FILE = "migration/inventory.csv";

export type Lang = "fr" | "es" | "en";

export type Block =
  // Texto: HTML limpio (p, h3, listas, enlaces, negritas…) y su texto plano.
  // repeated = en cuántas páginas del mismo idioma aparece (≥ 3: plantilla).
  | { kind: "html"; html: string; text: string; repeated?: number }
  | { kind: "image"; src: string; alt: string }
  | { kind: "person"; name: string; role: string; src: string }
  // Módulo incrustado (bloque común a varias páginas, p. ej. «Plus d'expériences…»).
  | { kind: "module"; text: string }
  | { kind: "link"; text: string; href: string };

export type OldPage = {
  url: string;
  lang: Lang;
  title: string;
  description: string;
  // Traducciones de la página según sus etiquetas hreflang.
  alternates: Partial<Record<Lang, string>>;
  // Fecha de creación aproximada (SP Page Builder) o de publicación (artículos).
  created?: string;
  date?: string;
  headline?: string;
  blocks: Block[];
};
