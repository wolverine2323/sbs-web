import { useTranslations } from "next-intl";

// Página provisional: la portada real se construye en la Fase 4.
export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main>
      <section>
        <p>{t("heroEyebrow")}</p>
        <h1>
          {t("heroTitle1")}
          <br />
          <em>{t("heroTitle2")}</em>
        </h1>
        <p>{t("heroLead")}</p>
      </section>
      <section>
        <p>{t("firmEyebrow")}</p>
        <h2>{t("firmTitle")}</h2>
      </section>
    </main>
  );
}
