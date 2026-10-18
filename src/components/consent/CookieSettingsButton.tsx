"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "./useConsent";

// «Gestion des cookies» en el pie: reabre el banner para cambiar la elección.
export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("Consent");
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      {t("manage")}
    </button>
  );
}
