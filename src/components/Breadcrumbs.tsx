import { useLocale, useTranslations } from "next-intl";
import { getPathname, Link } from "@/i18n/navigation";
import { breadcrumbList } from "@/lib/structured-data";
import { JsonLd } from "./JsonLd";

export type Crumb = {
  label: string;
  href: Parameters<typeof getPathname>[0]["href"];
};

// Migas de pan: Accueil › … › página actual (esta última sin enlace).
// También para Google, como BreadcrumbList.
export function Breadcrumbs({ items, current }: { items?: Crumb[]; current: string }) {
  const t = useTranslations("Breadcrumbs");
  const tNav = useTranslations("Navigation");
  const locale = useLocale();
  const links: Crumb[] = [{ label: tNav("home"), href: "/" }, ...(items ?? [])];
  const structured = breadcrumbList([
    ...links.map((crumb) => ({ name: crumb.label, url: getPathname({ locale, href: crumb.href }) })),
    { name: current },
  ]);

  return (
    <nav aria-label={t("label")}>
      <JsonLd data={structured} />
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
