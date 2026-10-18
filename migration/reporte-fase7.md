# Fase 7 — Reporte de redirecciones y Lighthouse

Generado el 18/10/2026. Detalle de cada comprobación en `migration/redirects-report.csv`.

## Redirecciones 301

- **120** direcciones del sitio viejo (inventario de la Fase 6): **92** cambian de dirección y **28** quedan igual.
- Se probaron **360** variantes (cada dirección tal cual, con barra final y con `/index.php` delante): **360 correctas**, 0 fallos. Todas llegan en **un solo 301** a su dirección nueva.
- Destino de las 120 direcciones: **21** llegan ya a su página definitiva; **45** llegan a una página que existe pero cuyo contenido migrado sigue en borrador (equipo, servicios, guía, Le Cabinet); **54** llegan a una página nueva que da 404 hasta que se publique (artículos, casos, subtemas de la guía, página de constitución de sociedad).
- Probado contra la build de producción en local. En Vercel se comprobó una muestra (mismo código); la prueba completa allí necesita permitir `*.vercel.app` en la red del entorno.

| Dirección vieja | Dirección nueva | Tipo | Destino hoy |
|---|---|---|---|
| `/en/actuality` | `/en/news` | página de sección | 200 ✓ |
| `/en/actuality/david-solano-participates-as-an-expert-in-the-free-zones-and-medical-devices-webinar-in-costa-rica` | `/en/news/david-solano-participates-as-an-expert-in-the-free-zones-and-medical-devices-webinar-in-costa` | artículo | 404 · se publica desde el Studio |
| `/en/actuality/general-obligations-of-a-corporation-in-costa-rica` | `/en/news/general-obligations-of-a-corporation-in-costa-rica` | artículo | 404 · se publica desde el Studio |
| `/en/andrea-hernandez-bermudez` | `/en/the-firm/associate-attorneys#andrea-hernandez-bermudez` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/angel-edmundo-solano-calderon` | `/en/the-firm/founding-partners#angel-edmundo-solano-calderon` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/experiences-business-in-the-productive-sector-of-the-caribbean` | `/en/experiences/business-in-the-productive-sector-of-the-caribbean` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-corporate-company-in-free-zone` | `/en/experiences/corporate-company-in-free-zone` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-expats-our-service-experiences` | `/en/experiences/expats-our-service-experiences` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-financial-sector-credit-and-collection` | `/en/experiences/financial-sector-credit-and-collection` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-fintech-successful-arbitration-in-the-technology-sector` | `/en/experiences/fintech-successful-arbitration-in-the-technology-sector` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-hotel-royal-corin` | `/en/experiences/hotel-royal-corin` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-leadership-during-the-opening-of-the-telecommunications-sector` | `/en/experiences/leadership-during-the-opening-of-the-telecommunications-sector` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-rating-for-francophone-investors` | `/en/experiences/rating-for-francophone-investors` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-real-estate-project-montana-del-mar` | `/en/experiences/real-estate-project-montana-del-mar` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-study-on-competition-regulation-for-mobile-operator` | `/en/experiences/study-on-competition-regulation-for-mobile-operator` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-successful-completion-of-the-capannori-condominium-project` | `/en/experiences/successful-completion-of-the-capannori-condominium-project` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-telecommunications-successful-litigation` | `/en/experiences/telecommunications-successful-litigation` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/experiences-the-sanctuary-resort-and-condos` | `/en/experiences/the-sanctuary-resort-and-condos` | experiencia (caso) | 404 · se publica desde el Studio |
| `/en/kattia-bermudez-montenegro` | `/en/the-firm/founding-partners#kattia-bermudez-montenegro` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/leticia-monge-castillo` | `/en/the-firm/associate-attorneys#leticia-monge-castillo` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/lilliana-garcia-barrantes` | `/en/the-firm/associate-attorneys#lilliana-garcia-barrantes` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/maxime-bargain` | `/en/the-firm/associate-attorneys#maxime-bargain` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/our-firm` | `/en/the-firm` | página de sección | 200 · el contenido migrado está en borrador |
| `/en/our-firm/associates-lawyers` | `/en/the-firm/associate-attorneys` | página de sección | 200 ✓ |
| `/en/our-firm/founding-partners` | `/en/the-firm/founding-partners` | página de sección | 200 ✓ |
| `/en/phd-david-solano-ortiz` | `/en/the-firm/founding-partners#phd-david-solano-ortiz` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/en/service-areas` | `/en/practice-areas` | página de sección | 200 ✓ |
| `/en/service-areas/business-real-estate-investment` | `/en/practice-areas/business-real-estate-investment` | servicio | 200 · el contenido migrado está en borrador |
| `/en/service-areas/competition-telecommunications` | `/en/practice-areas/competition-telecommunications` | servicio | 200 · el contenido migrado está en borrador |
| `/en/service-areas/corporate-law` | `/en/practice-areas/corporate-law` | servicio | 200 · el contenido migrado está en borrador |
| `/en/service-areas/labor-law` | `/en/practice-areas/employment-law` | servicio | 200 · el contenido migrado está en borrador |
| `/es/actualidad/david-solano-participa-como-experto-en-el-webinar-sobre-zonas-francas-y-dispositivos-medicos-en-costa-rica` | `/es/actualidad/david-solano-participa-como-experto-en-el-webinar-sobre-zonas-francas-y-dispositivos-medicos-en` | artículo | 404 · se publica desde el Studio |
| `/es/andrea-hernandez-bermudez` | `/es/la-firma/abogados-colaboradores#andrea-hernandez-bermudez` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/angel-edmundo-solano-calderon` | `/es/la-firma/socios-fundadores#angel-edmundo-solano-calderon` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/areas-de-servicio` | `/es/areas-de-practica` | página de sección | 200 ✓ |
| `/es/areas-de-servicio/competencia-y-telecomunicaciones` | `/es/areas-de-practica/competencia-telecomunicaciones` | servicio | 200 · el contenido migrado está en borrador |
| `/es/areas-de-servicio/derecho-corporativo` | `/es/areas-de-practica/derecho-corporativo` | servicio | 200 · el contenido migrado está en borrador |
| `/es/areas-de-servicio/derecho-laboral` | `/es/areas-de-practica/derecho-laboral` | servicio | 200 · el contenido migrado está en borrador |
| `/es/areas-de-servicio/negocios-e-inversion-inmobiliaria` | `/es/areas-de-practica/negocios-e-inversion-inmobiliaria` | servicio | 200 · el contenido migrado está en borrador |
| `/es/calificacion-para-inversores-franceses` | `/es/experiencias/calificacion-para-inversores-franceses` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/corporativo-empresa-en-zona-franca` | `/es/experiencias/corporativo-empresa-en-zona-franca` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/culminacion-exitosa-del-proyecto-condominio-capannori` | `/es/experiencias/culminacion-exitosa-del-proyecto-condominio-capannori` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/david-solano-ortiz` | `/es/la-firma/socios-fundadores#dr-david-solano-ortiz` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/estudio-en-regulacion-de-la-competencia-para-operador-movil` | `/es/experiencias/estudio-en-regulacion-de-la-competencia-para-operador-movil` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/expatriados-nuestra-experiencia-de-servicio` | `/es/experiencias/expatriados-nuestra-experiencia-de-servicio` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/fintech-litigio-exitoso-en-sector-tecnologia` | `/es/experiencias/fintech-litigio-exitoso-en-sector-tecnologia` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/hotel-royal-corin` | `/es/experiencias/hotel-royal-corin` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/kattia-bermudez-montenegro` | `/es/la-firma/socios-fundadores#kattia-bermudez-montenegro` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/la-firma/asociados-y-abogados-colaboradores` | `/es/la-firma/abogados-colaboradores` | página de sección | 200 ✓ |
| `/es/leticia-monge-castillo` | `/es/la-firma/abogados-colaboradores#leticia-monge-castillo` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/lilliana-garcia-barrantes` | `/es/la-firma/abogados-colaboradores#lilliana-garcia-barrantes` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/maxime-bargain` | `/es/la-firma/abogados-colaboradores#maxime-bargain` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/es/negocios-en-sector-productivo-del-caribe` | `/es/experiencias/negocios-en-sector-productivo-del-caribe` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/protagonismo-durante-la-apertura-del-sector-telecomunicaciones` | `/es/experiencias/protagonismo-durante-la-apertura-del-sector-telecomunicaciones` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/proyecto-inmobiliario-montana-del-mar` | `/es/experiencias/proyecto-inmobiliario-montana-del-mar` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/sector-financiero-credito-y-cobro` | `/es/experiencias/sector-financiero-credito-y-cobro` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/telecomunicaciones-litigio-exitoso` | `/es/experiencias/telecomunicaciones-litigio-exitoso` | experiencia (caso) | 404 · se publica desde el Studio |
| `/es/the-sanctuary-resort-and-condos` | `/es/experiencias/the-sanctuary-resort-and-condos` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/actualite/david-solano-participe-en-qualite-dexpert-dans-le-webinaire-zones-franches-et-dispositifs-medicaux-au-costa-rica` | `/fr/actualite/david-solano-participe-en-qualite-d-expert-dans-le-webinaire-zones-franches-et-dispositifs` | artículo | 404 · se publica desde el Studio |
| `/fr/andrea-hernandez-bermudez` | `/fr/le-cabinet/avocats-collaborateurs#andrea-hernandez-bermudez` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/angel-edmundo-solano-calderon` | `/fr/le-cabinet/associes-fondateurs#angel-edmundo-solano-calderon` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/domaines-dexpertises` | `/fr/expertises` | página de sección | 200 ✓ |
| `/fr/domaines-dexpertises/affaires-et-investissement-immobilier` | `/fr/expertises/affaires-et-investissement-immobilier` | servicio | 200 · el contenido migrado está en borrador |
| `/fr/domaines-dexpertises/concurrence-et-telecommunications` | `/fr/expertises/concurrence-telecommunications` | servicio | 200 · el contenido migrado está en borrador |
| `/fr/domaines-dexpertises/droit-corporatif` | `/fr/expertises/droit-corporatif` | servicio | 200 · el contenido migrado está en borrador |
| `/fr/domaines-dexpertises/droit-du-travail` | `/fr/expertises/droit-du-travail` | servicio | 200 · el contenido migrado está en borrador |
| `/fr/dr-david-solano-ortiz` | `/fr/le-cabinet/associes-fondateurs#dr-david-solano-ortiz` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/etude-de-la-regulation-de-la-concurrence-pour-loperateur-mobile` | `/fr/experiences/etude-de-la-regulation-de-la-concurrence-pour-l-operateur-mobile` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-affaires-dans-le-secteur-productif-des-caraibes` | `/fr/experiences/affaires-dans-le-secteur-productif-des-caraibes` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-corporatif-entreprise-en-zone-franche` | `/fr/experiences/corporatif-entreprise-en-zone-franche` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-culmination-reussie-du-projet-condominium-capannori` | `/fr/experiences/culmination-reussie-du-projet-condominium-capannori` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-expatries-notre-experience-de-service` | `/fr/experiences/expatries-notre-experience-de-service` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-fintech-litige-reussi-dans-le-secteur-technologique` | `/fr/experiences/fintech-litige-reussi-dans-le-secteur-technologique` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-hotel-royal-corin` | `/fr/experiences/hotel-royal-corin` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-projet-immobilier-montana-del-mar` | `/fr/experiences/projet-immobilier-montana-del-mar` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-role-protagoniste-lors-de-louverture-du-secteur-des-telecommunications` | `/fr/experiences/role-protagoniste-lors-de-l-ouverture-du-secteur-des-telecommunications` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-secteur-financier-credit-et-recouvrement` | `/fr/experiences/secteur-financier-credit-et-recouvrement` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-telecommunications-litige-reussi` | `/fr/experiences/telecommunications-litige-reussi` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/experiences-the-sanctuary-resort-and-condos` | `/fr/experiences/the-sanctuary-resort-and-condos` | experiencia (caso) | 404 · se publica desde el Studio |
| `/fr/investir-au-costa-rica/accord-dassociation-ue-ac` | `/fr/investir-au-costa-rica/accord-d-association-ue-ac` | guía (tema) | 200 · el contenido migrado está en borrador |
| `/fr/investir-au-costa-rica/centre-daffaires` | `/fr/investir-au-costa-rica/centre-d-affaires` | guía (tema) | 200 · el contenido migrado está en borrador |
| `/fr/investir-au-costa-rica/climat-dinvestissement` | `/fr/investir-au-costa-rica/climat-d-investissement` | guía (tema) | 200 · el contenido migrado está en borrador |
| `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/financement-de-projet-dinvestissement` | `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/financement-de-projet-d-investissement` | guía (subtema) | 404 · se publica desde el Studio |
| `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/fiscalite-fonciere-2` | `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/devenez-promoteur-immobilier` | guía (subtema) | 404 · se publica desde el Studio |
| `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/louer-un-inmeuble` | `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/louer-un-immeuble` | guía (subtema) | 404 · se publica desde el Studio |
| `/fr/kattia-bermudez-montenegro` | `/fr/le-cabinet/associes-fondateurs#kattia-bermudez-montenegro` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/le-cabinet/les-associes-fondateurs` | `/fr/le-cabinet/associes-fondateurs` | página de sección | 200 ✓ |
| `/fr/le-cabinet/les-avocats-collaborateurs` | `/fr/le-cabinet/avocats-collaborateurs` | página de sección | 200 ✓ |
| `/fr/leticia-monge-castillo` | `/fr/le-cabinet/avocats-collaborateurs#leticia-monge-castillo` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/lilliana-garcia-barrantes` | `/fr/le-cabinet/avocats-collaborateurs#lilliana-garcia-barrantes` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/maxime-bargain` | `/fr/le-cabinet/avocats-collaborateurs#maxime-bargain` | miembro del equipo | 200 · la ficha aparece al publicar |
| `/fr/note-dappreciation-a-legard-dinvestisseurs-francais` | `/fr/experiences/note-d-appreciation-a-l-egard-d-investisseurs-francais` | experiencia (caso) | 404 · se publica desde el Studio |

Las 28 que no cambian (solo se normaliza la barra final y `/index.php`): `/fr`, `/es`, `/en`, `/fr/le-cabinet`, `/es/la-firma`, `/es/la-firma/socios-fundadores`, `/fr/experiences`, `/es/experiencias`, `/en/experiences`, `/fr/actualite`, `/es/actualidad`, `/fr/contact`, `/es/contacto`, `/en/contact`, `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers`, `/fr/investir-au-costa-rica/commerce-entreprises-societes`, `/fr/investir-au-costa-rica/droit-du-travail`, `/fr/investir-au-costa-rica/migration`, `/fr/investir-au-costa-rica/fiscalite`, `/fr/investir-au-costa-rica/concurrence-et-marches-regules`, `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/acquerir-la-propriete-immobiliere`, `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/fiscalite-fonciere`, `/fr/investir-au-costa-rica/propriete-et-droits-immobiliers/successions`, `/fr/actualite/les-obligations-legales-pour-les-societes-locales-au-costa-rica`, `/es/actualidad/obligaciones-legales-para-sociedades-en-costa-rica`, `/fr/constitution-d-une-societe-a-responsabilite-limitee`, `/es/creacion-de-sociedad-de-responsabilidad-limitada`, `/en/creation-of-a-limited-liability-company`.

## Lighthouse (móvil)

Lighthouse 12.8, perfil móvil (Moto G Power, 4G lenta simulada), sobre la build de producción en local con el contenido publicado hoy.

| Página | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/fr` | 98 | 100 | 96 | 100 | 1.7 s | 0 |
| `/fr/le-cabinet` | 96 | 100 | 96 | 100 | 2.7 s | 0 |
| `/fr/expertises` | 98 | 100 | 96 | 100 | 2.3 s | 0 |
| `/fr/expertises/credit-hypothecaire-prive-investissement` | 95 | 100 | 96 | 100 | 2.9 s | 0 |
| `/fr/investir-au-costa-rica` | 96 | 100 | 96 | 100 | 2.7 s | 0 |
| `/fr/experiences` | 98 | 100 | 96 | 100 | 2.3 s | 0 |
| `/fr/actualite` | 98 | 100 | 96 | 100 | 2.5 s | 0 |
| `/fr/actualite/article-de-test` | 95 | 100 | 96 | 100 | 3.0 s | 0 |
| `/fr/contact` | 92 | 100 | 96 | 100 | 2.8 s | 0 |
| `/es` | 94 | 100 | 96 | 100 | 2.9 s | 0 |
| `/en/practice-areas/corporate-law` | 98 | 100 | 96 | 100 | 2.5 s | 0 |

**Todas ≥ 90.** Corregido durante la fase: favicon e iconos (había un 404), rol ARIA del carrusel de testimonios y descripción en todas las páginas.

Lo único que aún resta en Best Practices (96) es un aviso de la consola: Sanity Live no puede conectarse desde `localhost` porque no está entre los orígenes permitidos de Sanity. En producción desaparece al añadir `https://www.sbs.cr` en Sanity → API → CORS origins (Fase 9).

## Qué más quedó hecho

- **Metadatos:** título y descripción desde Sanity (campo SEO o título y resumen), dirección canónica en `https://www.sbs.cr`, Open Graph y tarjeta para redes; imagen de marca por defecto `public/og-default.png` (se puede poner otra en Ajustes del sitio → SEO).
- **hreflang:** las 3 versiones de cada página más `x-default` → la versión francesa; las páginas sin traducción no se anuncian. Los temas de la guía todavía sin texto llevan `noindex` y quedan fuera del grupo de idiomas y del sitemap.
- **sitemap.xml** (con las traducciones de cada página) y **robots.txt** (bloquea /studio y /api; en las versiones de prueba de Vercel bloquea todo).
- **Datos estructurados:** `LegalService` con dirección, teléfono, email, horario (lunes a viernes, 8:00–17:00) e idiomas en todas las páginas; `BreadcrumbList` en las páginas internas; `BlogPosting` en Actualité; `Article` en la guía; `Person` para el equipo. El horario y la dirección por partes se editan en Ajustes del sitio → Contacto.

## Pendiente

1. **Publicar los borradores** en el Studio: así las 54 redirecciones que hoy terminan en 404 llegarán a su página y el resto mostrará el contenido migrado. Después, volver a ejecutar `npm run migrate:check-redirects`.
2. **Borrar «Article de test»** de Actualité (el artículo de prueba de la Fase 3 sigue publicado y entra en el sitemap).
3. **Fase 9:** añadir `https://www.sbs.cr` (y la dirección de Vercel) en Sanity → CORS origins.
4. **Limitación conocida de Next.js 16:** la primera visita a una dirección que nunca existió responde 200 con `noindex` (la página 404 ya se estaba enviando); desde la segunda responde 404. Google no la indexa por el `noindex`. Las direcciones viejas no se ven afectadas: todas redirigen antes.
