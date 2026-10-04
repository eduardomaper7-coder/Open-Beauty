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
5. **Reseñas**: si tenéis reseñas de Google, se puede añadir una sección con las reales.
