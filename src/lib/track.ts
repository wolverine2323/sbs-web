// Eventos GA4 de CLAUDE.md. Los enlaces los declaran con data-track;
// src/components/consent/Analytics.tsx los envía a GA4 con el idioma y la
// sección (si el visitante aceptó la medición).
export type TrackEvent =
  | "book_click"
  | "phone_click"
  | "email_click"
  | "whatsapp_click";
