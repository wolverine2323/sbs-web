import { Heading } from "../Heading";
import { SealBadge } from "../SealBadge";
import { SectionEyebrow } from "../SectionEyebrow";
import type { HomeContent } from "./types";

// Sellos de embajadas (solo texto) y distinciones (sobre paper).
export function RecognitionSection({
  recognition,
}: {
  recognition: NonNullable<HomeContent["recognition"]>;
}) {
  const embassies = recognition.embassies ?? [];
  const distinctions = recognition.distinctions ?? [];

  return (
    <section className="bg-paper text-on-paper">
      <div className="mx-auto max-w-[1320px] px-7 py-28 text-center">
        {recognition.eyebrow && <SectionEyebrow tone="light">{recognition.eyebrow}</SectionEyebrow>}
        {recognition.title && (
          <Heading size="feature" className="mx-auto mt-5 max-w-[760px]">
            {recognition.title}
          </Heading>
        )}
        <div className="mt-16 flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-14">
          {embassies.map((seal) => (
            <SealBadge key={seal._key} label={seal.name ?? ""} caption={seal.caption ?? ""} />
          ))}
          {!!embassies.length && !!distinctions.length && (
            <span aria-hidden="true" className="w-px self-stretch bg-on-paper/15 max-md:hidden" />
          )}
          {distinctions.map((seal) => (
            <SealBadge
              key={seal._key}
              variant="distinction"
              label={seal.name ?? ""}
              caption={seal.caption ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
