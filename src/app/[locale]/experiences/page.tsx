import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { HeroActions } from "@/components/HeroActions";
import { PageHero } from "@/components/PageHero";
import { TestimonialQuote } from "@/components/TestimonialQuote";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Expériences: todos los testimonios publicados.

export const generateMetadata = () => sectionMetadata("experiences");

export default function ExperiencesPage() {
  return <WithFetchOptions>{(options) => <Experiences {...options} />}</WithFetchOptions>;
}

async function Experiences(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [page, { data: testimonials }, settings, tNav] = await Promise.all([
    getSectionPage("experiences", fetchOptions),
    cachedSanity({ query: TESTIMONIALS_QUERY, params: { language }, tags: ["testimonial"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Navigation"),
  ]);
  if (!page || !settings) notFound();

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

      <section className="bg-burgundy-deep">
        <ul className="mx-auto grid max-w-[1320px] gap-6 px-7 py-28 md:grid-cols-2">
          {testimonials.map(
            (item) =>
              item.quote && (
                <li key={item._id}>
                  <TestimonialQuote
                    variant="card"
                    quote={item.quote}
                    name={item.author}
                    role={item.role}
                  />
                </li>
              ),
          )}
        </ul>
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
