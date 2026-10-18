import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { BookingCard } from "@/components/BookingCard";
import { ButtonOutline } from "@/components/ButtonOutline";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { ContactList } from "@/components/ContactList";
import { Heading } from "@/components/Heading";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { SealBadge } from "@/components/SealBadge";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ServiceRow } from "@/components/ServiceRow";
import { StepList } from "@/components/StepList";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { telHref } from "@/lib/contact";
import { pad2 } from "@/lib/format";
import { kitContent, kitSettings } from "./fixtures";

// Catálogo de componentes. Solo en desarrollo: en producción responde 404.
// La carpeta se llama %5Fkit porque Next.js ignora las que empiezan por "_".

export const metadata: Metadata = {
  title: "Kit Nocturne",
  robots: { index: false, follow: false },
};

const kitHref = (hash: string) => ({ pathname: "/_kit" as const, hash });

// Nombre del componente que se ve debajo (solo para el kit).
function KitLabel({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <p
      className={cn(
        "mb-10 border-l-2 pl-3 font-mono text-[11px]",
        light ? "border-burgundy text-on-paper-body" : "border-bronze-light text-stone-dim",
      )}
    >
      {name}
    </p>
  );
}

export default async function KitPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const c = kitContent[locale];
  const tNav = await getTranslations("Navigation");
  const tCommon = await getTranslations("Common");


  return (
    <>
      <main>
        {/* Hero: tipografía y botones sobre ink */}
        <section id="hero" className="scroll-mt-[92px] border-b border-bronze-light/16">
          <div className="mx-auto max-w-[1080px] px-7 pt-16">
            <KitLabel name="SectionEyebrow · Heading · ButtonPrimary · ButtonOutline" />
          </div>
          <div className="mx-auto flex max-w-[1080px] flex-col items-center px-7 pt-14 pb-28 text-center">
            <SectionEyebrow variant="hero">{c.hero.eyebrow}</SectionEyebrow>
            <span
              aria-hidden="true"
              className="mt-7 mb-8 h-14 w-px bg-linear-to-b from-bronze-light to-bronze-light/0"
            />
            <Heading as="h1" size="display" accent={c.hero.title2}>
              {c.hero.title1}
            </Heading>
            <p className="mt-10 max-w-[640px] text-lg leading-[1.7] text-stone">
              {c.hero.lead}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3.5">
              <ButtonPrimary href={kitSettings.bookingUrl} withArrow track="book_click">
                {tCommon("cta")}
              </ButtonPrimary>
              <ButtonOutline href={telHref(kitSettings.phone)} track="phone_click">
                {c.heroCta2}
              </ButtonOutline>
            </div>
            <p className="mt-[22px] text-[13px] text-stone-dim">{c.heroNote}</p>
          </div>
        </section>

        {/* Firma: variantes sobre paper e ImagePlaceholder */}
        <section id="firm" className="scroll-mt-[92px] bg-paper text-on-paper">
          <div className="mx-auto max-w-[1320px] px-7 py-[136px]">
            <KitLabel name="SectionEyebrow · Heading · Buttons (tone=light) · ImagePlaceholder" light />
            <div className="flex flex-wrap items-center gap-20">
              <div className="min-w-0 flex-[1.2_1_560px]">
                <SectionEyebrow tone="light">{c.firm.eyebrow}</SectionEyebrow>
                <Heading className="mt-6">{c.firm.title}</Heading>
                <div aria-hidden="true" className="my-10 h-px w-16 bg-bronze" />
                <div className="flex flex-wrap gap-3.5">
                  <ButtonPrimary href={kitSettings.bookingUrl} size="md" tone="light" track="book_click">
                    {c.investCta}
                  </ButtonPrimary>
                  <ButtonOutline href={telHref(kitSettings.phone)} size="md" tone="light" track="phone_click">
                    {c.heroCta2}
                  </ButtonOutline>
                </div>
              </div>
              <ImagePlaceholder label={c.firmPhoto} className="min-w-0 flex-[1_1_400px]" />
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="expertise" className="mx-auto max-w-[1320px] scroll-mt-[92px] px-7 py-[136px]">
          <KitLabel name="ServiceRow" />
          <div className="mb-16 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
            <div>
              <SectionEyebrow>{c.servEyebrow}</SectionEyebrow>
              <Heading className="mt-6">{c.servTitle}</Heading>
            </div>
            <p className="max-w-[380px] text-base leading-[1.7] text-stone">{c.servLead}</p>
          </div>
          <ul className="border-t border-bronze-light/25">
            {c.services.map(([title, description], i) => (
              <li key={title}>
                <ServiceRow
                  number={pad2(i + 1)}
                  title={title}
                  description={description}
                  href={kitHref("expertise")}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Testimonios */}
        <section id="experiences" className="scroll-mt-[92px] bg-burgundy-deep">
          <div className="mx-auto max-w-[980px] px-7 pt-16">
            <KitLabel name="TestimonialCarousel" />
          </div>
          <div className="mx-auto flex max-w-[980px] flex-col items-center px-7 pt-[72px] pb-28 text-center">
            <SectionEyebrow>{c.testiEyebrow}</SectionEyebrow>
            <Heading size="sub" className="mt-5 mb-14">
              {c.testiTitle}
            </Heading>
            <TestimonialCarousel
              label={c.testiTitle}
              items={c.testimonials.map(([quote, name, role]) => ({ quote, name, role }))}
            />
          </div>
        </section>

        {/* Reserva */}
        <section id="booking" className="mx-auto max-w-[1320px] scroll-mt-[92px] px-7 py-[136px]">
          <KitLabel name="StepList · BookingCard" />
          <div className="flex flex-wrap items-stretch gap-[72px]">
            <div className="min-w-0 flex-[1.2_1_520px]">
              <SectionEyebrow>{c.procEyebrow}</SectionEyebrow>
              <Heading className="mt-6 mb-14">{c.procTitle}</Heading>
              <StepList
                steps={c.steps.map(([title, description]) => ({ title, description }))}
              />
            </div>
            <div className="min-w-0 flex-[1_1_400px] md:max-w-[480px]">
              <BookingCard
                tag={c.booking.tag}
                title={c.booking.title}
                body={c.booking.body}
                buttonLabel={c.booking.button}
                bookingUrl={kitSettings.bookingUrl}
                alternative={c.booking.alternative}
                phone={kitSettings.phone}
                email={kitSettings.email}
              />
            </div>
          </div>
        </section>

        {/* Reconocimientos */}
        <section id="recognition" className="scroll-mt-[92px] bg-paper text-on-paper">
          <div className="mx-auto max-w-[1320px] px-7 py-28 text-center">
            <KitLabel name="SealBadge" light />
            <SectionEyebrow tone="light">{c.recoEyebrow}</SectionEyebrow>
            <Heading size="feature" className="mx-auto mt-5 max-w-[760px]">
              {c.recoTitle}
            </Heading>
            <div className="mt-16 flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-14">
              {c.embassies.map(([short, label]) => (
                <SealBadge key={short} label={short} caption={label} />
              ))}
              <span aria-hidden="true" className="w-px self-stretch bg-on-paper/15 max-md:hidden" />
              {kitSettings.distinctions.map((name) => (
                <SealBadge key={name} variant="distinction" label={name} caption={c.distTitle} />
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contact" className="scroll-mt-[92px] border-b border-bronze-light/16">
          <div className="mx-auto max-w-[1320px] px-7 pt-32 pb-24">
            <KitLabel name="ContactList" />
            <div className="flex flex-wrap gap-16">
              <div className="min-w-0 flex-[1.3_1_520px]">
                <SectionEyebrow>{tNav("contact")}</SectionEyebrow>
                <Heading size="contact" className="mt-6">
                  {c.contactTitle}
                </Heading>
                <p className="mt-7 max-w-[520px] text-base leading-[1.7] text-stone">
                  {c.contactBody}
                </p>
                <ButtonPrimary href={kitSettings.bookingUrl} track="book_click" className="mt-10">
                  {tCommon("cta")}
                </ButtonPrimary>
              </div>
              <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-end">
                <ContactList
                  address={c.address}
                  phone={kitSettings.phone}
                  email={kitSettings.email}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Header y Footer los pone el layout con los datos reales de Sanity. */}
      <WhatsAppFloat number={kitSettings.whatsapp} />
    </>
  );
}
