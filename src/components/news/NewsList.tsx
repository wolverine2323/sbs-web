import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { currentLocale } from "@/i18n/locale";
import { alternatesFor } from "@/lib/alternates";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { POSTS_PAGE_QUERY } from "@/sanity/lib/queries";
import { getSectionPage, sectionMetadata } from "@/sanity/lib/sections";
import { Breadcrumbs, type Crumb } from "../Breadcrumbs";
import { ClosingCta } from "../ClosingCta";
import { PageAlternates } from "../LocaleAlternates";
import { PageHero } from "../PageHero";
import { CategoryFilter } from "./CategoryFilter";
import { newsHref, POSTS_PER_PAGE } from "./newsHref";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";

// Tipos que aparecen en la lista: el webhook /api/revalidate las renueva.
export const NEWS_TAGS = ["post", "category", "translation.metadata"];

type Params = { page: number; category?: string };

async function getPosts({ page, category = "" }: Params, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: POSTS_PAGE_QUERY,
    params: {
      language: await currentLocale(),
      category,
      start: (page - 1) * POSTS_PER_PAGE,
      end: page * POSTS_PER_PAGE,
    },
    tags: NEWS_TAGS,
    ...fetchOptions,
  });
  return data;
}

// "2" → 2. Las páginas de la lista empiezan en 2 (la 1 es /actualite).
export function parsePage(value: string) {
  return /^[1-9]\d*$/.test(value) ? Number(value) : NaN;
}

export async function newsMetadata(params: Params): Promise<Metadata> {
  if (!Number.isInteger(params.page)) return {};
  const [base, data, t] = await Promise.all([
    sectionMetadata("news"),
    params.category ? getPosts(params, { perspective: "published", stega: false }) : null,
    getTranslations("News"),
  ]);
  const title = data?.category?.title ?? (base.title as string | undefined);
  if (!title) return base;
  return {
    ...base,
    title: params.page > 1 ? t("pageTitle", { title, page: params.page }) : title,
  };
}

// Lista de Actualité: todos los artículos o los de una categoría, paginada.
export function NewsList(params: Params) {
  return <WithFetchOptions>{(options) => <List params={params} {...options} />}</WithFetchOptions>;
}

async function List({ params, ...fetchOptions }: { params: Params } & DynamicFetchOptions) {
  const { page, category } = params;
  if (!Number.isInteger(page) || page < 1) notFound();
  const [section, data, t, tNav] = await Promise.all([
    getSectionPage("news", fetchOptions),
    getPosts(params, fetchOptions),
    getTranslations("News"),
    getTranslations("Navigation"),
  ]);
  if (!section || !data || (category && !data.category)) notFound();

  const totalPages = Math.max(1, Math.ceil(data.total / POSTS_PER_PAGE));
  if (page > totalPages) notFound();

  // Migas: Accueil › Actualité › Categoría › Página N (la última sin enlace).
  const trail: Crumb[] = [{ label: tNav("news"), href: newsHref(1) }];
  if (data.category) trail.push({ label: data.category.title, href: newsHref(1, category) });
  const current = page > 1 ? t("page", { page }) : trail.pop()!.label;

  // Una categoría tiene su propio slug en cada idioma.
  const alternates = data.category
    ? alternatesFor(data.category.translations, ({ slug }) => (slug ? newsHref(1, slug) : null))
    : null;

  return (
    <main>
      {alternates && <PageAlternates alternates={alternates} />}
      <PageHero
        breadcrumbs={<Breadcrumbs items={trail} current={current} />}
        eyebrow={section.eyebrow}
        title={data.category?.title ?? section.title}
        lead={data.category ? null : section.lead}
      />

      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[1320px] px-7 py-24">
          {!!data.categories.length && (
            <CategoryFilter categories={data.categories} current={category} />
          )}
          {data.posts.length ? (
            <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {data.posts.map((post) => (
                <li key={post._id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-on-paper-body">{t("empty")}</p>
          )}
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} category={category} />}
        </div>
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
