import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import { newsHref } from "./newsHref";

type Props = { page: number; totalPages: number; category?: string };

const stepClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-3 text-[13px] font-semibold tracking-[0.1em] uppercase transition-colors hover:text-burgundy focus-visible:outline-on-paper";

// Paginación de Actualité (sobre paper): anterior, números y siguiente.
export function Pagination({ page, totalPages, category }: Props) {
  const t = useTranslations("News");
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label={t("pagination")}
      className="mt-20 flex items-center justify-between gap-4 border-t border-on-paper/14 pt-8"
    >
      {page > 1 ? (
        <Link href={newsHref(page - 1, category)} rel="prev" className={stepClass}>
          <ArrowLeftIcon />
          <span className="max-sm:sr-only">{t("previous")}</span>
        </Link>
      ) : (
        <span className="min-w-11" />
      )}
      <ol className="flex flex-wrap justify-center gap-1">
        {pages.map((n) => (
          <li key={n}>
            <Link
              href={newsHref(n, category)}
              aria-label={t("page", { page: n })}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "inline-flex size-11 items-center justify-center text-sm tabular-nums transition-colors focus-visible:outline-on-paper",
                n === page ? "bg-on-paper text-paper" : "hover:bg-on-paper/8",
              )}
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        <Link href={newsHref(page + 1, category)} rel="next" className={stepClass}>
          <span className="max-sm:sr-only">{t("next")}</span>
          <ArrowRightIcon />
        </Link>
      ) : (
        <span className="min-w-11" />
      )}
    </nav>
  );
}
