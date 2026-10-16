import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { mailtoHref, telHref } from "@/lib/contact";

type Props = {
  address: string;
  phone: string;
  email: string;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-bronze-light/25 py-[22px] last:border-b">
      <dt className="text-[11px] tracking-[0.3em] text-bronze-light uppercase">
        {label}
      </dt>
      <dd className="mt-2.5">{children}</dd>
    </div>
  );
}

const linkClass =
  "inline-flex min-h-11 items-center font-serif text-[28px] text-cream hover:text-bronze-light";

// Dirección, teléfono y email (sobre ink).
export function ContactList({ address, phone, email }: Props) {
  const t = useTranslations("Contact");

  return (
    <dl className="flex flex-col">
      <Row label={t("address")}>
        <p className="text-base leading-[1.55]">{address}</p>
      </Row>
      <Row label={t("phone")}>
        <a href={telHref(phone)} data-track="phone_click" className={linkClass}>
          {phone}
        </a>
      </Row>
      <Row label={t("email")}>
        <a href={mailtoHref(email)} data-track="email_click" className={linkClass}>
          {email}
        </a>
      </Row>
    </dl>
  );
}
