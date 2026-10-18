import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { stegaClean } from "next-sanity";
import { Link } from "@/i18n/navigation";
import { readingMinutes } from "@/lib/portable-text";
import { urlFor } from "@/sanity/lib/image";
import type { POSTS_PAGE_QUERY_RESULT } from "@/sanity/types";

export type PostSummary = POSTS_PAGE_QUERY_RESULT["posts"][number];

// Fecha y tiempo de lectura: "12 octobre 2026 · 4 min de lecture".
export function PostMeta({ post, className }: { post: Pick<PostSummary, "publishedAt" | "words">; className?: string }) {
  const format = useFormatter();
  const t = useTranslations("News");
  return (
    <p className={className}>
      <time dateTime={stegaClean(post.publishedAt)}>
        {format.dateTime(new Date(stegaClean(post.publishedAt)), { dateStyle: "long" })}
      </time>
      <span aria-hidden="true"> · </span>
      {t("readingTime", { minutes: readingMinutes(post.words) })}
    </p>
  );
}

// Tarjeta de artículo (sobre paper). Toda la tarjeta es el enlace.
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex h-full flex-col border-t border-on-paper/14 pt-6">
      {post.image?.asset && (
        <div className="relative mb-6 aspect-[3/2] overflow-hidden bg-on-paper/5">
          <Image
            src={urlFor(post.image).width(900).height(600).url()}
            alt={post.image.alt ?? ""}
            fill
            sizes="(min-width: 1100px) 400px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      {post.category && (
        <p className="text-[11px] tracking-[0.3em] text-burgundy uppercase">{post.category.title}</p>
      )}
      <h2 className="mt-3 font-serif text-[clamp(26px,2.2vw,30px)] leading-[1.15] text-on-paper">
        <Link
          href={{ pathname: "/actualite/[slug]", params: { slug: post.slug } }}
          className="transition-colors after:absolute after:inset-0 group-hover:text-burgundy focus-visible:outline-on-paper"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="mt-4 text-[15px] leading-[1.7] text-on-paper-body">{post.excerpt}</p>
      )}
      <PostMeta post={post} className="mt-auto pt-6 text-[13px] text-on-paper-body" />
    </article>
  );
}
