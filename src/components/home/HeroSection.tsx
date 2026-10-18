import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { telHref } from "@/lib/contact";
import { ButtonOutline } from "../ButtonOutline";
import { ButtonPrimary } from "../ButtonPrimary";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import type { Contact, HomeContent } from "./types";

type Props = {
  hero: NonNullable<HomeContent["hero"]>;
  contact: Contact;
};

function StatCell({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 border-bronze-light/16 px-7 py-9 not-last:border-b md:not-last:border-r md:not-last:border-b-0">
      {label && <SectionEyebrow variant="small">{label}</SectionEyebrow>}
      {children}
    </div>
  );
}

export function HeroSection({ hero, contact }: Props) {
  const t = useTranslations("Common");

  return (
    <section data-section="hero" className="relative overflow-hidden border-b border-bronze-light/16">
      {/* Monograma de fondo, decorativo */}
      <Image
        src="/monogram-temp.png"
        alt=""
        width={900}
        height={900}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[900px] max-w-none -translate-1/2 object-contain opacity-[0.035] brightness-200 grayscale"
      />
      <div className="relative mx-auto flex max-w-[1080px] flex-col items-center px-7 pt-[136px] pb-28 text-center">
        {hero.eyebrow && <SectionEyebrow variant="hero">{hero.eyebrow}</SectionEyebrow>}
        <span
          aria-hidden="true"
          className="mt-7 mb-8 h-14 w-px bg-linear-to-b from-bronze-light to-bronze-light/0"
        />
        <Heading as="h1" size="display" accent={hero.title2}>
          {hero.title1}
        </Heading>
        {hero.lead && (
          <p className="mt-10 max-w-[640px] text-lg leading-[1.7] text-stone">{hero.lead}</p>
        )}
        <div className="mt-12 flex flex-wrap justify-center gap-3.5">
          <ButtonPrimary href={contact.bookingUrl} withArrow track="book_click">
            {t("cta")}
          </ButtonPrimary>
          {hero.callLabel && (
            <ButtonOutline href={telHref(contact.phone)} track="phone_click">
              {hero.callLabel}
            </ButtonOutline>
          )}
        </div>
        {hero.note && <p className="mt-[22px] text-[13px] text-stone-dim">{hero.note}</p>}
      </div>

      <div className="relative border-t border-bronze-light/16">
        <div className="mx-auto grid max-w-[1320px] md:grid-cols-3">
          <StatCell label={hero.recognitionLabel}>
            <p className="font-serif text-[26px] italic">{hero.countries}</p>
          </StatCell>
          <StatCell label={hero.distinctionsLabel}>
            <p className="font-serif text-[26px]">{hero.distinctions}</p>
          </StatCell>
          <StatCell label={hero.membershipsLabel}>
            <p className="text-[14.5px] leading-[1.55] text-stone">{hero.memberships}</p>
          </StatCell>
        </div>
      </div>
    </section>
  );
}
