import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buttonBase, buttonSizes } from "@/components/button-styles";
import { ClosingCta } from "@/components/ClosingCta";
import { Heading } from "@/components/Heading";
import { HeroActions } from "@/components/HeroActions";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { currentLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { GUIDE_INDEX_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Índice de la guía «Investir au Costa Rica»: temas y sus subtemas.

export const generateMetadata = () => sectionMetadata("invest");

export default function GuideIndexPage() {
  return <WithFetchOptions>{(options) => <GuideIndex {...options} />}</WithFetchOptions>;
}

async function GuideIndex(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [page, { data: topics }, settings, tNav, tFirm] = await Promise.all([
    getSectionPage("invest", fetchOptions),
    cachedSanity({ query: GUIDE_INDEX_QUERY, params: { language }, tags: ["investGuide"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Navigation"),
    getTranslations("Firm"),
  ]);
  if (!page || !settings) notFound();

  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs current={tNav("invest")} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      <section className="bg-paper text-on-paper">
        <ol className="mx-auto grid max-w-[1320px] gap-x-16 px-7 py-28 md:grid-cols-2">
          {topics.map((topic, i) => (
            <li key={topic._id} className="flex gap-5 border-t border-on-paper/14 py-9">
              <span className="w-7 shrink-0 pt-3 text-xs tracking-[0.1em] text-bronze-text tabular-nums">
                {pad2(i + 1)}
              </span>
              <div className="min-w-0">
                <Link
                  href={{ pathname: "/investir-au-costa-rica/[topic]", params: { topic: topic.slug } }}
                  className="inline-flex min-h-11 items-center font-serif text-[clamp(28px,2.6vw,36px)] leading-[1.15] transition-colors hover:text-burgundy focus-visible:outline-on-paper"
                >
                  {topic.title}
                </Link>
                {topic.summary && (
                  <p className="mt-3 text-[15px] leading-[1.7] text-on-paper-body">{topic.summary}</p>
                )}
                {!!topic.children.length && (
                  <ul className="mt-4 flex flex-col">
                    {topic.children.map((child) => (
                      <li key={child._id}>
                        <Link
                          href={{
                            pathname: "/investir-au-costa-rica/[topic]/[subtopic]",
                            params: { topic: topic.slug, subtopic: child.slug },
                          }}
                          className="inline-flex min-h-11 items-center gap-3 text-[15px] text-on-paper-body underline-offset-4 hover:text-burgundy hover:underline focus-visible:outline-on-paper"
                        >
                          <span aria-hidden="true" className="text-bronze-text">
                            —
                          </span>
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Servicio destacado (Páginas de sección → Guía → Servicio destacado) */}
      {page.featuredService?.slug && (
        <section className="border-b border-bronze-light/16">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-x-16 gap-y-10 px-7 py-24">
            <div className="max-w-[760px] min-w-0">
              <SectionEyebrow>{tNav("expertise")}</SectionEyebrow>
              <Heading size="sub" className="mt-5">
                {page.featuredService.title}
              </Heading>
              <p className="mt-5 text-base leading-[1.7] text-stone">{page.featuredService.summary}</p>
            </div>
            <Link
              href={{ pathname: "/expertises/[slug]", params: { slug: page.featuredService.slug } }}
              className={cn(buttonBase, buttonSizes.md, "inline-flex border border-cream/40 text-cream hover:bg-cream hover:text-ink")}
            >
              {tFirm("discover")}
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      )}

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
