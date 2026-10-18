import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Tone } from "./tone";

// Tamaños de los títulos de la referencia.
const sizes = {
  display: "text-[clamp(50px,7vw,104px)] leading-[0.98] tracking-[-0.015em] font-normal", // hero
  page: "text-[clamp(42px,5.4vw,78px)] leading-[1.02] tracking-[-0.01em] font-normal", // páginas internas
  contact: "text-[clamp(42px,5vw,72px)] leading-none font-normal",
  section: "text-[clamp(38px,4.2vw,62px)] leading-[1.04] font-normal",
  feature: "text-[clamp(32px,3.4vw,50px)] leading-[1.1] font-normal", // reconocimientos
  sub: "text-[clamp(30px,3vw,42px)] leading-[1.1] font-normal", // testimonios
  card: "text-[38px] leading-[1.08] font-medium", // BookingCard
};

const accentTones: Record<Tone, string> = {
  dark: "text-bronze-light",
  light: "text-bronze-text",
};

type Props = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof sizes;
  // Segunda línea en itálica, como en el hero.
  accent?: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Heading({
  children,
  as: Tag = "h2",
  size = "section",
  accent,
  tone = "dark",
  className,
}: Props) {
  return (
    <Tag className={cn("font-serif", sizes[size], className)}>
      {children}
      {accent && (
        <>
          <br />
          <em className={cn("italic", accentTones[tone])}>{accent}</em>
        </>
      )}
    </Tag>
  );
}
