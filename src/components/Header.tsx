"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState, type ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ButtonPrimary } from "./ButtonPrimary";
import { CloseIcon, MenuIcon } from "./icons";
import { LocaleSwitcher } from "./LocaleSwitcher";

export type NavItem = {
  href: ComponentProps<typeof Link>["href"];
  label: string;
  // Solo en el menú móvil (Actualité y Contact en la referencia).
  mobileOnly?: boolean;
};

type Props = {
  items: NavItem[];
  // siteSettings.bookingUrl; sin él no se muestra el botón de cita.
  bookingUrl?: string;
};

// Header fijo: navegación a la izquierda, logo centrado, idioma + cita a la
// derecha. Bajo 1280px la navegación pasa al menú hamburguesa (a 1100px,
// el breakpoint de la referencia, los enlaces no caben en una línea).
export function Header({ items, bookingUrl }: Props) {
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  // "page" en la página de la sección; "true" dentro de ella (p. ej. un servicio).
  const current = (href: NavItem["href"]) => {
    if (typeof href !== "string") return undefined;
    if (pathname === href) return "page" as const;
    return pathname.startsWith(`${href}/`) ? ("true" as const) : undefined;
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-bronze-light/16 bg-ink/94 backdrop-blur-[10px]">
      <div className="mx-auto grid h-[92px] max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-7 sm:gap-5">
        <nav
          aria-label={t("label")}
          className="hidden gap-[22px] text-[13px] tracking-[0.08em] whitespace-nowrap uppercase min-[1280px]:flex"
        >
          {items
            .filter((item) => !item.mobileOnly)
            .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current(item.href)}
                className={cn(
                  "inline-flex min-h-11 items-center transition-colors hover:text-bronze-light",
                  current(item.href) ? "text-bronze-light" : "text-cream",
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="inline-flex size-12 items-center justify-center justify-self-start border border-bronze-light/35 text-cream min-[1280px]:hidden"
        >
          {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>

        <Link
          href="/"
          onClick={close}
          className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 text-cream"
        >
          <Image
            src="/monogram-temp.png"
            alt=""
            width={42}
            height={42}
            priority
            className="size-[42px] object-contain"
          />
          {/* En móvil solo se ve el monograma; el nombre queda para lectores de pantalla. */}
          <span className="pl-[0.42em] font-serif text-[15px] tracking-[0.42em] uppercase max-sm:sr-only">
            {tc("brand")}
          </span>
        </Link>

        <div className="flex items-center justify-end gap-[18px]">
          <LocaleSwitcher className="hidden lg:flex" />
          {bookingUrl && (
            <ButtonPrimary
              href={bookingUrl}
              size="sm"
              track="book_click"
              className="whitespace-nowrap max-md:px-3.5 max-md:text-xs"
            >
              <span className="md:hidden">{tc("ctaShort")}</span>
              <span className="max-md:hidden">{tc("cta")}</span>
            </ButtonPrimary>
          )}
        </div>
      </div>

      <nav
        id={menuId}
        aria-label={t("label")}
        hidden={!open}
        className="flex flex-col border-t border-bronze-light/16 px-7 pt-2 pb-6 min-[1280px]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={close}
            aria-current={current(item.href)}
            className={cn(
              "border-b border-bronze-light/12 py-4 last-of-type:border-b-0",
              current(item.href) ? "text-bronze-light" : "text-cream",
            )}
          >
            {item.label}
          </Link>
        ))}
        <LocaleSwitcher className="mt-3 flex" />
      </nav>
    </header>
  );
}
