import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { HeroActions } from "@/components/HeroActions";
import { PageAlternates } from "@/components/LocaleAlternates";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import {
  AudienceNav,
  AudienceSection,
  HelpPoints,
  OtherServices,
  ServiceFaq,
} from "@/components/service/ServiceSections";
import { TestimonialQuote } from "@/components/TestimonialQuote";
import { toneClasses, type Tone } from "@/components/tone";
import { currentLocale } from "@/i18n/locale";
import { alternatesFor } from "@/lib/alternates";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { SERVICE_QUERY, SERVICE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";
import type { SERVICE_QUERY_RESULT } from "@/sanity/types";

// Plantilla de servicio: hero, cuerpo, públicos (p. ej. quien pide un crédito
// y quien invierte), «Comment nous vous aidons», preguntas frecuentes y aviso,
// testimonio relacionado, otras expertises y CTA final. Solo se muestran los
// bloques que el servicio tiene rellenos en Sanity.

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

// Los bloques que el servicio tiene rellenos alternan fondo (ink ↔ paper) a
// partir del hero; el testimonio (burgundy-deep) cuenta como oscuro.
function sectionTones(service: NonNullable<SERVICE_QUERY_RESULT>) {
  let tone: Tone = "dark";
  const next = (): Tone => (tone = tone === "dark" ? "light" : "dark");
  return {
    body: service.body ? next() : tone,
    audiences: (service.audiences ?? []).map(() => next()),
    help: service.helpPoints?.length ? next() : tone,
    faq: service.faq?.length || service.disclaimer ? next() : tone,
    others: service.testimonial?.quote ? ("light" as Tone) : next(),
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
  const audiences = service.audiences ?? [];
  const faq = service.faq ?? [];
  const alternates = alternatesFor(service.translations, ({ slug }) =>
    slug ? { pathname: "/expertises/[slug]", params: { slug } } : null,
  );

  const tones = sectionTones(service);

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
      {audiences.length > 1 && <AudienceNav audiences={audiences} />}

      {/* Cuerpo con la imagen al lado */}
      {service.body && (
        <section className={toneClasses[tones.body].section}>
          <div className="mx-auto grid max-w-[1320px] gap-x-20 gap-y-12 px-7 py-28 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="max-w-[760px] min-w-0 [&>*:first-child]:mt-0">
              <RichText value={service.body} tone={tones.body} />
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

      {audiences.map((audience, i) => (
        <AudienceSection
          key={audience._key}
          audience={audience}
          tone={tones.audiences[i]}
          bookingUrl={settings.bookingUrl}
        />
      ))}

      {!!helpPoints.length && (
        <HelpPoints eyebrow={service.title} points={helpPoints} tone={tones.help} />
      )}

      {(!!faq.length || service.disclaimer) && (
        <ServiceFaq items={faq} disclaimer={service.disclaimer} tone={tones.faq} />
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

      {!!service.others.length && (
        <OtherServices
          label={tNav("expertise")}
          title={t("otherServices")}
          services={service.others}
          tone={tones.others}
        />
      )}

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
