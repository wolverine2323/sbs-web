/**
 * Servicio «Crédito hipotecario privado e inversión» (en alianza con
 * Trust Capital), a partir de trustcapital.credit y trustcapital.credit/investors
 * (leídos el 18/10/2026). Criterios aprobados por José Luis:
 * - Los botones llevan a la agenda de SBS, no a Trust Capital.
 * - Solo cifras prudentes: sin testimonios, sin «aprobación garantizada»,
 *   sin volumen de créditos ni número de clientes.
 * - SBS hace la revisión legal, la escritura e inscripción ante notario y
 *   asesora al inversionista extranjero.
 * - Título corto (menú): «Crédit privé», para que el logo siga centrado.
 * - 12 % es la tasa de interés anual a la que se colocan los préstamos, no
 *   un rendimiento. Si el deudor no paga, pierde el inmueble y el
 *   inversionista se queda con él.
 */

type Item = [title: string, description: string];
type Fact = [value: string, label: string];

export type LendingContent = {
  title: string;
  shortTitle: string;
  slug: string;
  summary: string;
  audiences: {
    eyebrow: string;
    title: string;
    lead: string;
    facts: Fact[];
    steps: Item[];
    ctaLabel: string;
  }[];
  helpPoints: Item[];
  faq: Item[];
  disclaimer: string;
  seo: { title: string; description: string };
};

export const lending: Record<"fr" | "es" | "en", LendingContent> = {
  fr: {
    title: "Crédit hypothécaire privé & investissement",
    shortTitle: "Crédit privé",
    slug: "credit-hypothecaire-prive-investissement",
    summary:
      "Financement privé garanti par un bien immobilier et investissement dans des prêts hypothécaires au Costa Rica, en alliance avec Trust Capital. SBS assure la sécurité juridique de chaque opération.",
    audiences: [
      {
        eyebrow: "Emprunteurs",
        title: "Obtenir un financement garanti par un bien immobilier",
        lead: "Pour les propriétaires, entrepreneurs, entreprises et promoteurs qui ont besoin de capital sans passer par une banque. Chaque demande est étudiée au cas par cas : bien en garantie, documentation juridique et ratio prêt/valeur.",
        facts: [
          ["50 000 – 3,5 M USD", "Montant du financement, selon le dossier"],
          ["Bien immobilier", "Garantie hypothécaire au Costa Rica"],
          ["12 %", "Taux d’intérêt annuel"],
        ],
        steps: [
          ["Pré-qualification", "Vous nous présentez votre projet, le montant recherché et le bien proposé en garantie."],
          ["Analyse du dossier", "Étude du bien, des documents et de votre capacité de remboursement."],
          ["Mise en relation", "Trust Capital vous met en relation avec des investisseurs privés adaptés à votre projet."],
          ["Structuration", "Les conditions du crédit sont définies : montant, durée et garanties."],
          ["Signature et décaissement", "L’acte d’hypothèque est signé devant notaire et inscrit au Registre national, puis les fonds sont versés."],
        ],
        ctaLabel: "Parler de mon financement",
      },
      {
        eyebrow: "Investisseurs",
        title: "Investir dans des prêts hypothécaires au Costa Rica",
        lead: "Des prêts privés garantis par des biens immobiliers inscrits au Registre national, avec un ratio prêt/valeur prudent et une revue juridique de chaque opération. Les investisseurs étrangers peuvent participer.",
        facts: [
          ["12 %", "Taux d’intérêt annuel des prêts"],
          ["50 % max.", "Ratio prêt/valeur : 2 USD de garantie pour 1 USD prêté"],
          ["1er rang", "Hypothèque inscrite au Registre national"],
          ["12 à 36 mois", "Durée habituelle des opérations"],
        ],
        steps: [
          ["Dossier de l’emprunteur", "L’emprunteur présente le bien, sa demande de financement et ses justificatifs."],
          ["Évaluation indépendante", "Un expert agréé et indépendant établit la valeur de marché du bien."],
          ["Revue juridique", "Nos avocats vérifient le titre de propriété, les charges, l’usage du sol et la situation légale du bien."],
          ["Analyse de l’opération", "Qualité de la garantie, structure du prêt, ratio prêt/valeur et profil de l’emprunteur."],
          ["Présentation aux investisseurs", "Vous recevez la synthèse de l’opération, la garantie et les conditions proposées."],
          ["Signature devant notaire", "L’hypothèque de premier rang est signée devant notaire et inscrite au Registre national."],
          ["Paiement des intérêts", "Vous percevez les intérêts selon le calendrier convenu, puis le capital à l’échéance."],
        ],
        ctaLabel: "Planifier un appel investisseur",
      },
    ],
    helpPoints: [
      ["Revue juridique du bien", "Titre de propriété, hypothèques et charges existantes, usage du sol et situation légale de chaque bien proposé en garantie."],
      ["Acte notarié et inscription", "Rédaction et signature de l’acte d’hypothèque devant notaire, puis inscription au Registre national."],
      ["Conseil à l’investisseur étranger", "Structure juridique de votre investissement depuis la France, la Suisse, le Canada ou ailleurs, en français."],
    ],
    faq: [
      ["Comment les prêts sont-ils garantis ?", "Chaque prêt est garanti par une hypothèque de premier rang inscrite au Registre national du Costa Rica. L’investisseur dispose ainsi d’un droit direct sur le bien en cas de défaut."],
      ["Que se passe-t-il si l’emprunteur ne paie pas ?", "La garantie hypothécaire est exécutée selon la procédure prévue par la loi : l’emprunteur perd le bien et l’investisseur en devient propriétaire. Comme chaque prêt est limité à 50 % de la valeur du bien, la garantie couvre largement le montant prêté."],
      ["Comment la valeur du bien est-elle déterminée ?", "Un expert agréé et indépendant réalise une évaluation formelle avant toute approbation : ventes comparables, potentiel de revenus et conditions du marché. Les évaluations fournies par l’emprunteur ne sont pas retenues."],
      ["Comment les investisseurs sont-ils payés ?", "Les intérêts, au taux de 12 % par an, sont versés selon le calendrier prévu dans le contrat de prêt, présenté avant l’investissement. Le capital est remboursé à l’échéance ou en cas de remboursement anticipé."],
      ["Qui s’occupe des documents juridiques ?", "Les avocats et notaires de SBS Abogados préparent et vérifient la documentation. L’acte d’hypothèque est signé devant notaire et inscrit au Registre national, ce qui lui donne sa validité et sa force exécutoire."],
      ["Les investisseurs étrangers peuvent-ils participer ?", "Oui. Le Costa Rica accueille l’investissement étranger et les non-résidents peuvent détenir des droits hypothécaires. Nous vous accompagnons sur le volet costaricien ; pour la fiscalité dans votre pays de résidence, consultez aussi votre conseiller habituel."],
      ["Quelle est la durée des investissements ?", "Généralement entre 12 et 36 mois selon l’opération. La durée, le taux et le calendrier de paiement sont indiqués avant tout engagement."],
      ["Quels risques faut-il prendre en compte ?", "Les principaux sont le retard ou le défaut de paiement de l’emprunteur, la variation de la valeur du bien et une liquidité limitée pendant la durée du prêt. C’est pourquoi chaque prêt est limité à 50 % de la valeur du bien, évaluée par un expert indépendant, et garanti par une hypothèque de premier rang."],
    ],
    disclaimer:
      "Les opportunités de financement et d’investissement sont proposées en alliance avec Trust Capital, plateforme qui met en relation des emprunteurs et des investisseurs privés au Costa Rica. Ni Trust Capital ni SBS Abogados ne sont une banque ou une entité financière réglementée. Le taux de 12 % est le taux d’intérêt annuel auquel les prêts sont accordés ; il ne s’agit pas d’un rendement promis. Les conditions de chaque crédit (montant, durée et garanties) sont définies entre les parties et indiquées avant tout engagement. Cette page est informative et ne constitue ni une offre ni une sollicitation.",
    seo: {
      title: "Crédit hypothécaire privé et investissement au Costa Rica",
      description:
        "Financement garanti par un bien immobilier et investissement dans des prêts hypothécaires au Costa Rica, avec la sécurité juridique de SBS Abogados.",
    },
  },
  es: {
    title: "Crédito hipotecario privado e inversión",
    shortTitle: "Crédito privado",
    slug: "credito-hipotecario-privado-e-inversion",
    summary:
      "Financiamiento privado con garantía inmobiliaria e inversión en créditos hipotecarios en Costa Rica, en alianza con Trust Capital. SBS asegura la seguridad jurídica de cada operación.",
    audiences: [
      {
        eyebrow: "Solicitantes",
        title: "Obtenga financiamiento con garantía inmobiliaria",
        lead: "Para propietarios, emprendedores, empresas y desarrolladores que necesitan capital sin pasar por un banco. Cada solicitud se analiza de forma individual: inmueble en garantía, documentación legal y relación préstamo/valor.",
        facts: [
          ["50 000 – 3,5 M USD", "Monto del financiamiento, según el caso"],
          ["Inmueble", "Garantía hipotecaria en Costa Rica"],
          ["12 %", "Tasa de interés anual"],
        ],
        steps: [
          ["Precalificación", "Nos presenta su proyecto, el monto que necesita y el inmueble que ofrece en garantía."],
          ["Análisis", "Revisión del inmueble, de los documentos y de su capacidad de pago."],
          ["Conexión con inversionistas", "Trust Capital lo conecta con inversionistas privados que se ajustan a su proyecto."],
          ["Estructuración", "Se definen las condiciones del crédito: monto, plazo y garantías."],
          ["Firma y desembolso", "La escritura de hipoteca se firma ante notario y se inscribe en el Registro Nacional; luego se desembolsan los fondos."],
        ],
        ctaLabel: "Conversar sobre mi financiamiento",
      },
      {
        eyebrow: "Inversionistas",
        title: "Invierta en créditos hipotecarios en Costa Rica",
        lead: "Préstamos privados garantizados con inmuebles inscritos en el Registro Nacional, con una relación préstamo/valor prudente y revisión legal de cada operación. Los inversionistas extranjeros pueden participar.",
        facts: [
          ["12 %", "Tasa de interés anual de los préstamos"],
          ["50 % máx.", "Relación préstamo/valor: 2 USD de garantía por cada 1 USD prestado"],
          ["1.er grado", "Hipoteca inscrita en el Registro Nacional"],
          ["12 a 36 meses", "Plazo habitual de las operaciones"],
        ],
        steps: [
          ["Solicitud del deudor", "El solicitante presenta el inmueble, su solicitud de financiamiento y la documentación de respaldo."],
          ["Avalúo independiente", "Un perito valuador independiente y autorizado establece el valor de mercado del inmueble."],
          ["Revisión legal", "Nuestros abogados verifican el título, los gravámenes, el uso de suelo y la situación legal del inmueble."],
          ["Análisis de la operación", "Calidad de la garantía, estructura del préstamo, relación préstamo/valor y perfil del deudor."],
          ["Presentación a inversionistas", "Usted recibe el resumen de la operación, la garantía y las condiciones propuestas."],
          ["Firma ante notario", "La hipoteca de primer grado se firma ante notario y se inscribe en el Registro Nacional."],
          ["Pago de intereses", "Recibe los intereses según el calendario acordado y el capital al vencimiento."],
        ],
        ctaLabel: "Agendar una llamada de inversionista",
      },
    ],
    helpPoints: [
      ["Revisión legal del inmueble", "Título de propiedad, hipotecas y gravámenes existentes, uso de suelo y situación legal de cada inmueble ofrecido en garantía."],
      ["Escritura e inscripción", "Redacción y firma de la escritura de hipoteca ante notario, e inscripción en el Registro Nacional."],
      ["Asesoría al inversionista extranjero", "Estructura legal de su inversión desde Francia, Suiza, Canadá u otro país, en su idioma."],
    ],
    faq: [
      ["¿Cómo se garantizan los préstamos?", "Cada préstamo está garantizado con una hipoteca de primer grado inscrita en el Registro Nacional de Costa Rica. Así, el inversionista tiene un derecho directo sobre el inmueble en caso de incumplimiento."],
      ["¿Qué pasa si el deudor no paga?", "La garantía hipotecaria se ejecuta según el procedimiento que establece la ley: el deudor pierde el inmueble y el inversionista se queda con él. Como cada préstamo se limita al 50 % del valor del inmueble, la garantía cubre ampliamente el monto prestado."],
      ["¿Cómo se determina el valor del inmueble?", "Un perito valuador independiente y autorizado hace un avalúo formal antes de cualquier aprobación: ventas comparables, potencial de ingresos y condiciones del mercado. No se usan avalúos aportados por el deudor."],
      ["¿Cómo se les paga a los inversionistas?", "Los intereses, a una tasa del 12 % anual, se pagan según el calendario del contrato de préstamo, que se presenta antes de invertir. El capital se devuelve al vencimiento o si el deudor paga por adelantado."],
      ["¿Quién se encarga de los documentos legales?", "Los abogados y notarios de SBS Abogados preparan y revisan la documentación. La escritura de hipoteca se firma ante notario y se inscribe en el Registro Nacional, lo que le da plena validez y fuerza ejecutiva."],
      ["¿Pueden participar inversionistas extranjeros?", "Sí. Costa Rica recibe con apertura la inversión extranjera y los no residentes pueden ser titulares de derechos hipotecarios. Lo acompañamos en la parte costarricense; para la parte fiscal en su país de residencia, consulte también a su asesor habitual."],
      ["¿Cuánto duran las inversiones?", "Normalmente entre 12 y 36 meses, según la operación. El plazo, la tasa y el calendario de pagos se indican antes de cualquier compromiso."],
      ["¿Qué riesgos hay que considerar?", "Los principales son el atraso o el incumplimiento del deudor, la variación del valor del inmueble y una liquidez limitada durante el plazo del préstamo. Por eso cada préstamo se limita al 50 % del valor del inmueble, avaluado por un perito independiente, y se garantiza con una hipoteca de primer grado."],
    ],
    disclaimer:
      "Las oportunidades de financiamiento e inversión se ofrecen en alianza con Trust Capital, plataforma que conecta a solicitantes de crédito con inversionistas privados en Costa Rica. Ni Trust Capital ni SBS Abogados son un banco ni una entidad financiera regulada. El 12 % es la tasa de interés anual a la que se colocan los préstamos; no es un rendimiento prometido. Las condiciones de cada crédito (monto, plazo y garantías) las definen las partes y se indican antes de cualquier compromiso. Esta página es informativa y no constituye una oferta ni una solicitud.",
    seo: {
      title: "Crédito hipotecario privado e inversión en Costa Rica",
      description:
        "Financiamiento con garantía inmobiliaria e inversión en créditos hipotecarios en Costa Rica, con la seguridad jurídica de SBS Abogados.",
    },
  },
  en: {
    title: "Private mortgage lending & investment",
    shortTitle: "Private credit",
    slug: "private-mortgage-lending-investment",
    summary:
      "Private financing secured by real estate and investment in mortgage loans in Costa Rica, in alliance with Trust Capital. SBS provides the legal security of every transaction.",
    audiences: [
      {
        eyebrow: "Borrowers",
        title: "Get financing secured by real estate",
        lead: "For property owners, entrepreneurs, companies and developers who need capital without going through a bank. Each request is reviewed individually: collateral property, legal documentation and loan-to-value ratio.",
        facts: [
          ["USD 50,000 – 3.5M", "Financing amount, depending on the case"],
          ["Real estate", "Mortgage collateral in Costa Rica"],
          ["12%", "Annual interest rate"],
        ],
        steps: [
          ["Pre-qualification", "You tell us about your project, the amount you need and the property offered as collateral."],
          ["Review", "Assessment of the property, the documents and your repayment capacity."],
          ["Investor matching", "Trust Capital connects you with private investors suited to your project."],
          ["Structuring", "The loan terms are set: amount, term and collateral."],
          ["Signing and disbursement", "The mortgage deed is signed before a notary and recorded in the National Registry, then the funds are disbursed."],
        ],
        ctaLabel: "Discuss my financing",
      },
      {
        eyebrow: "Investors",
        title: "Invest in mortgage loans in Costa Rica",
        lead: "Private loans secured by real estate recorded in the National Registry, with a conservative loan-to-value ratio and a legal review of every transaction. International investors can participate.",
        facts: [
          ["12%", "Annual interest rate on the loans"],
          ["50% max.", "Loan-to-value: USD 2 of collateral for every USD 1 lent"],
          ["1st lien", "Mortgage recorded in the National Registry"],
          ["12 to 36 months", "Typical term of each transaction"],
        ],
        steps: [
          ["Borrower submission", "The borrower submits the property, the financing request and supporting documents."],
          ["Independent valuation", "A licensed, independent appraiser establishes the property’s market value."],
          ["Legal review", "Our attorneys verify title, encumbrances, zoning and the legal standing of the property."],
          ["Transaction review", "Collateral quality, loan structure, loan-to-value ratio and borrower profile."],
          ["Investor review", "You receive the opportunity summary, collateral details and proposed terms."],
          ["Notarial closing", "The first-lien mortgage is signed before a notary and recorded in the National Registry."],
          ["Interest payments", "You receive interest on the agreed schedule and your principal at maturity."],
        ],
        ctaLabel: "Schedule an investor call",
      },
    ],
    helpPoints: [
      ["Legal review of the property", "Title, existing mortgages and encumbrances, zoning and the legal standing of every property offered as collateral."],
      ["Notarial deed and registration", "Drafting and signing of the mortgage deed before a notary, and recording in the National Registry."],
      ["Advice for international investors", "Legal structuring of your investment from France, Switzerland, Canada or elsewhere, in your language."],
    ],
    faq: [
      ["How are loans secured?", "Every loan is secured by a first-lien mortgage recorded in Costa Rica’s National Registry. The investor therefore holds a direct legal claim on the property in the event of default."],
      ["What happens if a borrower defaults?", "The mortgage is enforced under the procedure set by law: the borrower loses the property and the investor keeps it. Because each loan is capped at 50% of the property’s value, the collateral amply covers the amount lent."],
      ["How is the property value determined?", "A licensed, independent appraiser performs a formal valuation before any approval, based on comparable sales, income potential and market conditions. Borrower-provided valuations are not relied upon."],
      ["How are investors paid?", "Interest, at 12% a year, is paid on the schedule set in the loan agreement, which is presented before you invest. Principal is returned at maturity or upon early repayment by the borrower."],
      ["Who handles the legal documentation?", "The attorneys and notaries of SBS Abogados prepare and review the documentation. The mortgage deed is signed before a notary and recorded in the National Registry, giving it full validity and enforceability."],
      ["Can international investors participate?", "Yes. Costa Rica welcomes foreign investment and non-residents can hold mortgage interests. We advise you on the Costa Rican side; for taxation in your home country, please also consult your usual adviser."],
      ["How long are investment terms?", "Typically 12 to 36 months, depending on the transaction. The term, rate and payment schedule are stated before any commitment."],
      ["What risks should investors consider?", "The main ones are late payment or default by the borrower, changes in the property’s value and limited liquidity during the loan term. That is why each loan is capped at 50% of the property’s value, set by an independent appraiser, and secured by a first-lien mortgage."],
    ],
    disclaimer:
      "Financing and investment opportunities are offered in alliance with Trust Capital, a platform that connects borrowers with private investors in Costa Rica. Neither Trust Capital nor SBS Abogados is a bank or a regulated financial institution. The 12% figure is the annual interest rate at which the loans are made; it is not a promised return. The terms of each loan (amount, term and collateral) are agreed between the parties and stated before any commitment. This page is for information only and does not constitute an offer or solicitation.",
    seo: {
      title: "Private mortgage lending & investment in Costa Rica",
      description:
        "Real estate secured financing and investment in private mortgage loans in Costa Rica, with the legal security of SBS Abogados.",
    },
  },
};
