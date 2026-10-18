import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const pages = [
  { key: "overview", href: "/le-cabinet" },
  { key: "founders", href: "/le-cabinet/associes-fondateurs" },
  { key: "associates", href: "/le-cabinet/avocats-collaborateurs" },
] as const;

type Props = { current: (typeof pages)[number]["key"] };

// Subnavegación de Le Cabinet: presentación, fundadores, colaboradores.
export function FirmNav({ current }: Props) {
  const t = useTranslations("Firm");

  return (
    <nav aria-label={t("navLabel")} className="border-b border-bronze-light/16">
      <ul className="mx-auto flex max-w-[1320px] flex-wrap gap-x-8 px-7">
        {pages.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              aria-current={key === current ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex min-h-14 items-center border-b text-[13px] tracking-[0.1em] uppercase transition-colors",
                key === current
                  ? "border-bronze-light text-cream"
                  : "border-transparent text-stone-dim hover:text-cream",
              )}
            >
              {t(key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
