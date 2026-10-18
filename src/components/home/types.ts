import type { HOME_PAGE_QUERY_RESULT } from "@/sanity/types";

export type HomeContent = NonNullable<HOME_PAGE_QUERY_RESULT>;

// Datos de siteSettings que usan las secciones.
export type Contact = {
  bookingUrl: string;
  phone: string;
  email: string;
};
