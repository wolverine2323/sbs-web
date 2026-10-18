"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonBase, buttonSizes } from "./button-styles";
import { useConsent } from "./consent/useConsent";
import { MapPinIcon } from "./icons";

// Mapa de Google: Google Maps pone cookies y hace la página más lenta, así que
// solo se carga si el visitante aceptó los mapas en el banner de cookies o lo
// pide con el botón (lo que queda guardado si ya había elegido).
export function MapEmbed({ src }: { src: string }) {
  const t = useTranslations("Contact");
  const { consent, choose } = useConsent();
  const [requested, setRequested] = useState(false);
  const shown = requested || !!consent?.maps;
  const show = () => {
    setRequested(true);
    if (consent) choose({ ...consent, maps: true });
  };

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
        onClick={show}
        className={`${buttonBase} ${buttonSizes.md} inline-flex border border-cream/40 text-cream hover:bg-cream hover:text-ink`}
      >
        {t("showMap")}
      </button>
      <p className="max-w-[360px] text-[13px] leading-[1.6] text-stone">{t("mapNotice")}</p>
    </div>
  );
}
