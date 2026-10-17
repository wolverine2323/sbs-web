import { useTranslations } from "next-intl";
import { ButtonPrimary } from "../ButtonPrimary";
import { ContactList } from "../ContactList";
import { Heading } from "../Heading";
import { SectionEyebrow } from "../SectionEyebrow";
import type { Contact, HomeContent } from "./types";

type Props = {
  block: NonNullable<HomeContent["contact"]>;
  contact: Contact & { address: string };
};

export function ContactSection({ block, contact }: Props) {
  const t = useTranslations("Common");

  return (
    <section id="contact" className="scroll-mt-[92px] border-b border-bronze-light/16">
      <div className="mx-auto flex max-w-[1320px] flex-wrap gap-16 px-7 pt-32 pb-24">
        <div className="min-w-0 flex-[1.3_1_520px]">
          {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
          {block.title && (
            <Heading size="contact" className="mt-6">
              {block.title}
            </Heading>
          )}
          {block.body && (
            <p className="mt-7 max-w-[520px] text-base leading-[1.7] text-stone">{block.body}</p>
          )}
          <ButtonPrimary href={contact.bookingUrl} track="book_click" className="mt-10">
            {t("cta")}
          </ButtonPrimary>
        </div>
        <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-end">
          <ContactList address={contact.address} phone={contact.phone} email={contact.email} />
        </div>
      </div>
    </section>
  );
}
