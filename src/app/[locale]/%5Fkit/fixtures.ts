import type { Locale } from "@/i18n/routing";

// Contenido de ejemplo para la página _kit, copiado del dict() de
// design/nocturne-reference.html. En el sitio real estos datos vienen de
// Sanity (Fases 3 y 4); este archivo solo existe para el kit.

export const kitSettings = {
  bookingUrl: "https://calendar.app.google/oU4teZWLHRAWEcy67",
  phone: "(506) 4000 3322",
  email: "info@sbs.cr",
  // Número ficticio hasta tener el de la firma (siteSettings.whatsapp).
  whatsapp: "+506 0000 0000",
  distinctions: ["Chambers & Partners", "LACCA Approved"],
};

type KitContent = {
  heroCta2: string;
  heroNote: string;
  firmPhoto: string;
  servEyebrow: string;
  servTitle: string;
  servLead: string;
  services: Array<[title: string, description: string]>;
  investCta: string;
  testiEyebrow: string;
  testiTitle: string;
  testimonials: Array<[quote: string, name: string, role: string]>;
  procEyebrow: string;
  procTitle: string;
  steps: Array<[title: string, description: string]>;
  booking: {
    tag: string;
    title: string;
    body: string;
    button: string;
    alternative: string;
  };
  recoEyebrow: string;
  recoTitle: string;
  embassies: Array<[short: string, label: string]>;
  distTitle: string;
  contactTitle: string;
  contactBody: string;
  address: string;
  footerBody: string;
  rights: string;
};

export const kitContent: Record<Locale, KitContent> = {
  fr: {
    heroCta2: "Appeler le cabinet",
    heroNote: "Consultation en français, espagnol ou anglais",
    firmPhoto: "Photo · Les associés fondateurs",
    servEyebrow: "Domaines de service",
    servTitle: "Une expertise ciblée, des réponses précises.",
    servLead:
      "Quatre pôles d’expertise pour sécuriser chaque étape de votre projet au Costa Rica.",
    services: [
      ["Affaires et Investissement Immobilier", "Acquisition, location, fiscalité foncière, promotion et financement de projets immobiliers, successions."],
      ["Droit Corporatif", "Constitution et gestion de sociétés, conseil corporatif et opérations de fusion-acquisition."],
      ["Droit du Travail", "Conseil aux entreprises sur leurs relations de travail, contrats et obligations d’employeur."],
      ["Concurrence & Télécommunications", "Conseil et litige en droit de la concurrence et régulation des marchés de télécommunications."],
    ],
    investCta: "Parler de mon projet",
    testiEyebrow: "Expériences",
    testiTitle: "Ils nous ont confié leur projet.",
    testimonials: [
      ["Excellente équipe. David Solano est ce qu’on appelle un consciencieux. Il est doté d’une grande conscience professionnelle et d’une implication réelle qui font de lui un partenaire indispensable dans la grande aventure d’une installation au Costa Rica.", "Catherinne Gallardo", "France"],
      ["Très réactifs et ils maîtrisent parfaitement la langue. Ils ont su anticiper nos attentes et nous proposer les solutions les moins coûteuses et les plus appropriées. Ils méritent pleinement la confiance que nous leur avons accordée.", "François Tary", "Cassis, France"],
      ["Le soutien du Cabinet a été essentiel pour développer le projet d’investissement dans la zone franche du Costa Rica, qui concerne plus de 120 emplois directs. Je souligne le service agile, ponctuel et efficace, et surtout la relation de confiance et d’engagement des avocats avec notre entreprise.", "Jorge Hernández C.", "General Manager · BM Datos of Costa Rica S.A."],
      ["Chez CCS, nous sommes très heureux d’avoir les services de l’équipe juridique de SBS. Ce fut une expérience très positive de les voir se préparer durement pour nous défendre dans un litige en télécommunications. Don David Solano et l’équipe traitent les informations de notre cas avec précision.", "Sal Ayala", "CEO · Trigicom, USA – Israël"],
      ["À Montaña del Mar, nous n’avons aucune hésitation à recommander Kattia Bermúdez pour tous vos besoins juridiques au Costa Rica : extrêmement diligente, travailleuse, honnête et fiable.", "David Knaggs", "CEO · Montaña del Mar, USA"],
      ["L’investissement à l’étranger nécessite un partenaire de confiance sur place. SBS est le cabinet parfait que je recommande systématiquement à mon réseau d’investisseurs.", "Neil Atkinson", "US Realty Investor"],
    ],
    procEyebrow: "Votre premier rendez-vous",
    procTitle: "Parlons de votre projet, simplement.",
    steps: [
      ["Choisissez un créneau", "Réservez en ligne le moment qui vous convient, où que vous soyez."],
      ["Échangez avec un avocat", "Présentez votre projet ou votre situation, en français, en espagnol ou en anglais."],
      ["Avancez avec clarté", "Nous définissons ensemble les étapes juridiques et la marche à suivre."],
    ],
    booking: {
      tag: "Agenda en ligne",
      title: "Réservez votre consultation",
      body: "Sélectionnez directement un créneau dans notre agenda. Vous recevrez la confirmation par email.",
      button: "Choisir un créneau",
      alternative: "Vous préférez nous appeler ou nous écrire ?",
    },
    recoEyebrow: "Reconnaissance",
    recoTitle: "Avocats et notaires connus des ambassades.",
    embassies: [["Canada", "Ambassade du Canada"], ["Suisse", "Ambassade de Suisse"], ["France", "Ambassade de France au Costa Rica"]],
    distTitle: "Distinction d’excellence",
    contactTitle: "Nous sommes à votre disposition.",
    contactBody:
      "Pour plus d’informations sur SBS Abogados, contactez-nous par l’un des moyens suivants et nous vous répondrons rapidement.",
    address: "Terra Campus Corporativo, Torre uno, segundo piso, n° 202, La Unión, Costa Rica.",
    footerBody:
      "Solano Bermúdez & Solano est un cabinet d’avocats et de notaires principalement spécialisé dans la direction de projets d’investissement au Costa Rica, l’assistance corporative et le conseil juridique en droit de la concurrence, régulation des marchés de télécommunications et opérations de fusion-acquisition.",
    rights: "© 2026 SBS Abogados. Tous droits réservés.",
  },
  es: {
    heroCta2: "Llamar a la firma",
    heroNote: "Atención en francés, español o inglés",
    firmPhoto: "Foto · Socios fundadores",
    servEyebrow: "Áreas de servicio",
    servTitle: "Experiencia enfocada, respuestas precisas.",
    servLead:
      "Cuatro áreas de práctica para asegurar cada etapa de su proyecto en Costa Rica.",
    services: [
      ["Negocios e Inversión Inmobiliaria", "Adquisición, alquiler, impuestos sobre la propiedad, desarrollo y financiamiento de proyectos inmobiliarios, sucesiones."],
      ["Derecho Corporativo", "Constitución y gestión de sociedades, asesoría corporativa y operaciones de fusión y adquisición."],
      ["Derecho Laboral", "Asesoría a empresas en relaciones laborales, contratos y obligaciones patronales."],
      ["Competencia & Telecomunicaciones", "Asesoría y litigio en derecho de la competencia y regulación de los mercados de telecomunicaciones."],
    ],
    investCta: "Conversar sobre mi proyecto",
    testiEyebrow: "Experiencias",
    testiTitle: "Nos confiaron su proyecto.",
    testimonials: [
      ["Excelente equipo. David Solano es lo que se llama una persona concienzuda: tiene una gran ética profesional y un compromiso real que lo convierten en un aliado indispensable en la gran aventura de establecerse en Costa Rica.", "Catherinne Gallardo", "Francia"],
      ["Muy ágiles y dominan perfectamente el idioma. Supieron anticipar nuestras expectativas y proponernos las soluciones más económicas y adecuadas. Merecen plenamente la confianza que les dimos.", "François Tary", "Cassis, Francia"],
      ["El apoyo de la firma fue esencial para desarrollar el proyecto de inversión en zona franca de Costa Rica, que involucra más de 120 empleos directos. Destaco el servicio ágil, puntual y eficaz, y sobre todo la relación de confianza y compromiso de los abogados con nuestra empresa.", "Jorge Hernández C.", "Gerente General · BM Datos of Costa Rica S.A."],
      ["En CCS estamos muy contentos con los servicios del equipo legal de SBS. Fue una experiencia muy positiva verlos prepararse a fondo para defendernos en un litigio de telecomunicaciones. Don David Solano y el equipo manejan la información de nuestro caso con precisión.", "Sal Ayala", "CEO · Trigicom, USA – Israel"],
      ["En Montaña del Mar no dudamos en recomendar a Kattia Bermúdez para cualquier necesidad legal en Costa Rica: extremadamente diligente, trabajadora, honesta y confiable.", "David Knaggs", "CEO · Montaña del Mar, USA"],
      ["Invertir en el extranjero requiere un socio de confianza en el lugar. SBS es la firma perfecta que recomiendo sistemáticamente a mi red de inversionistas.", "Neil Atkinson", "US Realty Investor"],
    ],
    procEyebrow: "Su primera cita",
    procTitle: "Hablemos de su proyecto, sin complicaciones.",
    steps: [
      ["Elija un horario", "Reserve en línea el momento que mejor le convenga, esté donde esté."],
      ["Converse con un abogado", "Cuéntenos su proyecto o situación, en francés, español o inglés."],
      ["Avance con claridad", "Definimos juntos los pasos legales y la ruta a seguir."],
    ],
    booking: {
      tag: "Agenda en línea",
      title: "Reserve su consulta",
      body: "Seleccione directamente un espacio en nuestra agenda. Recibirá la confirmación por correo electrónico.",
      button: "Elegir un horario",
      alternative: "¿Prefiere llamarnos o escribirnos?",
    },
    recoEyebrow: "Reconocimiento",
    recoTitle: "Abogados y notarios reconocidos por las embajadas.",
    embassies: [["Canadá", "Embajada de Canadá"], ["Suiza", "Embajada de Suiza"], ["Francia", "Embajada de Francia en Costa Rica"]],
    distTitle: "Distinción de excelencia",
    contactTitle: "Estamos a su disposición.",
    contactBody:
      "Para más información sobre SBS Abogados, contáctenos por cualquiera de estos medios y le responderemos a la brevedad.",
    address: "Terra Campus Corporativo, Torre uno, segundo piso, No. 202, La Unión, Costa Rica.",
    footerBody:
      "Solano Bermúdez & Solano es una firma de abogados y notarios especializada principalmente en la dirección de proyectos de inversión en Costa Rica, asistencia corporativa y asesoría legal en derecho de la competencia, regulación de mercados de telecomunicaciones y operaciones de fusión y adquisición.",
    rights: "© 2026 SBS Abogados. Todos los derechos reservados.",
  },
  en: {
    heroCta2: "Call the firm",
    heroNote: "Consultations in French, Spanish or English",
    firmPhoto: "Photo · Founding partners",
    servEyebrow: "Practice areas",
    servTitle: "Focused expertise, precise answers.",
    servLead: "Four practice areas to secure every step of your project in Costa Rica.",
    services: [
      ["Business & Real Estate Investment", "Acquisitions, leasing, property tax, development and financing of real estate projects, estates."],
      ["Corporate Law", "Company formation and management, corporate advice, mergers and acquisitions."],
      ["Employment Law", "Advice to companies on employment relations, contracts and employer obligations."],
      ["Competition & Telecommunications", "Advice and litigation in competition law and telecommunications market regulation."],
    ],
    investCta: "Discuss my project",
    testiEyebrow: "Experiences",
    testiTitle: "They trusted us with their project.",
    testimonials: [
      ["An excellent team. David Solano is what you call conscientious: his strong professional ethic and genuine involvement make him an indispensable partner in the great adventure of settling in Costa Rica.", "Catherinne Gallardo", "France"],
      ["Very responsive, and they master the language perfectly. They anticipated our expectations and offered the most cost-effective and appropriate solutions. They fully deserve the trust we placed in them.", "François Tary", "Cassis, France"],
      ["The firm’s support was essential to developing our investment project in Costa Rica’s free trade zone, involving more than 120 direct jobs. I highlight the agile, timely and effective service, and above all the trust and commitment of the attorneys toward our company.", "Jorge Hernández C.", "General Manager · BM Datos of Costa Rica S.A."],
      ["At CCS we are very happy to have SBS’s legal team. It was a very positive experience to see them prepare thoroughly to defend us in a telecommunications dispute. Don David Solano and the team handle our case information with precision.", "Sal Ayala", "CEO · Trigicom, USA – Israel"],
      ["At Montaña del Mar we have absolutely no hesitation in recommending Kattia Bermúdez for any legal needs you may have in Costa Rica: extremely diligent, hard-working, honest and reliable.", "David Knaggs", "CEO · Montaña del Mar, USA"],
      ["Investing abroad requires a trusted partner on the ground. SBS is the perfect firm, and I recommend it consistently to my network of investors.", "Neil Atkinson", "US Realty Investor"],
    ],
    procEyebrow: "Your first meeting",
    procTitle: "Let’s talk about your project.",
    steps: [
      ["Pick a time slot", "Book online at the time that suits you, wherever you are."],
      ["Speak with an attorney", "Walk us through your project or situation, in French, Spanish or English."],
      ["Move forward with clarity", "Together we define the legal steps and the way forward."],
    ],
    booking: {
      tag: "Online booking",
      title: "Book your consultation",
      body: "Choose a slot directly in our calendar. You’ll receive a confirmation by email.",
      button: "Choose a time",
      alternative: "Prefer to call or write to us?",
    },
    recoEyebrow: "Recognition",
    recoTitle: "Attorneys and notaries known to the embassies.",
    embassies: [["Canada", "Embassy of Canada"], ["Switzerland", "Embassy of Switzerland"], ["France", "Embassy of France in Costa Rica"]],
    distTitle: "Distinction of excellence",
    contactTitle: "We are at your disposal.",
    contactBody:
      "For more information about SBS Abogados, reach us through any of the following and we will get back to you shortly.",
    address: "Terra Campus Corporativo, Tower one, second floor, No. 202, La Unión, Costa Rica.",
    footerBody:
      "Solano Bermúdez & Solano is a law and notary firm mainly specialized in leading investment projects in Costa Rica, corporate assistance and legal advice in competition law, telecommunications market regulation and mergers and acquisitions.",
    rights: "© 2026 SBS Abogados. All rights reserved.",
  },
};
