import { currentLocale } from "@/i18n/locale";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { CLOSING_CTA_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";
import { BookingSection } from "./home/BookingSection";

// CTA final de las páginas internas: los pasos de la primera cita y la
// tarjeta de reserva de la portada (mismos textos, editables en «Portada»).
export async function ClosingCta(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [{ data: cta }, settings] = await Promise.all([
    cachedSanity({ query: CLOSING_CTA_QUERY, params: { language }, tags: ["homePage"], ...fetchOptions }),
    getSiteSettings(language),
  ]);
  if (!cta || !settings) return null;

  return (
    <div className="border-t border-bronze-light/16">
      <BookingSection
        steps={cta.steps}
        booking={cta.booking}
        contact={{ bookingUrl: settings.bookingUrl, phone: settings.phone, email: settings.email }}
      />
    </div>
  );
}
