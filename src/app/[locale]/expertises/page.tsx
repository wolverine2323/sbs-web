import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { HeroActions } from "@/components/HeroActions";
import { PageHero } from "@/components/PageHero";
import { ServiceRow } from "@/components/ServiceRow";
import { currentLocale } from "@/i18n/locale";
import { pad2 } from "@/lib/format";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Índice de Domaines d'expertise.

export const generateMetadata = () => sectionMetadata("expertise");

export default function ExpertisePage() {
  return <WithFetchOptions>{(options) => <Expertise {...options} />}</WithFetchOptions>;
}

async function Expertise(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [page, { data: services }, settings, tNav] = await Promise.all([
    getSectionPage("expertise", fetchOptions),
    cachedSanity({ query: SERVICES_QUERY, params: { language }, tags: ["service"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Navigation"),
  ]);
  if (!page || !settings) notFound();

  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs current={tNav("expertise")} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      <section className="bg-paper text-on-paper">
        <ul className="mx-auto max-w-[1320px] px-7 py-28">
          {services.map((service, i) => (
            <li key={service._id} className="first:border-t first:border-on-paper/14">
              <ServiceRow
                tone="light"
                number={pad2(i + 1)}
                title={service.title}
                description={service.summary}
                href={{ pathname: "/expertises/[slug]", params: { slug: service.slug } }}
              />
            </li>
          ))}
        </ul>
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
