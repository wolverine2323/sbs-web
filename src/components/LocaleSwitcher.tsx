"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, sectionIndex } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useAlternates } from "./LocaleAlternates";

type Href = ComponentProps<typeof Link>["href"];

// Selector FR / ES / EN. Son enlaces (no botones) para que lleven a la misma
// página en el otro idioma y los buscadores puedan seguirlos.
// En las páginas de Sanity cada idioma tiene su propio slug: la página indica
// sus traducciones (PageAlternates) y, si falta alguna, se va al índice de
// la sección en ese idioma.
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();
  const alternates = useAlternates();

  const target = sectionIndex[pathname] ?? pathname;
  const fallback = (target.includes("[") ? { pathname: target, params } : target) as Href;

  return (
    <div role="group" aria-label={t("label")} className={cn("gap-0.5", className)}>
      {routing.locales.map((code) => {
        const linkProps = {
          hrefLang: code,
          lang: code,
          "aria-label": t(code),
          "aria-current": code === locale ? ("true" as const) : undefined,
          className: cn(
            "inline-flex h-11 min-w-11 items-center justify-center border-b px-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors",
            code === locale
              ? "border-bronze-light text-cream"
              : "border-transparent text-stone-dim hover:text-cream",
          ),
        };
        const alternate = alternates?.[code];
        return alternate ? (
          <NextLink key={code} href={alternate} {...linkProps}>
            {code}
          </NextLink>
        ) : (
          <Link key={code} href={fallback} locale={code} {...linkProps}>
            {code}
          </Link>
        );
      })}
    </div>
  );
}
