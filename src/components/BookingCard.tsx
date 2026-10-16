import { mailtoHref, telHref } from "@/lib/contact";
import { ButtonPrimary } from "./ButtonPrimary";
import { Heading } from "./Heading";
import { SectionEyebrow } from "./SectionEyebrow";

type Props = {
  tag: string;
  title: string;
  body: string;
  buttonLabel: string;
  bookingUrl: string;
  // "Vous préférez nous appeler ou nous écrire ?"
  alternative: string;
  phone: string;
  email: string;
};

// Tarjeta de reserva con marco bronce (sobre ink).
export function BookingCard({
  tag,
  title,
  body,
  buttonLabel,
  bookingUrl,
  alternative,
  phone,
  email,
}: Props) {
  return (
    <div className="border border-bronze-light/45 p-2.5">
      <div className="flex h-full flex-col bg-ink-raised px-6 py-12 sm:px-10">
        <SectionEyebrow variant="small">{tag}</SectionEyebrow>
        <Heading as="h3" size="card" className="mt-5">
          {title}
        </Heading>
        <p className="mt-4 text-[15px] leading-[1.7] text-stone">{body}</p>
        <ButtonPrimary
          href={bookingUrl}
          fullWidth
          track="book_click"
          className="mt-8"
        >
          {buttonLabel}
        </ButtonPrimary>
        <div className="mt-auto flex flex-col items-start pt-8">
          <p className="text-[13px] text-stone-dim">{alternative}</p>
          <a
            href={telHref(phone)}
            data-track="phone_click"
            className="inline-flex min-h-11 items-center font-serif text-[30px] text-cream hover:text-bronze-light"
          >
            {phone}
          </a>
          <a
            href={mailtoHref(email)}
            data-track="email_click"
            className="inline-flex min-h-11 items-center text-[15px] text-bronze-light hover:text-cream"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
