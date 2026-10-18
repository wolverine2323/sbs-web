import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { Heading } from "@/components/Heading";
import { HeroActions } from "@/components/HeroActions";
import { ArrowRightIcon } from "@/components/icons";
import { PageAlternates } from "@/components/LocaleAlternates";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { TestimonialQuote } from "@/components/TestimonialQuote";
import { currentLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/alternates";
import { pad2 } from "@/lib/format";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { SERVICE_QUERY, SERVICE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";

// Plantilla de servicio: hero, cuerpo, «Comment nous vous aidons»,
// testimonio relacionado, otras expertises y CTA final.

type Props = PageProps<"/[locale]/expertises/[slug]">;

// Tipos que aparecen en la página: el webhook /api/revalidate las renueva.
const SERVICE_TAGS = ["service", "testimonial", "translation.metadata"];

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: SERVICE_SLUGS_QUERY,
    params: { language: await currentLocale() },
    tags: SERVICE_TAGS,
    perspective: "published",
    stega: false,
  });
  return withPlaceholder(slugs.map((slug) => ({ slug })), { slug: PLACEHOLDER });
}

async function getService(slug: string, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: SERVICE_QUERY,
    params: { language: await currentLocale(), slug },
    tags: SERVICE_TAGS,
    ...fetchOptions,
  });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug, { perspective: "published", stega: false });
  if (!service) return {};
  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.summary,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  return <WithFetchOptions>{(options) => <Service slug={slug} {...options} />}</WithFetchOptions>;
}

async function Service({ slug, ...fetchOptions }: { slug: string } & DynamicFetchOptions) {
  const [service, settings, t, tNav] = await Promise.all([
    getService(slug, fetchOptions),
    getSiteSettings(await currentLocale()),
    getTranslations("Service"),
    getTranslations("Navigation"),
  ]);
  if (!service || !settings) notFound();

  const image = imageDimensions(service.image?.asset?._ref);
  const helpPoints = service.helpPoints ?? [];
  const alternates = alternatesFor(service.translations, ({ slug }) =>
    slug ? { pathname: "/expertises/[slug]", params: { slug } } : null,
  );

  return (
    <main>
      <PageAlternates alternates={alternates} />
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: tNav("expertise"), href: "/expertises" }]}
            current={service.title}
          />
        }
        eyebrow={t("label")}
        title={service.title}
        lead={service.summary}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      {/* Cuerpo (sobre paper) con la imagen al lado */}
      {service.body && (
        <section className="bg-paper text-on-paper">
          <div className="mx-auto grid max-w-[1320px] gap-x-20 gap-y-12 px-7 py-28 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="max-w-[760px] min-w-0 [&>*:first-child]:mt-0">
              <RichText value={service.body} tone="light" />
            </div>
            {service.image?.asset && image && (
              <Image
                src={urlFor(service.image).width(900).url()}
                alt={service.image.alt ?? ""}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 400px, 100vw"
                className="h-auto w-full lg:sticky lg:top-[120px] lg:self-start"
              />
            )}
          </div>
        </section>
      )}

      {/* Comment nous vous aidons */}
      {!!helpPoints.length && (
        <section className="mx-auto max-w-[1320px] px-7 py-28">
          <SectionEyebrow>{service.title}</SectionEyebrow>
          <Heading className="mt-6">{t("howWeHelp")}</Heading>
          <ol className="mt-16 grid gap-x-16 md:grid-cols-2">
            {helpPoints.map((point, i) => (
              <li key={point._key} className="flex gap-6 border-t border-bronze-light/25 py-9">
                <span className="w-9 shrink-0 font-serif text-xl text-bronze-light italic">
                  {pad2(i + 1)}
                </span>
                <div>
                  <h3 className="font-serif text-[28px] leading-[1.15] text-cream">{point.title}</h3>
                  {point.description && (
                    <p className="mt-3 text-[15px] leading-[1.7] text-stone">{point.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Testimonio relacionado */}
      {service.testimonial?.quote && (
        <section aria-label={t("testimonial")} className="bg-burgundy-deep">
          <div className="mx-auto max-w-[980px] px-7 py-28">
            <TestimonialQuote
              quote={service.testimonial.quote}
              name={service.testimonial.author}
              role={service.testimonial.role}
            />
          </div>
        </section>
      )}

      {/* Otras expertises */}
      {!!service.others.length && (
        <section className="bg-paper text-on-paper">
          <div className="mx-auto max-w-[1320px] px-7 py-28">
            <SectionEyebrow tone="light">{tNav("expertise")}</SectionEyebrow>
            <Heading size="sub" className="mt-5 mb-12">
              {t("otherServices")}
            </Heading>
            <ul className="grid border-t border-on-paper/14 md:grid-cols-2 md:gap-x-16">
              {service.others.map((other) => (
                <li key={other._id} className="border-b border-on-paper/14">
                  <Link
                    href={{ pathname: "/expertises/[slug]", params: { slug: other.slug } }}
                    className="group flex min-h-20 items-center justify-between gap-6 py-6 font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.2] transition-colors hover:text-burgundy focus-visible:outline-on-paper"
                  >
                    {other.title}
                    <ArrowRightIcon className="shrink-0 transition-transform duration-250 group-hover:translate-x-1.5" />
                  </Link>
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
