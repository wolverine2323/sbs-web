// Fondo sobre el que va un componente: "dark" = ink / ink-raised / burgundy-deep,
// "light" = paper.
export type Tone = "dark" | "light";

// Clases de texto y filetes de las secciones que existen en los dos fondos.
export const toneClasses = {
  dark: {
    section: "",
    heading: "text-cream",
    muted: "text-stone",
    rule: "border-bronze-light/25",
    accent: "text-bronze-light",
    link: "hover:text-bronze-light",
  },
  light: {
    section: "bg-paper text-on-paper",
    heading: "text-on-paper",
    muted: "text-on-paper-body",
    rule: "border-on-paper/14",
    accent: "text-bronze-text",
    link: "hover:text-burgundy focus-visible:outline-on-paper",
  },
} satisfies Record<Tone, Record<string, string>>;
