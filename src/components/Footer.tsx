import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  // Textos del pie por idioma (siteSettings en Sanity).
  body: string;
  rights: string;
};

export function Footer({ body, rights }: Props) {
  const t = useTranslations("Navigation");

  return (
    // pb-24 deja sitio para que WhatsAppFloat no tape el último texto.
    <footer className="mx-auto flex max-w-[1320px] flex-wrap items-start justify-between gap-x-14 gap-y-8 px-7 pt-14 pb-24">
      <div className="flex flex-[2_1_420px] items-start gap-5">
        <Image
          src="/monogram-temp.png"
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 object-contain"
        />
        <p className="max-w-[560px] text-[13.5px] leading-[1.75] text-stone-dim">
          {body}
        </p>
      </div>
      <div className="flex flex-[1_1_240px] flex-col items-end gap-2.5 text-right text-[13px] text-stone-dim">
        <Link
          href="/actualite"
          className="inline-flex min-h-11 min-w-11 items-center justify-end text-bronze-light underline-offset-4 hover:text-cream hover:underline"
        >
          {t("news")}
        </Link>
        <p>{rights}</p>
      </div>
    </footer>
  );
}
