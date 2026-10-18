"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { getPathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { CONSENT_CATEGORIES, FULL_CONSENT, NO_CONSENT, type Consent } from "@/lib/consent";
import { CloseIcon } from "../icons";
import { useConsent } from "./useConsent";

type Href = Parameters<typeof getPathname>[0]["href"];

// Banner de cookies (RGPD y Ley 8968): aceptar, rechazar o elegir por
// categoría, con el mismo peso visual para aceptar y rechazar. Sale a todo
// visitante que aún no ha elegido; «Gestion des cookies» en el pie lo reabre.
export function CookieBanner({ privacyHref }: { privacyHref?: Href | null }) {
  const t = useTranslations("Consent");
  const { consent, choose, settingsOpen, closeSettings } = useConsent();
  const [customizing, setCustomizing] = useState(false);
  // Cambios sin guardar sobre lo que ya eligió (o sobre «nada aceptado»).
  const [edits, setEdits] = useState<Partial<Consent>>({});
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Al reabrirlo desde el pie, el foco va al banner.
  useEffect(() => {
    if (settingsOpen) titleRef.current?.focus();
  }, [settingsOpen]);

  if (consent === undefined || (consent && !settingsOpen)) return null;

  const current = { ...(consent ?? NO_CONSENT), ...edits };
  const showOptions = customizing || settingsOpen;
  const save = (next: Consent) => {
    setEdits({});
    setCustomizing(false);
    choose(next);
  };
  const close = () => {
    setEdits({});
    closeSettings();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && consent) close();
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      onKeyDown={onKeyDown}
      className="fixed inset-x-4 bottom-4 z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto border border-bronze-light/30 bg-ink-raised p-6 text-cream sm:right-auto sm:bottom-7 sm:left-7 sm:w-[min(440px,calc(100vw-56px))] sm:p-8"
    >
      {consent && (
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute top-2 right-2 inline-flex size-11 items-center justify-center text-stone transition-colors hover:text-cream"
        >
          <CloseIcon size={18} />
        </button>
      )}
      <h2
        id="cookie-banner-title"
        ref={titleRef}
        tabIndex={-1}
        className="pr-10 font-serif text-[26px] leading-[1.15] outline-none"
      >
        {t("title")}
      </h2>
      <p id="cookie-banner-text" className="mt-3 text-[14px] leading-[1.7] text-stone">
        {t("text")}{" "}
        {privacyHref && (
          <Link href={privacyHref} className="text-bronze-light underline underline-offset-4 hover:text-cream">
            {t("privacy")}
          </Link>
        )}
      </p>

      {showOptions && (
        <fieldset className="mt-6 border-t border-bronze-light/16">
          <legend className="sr-only">{t("categories")}</legend>
          <Category title={t("necessary")} text={t("necessaryText")}>
            <span className="text-[12px] tracking-[0.1em] text-bronze-light uppercase">{t("alwaysOn")}</span>
          </Category>
          {CONSENT_CATEGORIES.map((category) => (
            <Category key={category} title={t(category)} text={t(`${category}Text`)} htmlFor={`consent-${category}`}>
              <Switch
                id={`consent-${category}`}
                checked={current[category]}
                onChange={(checked) => setEdits({ ...edits, [category]: checked })}
              />
            </Category>
          ))}
        </fieldset>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {showOptions ? (
          <>
            <BannerButton onClick={() => save(current)}>{t("save")}</BannerButton>
            <BannerButton onClick={() => save(FULL_CONSENT)}>{t("accept")}</BannerButton>
          </>
        ) : (
          <>
            <BannerButton onClick={() => save(FULL_CONSENT)}>{t("accept")}</BannerButton>
            <BannerButton onClick={() => save(NO_CONSENT)}>{t("reject")}</BannerButton>
            <BannerButton onClick={() => setCustomizing(true)}>{t("customize")}</BannerButton>
          </>
        )}
      </div>
    </section>
  );
}

function Category({ title, text, htmlFor, children }: { title: string; text: string; htmlFor?: string; children: ReactNode }) {
  const Label = htmlFor ? "label" : "div";
  return (
    <Label
      htmlFor={htmlFor}
      className={cn(
        "flex min-h-11 items-center justify-between gap-6 border-b border-bronze-light/16 py-4",
        htmlFor && "cursor-pointer",
      )}
    >
      <span>
        <span className="block text-[15px] font-medium text-cream">{title}</span>
        <span className="mt-1 block text-[13px] leading-[1.6] text-stone">{text}</span>
      </span>
      {children}
    </Label>
  );
}

// Interruptor recto (sin esquinas redondeadas, como los botones): una casilla
// nativa invisible encima, para el teclado y los lectores de pantalla.
function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <span className="relative inline-flex shrink-0">
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className="h-6 w-11 border border-stone/60 transition-colors peer-checked:border-bronze-light peer-checked:bg-bronze-light/20 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze-light"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 left-1 size-4 bg-stone transition-transform peer-checked:translate-x-5 peer-checked:bg-bronze-light"
      />
    </span>
  );
}

// Aceptar, rechazar y configurar con el mismo estilo (ninguno destaca).
function BannerButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 flex-[1_1_auto] items-center justify-center border border-cream/40 px-5 text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap text-cream uppercase transition-colors duration-200 hover:bg-cream hover:text-ink"
    >
      {children}
    </button>
  );
}
