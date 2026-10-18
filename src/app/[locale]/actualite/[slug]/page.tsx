import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClosingCta } from "@/components/ClosingCta";
import { Heading } from "@/components/Heading";
import { PageAlternates } from "@/components/LocaleAlternates";
import { newsHref } from "@/components/news/newsHref";
import { PostCard, PostMeta } from "@/components/news/PostCard";
import { ShareLinks } from "@/components/news/ShareLinks";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { memberAnchor } from "@/components/team/TeamMember";
import { currentLocale } from "@/i18n/locale";
import { getPathname, Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/alternates";
import { siteUrl } from "@/lib/site";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PLACEHOLDER, withPlaceholder } from "@/sanity/lib/params";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

// Artículo de Actualité: autor, tiempo de lectura, compartir, artículos
// relacionados y CTA final.

type Props = PageProps<"/[locale]/actualite/[slug]">;

// Tipos que aparecen en la página: el webhook /api/revalidate las renueva.
const POST_TAGS = ["post", "teamMember", "category", "translation.metadata"];

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: POST_SLUGS_QUERY,
    params: { language: await currentLocale() },
    perspective: "published",
    stega: false,
    tags: POST_TAGS,
  });
  return withPlaceholder(slugs.map((slug) => ({ slug })), { slug: PLACEHOLDER });
}

async function getPost(slug: string, fetchOptions: DynamicFetchOptions) {
  const { data } = await cachedSanity({
    query: POST_QUERY,
    params: { language: await currentLocale(), slug },
    tags: POST_TAGS,
    ...fetchOptions,
  });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug, { perspective: "published", stega: false });
  if (!post) return {};
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  return <WithFetchOptions>{(options) => <Post slug={slug} {...options} />}</WithFetchOptions>;
}

async function Post({ slug, ...fetchOptions }: { slug: string } & DynamicFetchOptions) {
  const locale = await currentLocale();
  const [post, t, tNav] = await Promise.all([
    getPost(slug, fetchOptions),
    getTranslations("News"),
    getTranslations("Navigation"),
  ]);
  if (!post) notFound();

  const image = imageDimensions(post.image?.asset?._ref);
  const { author } = post;
  const authorHref = author && {
    pathname:
      stegaClean(author.kind) === "founder"
        ? ("/le-cabinet/associes-fondateurs" as const)
        : ("/le-cabinet/avocats-collaborateurs" as const),
    hash: memberAnchor(author.name),
  };
  const url = siteUrl + getPathname({ locale, href: { pathname: "/actualite/[slug]", params: { slug } } });
  const alternates = alternatesFor(post.translations, (translation) =>
    translation.slug
      ? { pathname: "/actualite/[slug]", params: { slug: translation.slug } }
      : null,
  );

  return (
    <main>
      <PageAlternates alternates={alternates} />
      <PageHero
        breadcrumbs={
          <Breadcrumbs items={[{ label: tNav("news"), href: newsHref(1) }]} current={post.title} />
        }
        eyebrow={post.category?.title ?? tNav("news")}
        title={post.title}
        lead={post.excerpt}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone">
          {author && <p>{t("by", { name: author.name })}</p>}
          <PostMeta post={post} />
        </div>
      </PageHero>

      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[840px] px-7 py-24">
          {post.image?.asset && image && (
            <Image
              src={urlFor(post.image).width(1600).url()}
              alt={post.image.alt ?? ""}
              width={image.width}
              height={image.height}
              sizes="(min-width: 900px) 784px, 100vw"
              priority
              className="mb-14 h-auto w-full"
            />
          )}
          {post.body && (
            <article className="[&>*:first-child]:mt-0">
              <RichText value={post.body} tone="light" />
            </article>
          )}

          <div className="mt-16 border-t border-on-paper/14 pt-8">
            <ShareLinks url={url} title={post.title} />
          </div>

          {author && authorHref && (
            <div className="mt-12 flex items-center gap-6 border border-on-paper/14 p-6">
              {author.photo?.asset && (
                <Image
                  src={urlFor(author.photo).width(160).height(160).url()}
                  alt=""
                  width={80}
                  height={80}
                  className="size-20 shrink-0 object-cover"
                />
              )}
              <div>
                <SectionEyebrow tone="light" variant="small">
                  {t("author")}
                </SectionEyebrow>
                <Link
                  href={authorHref}
                  className="mt-2 inline-flex min-h-11 items-center font-serif text-[26px] leading-[1.15] transition-colors hover:text-burgundy focus-visible:outline-on-paper"
                >
                  {author.name}
                </Link>
                {author.role && (
                  <p className="text-[14px] leading-[1.6] text-on-paper-body">{author.role}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {!!post.related.length && (
          <div className="border-t border-on-paper/14">
            <div className="mx-auto max-w-[1320px] px-7 py-24">
              <Heading size="sub" className="mb-12">
                {t("related")}
              </Heading>
              <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {post.related.map((related) => (
                  <li key={related._id}>
                    <PostCard post={related} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
