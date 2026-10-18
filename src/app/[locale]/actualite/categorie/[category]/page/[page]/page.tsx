import type { Metadata } from "next";
import { NEWS_TAGS, NewsList, newsMetadata, parsePage } from "@/components/news/NewsList";
import { POSTS_PER_PAGE } from "@/components/news/newsHref";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { POST_COUNTS_QUERY } from "@/sanity/lib/queries";

// Actualité filtrada por categoría, páginas 2, 3…

type Props = PageProps<"/[locale]/actualite/categorie/[category]/page/[page]">;

export async function generateStaticParams() {
  const { data } = await cachedSanity({
    query: POST_COUNTS_QUERY,
    params: { language: await currentLocale() },
    tags: NEWS_TAGS,
    perspective: "published",
    stega: false,
  });
  const params = data.categories.flatMap(({ slug, total }) =>
    Array.from({ length: Math.max(0, Math.ceil(total / POSTS_PER_PAGE) - 1) }, (_, i) => ({
      category: slug,
      page: String(i + 2),
    })),
  );
  return withPlaceholder(params, { category: PLACEHOLDER, page: "2" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  return newsMetadata({ page: parsePage(page), category });
}

export default async function CategoryPageN({ params }: Props) {
  const { category, page } = await params;
  const n = parsePage(page);
  // La página 1 es /actualite/categorie/(slug).
  return <NewsList page={n > 1 ? n : NaN} category={category} />;
}
