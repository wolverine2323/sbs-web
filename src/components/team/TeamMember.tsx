import Image from "next/image";
import { useTranslations } from "next-intl";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/cn";
import { mailtoHref } from "@/lib/contact";
import { slugify } from "@/lib/slugify";
import { urlFor } from "@/sanity/lib/image";
import type { TEAM_QUERY_RESULT } from "@/sanity/types";
import { Heading } from "../Heading";
import { ImagePlaceholder } from "../ImagePlaceholder";
import { RichText } from "../RichText";
import { SectionEyebrow } from "../SectionEyebrow";

export type Member = TEAM_QUERY_RESULT[number];

// Ancla de cada persona (el autor de un artículo enlaza aquí).
export const memberAnchor = (name: string) => slugify(name);

function Photo({ member, sizes, className }: { member: Member; sizes: string; className?: string }) {
  if (!member.photo?.asset) {
    return <ImagePlaceholder label={member.name} className={className} />;
  }
  return (
    <div className={cn("relative aspect-[3/4] bg-ink-raised", className)}>
      <Image
        src={urlFor(member.photo).width(900).height(1200).url()}
        alt={member.photo.alt ?? ""}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

// "Français · Espagnol · Anglais"
function SpokenLanguages({ codes, className }: { codes: string[] | null; className?: string }) {
  const t = useTranslations("Team");
  if (!codes?.length) return null;
  const names = codes.map((value) => stegaClean(value)).map((code) =>
    t.has(`languageNames.${code}`) ? t(`languageNames.${code}`) : code,
  );
  return (
    <p className={cn("text-[13px] leading-[1.6]", className)}>
      <span className="sr-only">{t("languages")}: </span>
      {names.join(" · ")}
    </p>
  );
}

// Email de la persona: enlace con objetivo táctil de 44 px y evento email_click.
function Email({ email, className }: { email: string | null; className?: string }) {
  if (!email) return null;
  return (
    <a
      href={mailtoHref(email)}
      data-track="email_click"
      className={cn(
        "inline-flex min-h-11 items-center text-[15px] text-on-paper underline decoration-bronze/45 underline-offset-4 transition-colors hover:text-burgundy-mid",
        className,
      )}
    >
      {email}
    </a>
  );
}

// Tarjeta de abogado colaborador (sobre paper): foto, nombre, cargo, idiomas y email.
export function TeamCard({ member }: { member: Member }) {
  return (
    <article id={memberAnchor(member.name)} className="scroll-mt-[120px]">
      <Photo member={member} sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 100vw" />
      <h2 className="mt-6 font-serif text-[28px] leading-[1.15] text-on-paper">{member.name}</h2>
      {member.role && (
        <p className="mt-2 text-[15px] leading-[1.6] text-on-paper-body">{member.role}</p>
      )}
      <SpokenLanguages
        codes={member.spokenLanguages}
        className="mt-4 border-t border-on-paper/14 pt-4 text-bronze-text"
      />
      <Email email={member.email} className="mt-1" />
    </article>
  );
}

// Perfil completo de un socio fundador (sobre paper): foto y biografía.
export function FounderProfile({ member }: { member: Member }) {
  return (
    <article
      id={memberAnchor(member.name)}
      className="grid scroll-mt-[120px] gap-x-20 gap-y-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <Photo member={member} sizes="(min-width: 768px) 40vw, 100vw" className="md:self-start" />
      <div>
        {member.role && <SectionEyebrow tone="light">{member.role}</SectionEyebrow>}
        <Heading size="section" className="mt-5 text-on-paper">
          {member.name}
        </Heading>
        <SpokenLanguages
          codes={member.spokenLanguages}
          className="mt-6 border-y border-on-paper/14 py-4 text-bronze-text"
        />
        <Email email={member.email} className="mt-3" />
        {member.bio && <RichText value={member.bio} tone="light" />}
      </div>
    </article>
  );
}
