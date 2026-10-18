import { useTranslations } from "next-intl";
import { stegaClean } from "next-sanity";
import type { ComponentType } from "react";
import { cn } from "@/lib/cn";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./icons";

// Redes de la firma (Ajustes del sitio → Redes sociales): solo las que tienen dirección.

export type SocialLink = { platform: string | null; url: string | null };

// Nombres propios de cada red: iguales en los tres idiomas.
const networks: Record<string, { name: string; Icon: ComponentType<{ size?: number }> }> = {
  instagram: { name: "Instagram", Icon: InstagramIcon },
  linkedin: { name: "LinkedIn", Icon: LinkedInIcon },
  facebook: { name: "Facebook", Icon: FacebookIcon },
  x: { name: "X", Icon: XIcon },
  youtube: { name: "YouTube", Icon: YouTubeIcon },
};

export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  const t = useTranslations("Footer");
  const active = links.flatMap(({ platform, url }) => {
    const network = networks[stegaClean(platform) ?? ""];
    return network && url ? [{ ...network, url }] : [];
  });
  if (!active.length) return null;

  return (
    <ul aria-label={t("social")} className={cn("flex items-center", className)}>
      {active.map(({ name, Icon, url }) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("socialLink", { network: name })}
            className="inline-flex size-11 items-center justify-center text-bronze-light transition-colors hover:text-cream"
          >
            <Icon size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
