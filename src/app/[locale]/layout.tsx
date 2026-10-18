import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { Footer, type FooterLink } from "@/components/Footer";
import { Header, type NavItem } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { AlternatesProvider } from "@/components/LocaleAlternates";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { legalService } from "@/lib/structured-data";
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
  const [t, tCommon] = await Promise.all([
    getTranslations("Metadata"),
    getTranslations("Common"),
  ]);
  return {
    // Las páginas internas: «Le Cabinet · SBS Abogados».
    // Base de las direcciones absolutas (canónica, Open Graph): www.sbs.cr.
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s · ${tCommon("brand")}` },
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

// Servicio elegido en «Ajustes del sitio → Servicio en el menú».
type FeaturedService = { label: string | null; slug: string | null } | null | undefined;

const featuredLink = (featured: FeaturedService) =>
  featured?.label && featured.slug
    ? {
        label: featured.label,
        href: { pathname: "/expertises/[slug]" as const, params: { slug: featured.slug } },
      }
    : null;

// Con el logo centrado solo caben cuatro enlaces en escritorio: Le Cabinet,
// Expertises, Investir y el servicio destacado. Expériences, Actualité y
// Contact van en el menú móvil y en el pie (Expériences también en la portada).
async function getNavItems(featured: FeaturedService): Promise<NavItem[]> {
  const t = await getTranslations("Navigation");
  const service = featuredLink(featured);
  return [
    { label: t("firm"), href: "/le-cabinet" },
    { label: t("expertise"), href: "/expertises" },
    { label: t("invest"), href: "/investir-au-costa-rica" },
    ...(service ? [service] : []),
    { label: t("experiences"), href: "/experiences", mobileOnly: !!service },
    { label: t("news"), href: "/actualite", mobileOnly: true },
    { label: t("contact"), href: "/contact", mobileOnly: true },
  ];
}

async function getFooterLinks(featured: FeaturedService): Promise<FooterLink[]> {
  const t = await getTranslations("Navigation");
  const service = featuredLink(featured);
  return [
    ...(service ? [service] : []),
    { label: t("experiences"), href: "/experiences" },
    { label: t("news"), href: "/actualite" },
    { label: t("contact"), href: "/contact" },
  ];
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const { data: settings } = await cachedSanity({
    query: SITE_SETTINGS_QUERY,
    params: { language: locale },
    tags: ["siteSettings", "service", "translation.metadata"],
    perspective: "published",
    stega: false,
  });
  const [navItems, footerLinks, tMeta, tCommon] = await Promise.all([
    getNavItems(settings?.featuredService),
    getFooterLinks(settings?.featuredService),
    getTranslations("Metadata"),
    getTranslations("Common"),
  ]);

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {/* La firma para Google: nombre, dirección, teléfono, horario e idiomas. */}
        {settings && (
          <JsonLd
            data={legalService({
              settings,
              name: tCommon("brand"),
              legalName: tCommon("legalName"),
              description: tMeta("description"),
              url: `/${locale}`,
              languages: routing.locales,
            })}
          />
        )}
        <NextIntlClientProvider>
          <AlternatesProvider>
            <Header items={navItems} bookingUrl={settings?.bookingUrl} />
            {children}
          </AlternatesProvider>
          {settings && (
            <Footer
              body={settings.footerBody ?? ""}
              rights={settings.footerRights ?? ""}
              links={footerLinks}
              social={settings.social ?? []}
            />
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
