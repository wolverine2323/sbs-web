import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { ContactList } from "@/components/ContactList";
import { HeroActions } from "@/components/HeroActions";
import { ExternalIcon } from "@/components/icons";
import { MapEmbed } from "@/components/MapEmbed";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { currentLocale } from "@/i18n/locale";
import type { DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Contact: datos de la firma, mapa de Terra Campus y CTA de cita.

export const generateMetadata = () => sectionMetadata("contact");

export default function ContactPage() {
  return <WithFetchOptions>{(options) => <Contact {...options} />}</WithFetchOptions>;
}

async function Contact(fetchOptions: DynamicFetchOptions) {
  const [page, settings, t, tNav] = await Promise.all([
    getSectionPage("contact", fetchOptions),
    getSiteSettings(await currentLocale()),
    getTranslations("Contact"),
    getTranslations("Navigation"),
  ]);
  if (!page || !settings) notFound();

  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs current={tNav("contact")} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[1320px] px-7 py-28">
          {page.body && (
            <div className="mb-16 max-w-[760px] [&>*:first-child]:mt-0">
              <RichText value={page.body} tone="light" />
            </div>
          )}
          <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
            <ContactList
              tone="light"
              address={settings.address ?? ""}
              phone={settings.phone}
              email={settings.email}
              addressExtra={
                settings.mapsUrl && (
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-2.5 text-[13px] font-semibold tracking-[0.1em] text-burgundy uppercase hover:text-burgundy-mid focus-visible:outline-on-paper"
                  >
                    {t("openMaps")}
                    <ExternalIcon size={14} />
                  </a>
                )
              }
            />
            {settings.mapsEmbedUrl && (
              <div>
                <SectionEyebrow tone="light" variant="small" className="mb-5">
                  {t("map")}
                </SectionEyebrow>
                <MapEmbed src={settings.mapsEmbedUrl} />
              </div>
            )}
          </div>
        </div>
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
