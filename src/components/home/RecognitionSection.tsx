import { imageDimensions, logoUrl } from "@/sanity/lib/image";
import { Heading } from "../Heading";
import { SealBadge, type SealLogo } from "../SealBadge";
import { SectionEyebrow } from "../SectionEyebrow";
import type { HomeContent } from "./types";

type Seal = NonNullable<NonNullable<HomeContent["recognition"]>["embassies"]>[number];

// Alto máximo del logo en pantalla (sm:h-[88px] en SealBadge).
const LOGO_HEIGHT = 88;

function sealLogo(logo: Seal["logo"]): SealLogo | null {
  const size = imageDimensions(logo?.asset?._ref);
  return logo && size ? { src: logoUrl(logo, LOGO_HEIGHT), ...size } : null;
}

// Embajadas y distinciones (sobre paper): el logo de cada una (autorizados
// por la firma) o, si no lo tiene, su sello de texto.
export function RecognitionSection({
  recognition,
}: {
  recognition: NonNullable<HomeContent["recognition"]>;
}) {
  const embassies = recognition.embassies ?? [];
  const distinctions = recognition.distinctions ?? [];
  const group = "flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-10";

  return (
    <section className="bg-paper text-on-paper">
      <div className="mx-auto max-w-[1320px] px-7 py-28 text-center">
        {recognition.eyebrow && <SectionEyebrow tone="light">{recognition.eyebrow}</SectionEyebrow>}
        {recognition.title && (
          <Heading size="feature" className="mx-auto mt-5 max-w-[760px]">
            {recognition.title}
          </Heading>
        )}
        {/* Embajadas | distinciones en una línea desde 1280 px; debajo, una fila por grupo. */}
        <div className="mt-16 flex flex-wrap justify-center gap-y-10 xl:flex-nowrap xl:gap-x-10">
          <div className={group}>
            {embassies.map((seal) => (
              <SealBadge
                key={seal._key}
                label={seal.name ?? ""}
                caption={seal.caption ?? ""}
                logo={sealLogo(seal.logo)}
              />
            ))}
          </div>
          {!!embassies.length && !!distinctions.length && (
            <span aria-hidden="true" className="w-px self-stretch bg-on-paper/15 max-xl:hidden" />
          )}
          <div className={group}>
            {distinctions.map((seal) => (
              <SealBadge
                key={seal._key}
                variant="distinction"
                label={seal.name ?? ""}
                caption={seal.caption ?? ""}
                logo={sealLogo(seal.logo)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
