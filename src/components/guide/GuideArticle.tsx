import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { currentLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/alternates";
import { tableOfContents } from "@/lib/portable-text";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { GUIDE_ARTICLE_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";
import { Breadcrumbs, type Crumb } from "../Breadcrumbs";
import { ClosingCta } from "../ClosingCta";
import { HeroActions } from "../HeroActions";
import { ArrowRightIcon } from "../icons";
import { PageAlternates } from "../LocaleAlternates";
import { PageHero } from "../PageHero";
import { RichText } from "../RichText";
import { GuideAside, type TopicLink } from "./GuideAside";

// Tipos que aparecen en la página: el webhook /api/revalidate las renueva.
export const GUIDE_TAGS = ["investGuide", "translation.metadata"];

// Un tema (topic) o un subtema (topic + subtopic) de la guía.
type Params = { topic: string; subtopic?: string };

async function getArticle({ topic, subtopic }: Params, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: GUIDE_ARTICLE_QUERY,
    params: {
      language: await currentLocale(),
      slug: subtopic ?? topic,
      topic: subtopic ? topic : "",
    },
    tags: GUIDE_TAGS,
    ...fetchOptions,
  });
  return data;
}

export async function guideMetadata(params: Params): Promise<Metadata> {
  const article = await getArticle(params, { perspective: "published", stega: false });
  if (!article) return {};
  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.summary || undefined,
  };
}

const topicHref = (topic: string) =>
  ({ pathname: "/investir-au-costa-rica/[topic]", params: { topic } }) as const;
const subtopicHref = (topic: string, subtopic: string) =>
  ({ pathname: "/investir-au-costa-rica/[topic]/[subtopic]", params: { topic, subtopic } }) as const;

// Artículo de la guía: migas de pan, índice lateral y subtemas.
export function GuideArticle(params: Params) {
  return (
    <WithFetchOptions>{(options) => <Article params={params} {...options} />}</WithFetchOptions>
  );
}

async function Article({ params, ...fetchOptions }: { params: Params } & DynamicFetchOptions) {
  const [article, settings, t, tNav] = await Promise.all([
    getArticle(params, fetchOptions),
    getSiteSettings(await currentLocale()),
    getTranslations("Guide"),
    getTranslations("Navigation"),
  ]);
  if (!article || !settings) notFound();

  const { parent } = article;
  const crumbs: Crumb[] = [{ label: tNav("invest"), href: "/investir-au-costa-rica" }];
  if (parent) crumbs.push({ label: parent.title, href: topicHref(parent.slug) });

  // Artículos del tema: el tema y sus subtemas (o los subtemas de este tema).
  const topicLinks: TopicLink[] = parent
    ? [
        { id: parent._id, title: parent.title, href: topicHref(parent.slug) },
        ...article.siblings.map((sibling) => ({
          id: sibling._id,
          title: sibling.title,
          href: subtopicHref(parent.slug, sibling.slug),
          current: sibling._id === article._id,
        })),
      ]
    : [
        { id: article._id, title: article.title, href: topicHref(params.topic), current: true },
        ...article.children.map((child) => ({
          id: child._id,
          title: child.title,
          href: subtopicHref(params.topic, child.slug),
        })),
      ];

  const alternates = alternatesFor(article.translations, ({ slug, parentSlug }) => {
    if (!slug) return null;
    return parentSlug ? subtopicHref(parentSlug, slug) : topicHref(slug);
  });

  return (
    <main>
      <PageAlternates alternates={alternates} />
      <PageHero
        breadcrumbs={<Breadcrumbs items={crumbs} current={article.title} />}
        eyebrow={parent?.title ?? tNav("invest")}
        title={article.title}
        lead={article.summary}
      >
        <HeroActions bookingUrl={settings.bookingUrl} phone={settings.phone} />
      </PageHero>

      <section className="bg-paper text-on-paper">
        {article.body?.length ? (
          <div className="mx-auto grid max-w-[1320px] gap-x-20 gap-y-14 px-7 py-24 lg:grid-cols-[260px_minmax(0,1fr)]">
            <GuideAside headings={tableOfContents(article.body)} topics={topicLinks} />
            <article className="max-w-[760px] min-w-0 [&>*:first-child]:mt-0">
              <RichText value={article.body} tone="light" />
            </article>
          </div>
        ) : (
          <div className="mx-auto max-w-[1320px] px-7 py-24">
            {article.children.length ? (
              <ul className="grid gap-x-16 border-t border-on-paper/14 md:grid-cols-2">
                {article.children.map((child) => (
                  <li key={child._id} className="border-b border-on-paper/14">
                    <Link
                      href={subtopicHref(params.topic, child.slug)}
                      className="group flex items-start justify-between gap-6 py-8 transition-colors hover:text-burgundy focus-visible:outline-on-paper"
                    >
                      <span>
                        <span className="block font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.2]">
                          {child.title}
                        </span>
                        {child.summary && (
                          <span className="mt-3 block text-[15px] leading-[1.7] text-on-paper-body">
                            {child.summary}
                          </span>
                        )}
                      </span>
                      <ArrowRightIcon className="mt-2 shrink-0 transition-transform duration-250 group-hover:translate-x-1.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-on-paper-body">{t("topicsEmpty")}</p>
            )}
          </div>
        )}
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
