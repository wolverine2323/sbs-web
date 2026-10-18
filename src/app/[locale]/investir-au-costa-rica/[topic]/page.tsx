import type { Metadata } from "next";
import { GUIDE_TAGS, GuideArticle, guideMetadata } from "@/components/guide/GuideArticle";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { GUIDE_TOPIC_SLUGS_QUERY } from "@/sanity/lib/queries";

// Tema principal de la guía, p. ej. «Propriété et droits immobiliers».

type Props = PageProps<"/[locale]/investir-au-costa-rica/[topic]">;

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: GUIDE_TOPIC_SLUGS_QUERY,
    params: { language: await currentLocale() },
    tags: GUIDE_TAGS,
    perspective: "published",
    stega: false,
  });
  return withPlaceholder(slugs.map((topic) => ({ topic })), { topic: PLACEHOLDER });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return guideMetadata(await params);
}

export default async function GuideTopicPage({ params }: Props) {
  const { topic } = await params;
  return <GuideArticle topic={topic} />;
}
