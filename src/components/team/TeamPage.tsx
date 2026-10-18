import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { currentLocale } from "@/i18n/locale";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { TEAM_QUERY } from "@/sanity/lib/queries";
import { getSectionPage } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";
import { Breadcrumbs } from "../Breadcrumbs";
import { ButtonPrimary } from "../ButtonPrimary";
import { ClosingCta } from "../ClosingCta";
import { PageHero } from "../PageHero";
import { FirmNav } from "./FirmNav";
import { FounderProfile, TeamCard } from "./TeamMember";

type Kind = "founder" | "associate";

const config = {
  founder: { section: "founders", nav: "founders" },
  associate: { section: "associates", nav: "associates" },
} as const;

// Página de equipo de Le Cabinet: socios fundadores o abogados colaboradores.
export function TeamPage({ kind }: { kind: Kind }) {
  return <WithFetchOptions>{(options) => <Team kind={kind} {...options} />}</WithFetchOptions>;
}

async function Team({ kind, ...fetchOptions }: { kind: Kind } & DynamicFetchOptions) {
  const language = await currentLocale();
  const { section, nav } = config[kind];
  const [page, { data: members }, settings, t, tNav, tCommon] = await Promise.all([
    getSectionPage(section, fetchOptions),
    cachedSanity({ query: TEAM_QUERY, params: { language, kind }, tags: ["teamMember"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Firm"),
    getTranslations("Navigation"),
    getTranslations("Common"),
  ]);
  if (!page || !settings) notFound();

  return (
    <main>
      <PageHero
        breadcrumbs={
          <Breadcrumbs items={[{ label: tNav("firm"), href: "/le-cabinet" }]} current={t(nav)} />
        }
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <ButtonPrimary href={settings.bookingUrl} withArrow track="book_click">
          {tCommon("cta")}
        </ButtonPrimary>
      </PageHero>
      <FirmNav current={nav} />

      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[1320px] px-7 py-28">
          {!members.length ? (
            <p className="text-lg text-on-paper-body">{t("teamEmpty")}</p>
          ) : kind === "founder" ? (
            <div className="flex flex-col gap-24 [&>*+*]:border-t [&>*+*]:border-on-paper/14 [&>*+*]:pt-24">
              {members.map((member) => (
                <FounderProfile key={member._id} member={member} />
              ))}
            </div>
          ) : (
            <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ClosingCta {...fetchOptions} />
    </main>
  );
}
