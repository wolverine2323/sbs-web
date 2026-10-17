import type { TESTIMONIALS_QUERY_RESULT } from "@/sanity/types";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import { TestimonialCarousel } from "../TestimonialCarousel";
import type { HomeContent } from "./types";

type Props = {
  block: NonNullable<HomeContent["testimonials"]>;
  testimonials: TESTIMONIALS_QUERY_RESULT;
};

export function TestimonialsSection({ block, testimonials }: Props) {
  const items = testimonials
    .filter((item) => item.quote)
    .map((item) => ({ quote: item.quote ?? "", name: item.author, role: item.role ?? "" }));
  if (!items.length) return null;

  return (
    <section id="experiences" className="scroll-mt-[92px] bg-burgundy-deep">
      <div className="mx-auto flex max-w-[980px] flex-col items-center px-7 pt-[136px] pb-28 text-center">
        {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
        {block.title && (
          <Heading size="sub" className="mt-5 mb-14">
            {block.title}
          </Heading>
        )}
        <TestimonialCarousel label={block.title ?? ""} items={items} />
      </div>
    </section>
  );
}
