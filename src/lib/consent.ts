// Consentimiento de cookies (RGPD y Ley 8968): qué aceptó el visitante.
// Se guarda 6 meses en una cookie propia; después se vuelve a preguntar.

export type Consent = {
  analytics: boolean; // Google Analytics 4
  marketing: boolean; // Google Ads
  maps: boolean; // Google Maps en Contact
};

export type ConsentCategory = keyof Consent;
export const CONSENT_CATEGORIES: ConsentCategory[] = ["analytics", "marketing", "maps"];

export const NO_CONSENT: Consent = { analytics: false, marketing: false, maps: false };
export const FULL_CONSENT: Consent = { analytics: true, marketing: true, maps: true };

const COOKIE = "sbs_consent";
const MAX_AGE = 60 * 60 * 24 * 182;
// Cambiar la versión vuelve a preguntar a todos (p. ej. si se añade una categoría).
const VERSION = 1;

// "v1.a1.m0.p1" → { analytics: true, marketing: false, maps: true }
export function parseConsent(raw: string | null | undefined): Consent | null {
  const match = raw?.match(/^v(\d+)\.a([01])\.m([01])\.p([01])$/);
  if (!match || Number(match[1]) !== VERSION) return null;
  return { analytics: match[2] === "1", marketing: match[3] === "1", maps: match[4] === "1" };
}

export function readConsentCookie() {
  const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(COOKIE.length + 1)) : "";
}

export function writeConsentCookie(consent: Consent) {
  const flag = (value: boolean) => (value ? 1 : 0);
  const value = `v${VERSION}.a${flag(consent.analytics)}.m${flag(consent.marketing)}.p${flag(consent.maps)}`;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

// Al retirar el consentimiento, se borran las cookies que ya puso Google.
export function deleteGoogleCookies() {
  const domains = ["", location.hostname, `.${location.hostname.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!/^(_ga|_gid|_gat|_gcl)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
