"use client";

import { useMemo, useSyncExternalStore } from "react";
import { deleteGoogleCookies, parseConsent, readConsentCookie, writeConsentCookie, type Consent } from "@/lib/consent";

// Estado del consentimiento, compartido sin envolver la página: solo lo leen
// el banner, la medición, el mapa y «Gestion des cookies» (así React no tiene
// que hidratar toda la página de una vez al leer la cookie).
// `consent` es undefined en el servidor (aún no se sabe), null si el
// visitante no ha elegido y un objeto si ya eligió.

let settingsOpen = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function choose(next: Consent) {
  const previous = parseConsent(readConsentCookie());
  writeConsentCookie(next);
  if ((previous?.analytics && !next.analytics) || (previous?.marketing && !next.marketing)) deleteGoogleCookies();
  settingsOpen = false;
  notify();
}

const setSettingsOpen = (open: boolean) => {
  settingsOpen = open;
  notify();
};

export function useConsent() {
  const raw = useSyncExternalStore(subscribe, readConsentCookie, () => undefined);
  const open = useSyncExternalStore(subscribe, () => settingsOpen, () => false);
  const consent = useMemo(() => (raw === undefined ? undefined : parseConsent(raw)), [raw]);
  return {
    consent,
    choose,
    settingsOpen: open,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
  };
}
