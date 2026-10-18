import { NewsList, newsMetadata } from "@/components/news/NewsList";

// Actualité: últimos artículos (página 1).

export const generateMetadata = () => newsMetadata({ page: 1 });

export default function NewsPage() {
  return <NewsList page={1} />;
}
