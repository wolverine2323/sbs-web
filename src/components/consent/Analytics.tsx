"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import type { TrackEvent } from "@/lib/track";
import { useConsent } from "./useConsent";

// Google Analytics 4 y Google Ads, cargados solo después del consentimiento
// (Consent Mode v2: todo denegado por defecto). Cada clic en un enlace con
// data-track envía su evento con el idioma y la sección de la página.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Props = { gaId?: string | null; adsId?: string | null; adsConversionLabel?: string | null };

// Cookies de GA4 por 13 meses como máximo (recomendación de la CNIL).
const GA_COOKIE_EXPIRES = 13 * 30 * 24 * 60 * 60;

function loadGtag(id: string) {
  if (window.gtag) return window.gtag;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js espera el objeto arguments tal cual.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  return window.gtag;
}

// Zona de la página donde se pulsó: data-section, la cabecera, el pie o el id
// de la sección ("booking", "contact"…).
function sectionOf(element: Element) {
  const marked = element.closest<HTMLElement>("[data-section]");
  if (marked) return marked.dataset.section;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return element.closest("section[id]")?.id || "page";
}

export function Analytics({ gaId, adsId, adsConversionLabel }: Props) {
  const { consent } = useConsent();
  const locale = useLocale();
  const configured = useRef({ ga: false, ads: false });

  // Carga y permisos según lo que el visitante aceptó (y si lo retira después).
  useEffect(() => {
    if (!consent) return;
    const analytics = consent.analytics && !!gaId;
    const marketing = consent.marketing && !!adsId;
    if (!analytics && !marketing) {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }
    const gtag = loadGtag((analytics ? gaId : adsId)!);
    const grant = (value: boolean) => (value ? "granted" : "denied");
    gtag("consent", "update", {
      analytics_storage: grant(analytics),
      ad_storage: grant(marketing),
      ad_user_data: grant(marketing),
      ad_personalization: grant(marketing),
    });
    if (analytics && !configured.current.ga) {
      gtag("config", gaId, { page_language: locale, cookie_expires: GA_COOKIE_EXPIRES });
      configured.current.ga = true;
    }
    if (marketing && !configured.current.ads) {
      gtag("config", adsId);
      configured.current.ads = true;
    }
  }, [consent, gaId, adsId, locale]);

  // Eventos de contacto: book_click, phone_click, email_click, whatsapp_click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-track]");
      const gtag = window.gtag;
      if (!link || !gtag || !consent) return;
      const name = link.dataset.track as TrackEvent;
      if (consent.analytics && gaId) {
        gtag("event", name, {
          page_language: locale,
          section: sectionOf(link),
          link_url: link.getAttribute("href") ?? undefined,
        });
      }
      // Cada clic en «Prendre rendez-vous» cuenta como conversión de Google Ads.
      if (name === "book_click" && consent.marketing && adsId && adsConversionLabel) {
        gtag("event", "conversion", { send_to: `${adsId}/${adsConversionLabel}` });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [consent, gaId, adsId, adsConversionLabel, locale]);

  return null;
}
