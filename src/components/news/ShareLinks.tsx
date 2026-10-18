import { useTranslations } from "next-intl";
import { CopyLinkButton } from "./CopyLinkButton";

type Props = { url: string; title: string };

const pill =
  "inline-flex min-h-11 min-w-11 items-center justify-center border border-on-paper/25 px-4 text-[12px] font-semibold tracking-[0.12em] text-on-paper uppercase transition-colors hover:border-on-paper focus-visible:outline-on-paper";

// Compartir un artículo: enlaces directos a cada red (sin scripts de terceros).
// Los nombres de las redes son marcas: no se traducen.
export function ShareLinks({ url, title }: Props) {
  const t = useTranslations("News");
  const tContact = useTranslations("Contact");
  const u = encodeURIComponent(url);
  const networks = [
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", href: `https://x.com/intent/post?url=${u}&text=${encodeURIComponent(title)}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-3 text-[11px] tracking-[0.3em] text-bronze-text uppercase">{t("share")}</p>
      {networks.map((network) => (
        <a
          key={network.name}
          href={network.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareOn", { network: network.name })}
          className={pill}
        >
          {network.name}
        </a>
      ))}
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${u}`}
        aria-label={t("shareByEmail")}
        className={pill}
      >
        {tContact("email")}
      </a>
      <CopyLinkButton label={t("copyLink")} copiedLabel={t("copied")} className={pill} />
    </div>
  );
}
