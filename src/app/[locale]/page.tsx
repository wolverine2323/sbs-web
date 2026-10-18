import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSection } from "@/components/home/BookingSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FirmSection } from "@/components/home/FirmSection";
import { GuideSection } from "@/components/home/GuideSection";
import { HeroSection } from "@/components/home/HeroSection";
import { RecognitionSection } from "@/components/home/RecognitionSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import {
  cachedSanity,
  getDynamicFetchOptions,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { currentLocale } from "@/i18n/locale";
import { pageMetadata, pathsFor } from "@/lib/metadata";
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries";

// Portada: reproduce design/nocturne-reference.html con el contenido de Sanity.

// Tipos que aparecen en la portada: el webhook /api/revalidate las renueva.
const HOME_TAGS = ["homePage", "service", "investGuide", "translation.metadata"];

export async function generateMetadata(): Promise<Metadata> {
  const language = await currentLocale();
  const [{ data: home }, t] = await Promise.all([
    cachedSanity({
      query: HOME_PAGE_QUERY,
      params: { language },
      tags: HOME_TAGS,
      perspective: "published",
      stega: false,
    }),
    getTranslations("Metadata"),
  ]);
  return pageMetadata({
    locale: language,
    paths: pathsFor("/"),
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
    seo: home?.seo,
  });
}

export default async function HomePage() {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense>
        <DraftHome />
      </Suspense>
    );
  }
  return <Home perspective="published" stega={false} />;
}

// Vista previa desde el Studio: borradores y edición con clic.
async function DraftHome() {
  return <Home {...await getDynamicFetchOptions()} />;
}

async function Home(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [{ data: home }, { data: testimonials }, { data: settings }] = await Promise.all([
    cachedSanity({ query: HOME_PAGE_QUERY, params: { language }, tags: HOME_TAGS, ...fetchOptions }),
    cachedSanity({ query: TESTIMONIALS_QUERY, params: { language }, tags: ["testimonial"], ...fetchOptions }),
    // Los datos de contacto se usan en enlaces: siempre publicados y sin marcas de edición.
    cachedSanity({
      query: SITE_SETTINGS_QUERY,
      params: { language },
      tags: ["siteSettings"],
      perspective: "published",
      stega: false,
    }),
  ]);
  if (!home || !settings) notFound();

  const contact = {
    bookingUrl: settings.bookingUrl,
    phone: settings.phone,
    email: settings.email,
  };

  return (
    <main>
      {home.hero && <HeroSection hero={home.hero} contact={contact} />}
      {home.firm && <FirmSection firm={home.firm} />}
      {home.services && <ServicesSection services={home.services} />}
      {home.guide && <GuideSection guide={home.guide} bookingUrl={contact.bookingUrl} />}
      {home.testimonials && (
        <TestimonialsSection block={home.testimonials} testimonials={testimonials} />
      )}
      <BookingSection steps={home.steps} booking={home.booking} contact={contact} />
      {home.recognition && <RecognitionSection recognition={home.recognition} />}
      {home.contact && (
        <ContactSection
          block={home.contact}
          contact={{ ...contact, address: settings.address ?? "" }}
        />
      )}
    </main>
  );
}
