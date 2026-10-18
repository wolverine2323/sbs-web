import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { CASE_STUDIES_QUERY_RESULT } from "@/sanity/types";

export type CaseSummary = CASE_STUDIES_QUERY_RESULT[number];

// Tarjeta de caso (sobre paper): foto, título y resumen. Toda la tarjeta es el enlace.
export function CaseCard({ item }: { item: CaseSummary }) {
  return (
    <article className="group relative flex h-full flex-col border-t border-on-paper/14 pt-6">
      {/* Sin imagen, el monograma: todas las tarjetas de una fila quedan alineadas. */}
      <div className="relative mb-6 aspect-[3/2] overflow-hidden bg-on-paper/5">
        {item.image?.asset ? (
          <Image
            src={urlFor(item.image).width(900).height(600).url()}
            alt={item.image.alt ?? ""}
            fill
            sizes="(min-width: 1100px) 400px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <Image
            src="/monogram-temp.png"
            alt=""
            width={64}
            height={64}
            className="absolute inset-0 m-auto size-16 object-contain opacity-25 grayscale"
          />
        )}
      </div>
      <h3 className="font-serif text-[clamp(26px,2.2vw,30px)] leading-[1.15] text-on-paper">
        <Link
          href={{ pathname: "/experiences/[slug]", params: { slug: item.slug } }}
          className="inline-block min-h-11 transition-colors after:absolute after:inset-0 group-hover:text-burgundy focus-visible:outline-on-paper"
        >
          {item.title}
        </Link>
      </h3>
      {item.summary && (
        <p className="mt-4 text-[15px] leading-[1.7] text-on-paper-body">{item.summary}</p>
      )}
    </article>
  );
}
