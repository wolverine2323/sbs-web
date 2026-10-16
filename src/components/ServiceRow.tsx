import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "./icons";

type Props = {
  number: string;
  title: string;
  description: string;
  href: ComponentProps<typeof Link>["href"];
};

// Fila de la lista de servicios (sobre ink). Va dentro de una lista con
// border-top bronze-light/25, como en la referencia.
export function ServiceRow({ number, title, description, href }: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-wrap items-center gap-x-10 gap-y-4 border-b border-bronze-light/25 px-3 py-10 text-cream transition-colors duration-250 hover:bg-bronze-light/6"
    >
      <span className="w-12 font-serif text-xl text-bronze-light italic">
        {number}
      </span>
      <span className="flex-[1_1_380px] font-serif text-[clamp(30px,3vw,42px)] leading-[1.1]">
        {title}
      </span>
      <span className="flex-[1_1_340px] text-[15px] leading-[1.65] text-stone">
        {description}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex size-[52px] items-center justify-center border border-bronze-light/40 text-bronze-light transition-transform duration-250 group-hover:translate-x-1.5"
      >
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
