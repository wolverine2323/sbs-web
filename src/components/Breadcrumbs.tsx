import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

export type Crumb = {
  label: string;
  href: ComponentProps<typeof Link>["href"];
};

// Migas de pan: Accueil › … › página actual (esta última sin enlace).
export function Breadcrumbs({ items, current }: { items?: Crumb[]; current: string }) {
  const t = useTranslations("Breadcrumbs");
  const tNav = useTranslations("Navigation");
  const links: Crumb[] = [{ label: tNav("home"), href: "/" }, ...(items ?? [])];

  return (
    <nav aria-label={t("label")}>
      <ol className="flex flex-wrap items-center gap-x-3 text-[11px] tracking-[0.24em] text-stone-dim uppercase">
        {links.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-x-3">
            <Link
              href={crumb.href}
              className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-cream"
            >
              {crumb.label}
            </Link>
            <span aria-hidden="true" className="text-bronze-light/60">
              /
            </span>
          </li>
        ))}
        <li className="flex min-h-11 min-w-0 items-center">
          <span aria-current="page" className="max-w-[min(420px,70vw)] truncate text-stone">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
