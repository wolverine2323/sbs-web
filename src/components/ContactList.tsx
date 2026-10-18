import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { mailtoHref, telHref } from "@/lib/contact";
import type { Tone } from "./tone";

type Props = {
  address: string;
  phone: string;
  email: string;
  tone?: Tone;
  // Debajo de la dirección, p. ej. «Ouvrir dans Google Maps».
  addressExtra?: ReactNode;
};

const tones = {
  dark: {
    row: "border-bronze-light/25",
    label: "text-bronze-light",
    link: "text-cream hover:text-bronze-light",
  },
  light: {
    row: "border-on-paper/14",
    label: "text-bronze-text",
    link: "text-on-paper hover:text-burgundy focus-visible:outline-on-paper",
  },
} satisfies Record<Tone, Record<string, string>>;

function Row({ label, tone, children }: { label: string; tone: Tone; children: ReactNode }) {
  return (
    <div className={cn("border-t py-[22px] last:border-b", tones[tone].row)}>
      <dt className={cn("text-[11px] tracking-[0.3em] uppercase", tones[tone].label)}>{label}</dt>
      <dd className="mt-2.5">{children}</dd>
    </div>
  );
}

// Dirección, teléfono y email (sobre ink o paper).
export function ContactList({ address, phone, email, tone = "dark", addressExtra }: Props) {
  const t = useTranslations("Contact");
  const c = tones[tone];
  const linkClass = cn("inline-flex min-h-11 items-center font-serif text-[28px]", c.link);

  return (
    <dl className="flex flex-col">
      <Row label={t("address")} tone={tone}>
        <p className="text-base leading-[1.55]">{address}</p>
        {addressExtra}
      </Row>
      <Row label={t("phone")} tone={tone}>
        <a href={telHref(phone)} data-track="phone_click" className={linkClass}>
          {phone}
        </a>
      </Row>
      <Row label={t("email")} tone={tone}>
        <a href={mailtoHref(email)} data-track="email_click" className={linkClass}>
          {email}
        </a>
      </Row>
    </dl>
  );
}
