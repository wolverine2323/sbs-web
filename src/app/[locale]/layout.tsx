import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header, type NavItem } from "@/components/Header";
import { AlternatesProvider } from "@/components/LocaleAlternates";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { routing } from "@/i18n/routing";
import { cachedSanity, SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import "../globals.css";

// Títulos (clase font-serif).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Texto (clase font-sans, la predeterminada).
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

// Sanity Live (actualiza lo publicado) y, en modo borrador, la edición con
// clic desde la vista previa del Studio.
async function SanityTools() {
  const { isEnabled } = await draftMode();
  return (
    <>
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled && <VisualEditing />}
    </>
  );
}

// En escritorio el menú muestra las cuatro secciones de la referencia;
// Actualité y Contact solo en el menú móvil (están en el pie y en la portada).
async function getNavItems(): Promise<NavItem[]> {
  const t = await getTranslations("Navigation");
  return [
    { label: t("firm"), href: "/le-cabinet" },
    { label: t("expertise"), href: "/expertises" },
    { label: t("invest"), href: "/investir-au-costa-rica" },
    { label: t("experiences"), href: "/experiences" },
    { label: t("news"), href: "/actualite", mobileOnly: true },
    { label: t("contact"), href: "/contact", mobileOnly: true },
  ];
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const [navItems, { data: settings }] = await Promise.all([
    getNavItems(),
    cachedSanity({
      query: SITE_SETTINGS_QUERY,
      params: { language: locale },
      tags: ["siteSettings"],
      perspective: "published",
      stega: false,
    }),
  ]);

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider>
          <AlternatesProvider>
            <Header items={navItems} bookingUrl={settings?.bookingUrl} />
            {children}
          </AlternatesProvider>
          {settings && (
            <Footer body={settings.footerBody ?? ""} rights={settings.footerRights ?? ""} />
          )}
          <WhatsAppFloat number={settings?.whatsapp ?? undefined} />
        </NextIntlClientProvider>
        <Suspense>
          <SanityTools />
        </Suspense>
      </body>
    </html>
  );
}
