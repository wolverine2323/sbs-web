import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { newsHref } from "./newsHref";

type Props = {
  categories: { _id: string; title: string; slug: string }[];
  // Slug de la categoría actual; vacío = todos los artículos.
  current?: string;
};

const pill = (active: boolean) =>
  cn(
    "inline-flex min-h-11 items-center border px-5 text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors focus-visible:outline-on-paper",
    active
      ? "border-on-paper bg-on-paper text-paper"
      : "border-on-paper/25 text-on-paper hover:border-on-paper",
  );

// Filtro por categoría (sobre paper). Son enlaces: cada categoría tiene su URL.
export function CategoryFilter({ categories, current }: Props) {
  const t = useTranslations("News");

  return (
    <nav aria-label={t("categories")} className="mb-16">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={newsHref(1)} aria-current={!current ? "page" : undefined} className={pill(!current)}>
            {t("allCategories")}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={newsHref(1, category.slug)}
              aria-current={category.slug === current ? "page" : undefined}
              className={pill(category.slug === current)}
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
