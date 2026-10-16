import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Tone } from "./tone";

const variants = {
  hero: "text-xs tracking-[0.36em]",
  section: "text-xs tracking-[0.32em]",
  // Etiquetas de tarjetas y listas (BookingCard, ContactList).
  small: "text-[11px] tracking-[0.3em]",
};

// Bronce sobre fondo oscuro; burgundy sobre paper, como en la referencia.
const tones: Record<Tone, string> = {
  dark: "text-bronze-light",
  light: "text-burgundy",
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  variant?: keyof typeof variants;
  className?: string;
};

export function SectionEyebrow({
  children,
  tone = "dark",
  variant = "section",
  className,
}: Props) {
  return (
    <p className={cn("uppercase", variants[variant], tones[tone], className)}>
      {children}
    </p>
  );
}
