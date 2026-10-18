"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type Testimonial = { quote: string; name: string; role: string };

type Props = {
  items: Testimonial[];
  // Nombre accesible del carrusel (normalmente el título de la sección).
  label: string;
};

const navButtonClass =
  "inline-flex size-[52px] items-center justify-center rounded-full border border-bronze-light/45 text-cream transition-colors duration-200 hover:bg-cream hover:text-burgundy-deep";

// Carrusel de testimonios sin autoplay (sobre burgundy-deep).
export function TestimonialCarousel({ items, label }: Props) {
  const t = useTranslations("Testimonials");
  const [index, setIndex] = useState(0);
  const total = items.length;

  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  return (
    <div
      role="region"
      aria-roledescription={t("carousel")}
      aria-label={label}
      className="flex w-full flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        className="h-16 font-serif text-[140px] leading-[0.6] text-burgundy"
      >
        “
      </span>
      {/* Todos los testimonios ocupan la misma celda: la altura es la del más
          largo y los botones no saltan al cambiar. */}
      <div aria-live="polite" className="grid w-full">
        {items.map((item, i) => (
          // La diapositiva es un div con role="group" (no se permite en <figure>).
          <div
            key={item.name}
            role="group"
            aria-roledescription={t("slide")}
            aria-label={t("position", { current: i + 1, total })}
            className={cn("col-start-1 row-start-1", i !== index && "invisible")}
          >
            <figure className="flex flex-col items-center">
              <blockquote className="font-serif text-[clamp(26px,2.6vw,36px)] leading-[1.4] text-cream italic">
                {item.quote}
              </blockquote>
              <figcaption className="mt-9 flex flex-col gap-1.5">
                <span className="text-[13px] tracking-[0.24em] text-cream uppercase">
                  {item.name}
                </span>
                <span className="text-sm text-bronze-light">{item.role}</span>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
      {total > 1 && (
        <div className="mt-12 flex items-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("previous")}
            className={navButtonClass}
          >
            <ArrowLeftIcon />
          </button>
          <span
            aria-hidden="true"
            className="min-w-20 font-serif text-xl tracking-[0.12em] text-bronze-light"
          >
            {pad2(index + 1)} — {pad2(total)}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("next")}
            className={navButtonClass}
          >
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
