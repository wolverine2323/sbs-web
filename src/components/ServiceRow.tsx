import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "./icons";
import type { Tone } from "./tone";

type Props = {
  number: string;
  title: string;
  description: string;
  href: ComponentProps<typeof Link>["href"];
  tone?: Tone;
};

const tones = {
  dark: {
    row: "border-bronze-light/25 text-cream hover:bg-bronze-light/6",
    number: "text-bronze-light",
    description: "text-stone",
    arrow: "border-bronze-light/40 text-bronze-light",
  },
  light: {
    row: "border-on-paper/14 text-on-paper hover:bg-on-paper/4 focus-visible:outline-on-paper",
    number: "text-bronze-text",
    description: "text-on-paper-body",
    arrow: "border-on-paper/30 text-on-paper",
  },
} satisfies Record<Tone, Record<string, string>>;

// Fila de la lista de servicios. Va dentro de una lista con border-top
// (bronze-light/25 sobre ink, on-paper/14 sobre paper), como en la referencia.
export function ServiceRow({ number, title, description, href, tone = "dark" }: Props) {
  const c = tones[tone];
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-wrap items-center gap-x-10 gap-y-4 border-b px-3 py-10 transition-colors duration-250",
        c.row,
      )}
    >
      <span className={cn("w-12 font-serif text-xl italic", c.number)}>{number}</span>
      <span className="flex-[1_1_380px] font-serif text-[clamp(30px,3vw,42px)] leading-[1.1]">
        {title}
      </span>
      <span className={cn("flex-[1_1_340px] text-[15px] leading-[1.65]", c.description)}>
        {description}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-[52px] items-center justify-center border transition-transform duration-250 group-hover:translate-x-1.5",
          c.arrow,
        )}
      >
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
