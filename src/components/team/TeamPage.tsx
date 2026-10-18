import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { notFound } from "next/navigation";
import { currentLocale } from "@/i18n/locale";
import { getPathname } from "@/i18n/navigation";
import { person } from "@/lib/structured-data";
import { urlFor } from "@/sanity/lib/image";
import { cachedSanity, type DynamicFetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/preview";
import { TEAM_QUERY } from "@/sanity/lib/queries";
import { getSectionPage } from "@/sanity/lib/sections";
import { getSiteSettings } from "@/sanity/lib/settings";
import { Breadcrumbs } from "../Breadcrumbs";
import { ButtonPrimary } from "../ButtonPrimary";
import { ClosingCta } from "../ClosingCta";
import { JsonLd } from "../JsonLd";
import { PageHero } from "../PageHero";
import { FirmNav } from "./FirmNav";
import { FounderProfile, memberAnchor, TeamCard } from "./TeamMember";

type Kind = "founder" | "associate";

const config = {
  founder: { section: "founders", nav: "founders", route: "/le-cabinet/associes-fondateurs" },
  associate: { section: "associates", nav: "associates", route: "/le-cabinet/avocats-collaborateurs" },
} as const;

// Página de equipo de Le Cabinet: socios fundadores o abogados colaboradores.
export function TeamPage({ kind }: { kind: Kind }) {
  return <WithFetchOptions>{(options) => <Team kind={kind} {...options} />}</WithFetchOptions>;
}

async function Team({ kind, ...fetchOptions }: { kind: Kind } & DynamicFetchOptions) {
  const language = await currentLocale();
  const { section, nav, route } = config[kind];
  const [page, { data: members }, settings, t, tNav, tCommon] = await Promise.all([
    getSectionPage(section, fetchOptions),
    cachedSanity({ query: TEAM_QUERY, params: { language, kind }, tags: ["teamMember"], ...fetchOptions }),
    getSiteSettings(language),
    getTranslations("Firm"),
    getTranslations("Navigation"),
    getTranslations("Common"),
  ]);
  if (!page || !settings) notFound();

  // Cada persona para Google, con la firma como empleador.
  const people = members.map((member) =>
    person({
      name: member.name,
      jobTitle: member.role,
      email: member.email,
      image: member.photo?.asset ? urlFor(member.photo).width(600).url() : null,
      url: `${getPathname({ locale: language, href: route })}#${memberAnchor(stegaClean(member.name))}`,
      languages: member.spokenLanguages?.map((code) => stegaClean(code)),
    }),
  );

  return (
    <main>
      {!!people.length && <JsonLd data={people} />}
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
