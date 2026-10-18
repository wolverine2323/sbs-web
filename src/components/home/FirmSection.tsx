import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { Heading } from "../Heading";
import { ArrowRightIcon } from "../icons";
import { ImagePlaceholder } from "../ImagePlaceholder";
import { SectionEyebrow } from "../SectionEyebrow";
import type { HomeContent } from "./types";

export function FirmSection({ firm }: { firm: NonNullable<HomeContent["firm"]> }) {
  const t = useTranslations("Common");

  return (
    <section id="firm" className="scroll-mt-[92px] bg-paper text-on-paper">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-20 px-7 py-[136px]">
        <div className="min-w-0 flex-[1.2_1_560px]">
          {firm.eyebrow && <SectionEyebrow tone="light">{firm.eyebrow}</SectionEyebrow>}
          {firm.title && <Heading className="mt-6">{firm.title}</Heading>}
          <div aria-hidden="true" className="my-10 h-px w-16 bg-bronze" />
          {firm.body && (
            <p className="max-w-[620px] text-[17px] leading-[1.8] text-on-paper-body">
              <span className="font-serif text-[22px] font-semibold text-on-paper">
                {t("brand")}
              </span>{" "}
              {firm.body}
            </p>
          )}
          {firm.moreLabel && (
            <Link
              href="/le-cabinet"
              className="mt-10 inline-flex items-center gap-3.5 border-b border-on-paper py-3 text-[13px] font-semibold tracking-[0.14em] uppercase focus-visible:outline-on-paper"
            >
              {firm.moreLabel}
              <ArrowRightIcon size={14} />
            </Link>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_400px] flex-col">
          {firm.photo?.asset ? (
            <div className="relative aspect-[3/4]">
              <Image
                src={urlFor(firm.photo).width(900).height(1200).url()}
                alt={firm.photo.alt ?? ""}
                fill
                sizes="(min-width: 1100px) 520px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <ImagePlaceholder label={firm.photoLabel ?? ""} />
          )}
          {!!firm.highlights?.length && (
            <ul className="grid grid-cols-2 border-l border-on-paper/14">
              {firm.highlights.map((item) => (
                <li
                  key={item}
                  className="border-r border-b border-on-paper/14 px-[18px] py-4 text-[13.5px] leading-[1.4]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
