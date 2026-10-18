import { Link } from "@/i18n/navigation";
import { pad2 } from "@/lib/format";
import { ButtonPrimary } from "../ButtonPrimary";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import type { HomeContent } from "./types";

type Props = {
  guide: NonNullable<HomeContent["guide"]>;
  bookingUrl: string;
};

// Índice de la guía del inversor (sobre paper).
export function GuideSection({ guide, bookingUrl }: Props) {
  const topics = guide.topics?.filter((topic) => topic?.slug) ?? [];

  return (
    <section id="invest" className="scroll-mt-[92px] bg-paper text-on-paper">
      <div className="mx-auto flex max-w-[1320px] flex-wrap gap-[72px] px-7 py-32">
        <div className="min-w-0 flex-[1_1_340px]">
          {guide.eyebrow && <SectionEyebrow tone="light">{guide.eyebrow}</SectionEyebrow>}
          {guide.title && <Heading className="mt-6">{guide.title}</Heading>}
          {guide.lead && (
            <p className="mt-6 max-w-[400px] text-base leading-[1.7] text-on-paper-body">
              {guide.lead}
            </p>
          )}
          {guide.ctaLabel && (
            <ButtonPrimary
              href={bookingUrl}
              size="md"
              tone="light"
              track="book_click"
              className="mt-10"
            >
              {guide.ctaLabel}
            </ButtonPrimary>
          )}
        </div>
        <ol className="min-w-0 flex-[2_1_580px] columns-[2_280px] gap-x-14">
          {topics.map((topic, i) => (
            <li key={topic._id} className="break-inside-avoid border-t border-on-paper/14">
              <Link
                href={{
                  pathname: "/investir-au-costa-rica/[topic]",
                  params: { topic: topic.slug ?? "" },
                }}
                className="flex items-baseline gap-5 py-[22px] transition-colors hover:text-burgundy focus-visible:outline-on-paper"
              >
                <span className="text-xs tracking-[0.1em] text-bronze-text tabular-nums">{pad2(i + 1)}</span>
                <span className="font-serif text-2xl leading-[1.2]">{topic.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
