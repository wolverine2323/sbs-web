import { useTranslations } from "next-intl";
import { telHref } from "@/lib/contact";
import { ButtonOutline } from "./ButtonOutline";
import { ButtonPrimary } from "./ButtonPrimary";

// Botones de la cabecera de las páginas internas: cita y llamada.
export function HeroActions({ bookingUrl, phone }: { bookingUrl: string; phone: string }) {
  const t = useTranslations("Common");
  return (
    <>
      <ButtonPrimary href={bookingUrl} withArrow track="book_click">
        {t("cta")}
      </ButtonPrimary>
      <ButtonOutline href={telHref(phone)} track="phone_click">
        {t("call")}
      </ButtonOutline>
    </>
  );
}
