import { pad2 } from "@/lib/format";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import { ServiceRow } from "../ServiceRow";
import type { HomeContent } from "./types";

export function ServicesSection({ services }: { services: NonNullable<HomeContent["services"]> }) {
  const items = services.items?.filter((service) => service?.slug) ?? [];

  return (
    <section id="expertise" className="mx-auto max-w-[1320px] scroll-mt-[92px] px-7 py-[136px]">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <div>
          {services.eyebrow && <SectionEyebrow>{services.eyebrow}</SectionEyebrow>}
          {services.title && <Heading className="mt-6">{services.title}</Heading>}
        </div>
        {services.lead && (
          <p className="max-w-[380px] text-base leading-[1.7] text-stone">{services.lead}</p>
        )}
      </div>
      <ul className="border-t border-bronze-light/25">
        {items.map((service, i) => (
          <li key={service._id}>
            <ServiceRow
              number={pad2(i + 1)}
              title={service.title}
              description={service.summary}
              href={{ pathname: "/expertises/[slug]", params: { slug: service.slug ?? "" } }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
