// Política de privacidad (Fase 8): borrador FR/ES/EN basado en la Ley 8968 de
// Costa Rica y en el RGPD. Lo revisa la firma antes de publicarlo; los
// corchetes [ ] son datos que debe completar.

type Section = { heading: string; paragraphs?: string[]; bullets?: string[]; after?: string[] };
export type PrivacyText = { title: string; slug: string; intro: string[]; sections: Section[] };

export const privacy: Record<"fr" | "es" | "en", PrivacyText> = {
  fr: {
    title: "Politique de confidentialité",
    slug: "politique-de-confidentialite",
    intro: [
      "Dernière mise à jour : 18 octobre 2026.",
      "Cette politique explique quelles données personnelles nous traitons lorsque vous consultez sbs.cr ou que vous nous contactez, pourquoi, et comment exercer vos droits. Elle s’appuie sur la loi costaricienne n° 8968 sur la protection de la personne face au traitement de ses données personnelles et, pour les visiteurs de l’Union européenne, sur le Règlement général sur la protection des données (RGPD).",
    ],
    sections: [
      {
        heading: "Qui est responsable de vos données",
        paragraphs: [
          "Solano Bermúdez & Solano (SBS Abogados), cabinet d’avocats et de notaires, cédula jurídica [à compléter], Terra Campus Corporativo, Torre uno, segundo piso, n° 202, La Unión, Cartago, Costa Rica.",
          "Contact : info@sbs.cr · (506) 4000 3322.",
        ],
      },
      {
        heading: "Les données que nous traitons",
        bullets: [
          "Lorsque vous nous écrivez ou nous appelez (e-mail, téléphone, WhatsApp) : votre nom, vos coordonnées et le contenu de votre demande.",
          "Lorsque vous prenez rendez-vous : l’agenda en ligne est fourni par Google Calendar, qui recueille votre nom, votre e-mail et les informations que vous saisissez.",
          "Lorsque vous naviguez, et seulement avec votre accord : les pages consultées, les clics sur les boutons de contact et des données techniques (appareil, navigateur, pays approximatif), mesurés par Google Analytics et Google Ads.",
          "Pour la sécurité du site, notre hébergeur enregistre l’adresse IP et la date de chaque visite dans des journaux techniques.",
        ],
        after: ["Le site ne comporte pas de formulaire et nous ne vendons aucune donnée."],
      },
      {
        heading: "Pourquoi nous les traitons",
        bullets: [
          "Répondre à vos demandes et préparer un rendez-vous : mesures précontractuelles prises à votre demande.",
          "Exécuter le mandat que vous nous confiez et respecter les obligations légales des avocats et notaires, notamment le secret professionnel et la prévention du blanchiment de capitaux.",
          "Mesurer l’audience du site et l’efficacité de nos annonces : votre consentement, que vous pouvez retirer à tout moment.",
          "Assurer la sécurité du site : notre intérêt légitime.",
        ],
      },
      {
        heading: "Qui peut y accéder",
        paragraphs: [
          "Les membres du cabinet, tenus au secret professionnel, et nos prestataires techniques, uniquement pour le service qu’ils nous rendent :",
        ],
        bullets: [
          "Vercel (hébergement du site) et Sanity (gestion du contenu du site) ;",
          "Google (agenda, mesure d’audience, publicité et carte) ;",
          "Meta, si vous nous écrivez par WhatsApp.",
        ],
        after: ["Nous communiquons des données aux autorités uniquement lorsque la loi l’exige."],
      },
      {
        heading: "Transferts hors du Costa Rica et de l’Union européenne",
        paragraphs: [
          "Certains prestataires sont établis aux États-Unis. Ces transferts sont encadrés par des garanties appropriées : clauses contractuelles types de la Commission européenne et, le cas échéant, le cadre de protection des données UE–États-Unis.",
        ],
      },
      {
        heading: "Combien de temps nous les conservons",
        bullets: [
          "Demandes qui n’aboutissent pas à un mandat : 12 mois au plus.",
          "Dossiers des clients : pendant le mandat, puis pendant les délais de conservation imposés par la loi aux avocats et notaires.",
          "Cookies de mesure d’audience : 13 mois au plus ; votre choix sur les cookies : 6 mois.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          "Selon la loi n° 8968, vous pouvez accéder à vos données, les faire rectifier ou supprimer. Si le RGPD s’applique à vous, vous disposez aussi des droits de limitation, d’opposition et de portabilité. Vous pouvez retirer votre consentement à tout moment, sans que cela remette en cause les traitements déjà effectués.",
          "Pour exercer vos droits, écrivez-nous à info@sbs.cr. Nous pourrons vous demander de justifier de votre identité.",
          "Vous pouvez aussi saisir l’Agence de protection des données des habitants du Costa Rica (PRODHAB) ou l’autorité de protection des données de votre pays (par exemple la CNIL en France, le PFPDT en Suisse ou le Commissariat à la protection de la vie privée au Canada).",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["Le site utilise :"],
        bullets: [
          "sbs_consent : mémorise votre choix sur les cookies (nécessaire, 6 mois) ;",
          "_ga et _ga_* : Google Analytics, uniquement si vous acceptez la mesure d’audience (13 mois au plus) ;",
          "_gcl_* : Google Ads, uniquement si vous acceptez la publicité (90 jours) ;",
          "les cookies de Google Maps, uniquement si vous affichez la carte de la page Contact.",
        ],
        after: [
          "Vous pouvez changer d’avis à tout moment grâce au lien « Gestion des cookies » en bas de chaque page. Lorsque vous refusez, les cookies de Google déjà déposés sont supprimés.",
        ],
      },
      {
        heading: "Sécurité",
        paragraphs: [
          "Le site est servi exclusivement en HTTPS et l’accès aux dossiers est réservé aux personnes qui en ont besoin, toutes tenues au secret professionnel.",
        ],
      },
      {
        heading: "Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour cette politique ; la date en tête de page indique la dernière version.",
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    slug: "politica-de-privacidad",
    intro: [
      "Última actualización: 18 de octubre de 2026.",
      "Esta política explica qué datos personales tratamos cuando visita sbs.cr o se comunica con nosotros, para qué y cómo ejercer sus derechos. Se basa en la Ley n.º 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales y, para los visitantes de la Unión Europea, en el Reglamento General de Protección de Datos (RGPD).",
    ],
    sections: [
      {
        heading: "Responsable de sus datos",
        paragraphs: [
          "Solano Bermúdez & Solano (SBS Abogados), firma de abogados y notarios, cédula jurídica [por completar], Terra Campus Corporativo, Torre uno, segundo piso, No. 202, La Unión, Cartago, Costa Rica.",
          "Contacto: info@sbs.cr · (506) 4000 3322.",
        ],
      },
      {
        heading: "Qué datos tratamos",
        bullets: [
          "Cuando nos escribe o nos llama (correo, teléfono, WhatsApp): su nombre, sus datos de contacto y el contenido de su consulta.",
          "Cuando agenda una cita: la agenda en línea es de Google Calendar, que recoge su nombre, su correo y la información que usted escriba.",
          "Cuando navega, y solo con su permiso: las páginas que visita, los clics en los botones de contacto y datos técnicos (dispositivo, navegador, país aproximado), medidos con Google Analytics y Google Ads.",
          "Por seguridad, nuestro proveedor de alojamiento registra la dirección IP y la fecha de cada visita en registros técnicos.",
        ],
        after: ["El sitio no tiene formularios y no vendemos ningún dato."],
      },
      {
        heading: "Para qué los tratamos",
        bullets: [
          "Responder a sus consultas y preparar una cita: medidas precontractuales que usted solicita.",
          "Ejecutar el mandato que nos confía y cumplir las obligaciones legales de abogados y notarios, en particular el secreto profesional y la prevención de la legitimación de capitales.",
          "Medir las visitas al sitio y la eficacia de nuestros anuncios: su consentimiento, que puede retirar en cualquier momento.",
          "Mantener la seguridad del sitio: nuestro interés legítimo.",
        ],
      },
      {
        heading: "Quién puede acceder a ellos",
        paragraphs: [
          "Los miembros de la firma, sujetos al secreto profesional, y nuestros proveedores técnicos, solo para el servicio que nos prestan:",
        ],
        bullets: [
          "Vercel (alojamiento del sitio) y Sanity (gestión del contenido del sitio);",
          "Google (agenda, medición de visitas, publicidad y mapa);",
          "Meta, si nos escribe por WhatsApp.",
        ],
        after: ["Solo comunicamos datos a las autoridades cuando la ley lo exige."],
      },
      {
        heading: "Transferencias fuera de Costa Rica y de la Unión Europea",
        paragraphs: [
          "Algunos proveedores están en Estados Unidos. Estas transferencias cuentan con garantías adecuadas: cláusulas contractuales tipo de la Comisión Europea y, cuando corresponde, el Marco de Privacidad de Datos UE–EE. UU.",
        ],
      },
      {
        heading: "Cuánto tiempo los conservamos",
        bullets: [
          "Consultas que no terminan en un mandato: 12 meses como máximo.",
          "Expedientes de clientes: durante el mandato y luego durante los plazos de conservación que la ley impone a abogados y notarios.",
          "Cookies de medición: 13 meses como máximo; su elección sobre las cookies: 6 meses.",
        ],
      },
      {
        heading: "Sus derechos",
        paragraphs: [
          "Según la Ley n.º 8968, usted puede acceder a sus datos, rectificarlos o suprimirlos. Si se le aplica el RGPD, también tiene derecho a la limitación, la oposición y la portabilidad. Puede retirar su consentimiento en cualquier momento, sin que ello afecte lo tratado antes.",
          "Para ejercer sus derechos, escríbanos a info@sbs.cr. Podemos pedirle que acredite su identidad.",
          "También puede acudir a la Agencia de Protección de Datos de los Habitantes (PRODHAB) o a la autoridad de protección de datos de su país (por ejemplo, la CNIL en Francia, el PFPDT en Suiza o el Comisionado de Privacidad de Canadá).",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["El sitio usa:"],
        bullets: [
          "sbs_consent: recuerda su elección sobre las cookies (necesaria, 6 meses);",
          "_ga y _ga_*: Google Analytics, solo si acepta la medición de visitas (13 meses como máximo);",
          "_gcl_*: Google Ads, solo si acepta la publicidad (90 días);",
          "las cookies de Google Maps, solo si muestra el mapa de la página de Contacto.",
        ],
        after: [
          "Puede cambiar de opinión en cualquier momento con el enlace «Gestionar cookies» al pie de cada página. Si las rechaza, se borran las cookies de Google ya instaladas.",
        ],
      },
      {
        heading: "Seguridad",
        paragraphs: [
          "El sitio se sirve solo por HTTPS y el acceso a los expedientes está reservado a quienes lo necesitan, todos sujetos al secreto profesional.",
        ],
      },
      {
        heading: "Cambios",
        paragraphs: [
          "Podemos actualizar esta política; la fecha al inicio de la página indica la versión vigente.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    slug: "privacy-policy",
    intro: [
      "Last updated: 18 October 2026.",
      "This policy explains which personal data we process when you visit sbs.cr or contact us, why, and how to exercise your rights. It is based on Costa Rica’s Law No. 8968 on the Protection of Persons in the Processing of their Personal Data and, for visitors from the European Union, on the General Data Protection Regulation (GDPR).",
    ],
    sections: [
      {
        heading: "Who is responsible for your data",
        paragraphs: [
          "Solano Bermúdez & Solano (SBS Abogados), law and notary firm, corporate ID (cédula jurídica) [to be completed], Terra Campus Corporativo, Tower one, second floor, No. 202, La Unión, Cartago, Costa Rica.",
          "Contact: info@sbs.cr · (506) 4000 3322.",
        ],
      },
      {
        heading: "The data we process",
        bullets: [
          "When you write to or call us (email, phone, WhatsApp): your name, contact details and the content of your request.",
          "When you book an appointment: the online calendar is provided by Google Calendar, which collects your name, your email and the information you enter.",
          "When you browse, and only with your consent: the pages you view, clicks on the contact buttons and technical data (device, browser, approximate country), measured with Google Analytics and Google Ads.",
          "For security, our hosting provider records the IP address and time of each visit in technical logs.",
        ],
        after: ["The site has no forms and we never sell any data."],
      },
      {
        heading: "Why we process it",
        bullets: [
          "To answer your requests and prepare an appointment: pre-contractual steps taken at your request.",
          "To carry out the engagement you entrust to us and meet the legal duties of lawyers and notaries, including professional secrecy and anti-money-laundering rules.",
          "To measure visits to the site and the effectiveness of our ads: your consent, which you can withdraw at any time.",
          "To keep the site secure: our legitimate interest.",
        ],
      },
      {
        heading: "Who can access it",
        paragraphs: [
          "Members of the firm, bound by professional secrecy, and our technical providers, only for the service they provide to us:",
        ],
        bullets: [
          "Vercel (website hosting) and Sanity (website content management);",
          "Google (calendar, analytics, advertising and map);",
          "Meta, if you write to us on WhatsApp.",
        ],
        after: ["We only share data with authorities when the law requires it."],
      },
      {
        heading: "Transfers outside Costa Rica and the European Union",
        paragraphs: [
          "Some providers are based in the United States. These transfers rely on appropriate safeguards: the European Commission’s standard contractual clauses and, where applicable, the EU–U.S. Data Privacy Framework.",
        ],
      },
      {
        heading: "How long we keep it",
        bullets: [
          "Requests that do not lead to an engagement: 12 months at most.",
          "Client files: for the duration of the engagement, then for the retention periods the law imposes on lawyers and notaries.",
          "Analytics cookies: 13 months at most; your cookie choice: 6 months.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under Law No. 8968 you can access your data and have it corrected or deleted. If the GDPR applies to you, you also have the rights to restriction, objection and portability. You can withdraw your consent at any time, without affecting processing carried out before.",
          "To exercise your rights, write to info@sbs.cr. We may ask you to confirm your identity.",
          "You can also contact Costa Rica’s Data Protection Agency (PRODHAB) or the data protection authority of your country (for example the CNIL in France, the FDPIC in Switzerland or the Office of the Privacy Commissioner of Canada).",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["The site uses:"],
        bullets: [
          "sbs_consent: remembers your cookie choice (necessary, 6 months);",
          "_ga and _ga_*: Google Analytics, only if you accept analytics (13 months at most);",
          "_gcl_*: Google Ads, only if you accept advertising (90 days);",
          "Google Maps cookies, only if you display the map on the Contact page.",
        ],
        after: [
          "You can change your mind at any time with the “Manage cookies” link at the bottom of every page. If you reject them, Google cookies already set are deleted.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "The site is served over HTTPS only, and access to files is limited to the people who need it, all bound by professional secrecy.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "We may update this policy; the date at the top of the page shows the current version.",
        ],
      },
    ],
  },
};
