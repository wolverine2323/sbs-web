import Image from "next/image";
import type { ReactNode } from "react";
import { Heading } from "./Heading";
import { SectionEyebrow } from "./SectionEyebrow";

type Props = {
  breadcrumbs: ReactNode;
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  // Botones (cita, llamada) o datos del artículo bajo el título.
  children?: ReactNode;
};

// Cabecera de las páginas internas (sobre ink): la versión alineada a la
// izquierda del hero de la portada, con el mismo filete bronce vertical.
export function PageHero({ breadcrumbs, eyebrow, title, lead, children }: Props) {
  return (
    <section data-section="hero" className="relative overflow-hidden border-b border-bronze-light/16">
      {/* Monograma de fondo, decorativo */}
      <Image
        src="/monogram-temp.png"
        alt=""
        width={720}
        height={720}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-48 size-[720px] max-w-none -translate-y-1/2 object-contain opacity-[0.035] brightness-200 grayscale max-md:hidden"
      />
      <div className="relative mx-auto max-w-[1320px] px-7 pt-6 pb-20 md:pb-28">
        {breadcrumbs}
        <div className="mt-12 md:mt-20">
          {eyebrow && <SectionEyebrow variant="hero">{eyebrow}</SectionEyebrow>}
          <span
            aria-hidden="true"
            className="mt-6 block h-12 w-px bg-linear-to-b from-bronze-light to-bronze-light/0"
          />
          <Heading as="h1" size="page" className="mt-6 max-w-[980px] text-balance">
            {title}
          </Heading>
          {lead && (
            <p className="mt-8 max-w-[680px] text-lg leading-[1.7] text-stone">{lead}</p>
          )}
          {children && <div className="mt-10 flex flex-wrap items-center gap-3.5">{children}</div>}
        </div>
      </div>
    </section>
  );
}
