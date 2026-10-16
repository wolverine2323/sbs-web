import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { VisualEditing } from "next-sanity/visual-editing";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import { SanityLive } from "@/sanity/lib/live";
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

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Suspense>
          <SanityTools />
        </Suspense>
      </body>
    </html>
  );
}
