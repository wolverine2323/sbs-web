import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { HeroActions } from "@/components/HeroActions";
import { RecognitionSection } from "@/components/home/RecognitionSection";
import { ArrowRightIcon } from "@/components/icons";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { FirmNav } from "@/components/team/FirmNav";
import { currentLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { pad2 } from "@/lib/format";
import { urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { FIRM_EXTRAS_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";

// Le Cabinet: presentación de la firma, accesos al equipo y reconocimientos.

export const generateMetadata = () => sectionMetadata("firm");

export default function FirmPage() {
  return <WithFetchOptions>{(options) => <Firm {...options} />}</WithFetchOptions>;
}

async function Firm(fetchOptions: DynamicFetchOptions) {
  const language = await currentLocale();
  const [page, founders, associates, { data: extras }, settings, t, tNav] = await Promise.all([
    getSectionPage("firm", fetchOptions),
    getSectionPage("founders", fetchOptions),
    getSectionPage("associates", fetchOptions),
    cachedSanity({ query: FIRM_EXTRAS_QUERY, params: { language }, tags: ["homePage"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Firm"),
    getTranslations("Navigation"),
  ]);
  if (!page || !settings) notFound();

  const highlights = extras?.highlights ?? [];
  const teams = [
    { key: "founders", href: "/le-cabinet/associes-fondateurs", page: founders },
    { key: "associates", href: "/le-cabinet/avocats-collaborateurs", page: associates },
  ] as const;

  return (
    <main>
      <PageHero
        breadcrumbs={<Breadcrumbs current={tNav("firm")} />}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>
      <FirmNav current="overview" />

      {/* Presentación (sobre paper): texto, foto y áreas destacadas */}
      <section className="bg-paper text-on-paper">
        <div className="mx-auto grid max-w-[1320px] gap-x-20 gap-y-14 px-7 py-28 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="min-w-0 [&>*:first-child]:mt-0">
            {page.body ? (
              <RichText value={page.body} tone="light" />
            ) : (
              <ol className="border-t border-on-paper/14">
                {highlights.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-6 border-b border-on-paper/14 py-6"
                  >
                    <span className="text-xs tracking-[0.1em] text-bronze-text tabular-nums">
                      {pad2(i + 1)}
                    </span>
                    <span className="font-serif text-[clamp(26px,2.4vw,34px)] leading-[1.15]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            {page.image?.asset ? (
              <div className="relative aspect-[3/4]">
                <Image
                  src={urlFor(page.image).width(900).height(1200).url()}
                  alt={page.image.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <ImagePlaceholder label={extras?.photoLabel ?? ""} />
            )}
            {page.body && !!highlights.length && (
              <ul className="grid grid-cols-2 border-l border-on-paper/14">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="border-r border-b border-on-paper/14 px-[18px] py-4 text-[13.5px] leading-[1.4]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Accesos al equipo */}
      <section className="mx-auto grid max-w-[1320px] gap-6 px-7 py-28 md:grid-cols-2">
        {teams.map(({ key, href, page: team }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col border border-bronze-light/25 p-8 transition-colors hover:bg-bronze-light/6 sm:p-12"
          >
            <SectionEyebrow>{t(key)}</SectionEyebrow>
            <span className="mt-5 font-serif text-[clamp(30px,3vw,42px)] leading-[1.1] text-cream">
              {team?.title ?? t(key)}
            </span>
            {team?.lead && (
              <span className="mt-5 text-[15px] leading-[1.7] text-stone">{team.lead}</span>
            )}
            <span className="mt-auto inline-flex items-center gap-3 pt-10 text-[13px] font-semibold tracking-[0.14em] text-bronze-light uppercase">
              {t("discover")}
              <ArrowRightIcon
                size={14}
                className="transition-transform duration-250 group-hover:translate-x-1.5"
              />
            </span>
          </Link>
        ))}
      </section>

      {extras?.recognition && <RecognitionSection recognition={extras.recognition} />}
      <ClosingCta {...fetchOptions} />
    </main>
  );
}
