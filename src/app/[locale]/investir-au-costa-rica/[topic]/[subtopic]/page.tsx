import type { Metadata } from "next";
import { GUIDE_TAGS, GuideArticle, guideMetadata } from "@/components/guide/GuideArticle";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { GUIDE_SUBTOPIC_PARAMS_QUERY } from "@/sanity/lib/queries";

// Subtema de la guía, p. ej. «Acquérir la propriété».

type Props = PageProps<"/[locale]/investir-au-costa-rica/[topic]/[subtopic]">;

export async function generateStaticParams() {
  const { data } = await cachedSanity({
    query: GUIDE_SUBTOPIC_PARAMS_QUERY,
    params: { language: await currentLocale() },
    tags: GUIDE_TAGS,
    perspective: "published",
    stega: false,
  });
  const params = data.flatMap(({ topic, subtopic }) => (topic ? [{ topic, subtopic }] : []));
  return withPlaceholder(params, { topic: PLACEHOLDER, subtopic: PLACEHOLDER });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return guideMetadata(await params);
}

export default async function GuideSubtopicPage({ params }: Props) {
  const { topic, subtopic } = await params;
  return <GuideArticle topic={topic} subtopic={subtopic} />;
}
