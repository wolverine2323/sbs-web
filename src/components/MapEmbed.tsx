"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonBase, buttonSizes } from "./button-styles";
import { MapPinIcon } from "./icons";

// Mapa de Google que solo se carga cuando el visitante lo pide: Google Maps
// pone cookies (consentimiento, Fase 8) y hace la página más lenta.
export function MapEmbed({ src }: { src: string }) {
  const t = useTranslations("Contact");
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <iframe
        src={src}
        title={t("map")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="aspect-[4/3] w-full border-0"
      />
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-6 bg-ink-raised p-8 text-center">
      <MapPinIcon size={44} strokeWidth={1} className="text-bronze-light" />
      <button
        type="button"
        onClick={() => setShown(true)}
        className={`${buttonBase} ${buttonSizes.md} inline-flex border border-cream/40 text-cream hover:bg-cream hover:text-ink`}
      >
        {t("showMap")}
      </button>
      <p className="max-w-[360px] text-[13px] leading-[1.6] text-stone">{t("mapNotice")}</p>
    </div>
  );
}
