import type { Metadata } from "next";
import { NEWS_TAGS, NewsList, newsMetadata } from "@/components/news/NewsList";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { POST_COUNTS_QUERY } from "@/sanity/lib/queries";

// Actualité filtrada por categoría (página 1).

type Props = PageProps<"/[locale]/actualite/categorie/[category]">;

export async function generateStaticParams() {
  const { data } = await cachedSanity({
    query: POST_COUNTS_QUERY,
    params: { language: await currentLocale() },
    tags: NEWS_TAGS,
    perspective: "published",
    stega: false,
  });
  const params = data.categories
    .filter((category) => category.total > 0)
    .map((category) => ({ category: category.slug }));
  return withPlaceholder(params, { category: PLACEHOLDER });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return newsMetadata({ page: 1, category: (await params).category });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return <NewsList page={1} category={category} />;
}
