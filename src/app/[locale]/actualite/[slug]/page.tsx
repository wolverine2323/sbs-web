import type { Metadata } from "next";
import { getFormatter } from "next-intl/server";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { Heading } from "@/components/Heading";
import { RichText } from "@/components/RichText";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { imageDimensions, urlFor } from "@/sanity/lib/image";
import {
  cachedSanity,
  getDynamicFetchOptions,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

// Página mínima de artículo para comprobar la conexión con Sanity.
// El diseño completo y las rutas traducidas llegan en la Fase 5.

type Props = PageProps<"/[locale]/actualite/[slug]">;

// Tipos que aparecen en la página: el webhook /api/revalidate las renueva.
const POST_TAGS = ["post", "teamMember", "category", "translation.metadata"];

// Cache Components exige al menos un slug por idioma. Mientras no haya
// artículos publicados se prerenderiza este, que responde 404.
const NO_POSTS_YET = "_";

export async function generateStaticParams() {
  const { data: slugs } = await cachedSanity({
    query: POST_SLUGS_QUERY,
    params: { language: await rootLocale() },
    perspective: "published",
    stega: false,
    tags: POST_TAGS,
  });
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: NO_POSTS_YET }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await cachedSanity({
    query: POST_QUERY,
    params: { language: await rootLocale(), slug },
    perspective: "published",
    stega: false,
    tags: POST_TAGS,
  });
  if (!post) return {};
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense>
        <DraftPost params={params} />
      </Suspense>
    );
  }
  const { slug } = await params;
  return <Post slug={slug} perspective="published" stega={false} />;
}

// Vista previa desde el Studio: borradores y edición con clic.
async function DraftPost({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  return <Post slug={slug} {...await getDynamicFetchOptions()} />;
}

async function Post({ slug, ...fetchOptions }: { slug: string } & DynamicFetchOptions) {
  const { data: post } = await cachedSanity({
    query: POST_QUERY,
    params: { language: await rootLocale(), slug },
    tags: POST_TAGS,
    ...fetchOptions,
  });
  if (!post) notFound();

  const format = await getFormatter();
  const image = imageDimensions(post.image?.asset?._ref);

  return (
    <main className="mx-auto max-w-[760px] px-7 pt-24 pb-32">
      <article>
        {post.category && <SectionEyebrow>{post.category}</SectionEyebrow>}
        <Heading as="h1" size="section" className="mt-6">
          {post.title}
        </Heading>
        <p className="mt-6 text-sm text-stone-dim">
          <time dateTime={post.publishedAt}>
            {format.dateTime(new Date(post.publishedAt), { dateStyle: "long" })}
          </time>
          {post.author && ` · ${post.author.name}`}
        </p>
        {post.image && image && (
          <Image
            src={urlFor(post.image).width(1600).url()}
            alt={post.image.alt ?? ""}
            width={image.width}
            height={image.height}
            sizes="(min-width: 820px) 760px, 100vw"
            priority
            className="mt-12 h-auto w-full"
          />
        )}
        {post.body && <RichText value={post.body} />}
      </article>
    </main>
  );
}
