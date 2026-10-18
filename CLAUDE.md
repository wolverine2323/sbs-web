# SBS Abogados — sitio web (sbs.cr)

Sitio corporativo de **Solano Bermúdez & Solano (SBS Abogados)**, firma de abogados y notarios en Costa Rica.
Objetivo principal del sitio: **convertir visitas en citas agendadas o llamadas.**
Audiencia principal: francófona (Francia, Suiza, Canadá), luego hispanohablante y anglófona.

## Stack (no cambiar sin preguntar)
- **Next.js (App Router) + TypeScript**, desplegado en **Vercel**.
- **Sanity** como CMS, con el Studio embebido en `/studio`.
- **Tailwind CSS** con los tokens de diseño definidos abajo.
- **next-intl** para idiomas. Locales: `fr` (por defecto), `es`, `en`. Todas las rutas llevan prefijo: `/fr`, `/es`, `/en`. La raíz `/` redirige a `/fr`.
- Fuentes con `next/font/google`: **Cormorant Garamond** (títulos, 400/500/600 + itálica) y **DM Sans** (texto, 400/500/600).
- No usar Supabase ni base de datos propia: todo el contenido editable vive en Sanity.

## Diseño: dirección "Nocturne — encre & bronze"
La referencia visual exacta es `design/nocturne-reference.html` (portada completa, con todos los textos FR/ES/EN en el objeto `dict()` del script).
Reproducir ese diseño fielmente; no inventar otro estilo.

### Tokens de color
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#131517` | Fondo principal oscuro |
| `ink-raised` | `#1B1D20` | Tarjetas sobre fondo oscuro |
| `paper` | `#F6F3EE` | Secciones claras alternas |
| `cream` | `#F1ECE4` | Texto principal sobre `ink` |
| `stone` | `#B9B2A8` | Texto secundario sobre `ink` |
| `stone-dim` | `#8F887E` | Notas y pie sobre `ink` |
| `bronze-light` | `#D4BC96` | Etiquetas, filetes y números sobre fondo oscuro |
| `bronze` | `#9B7D58` | Filetes sobre `paper` |
| `bronze-text` | `#856A45` | Números/etiquetas pequeñas sobre `paper` (antes #8A6E48; oscurecido para llegar a 4.5:1) |
| `burgundy` | `#9D2137` | **Solo** botones de acción y acentos de marca |
| `burgundy-hover` | `#B0283F` | Hover de botones sobre `ink` |
| `burgundy-deep` | `#3E1A21` | Sección de testimonios |
| `burgundy-mid` | `#652A35` | Hover sobre `paper` |
| `text-on-paper` | `#141517` / `#4A4540` | Títulos / cuerpo sobre `paper` |

### Reglas de estilo
- Ritmo de secciones: oscuro (`ink`) ↔ claro (`paper`), con testimonios en `burgundy-deep`.
- Etiquetas de sección: 12px, MAYÚSCULAS, `letter-spacing: 0.32em`, color bronce.
- Títulos en Cormorant Garamond peso 400, tamaños fluidos con `clamp()`; segunda línea del hero en itálica `bronze-light`.
- Botones rectos (sin border-radius), 13–14px en mayúsculas con `letter-spacing: 0.1em`, alto 48–60px.
- Filetes de 1px en bronce con opacidad (`rgba(212,188,150,.16–.45)`), sin sombras pesadas.
- Iconos: SVG de trazo fino (1.5px). Nunca emojis.
- Accesibilidad: contraste mínimo 4.5:1, objetivos táctiles ≥ 44px, `<button>`/`<a>` reales, `aria-label` en botones de icono, `lang` correcto por idioma.
- Responsive: todo debe funcionar a 375px de ancho (menú hamburguesa bajo 1280px; a 1100px, el corte de la referencia, la navegación no cabe en una línea).

## Datos fijos de la firma
- Teléfono: **(506) 4000 3322** → `tel:+50640003322`
- Email: **info@sbs.cr**
- Dirección: Terra Campus Corporativo, Torre uno, segundo piso, No. 202, La Unión, Costa Rica.
- **Agendar cita (CTA principal):** `https://calendar.app.google/oU4teZWLHRAWEcy67` — guardar en Sanity (`siteSettings.bookingUrl`), nunca hardcodear en componentes.
- Reconocimientos: abogados/notarios conocidos por las embajadas de Francia, Suiza y Canadá; Chambers & Partners; LACCA Approved.
- Miembros de: Chambre de Commerce et d'Industrie France – Costa Rica; Chambre d'Infocommunication.
- **Logos de embajadas: autorizados por la firma** (José Luis, 18/10/2026). Solo en la sección de reconocimientos, en un solo color (#4A4540) como los de Chambers y LACCA; archivos en `scripts/content/logos`, se suben con `npm run logos`. Fuera de esa sección, las embajadas van como texto.

## Conversión (prioridad en cada página)
- CTA "Prendre rendez-vous / Agendar una cita / Book a consultation" visible en el header fijo y al menos una vez por sección relevante.
- Botón secundario de llamada (`tel:`).
- Botón flotante de WhatsApp (número en `siteSettings.whatsapp`).
- Cada clic en CTA de cita, teléfono, email y WhatsApp dispara un evento GA4 (`book_click`, `phone_click`, `email_click`, `whatsapp_click`) con el idioma como parámetro.

## Reglas de trabajo
- Cualquier texto visible sale de Sanity o de los archivos de mensajes de `next-intl`; nunca texto fijo en JSX.
- Antes de cambios grandes, proponer el plan y esperar aprobación.
- Después de cada fase: `npm run build` sin errores, `npm run lint` limpio, y probar en 375px y 1440px.
- Commits pequeños con mensajes claros en español.
- No hacer push a `main` ni cambiar DNS sin confirmación explícita de José Luis.
- El plan completo por fases está en `PLAN.md`; marcar las casillas al terminar cada fase.
