import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { CaseCard } from "@/components/experiences/CaseCard";
import { Heading } from "@/components/Heading";
import { HeroActions } from "@/components/HeroActions";
import { PageHero } from "@/components/PageHero";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { TestimonialQuote } from "@/components/TestimonialQuote";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { CASE_STUDIES_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Expériences: los casos de la firma (sobre paper) y todos los testimonios
// publicados (burgundy-deep).

export const generateMetadata = () => sectionMetadata("experiences");

export default function ExperiencesPage() {
  return <WithFetchOptions>{(options) => <Experiences {...options} />}</WithFetchOptions>;
}

async function Experiences(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [page, { data: cases }, { data: testimonials }, settings, t, tNav] = await Promise.all([
    getSectionPage("experiences", fetchOptions),
    cachedSanity({
      query: CASE_STUDIES_QUERY,
      params: { language },
      tags: ["caseStudy"],
      ...fetchOptions,
    }),
    cachedSanity({ query: TESTIMONIALS_QUERY, params: { language }, tags: ["testimonial"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Experiences"),
    getTranslations("Navigation"),
  ]);
  if (!page || !settings) notFound();
  const quotes = testimonials.filter((item): item is typeof item & { quote: string } => !!item.quote);

  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs current={tNav("experiences")} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      {!!cases.length && (
        <section className="bg-paper text-on-paper">
          <div className="mx-auto max-w-[1320px] px-7 py-28">
            <SectionEyebrow tone="light">{t("casesLabel")}</SectionEyebrow>
            <Heading className="mt-6 mb-16">{t("casesTitle")}</Heading>
            <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => (
                <li key={item._id}>
                  <CaseCard item={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!!quotes.length && (
        <section className="bg-burgundy-deep">
          <div className="mx-auto max-w-[1320px] px-7 py-28">
            <SectionEyebrow>{t("testimonialsLabel")}</SectionEyebrow>
            <Heading className="mt-6 mb-16 text-cream">{t("testimonialsTitle")}</Heading>
            <ul className="grid gap-6 md:grid-cols-2">
              {quotes.map((item) => (
                <li key={item._id}>
                  <TestimonialQuote variant="card" quote={item.quote} name={item.author} role={item.role} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
