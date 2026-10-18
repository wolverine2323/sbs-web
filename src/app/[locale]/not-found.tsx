import { getTranslations } from "next-intl/server";
import { ButtonOutline } from "@/components/ButtonOutline";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Heading } from "@/components/Heading";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { currentLocale } from "@/i18n/locale";
import { getPathname, Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/sanity/lib/settings";

// Página 404 en el idioma de la dirección pedida.
export default async function NotFound() {
  const locale = await currentLocale();
  const [settings, t, tNav, tCommon] = await Promise.all([
    getSiteSettings(locale),
    getTranslations("NotFound"),
    getTranslations("Navigation"),
    getTranslations("Common"),
  ]);

  const links = [
    { label: tNav("firm"), href: "/le-cabinet" },
    { label: tNav("expertise"), href: "/expertises" },
    { label: tNav("invest"), href: "/investir-au-costa-rica" },
    { label: tNav("news"), href: "/actualite" },
    { label: tNav("contact"), href: "/contact" },
  ] as const;

  return (
    <main className="border-b border-bronze-light/16">
      <div className="mx-auto flex max-w-[880px] flex-col items-center px-7 pt-28 pb-32 text-center">
        <SectionEyebrow variant="hero">{t("eyebrow")}</SectionEyebrow>
        <span
          aria-hidden="true"
          className="mt-7 mb-8 h-14 w-px bg-linear-to-b from-bronze-light to-bronze-light/0"
        />
        <Heading as="h1" size="page">
          {t("title")}
        </Heading>
        <p className="mt-8 max-w-[560px] text-lg leading-[1.7] text-stone">{t("body")}</p>
        <nav aria-label={t("linksLabel")} className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-[13px] tracking-[0.1em] text-bronze-light uppercase underline-offset-4 hover:text-cream hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 flex flex-wrap justify-center gap-3.5">
          {settings && (
            <ButtonPrimary href={settings.bookingUrl} withArrow track="book_click">
              {tCommon("cta")}
            </ButtonPrimary>
          )}
          <ButtonOutline href={getPathname({ locale, href: "/" })}>{t("home")}</ButtonOutline>
        </div>
      </div>
    </main>
  );
}
