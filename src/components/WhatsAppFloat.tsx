import { useTranslations } from "next-intl";
import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "./icons";

// Botón flotante de WhatsApp. El número viene de siteSettings.whatsapp;
// sin número no se muestra.
export function WhatsAppFloat({ number }: { number?: string }) {
  const t = useTranslations("WhatsApp");
  if (!number) return null;

  return (
    <a
      href={whatsappHref(number, t("message"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      data-track="whatsapp_click"
      data-section="floating-button"
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center bg-burgundy text-white transition-colors duration-200 hover:bg-burgundy-hover sm:right-7 sm:bottom-7"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
