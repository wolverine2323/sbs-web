# Plan de migración — sbs.cr (Joomla → Next.js + Sanity + Vercel)

Cómo usar este plan:
1. Abre Claude Code dentro de la carpeta `sbs-web` (la que contiene este archivo, `CLAUDE.md`, `design/` y `public/`).
2. Ejecuta **una fase a la vez**: copia el prompt de la fase, pégalo en Claude Code y revisa el resultado antes de pasar a la siguiente.
3. Al terminar cada fase, pide: *"Marca la fase N como completada en PLAN.md y haz commit."*

Las tareas marcadas con 👤 las haces tú (cuentas, accesos, aprobaciones). Todo lo demás lo hace Claude Code.

---

## Fase 0 — Preparación 👤 (una sola vez)

- [ ] Crear cuenta en **GitHub** (o usar la tuya) y un repositorio privado vacío llamado `sbs-web`.
- [ ] Cuenta en **Vercel** conectada a GitHub. Para un sitio comercial corresponde el plan **Pro** (verificar precio vigente).
- [ ] Cuenta en **Sanity** (sanity.io) con tu email. El cliente se invita después, en la Fase 5.
- [ ] Tener instalado **Node.js LTS** y **Claude Code**. Si no los tienes, el primer prompt de la Fase 1 le pide a Claude Code que te guíe.
- [ ] Reunir material (se puede ir sumando después; mientras tanto se usan espacios rotulados):
  - Logo SBS en SVG o AI (el `public/monogram-temp.png` es provisional).
  - Fotos: socios fundadores, abogados colaboradores, oficina, imagen del Arenal/Costa Rica.
  - Logos autorizados de Chambers & Partners y LACCA.
  - Número de WhatsApp de la firma.
  - ID de medición de Google Analytics 4 (si ya existe).

---

## Fase 1 — Crear el proyecto ✅

- [x] **Completada el 16/10/2026** — Next.js 16 + next-intl (fr/es/en) + fuentes y tokens Nocturne. `npm run build` y `npm run lint` limpios; probado a 375px y 1440px.

**Prompt para Claude Code:**
```
Lee CLAUDE.md y PLAN.md completos. Luego:
1. Verifica que tengo Node.js LTS y git instalados; si falta algo, guíame paso a paso (no soy técnico en infraestructura).
2. Crea un proyecto Next.js (App Router, TypeScript, Tailwind, ESLint) en esta misma carpeta, sin borrar CLAUDE.md, PLAN.md, design/ ni public/.
3. Instala y configura next-intl con los locales fr (por defecto), es y en, con prefijo obligatorio en la URL y redirección de / a /fr.
4. Configura las fuentes Cormorant Garamond y DM Sans con next/font y los tokens de color de CLAUDE.md en Tailwind.
5. Inicializa git, conecta el repositorio remoto que te indique y haz el primer commit.
Muéstrame el plan antes de ejecutar.
```
**Listo cuando:** `npm run dev` abre `/fr`, `/es` y `/en` con una página vacía en las fuentes y colores correctos.

---

## Fase 2 — Sistema de componentes

**Prompt:**
```
Abre design/nocturne-reference.html y estúdialo a fondo: es la referencia visual exacta.
Crea los componentes reutilizables en src/components con los estilos de CLAUDE.md:
Header (logo centrado, navegación izquierda, selector FR/ES/EN + CTA a la derecha, menú móvil bajo 1100px),
Footer, SectionEyebrow, Heading, ButtonPrimary, ButtonOutline, ServiceRow, TestimonialCarousel,
StepList, BookingCard, SealBadge, ContactList, ImagePlaceholder y WhatsAppFloat.
Crea una página interna /[locale]/_kit (solo en desarrollo) que muestre todos los componentes.
```
**Listo cuando:** la página `_kit` se ve igual al estilo Nocturne en escritorio y en móvil.

---

## Fase 3 — Esquemas de Sanity y panel de edición

**Prompt:**
```
Configura Sanity v3 con el Studio embebido en /studio (protegido por el login de Sanity).
Usa @sanity/document-internationalization para documentos traducibles (fr, es, en) y vincula las traducciones entre sí.
Esquemas:
- siteSettings (singleton): teléfono, email, dirección, whatsapp, bookingUrl, gaId, redes, textos del pie (por idioma).
- homePage (por idioma): todos los bloques de la portada (hero, firma, servicios destacados, guía, pasos, reserva, reconocimientos, contacto).
- service (por idioma): título, slug, resumen, cuerpo (Portable Text), imagen, SEO.
- investGuide (por idioma): título, slug, página padre (para subtemas como "Propriété et droits immobiliers" > "Acquérir la propriété"), orden, cuerpo, SEO.
- teamMember (por idioma): nombre, cargo, tipo (socio fundador / colaborador), foto, biografía, idiomas que habla, orden.
- testimonial: cita (fr, es, en), autor, cargo/origen, orden, publicado sí/no.
- post (por idioma, para Actualité/blog): título, slug, extracto, imagen, cuerpo, fecha, autor (teamMember), categoría, SEO.
- page (por idioma): páginas genéricas como Política de privacidad.
Organiza el menú del Studio en español con secciones claras ("Blog", "Páginas", "Equipo", "Testimonios", "Configuración").
Agrega vista previa (Presentation / draft mode) para que el cliente vea el artículo antes de publicar.
Conecta Next.js a Sanity con GROQ y revalidación por webhook para que lo publicado aparezca en segundos.
```
**👤 Después:** en sanity.io/manage → *Members*, invita al cliente. Rol sugerido para el cliente: **Editor**, y para ti: **Administrator**.
⚠️ Verifica qué roles incluye el plan gratuito de Sanity; si el rol Editor requiere plan de pago, decide entre pagarlo o darle al cliente un rol más amplio.

**Listo cuando:** puedes crear un artículo de prueba en `/studio` y verlo publicado en `/fr/actualite/...`.

---

## Fase 4 — Portada

**Prompt:**
```
Construye /[locale] (portada) reproduciendo design/nocturne-reference.html sección por sección,
pero leyendo todo el contenido desde Sanity (homePage, service, testimonial, siteSettings).
Crea un script de seed que cargue en Sanity los textos FR/ES/EN que están en el objeto dict() del archivo de referencia.
El carrusel de testimonios debe ser accesible (botones con aria-label, sin autoplay).
Todos los CTA de cita usan siteSettings.bookingUrl.
```
**Listo cuando:** la portada en los 3 idiomas se ve igual a la referencia y cambiar un texto en el Studio lo cambia en el sitio.

---

## Fase 5 — Páginas internas

Primero el diseño, después el código. Pide las plantillas en el mismo estilo y apruébalas.

**Prompt:**
```
Crea estas plantillas en el estilo Nocturne, todas alimentadas por Sanity y con CTA de cita visible:
1. Le Cabinet (/fr/le-cabinet) + Les associés fondateurs + Les avocats collaborateurs (tarjetas de equipo con foto, cargo, idiomas).
2. Domaines d'expertise: índice + plantilla de servicio (hero, cuerpo, "cómo le ayudamos", testimonio relacionado, CTA final).
3. Investir au Costa Rica: índice de la guía + plantilla de artículo con índice lateral, migas de pan y subpáginas.
4. Expériences: todos los testimonios.
5. Actualité: listado con paginación y filtro por categoría + plantilla de artículo (tiempo de lectura, autor, compartir, artículos relacionados, CTA).
6. Contact: datos, mapa (Google Maps embed de Terra Campus) y CTA de cita.
7. Página 404 en los 3 idiomas.
Los slugs deben estar traducidos por idioma (p. ej. /fr/le-cabinet, /es/la-firma, /en/the-firm).
Muéstrame primero la estructura de rutas propuesta.
```
**Listo cuando:** todas las rutas funcionan en los 3 idiomas y el selector de idioma lleva a la página equivalente (no a la portada).

---

## Fase 6 — Migración del contenido actual

**Prompt:**
```
Recorre el sitio actual https://www.sbs.cr en sus tres idiomas (/fr, /es, /en): navega por los menús y,
si existe, usa el sitemap. Para cada página extrae título, texto, imágenes y URL original.
Guarda un inventario en migration/inventory.csv (url_vieja, idioma, tipo, título, slug_nuevo).
Luego escribe un script que importe ese contenido a Sanity (convirtiendo el HTML a Portable Text y subiendo las imágenes).
No publiques nada todavía: déjalo como borrador para que lo revise.
```
**👤 Después:** revisa en el Studio que los textos y las imágenes estén completos, y publica.

**Listo cuando:** todo el contenido de Joomla existe en Sanity y el inventario no tiene páginas sin migrar.

---

## Fase 7 — SEO y redirecciones (crítico para no perder Google)

**Prompt:**
```
1. Usa migration/inventory.csv para generar redirecciones 301 de cada URL vieja de Joomla a su URL nueva (en next.config o middleware). Incluye variantes con y sin barra final.
2. Metadatos por página desde Sanity: title, description y Open Graph con imagen por defecto de marca.
3. hreflang entre las 3 versiones de cada página + x-default apuntando a /fr.
4. sitemap.xml multilingüe y robots.txt.
5. Datos estructurados JSON-LD: LegalService/Attorney con dirección, teléfono y horarios; Article en el blog; BreadcrumbList.
6. Revisa con Lighthouse: objetivo ≥ 90 en Performance, Accessibility, Best Practices y SEO en móvil. Corrige lo que falte.
Entrégame un reporte de las redirecciones y de los puntajes.
```
**Listo cuando:** cada URL vieja del inventario redirige correctamente (verificado con un script) y Lighthouse está en verde.

---

## Fase 8 — Conversión, medición y cumplimiento

**Prompt:**
```
1. Integra GA4 (ID desde siteSettings) cargado solo después del consentimiento.
2. Eventos: book_click, phone_click, email_click, whatsapp_click, con el idioma y la sección como parámetros.
3. Banner de cookies en los 3 idiomas, compatible con RGPD (aceptar / rechazar / configurar) para visitantes europeos.
4. Página de Política de privacidad (contenido editable en Sanity) con referencia a la Ley 8968 de Costa Rica y al RGPD; enlázala en el pie.
5. Botón flotante de WhatsApp con mensaje predefinido según el idioma.
```
**👤 Después:** pide a la firma que revise el texto legal de la política de privacidad.

---

## Fase 9 — Despliegue de prueba en Vercel

**Prompt:**
```
Guíame para conectar el repositorio a Vercel, configurar las variables de entorno (Sanity project ID, dataset, token de lectura, secreto de revalidación) y desplegar.
Configura el webhook de Sanity → Vercel para revalidar al publicar.
Dame la URL de prueba (*.vercel.app) y una lista de verificación para que la firma revise.
```
**👤 Revisión con la firma:** que naveguen la URL de prueba en móvil y escritorio, en los 3 idiomas, y que prueben agendar una cita. Recoge correcciones.

**Listo cuando:** la firma aprueba el sitio de prueba.

---

## Fase 10 — Lanzamiento 👤 + Claude Code

**Prompt:**
```
Vamos a lanzar en sbs.cr. Guíame paso a paso:
1. Agregar sbs.cr y www.sbs.cr como dominios en Vercel (www redirige al dominio principal).
2. Qué registros DNS exactos debo cambiar en mi proveedor de dominio. IMPORTANTE: no tocar los registros MX ni los de correo (info@sbs.cr debe seguir funcionando).
3. Verificar HTTPS, redirecciones 301 y hreflang en producción.
4. Enviar el sitemap a Google Search Console y verificar la propiedad.
5. Checklist de las primeras 72 horas (errores 404, Search Console, Analytics).
```
⚠️ Antes de cambiar DNS: anota los registros actuales (sobre todo MX) y confirma quién administra el dominio.
⚠️ No canceles el hosting de Joomla hasta pasadas 2–4 semanas sin problemas.

---

## Fase 11 — Entrega al cliente

**Prompt:**
```
Escribe una guía corta en francés y en español para el cliente: cómo entrar al Studio, crear y traducir un artículo del blog,
subir imágenes, guardar como borrador, previsualizar y publicar. Incluye capturas o pasos numerados.
Agrega también una guía para mí (José Luis) sobre cómo cambiar textos, imágenes, testimonios y el enlace de citas.
```

---

## Resumen de responsabilidades

| Quién | Qué |
|---|---|
| **José Luis** | Cuentas (GitHub, Vercel, Sanity), material de la firma, aprobaciones, DNS, invitar al cliente |
| **Claude Code** | Código, componentes, Sanity, migración, SEO, redirecciones, despliegue guiado, guías |
| **Cliente (SBS)** | Revisar textos y traducciones, aprobar el sitio de prueba, escribir artículos del blog |
