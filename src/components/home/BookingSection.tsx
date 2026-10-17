import { BookingCard } from "../BookingCard";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import { StepList } from "../StepList";
import type { Contact, HomeContent } from "./types";

type Props = {
  steps: HomeContent["steps"];
  booking: HomeContent["booking"];
  contact: Contact;
};

// Pasos de la primera cita y tarjeta de reserva (sobre ink).
export function BookingSection({ steps, booking, contact }: Props) {
  const items = (steps?.items ?? []).map((step) => ({
    title: step.title ?? "",
    description: step.description ?? "",
  }));

  return (
    <section
      id="booking"
      className="mx-auto flex max-w-[1320px] scroll-mt-[92px] flex-wrap items-stretch gap-[72px] px-7 py-[136px]"
    >
      <div className="min-w-0 flex-[1.2_1_520px]">
        {steps?.eyebrow && <SectionEyebrow>{steps.eyebrow}</SectionEyebrow>}
        {steps?.title && <Heading className="mt-6">{steps.title}</Heading>}
        {!!items.length && (
          <div className="mt-14">
            <StepList steps={items} />
          </div>
        )}
      </div>
      {booking && (
        <div className="min-w-0 flex-[1_1_400px] md:max-w-[480px]">
          <BookingCard
            tag={booking.tag ?? ""}
            title={booking.title ?? ""}
            body={booking.body ?? ""}
            buttonLabel={booking.buttonLabel ?? ""}
            alternative={booking.alternative ?? ""}
            bookingUrl={contact.bookingUrl}
            phone={contact.phone}
            email={contact.email}
          />
        </div>
      )}
    </section>
  );
}
