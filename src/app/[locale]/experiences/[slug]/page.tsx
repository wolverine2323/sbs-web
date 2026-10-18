import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { CaseCard } from "@/components/experiences/CaseCard";
import { Heading } from "@/components/Heading";
import { HeroActions } from "@/components/HeroActions";
import { PageAlternates } from "@/components/LocaleAlternates";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { currentLocale } from "@/i18n/locale";
import { alternatesFor } from "@/lib/alternates";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { CASE_STUDY_QUERY, CASE_STUDY_SLUGS_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";

// Un caso de Expériences: foto y relato, otros casos y CTA final.

type Props = PageProps<"/[locale]/experiences/[slug]">;

// Tipos que aparecen en la página: el webhook /api/revalidate las renueva.
const CASE_TAGS = ["caseStudy", "translation.metadata"];

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: CASE_STUDY_SLUGS_QUERY,
    params: { language: await currentLocale() },
    perspective: "published",
    stega: false,
    tags: CASE_TAGS,
  });
  return withPlaceholder(slugs.map((slug) => ({ slug })), { slug: PLACEHOLDER });
}

async function getCase(slug: string, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: CASE_STUDY_QUERY,
    params: { language: await currentLocale(), slug },
    tags: CASE_TAGS,
    ...fetchOptions,
  });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getCase((await params).slug, { perspective: "published", stega: false });
  if (!item) return {};
  return {
    title: item.seo?.title || item.title,
    description: item.seo?.description || item.summary || undefined,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  return <WithFetchOptions>{(options) => <CaseStudy slug={slug} {...options} />}</WithFetchOptions>;
}

async function CaseStudy({ slug, ...fetchOptions }: { slug: string } & DynamicFetchOptions) {
  const [item, settings, t, tNav] = await Promise.all([
    getCase(slug, fetchOptions),
    getSiteSettings(await currentLocale()),
    getTranslations("Experiences"),
    getTranslations("Navigation"),
  ]);
  if (!item || !settings) notFound();

  const image = imageDimensions(item.image?.asset?._ref);
  const alternates = alternatesFor(item.translations, (translation) =>
    translation.slug ? { pathname: "/experiences/[slug]", params: { slug: translation.slug } } : null,
  );

  return (
    <main>
      <PageAlternates alternates={alternates} />
      <PageHero
        breadcrumbs={
          <Breadcrumbs items={[{ label: tNav("experiences"), href: "/experiences" }]} current={item.title} />
        }
        eyebrow={t("caseLabel")}
        title={item.title}
        lead={item.summary}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[840px] px-7 py-24">
          {item.image?.asset && image && (
            <Image
              src={urlFor(item.image).width(1600).url()}
              alt={item.image.alt ?? ""}
              width={image.width}
              height={image.height}
              sizes="(min-width: 900px) 784px, 100vw"
              priority
              className="mb-14 h-auto w-full"
            />
          )}
          {item.body && (
            <article className="[&>*:first-child]:mt-0">
              <RichText value={item.body} tone="light" />
            </article>
          )}
        </div>

        {!!item.others.length && (
          <div className="border-t border-on-paper/14">
            <div className="mx-auto max-w-[1320px] px-7 py-24">
              <Heading size="sub" className="mb-12">
                {t("others")}
              </Heading>
              <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {item.others.map((other) => (
                  <li key={other._id}>
                    <CaseCard item={other} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
