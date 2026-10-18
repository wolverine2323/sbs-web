import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { PageAlternates } from "@/components/LocaleAlternates";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { currentLocale } from "@/i18n/locale";
import { alternatesFor } from "@/lib/alternates";
import { pageMetadata, pathsWithSelf } from "@/lib/metadata";
import { plainExcerpt } from "@/lib/portable-text";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/sanity/lib/queries";

// Páginas generales (política de privacidad, aviso legal…): /fr/(slug).
// Las secciones fijas (le-cabinet, contact…) tienen prioridad sobre esta ruta.

type Props = PageProps<"/[locale]/[slug]">;

const PAGE_TAGS = ["page", "translation.metadata"];

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: PAGE_SLUGS_QUERY,
    params: { language: await currentLocale() },
    tags: PAGE_TAGS,
    perspective: "published",
    stega: false,
  });
  return withPlaceholder(slugs.map((slug) => ({ slug })), { slug: PLACEHOLDER });
}

async function getPage(slug: string, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: PAGE_QUERY,
    params: { language: await currentLocale(), slug },
    tags: PAGE_TAGS,
    ...fetchOptions,
  });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug, { perspective: "published", stega: false });
  if (!page) return {};
  const locale = await currentLocale();
  const translations = alternatesFor(page.translations, (translation) =>
    translation.slug ? { pathname: "/[slug]", params: { slug: translation.slug } } : null,
  );
  return pageMetadata({
    locale,
    paths: pathsWithSelf(locale, translations, { pathname: "/[slug]", params: { slug } }),
    title: page.title,
    description: plainExcerpt(page.body),
    seo: page.seo,
  });
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  return <WithFetchOptions>{(options) => <Page slug={slug} {...options} />}</WithFetchOptions>;
}

async function Page({ slug, ...fetchOptions }: { slug: string } & DynamicFetchOptions) {
  const page = await getPage(slug, fetchOptions);
  if (!page) notFound();

  const alternates = alternatesFor(page.translations, (translation) =>
    translation.slug ? { pathname: "/[slug]", params: { slug: translation.slug } } : null,
  );

  return (
    <main>
      <PageAlternates alternates={alternates} />
      <PageHero breadcrumbs={<Breadcrumbs current={page.title} />} title={page.title} />
      {page.body && (
        <section className="bg-paper text-on-paper">
          <div className="mx-auto max-w-[840px] px-7 py-24 [&>*:first-child]:mt-0">
            <RichText value={page.body} tone="light" />
          </div>
        </section>
      )}
      <ClosingCta {...fetchOptions} />
    </main>
  );
}
