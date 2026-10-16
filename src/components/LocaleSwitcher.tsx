"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

// Selector FR / ES / EN. Son enlaces (no botones) para que lleven a la misma
// página en el otro idioma y los buscadores puedan seguirlos.
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t("label")} className={cn("gap-0.5", className)}>
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          hrefLang={code}
          lang={code}
          aria-label={t(code)}
          aria-current={code === locale ? "true" : undefined}
          className={cn(
            "inline-flex h-11 min-w-11 items-center justify-center border-b px-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors",
            code === locale
              ? "border-bronze-light text-cream"
              : "border-transparent text-stone-dim hover:text-cream",
          )}
        >
          {code}
        </Link>
      ))}
    </div>
  );
}
