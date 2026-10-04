# Web Open Beauty by magnolia

Web estática (HTML + CSS + JS, sin dependencias externas). Abre `index.html` en el navegador para verla.
Para publicarla, sube la carpeta completa a cualquier hosting (Netlify, Vercel, Hostinger, etc.).

## Estructura
- `index.html` – contenido y secciones
- `css/styles.css` – estilos (colores y tipografías en `:root`, al principio)
- `js/main.js` – WhatsApp, horario, textos del mapa facial (`ZONES`) y textos legales (`LEGAL`)
- `assets/logo.svg`, `assets/logo-white.svg` – logo vectorizado
- `assets/img/` – fotos, mármol, favicon
- `assets/fonts/` – tipografías Lato y Sacramento (alojadas en local, sin Google Fonts)

## Pendiente antes de publicar
1. **Fotos**: las actuales están recortadas de los flyers (baja resolución). Sustituye `assets/img/hialuronico.jpg`, `microneedling.jpg` y `prp.jpg` por fotos reales del centro en alta calidad (mismo nombre).
2. **Instagram**: añade el enlace real en el pie (`@openbeauty` en `index.html`).
3. **Textos legales**: completa razón social, NIF, email y nº de registro sanitario en `LEGAL` (`js/main.js`).
4. **Profesionales**: si el centro cuenta con médico/a, conviene añadirlo (los inyectables en España deben realizarlos médicos en centro sanitario autorizado).
5. **Antes y después**: las 3 imágenes de `assets/antes-despues/` son de ejemplo. Sustitúyelas por fotos propias de pacientes de Open Beauty (con su consentimiento por escrito), manteniendo los nombres `caso-1.jpg`, `caso-2.jpg`, `caso-3.jpg`.
   - Cada foto debe llevar el antes y el después juntos en una sola imagen.
   - En `index.html`, `data-layout="h"` = lado a lado (antes a la izquierda); `data-layout="v"` = uno encima del otro (antes arriba).
   - Para añadir más casos, copia un bloque `<article class="ba">`. Si una foto no existe, su tarjeta se oculta sola.
6. **Opiniones**: están en la sección `#opiniones` de `index.html`. Para añadir una, copia un bloque `<article class="review">`.
