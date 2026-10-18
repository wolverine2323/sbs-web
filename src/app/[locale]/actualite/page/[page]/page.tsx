import type { Metadata } from "next";
import { NEWS_TAGS, NewsList, newsMetadata, parsePage } from "@/components/news/NewsList";
import { POSTS_PER_PAGE } from "@/components/news/newsHref";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity } from "@/sanity/lib/live";
import { withPlaceholder } from "@/sanity/lib/params";
import { POST_COUNTS_QUERY } from "@/sanity/lib/queries";

// Actualité, páginas 2, 3…

type Props = PageProps<"/[locale]/actualite/page/[page]">;

export async function generateStaticParams() {
  const { data } = await cachedSanity({
    query: POST_COUNTS_QUERY,
    params: { language: await currentLocale() },
    tags: NEWS_TAGS,
    perspective: "published",
    stega: false,
  });
  const pages = Math.ceil(data.total / POSTS_PER_PAGE);
  const params = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
  return withPlaceholder(params, { page: "2" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return newsMetadata({ page: parsePage((await params).page) });
}

export default async function NewsPageN({ params }: Props) {
  const page = parsePage((await params).page);
  // La página 1 es /actualite.
  return <NewsList page={page > 1 ? page : NaN} />;
}
