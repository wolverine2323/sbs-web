import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { slugify } from "@/lib/slugify";
import type { SERVICE_QUERY_RESULT } from "@/sanity/types";
import { ButtonPrimary } from "../ButtonPrimary";
import { Heading } from "../Heading";
import { ArrowRightIcon, PlusIcon } from "../icons";
import { SectionEyebrow } from "../SectionEyebrow";
import { toneClasses, type Tone } from "../tone";

// Secciones de la plantilla de servicio que pueden ir sobre ink o sobre paper,
// para que la página alterne fondos según los bloques que tenga cada servicio.

type Service = NonNullable<SERVICE_QUERY_RESULT>;
type Audience = NonNullable<Service["audiences"]>[number];

export const audienceAnchor = (audience: Pick<Audience, "title">) => slugify(audience.title);

// Accesos a cada público, justo debajo del hero (sobre ink).
export function AudienceNav({ audiences }: { audiences: Audience[] }) {
  const t = useTranslations("Service");
  return (
    <nav aria-label={t("audiences")} className="border-b border-bronze-light/16">
      <ul className="mx-auto grid max-w-[1320px] px-7 md:grid-cols-2">
        {audiences.map((audience) => (
          <li key={audience._key} className="border-bronze-light/16 max-md:not-last:border-b md:not-last:border-r">
            <a
              href={`#${audienceAnchor(audience)}`}
              className="group flex items-center justify-between gap-6 py-8 md:px-8 md:first:pl-0"
            >
              <span>
                {audience.eyebrow && <SectionEyebrow variant="small">{audience.eyebrow}</SectionEyebrow>}
                <span className="mt-3 block font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.2] text-cream">
                  {audience.title}
                </span>
              </span>
              <ArrowRightIcon className="shrink-0 rotate-90 text-bronze-light transition-transform duration-250 group-hover:translate-y-1" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

type AudienceProps = { audience: Audience; tone: Tone; bookingUrl: string };

// Un público: introducción y botón de cita a la izquierda; cifras clave y
// pasos a la derecha.
export function AudienceSection({ audience, tone, bookingUrl }: AudienceProps) {
  const t = useTranslations("Service");
  const tCommon = useTranslations("Common");
  const c = toneClasses[tone];
  const facts = audience.facts ?? [];
  const steps = audience.steps ?? [];

  return (
    <section id={audienceAnchor(audience)} className={cn("scroll-mt-[92px]", c.section)}>
      <div className="mx-auto grid max-w-[1320px] gap-x-20 gap-y-14 px-7 py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-[124px] lg:self-start">
          {audience.eyebrow && <SectionEyebrow tone={tone}>{audience.eyebrow}</SectionEyebrow>}
          <Heading className="mt-6">{audience.title}</Heading>
          {audience.lead && (
            <p className={cn("mt-7 text-[17px] leading-[1.75]", c.muted)}>{audience.lead}</p>
          )}
          <ButtonPrimary href={bookingUrl} size="md" tone={tone} withArrow track="book_click" className="mt-10">
            {audience.ctaLabel || tCommon("cta")}
          </ButtonPrimary>
        </div>
        <div className="min-w-0">
          {!!facts.length && (
            <dl className={cn("grid border-t border-l sm:grid-cols-2", c.rule)}>
              {facts.map((fact) => (
                <div key={fact._key} className={cn("flex flex-col-reverse gap-2 border-r border-b p-6", c.rule)}>
                  {fact.label && <dt className={cn("text-[13px] leading-[1.5]", c.muted)}>{fact.label}</dt>}
                  <dd className={cn("font-serif text-[clamp(28px,2.6vw,36px)] leading-[1.1]", c.heading)}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {!!steps.length && (
            <>
              <SectionEyebrow tone={tone} variant="small" className={cn(facts.length > 0 && "mt-14")}>
                {t("steps")}
              </SectionEyebrow>
              <ol className="mt-5">
                {steps.map((step, i) => (
                  <li key={step._key} className={cn("flex gap-6 border-t py-6", c.rule)}>
                    <span className={cn("w-8 shrink-0 font-serif text-xl italic", c.accent)}>{pad2(i + 1)}</span>
                    <div>
                      <h3 className={cn("text-[17px] font-medium", c.heading)}>{step.title}</h3>
                      {step.description && (
                        <p className={cn("mt-2 text-[15px] leading-[1.65]", c.muted)}>{step.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

type HelpProps = { eyebrow: string; points: NonNullable<Service["helpPoints"]>; tone: Tone };

// «Comment nous vous aidons»: lo que hace el cabinet en este ámbito.
export function HelpPoints({ eyebrow, points, tone }: HelpProps) {
  const t = useTranslations("Service");
  const c = toneClasses[tone];
  return (
    <section className={c.section}>
      <div className="mx-auto max-w-[1320px] px-7 py-28">
        <SectionEyebrow tone={tone}>{eyebrow}</SectionEyebrow>
        <Heading className="mt-6">{t("howWeHelp")}</Heading>
        <ol className="mt-16 grid gap-x-16 md:grid-cols-2">
          {points.map((point, i) => (
            <li key={point._key} className={cn("flex gap-6 border-t py-9", c.rule)}>
              <span className={cn("w-9 shrink-0 font-serif text-xl italic", c.accent)}>{pad2(i + 1)}</span>
              <div>
                <h3 className={cn("font-serif text-[28px] leading-[1.15]", c.heading)}>{point.title}</h3>
                {point.description && (
                  <p className={cn("mt-3 text-[15px] leading-[1.7]", c.muted)}>{point.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type FaqProps = { items: NonNullable<Service["faq"]>; disclaimer?: string | null; tone: Tone };

// Preguntas frecuentes (details/summary: accesibles sin JavaScript) y aviso legal.
export function ServiceFaq({ items, disclaimer, tone }: FaqProps) {
  const t = useTranslations("Service");
  const c = toneClasses[tone];
  return (
    <section className={c.section}>
      <div className="mx-auto max-w-[980px] px-7 py-28">
        {!!items.length && (
          <>
            <Heading size="sub">{t("faq")}</Heading>
            <div className={cn("mt-12 border-b", c.rule)}>
              {items.map((item) => (
                <details key={item._key} className={cn("group border-t", c.rule)}>
                  <summary
                    className={cn(
                      "flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[clamp(21px,2vw,25px)] leading-[1.3] transition-colors [&::-webkit-details-marker]:hidden",
                      c.link,
                    )}
                  >
                    {item.question}
                    <PlusIcon className={cn("shrink-0 transition-transform duration-200 group-open:rotate-45", c.accent)} />
                  </summary>
                  <p className={cn("pb-7 text-[16px] leading-[1.75]", c.muted)}>{item.answer}</p>
                </details>
              ))}
            </div>
          </>
        )}
        {disclaimer && (
          <aside aria-label={t("disclaimer")} className={cn(!!items.length && "mt-14")}>
            <SectionEyebrow tone={tone} variant="small">
              {t("disclaimer")}
            </SectionEyebrow>
            <p className={cn("mt-4 text-[13px] leading-[1.7]", c.muted)}>{disclaimer}</p>
          </aside>
        )}
      </div>
    </section>
  );
}

type OthersProps = {
  label: string;
  title: string;
  services: Service["others"];
  tone: Tone;
};

// Otras expertises, para seguir navegando.
export function OtherServices({ label, title, services, tone }: OthersProps) {
  const c = toneClasses[tone];
  const href = (slug: string): ComponentProps<typeof Link>["href"] => ({
    pathname: "/expertises/[slug]",
    params: { slug },
  });
  return (
    <section className={c.section}>
      <div className="mx-auto max-w-[1320px] px-7 py-28">
        <SectionEyebrow tone={tone}>{label}</SectionEyebrow>
        <Heading size="sub" className="mt-5 mb-12">
          {title}
        </Heading>
        <ul className={cn("grid border-t md:grid-cols-2 md:gap-x-16", c.rule)}>
          {services.map((other) => (
            <li key={other._id} className={cn("border-b", c.rule)}>
              <Link
                href={href(other.slug)}
                className={cn(
                  "group flex min-h-20 items-center justify-between gap-6 py-6 font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.2] transition-colors",
                  c.link,
                )}
              >
                {other.title}
                <ArrowRightIcon className="shrink-0 transition-transform duration-250 group-hover:translate-x-1.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
