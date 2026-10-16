import { useTranslations } from "next-intl";

// Página provisional para comprobar fuentes y colores.
// La portada real se construye en la Fase 4.
export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main>
      <section className="border-b border-bronze-light/16 bg-ink">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center px-7 pt-[136px] pb-28 text-center">
          <p className="text-xs tracking-[0.36em] text-bronze-light uppercase">
            {t("heroEyebrow")}
          </p>
          <span
            aria-hidden="true"
            className="mt-7 mb-8 h-14 w-px bg-linear-to-b from-bronze-light to-bronze-light/0"
          />
          <h1 className="font-serif text-[clamp(50px,7vw,104px)] leading-[0.98] font-normal tracking-[-0.015em]">
            {t("heroTitle1")}
            <br />
            <em className="text-bronze-light italic">{t("heroTitle2")}</em>
          </h1>
          <p className="mt-10 max-w-[640px] text-lg leading-[1.7] text-stone">
            {t("heroLead")}
          </p>
        </div>
      </section>
      <section className="bg-paper text-on-paper">
        <div className="mx-auto max-w-[1320px] px-7 py-[136px]">
          <p className="text-xs tracking-[0.32em] text-burgundy uppercase">
            {t("firmEyebrow")}
          </p>
          <h2 className="mt-6 max-w-[760px] font-serif text-[clamp(38px,4.2vw,62px)] leading-[1.04] font-normal">
            {t("firmTitle")}
          </h2>
          <div aria-hidden="true" className="my-10 h-px w-16 bg-bronze" />
        </div>
      </section>
    </main>
  );
}
