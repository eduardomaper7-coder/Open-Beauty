/* =========================================================
   OPEN BEAUTY by magnolia — Interacciones
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN (edita aquí) ---------- */
  const CONFIG = {
    whatsapp: '34608410097',                // con prefijo de país, sin + ni espacios
    hours: [[10, 0, 14, 0], [16, 0, 20, 0]], // franjas L–V (hora inicio, min, hora fin, min)
    openDays: [1, 2, 3, 4, 5],               // 1 = lunes … 5 = viernes
    timezone: 'Europe/Madrid'
  };

  /* Zonas del mapa facial */
  const ZONES = {
    frente:    { t: 'Frente', d: 'Suavizamos las líneas horizontales de expresión para una frente lisa que sigue moviéndose con naturalidad.', tx: ['Toxina botulínica'] },
    entrecejo: { t: 'Entrecejo', d: 'Relajamos el gesto de “enfado” o cansancio que marcan las arrugas verticales entre las cejas.', tx: ['Toxina botulínica'] },
    patas:     { t: 'Patas de gallo', d: 'Atenuamos las arrugas laterales del ojo para una mirada más fresca y luminosa.', tx: ['Toxina botulínica'] },
    ojeras:    { t: 'Ojeras', d: 'Corregimos el surco lagrimal hundido que da aspecto de cansancio, aportando luz e hidratación a la mirada.', tx: ['Ácido hialurónico', 'Exosomas'] },
    pomulos:   { t: 'Pómulos', d: 'Devolvemos proyección y soporte al tercio medio. Un pómulo bien definido levanta todo el rostro.', tx: ['Ácido hialurónico', 'Armonización'] },
    nariz:     { t: 'Nariz', d: 'Rinomodelación sin cirugía: corregimos pequeñas irregularidades del dorso o elevamos la punta.', tx: ['Diseño facial', 'Ácido hialurónico'] },
    surcos:    { t: 'Surco nasogeniano', d: 'Suavizamos el pliegue que va de la nariz a la comisura, rejuveneciendo la expresión sin “rellenar” de más.', tx: ['Ácido hialurónico'] },
    labios:    { t: 'Labios', d: 'Hidratación, perfilado del contorno o aumento de volumen con ácido hialurónico, siempre en proporción con el resto del rostro.', tx: ['Ácido hialurónico', 'Labios'] },
    mandibula: { t: 'Mandíbula', d: 'Definimos el ángulo y la línea mandibular para un óvalo facial más marcado y estilizado.', tx: ['Diseño facial', 'Armonización'] },
    menton:    { t: 'Mentón', d: 'Proyectamos y equilibramos el mentón para mejorar el perfil y la armonía de todo el rostro.', tx: ['Diseño facial', 'Ácido hialurónico'] }
  };

  /* Textos legales: COMPLETAR con los datos reales de la empresa */
  const LEGAL = {
    aviso: { t: 'Aviso legal', b: '<p>Titular: [Razón social] · NIF: [NIF] · Domicilio: Av. de Alfonso XIII, 151, 28016 Madrid · Contacto: WhatsApp 608 41 00 97.</p><p>[Nº de registro sanitario del centro, si procede].</p><p>La información de esta web es orientativa y no sustituye a una valoración profesional individualizada.</p>' },
    privacidad: { t: 'Política de privacidad', b: '<p>Responsable: [Razón social]. Finalidad: atender tu solicitud de información o cita. Legitimación: tu consentimiento. Los datos que escribes en el formulario no se almacenan en esta web: se trasladan a WhatsApp para que tú misma/o envíes el mensaje.</p><p>Puedes ejercer tus derechos de acceso, rectificación, supresión y demás escribiendo a [email de contacto].</p>' },
    cookies: { t: 'Política de cookies', b: '<p>Esta web no utiliza cookies propias de seguimiento. El mapa incrustado de Google Maps puede instalar cookies de terceros; consulta la política de Google para más información.</p>' }
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;

  /* ---------- Enlaces de WhatsApp con mensaje ---------- */
  function wireWhatsApp(el) {
    const msg = el.getAttribute('data-wa');
    el.setAttribute('href', waLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  }
  $$('[data-wa]').forEach(wireWhatsApp);

  /* ---------- Header al hacer scroll + botón flotante ---------- */
  const header = $('#header');
  const waFloat = $('.wa-float');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    // histéresis: evita que la clase cambie una y otra vez cerca del umbral
    if (y > 60) header.classList.add('is-scrolled');
    else if (y < 10) header.classList.remove('is-scrolled');
    waFloat && waFloat.classList.toggle('is-visible', y > 500);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleMenu = (open) => {
    const isOpen = open ?? !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', isOpen);
  };
  burger.addEventListener('click', () => toggleMenu());
  $$('a', nav).forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  /* ---------- Sección activa en el menú ---------- */
  const navLinks = $$('.nav > a[href^="#"]:not(.btn)');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }

  /* ---------- Animaciones de entrada ---------- */
  const reveals = $$('.reveal');
  // pequeño escalonado entre hermanos
  reveals.forEach(el => {
    const sibs = $$(':scope > .reveal', el.parentElement);
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, 0.48) + 's');
  });
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => ro.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Filtro de tratamientos ---------- */
  const filters = $$('.filter');
  const cards = $$('#cards .card');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
      c.classList.toggle('is-hidden', !show);
      if (show) { c.classList.remove('is-in'); requestAnimationFrame(() => c.classList.add('is-in')); }
    });
  }));

  /* ---------- Mapa facial ---------- */
  const spots = $$('.spot');
  const zoneBox = $('#zone');
  function selectZone(key, spot) {
    const z = ZONES[key];
    if (!z) return;
    spots.forEach(s => s.classList.toggle('is-active', s === spot));
    zoneBox.classList.add('is-changing');
    setTimeout(() => {
      $('#zoneTitle').textContent = z.t;
      $('#zoneText').textContent = z.d;
      $('#zoneTx').innerHTML = z.tx.map(t => `<li>${t}</li>`).join('');
      const cta = $('#zoneCta');
      cta.setAttribute('data-wa', `Hola, me interesa tratar la zona: ${z.t.toLowerCase()}.`);
      wireWhatsApp(cta);
      zoneBox.classList.remove('is-changing');
    }, 180);
  }
  spots.forEach(s => {
    s.setAttribute('tabindex', '0');
    s.setAttribute('role', 'button');
    s.setAttribute('aria-label', ZONES[s.dataset.zone]?.t || s.dataset.zone);
    s.addEventListener('click', () => selectZone(s.dataset.zone, s));
    s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectZone(s.dataset.zone, s); } });
  });
  const initial = $('.spot[data-zone="labios"]');
  initial && initial.classList.add('is-active');

  /* ---------- FAQ: solo una abierta ---------- */
  const accs = $$('.acc');
  accs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) accs.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---------- Estado abierto / cerrado ---------- */
  (function openStatus() {
    const el = $('#openStatus');
    if (!el) return;
    let now;
    try {
      now = new Date(new Date().toLocaleString('en-US', { timeZone: CONFIG.timezone }));
    } catch (e) { now = new Date(); }
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const open = CONFIG.openDays.includes(day) &&
      CONFIG.hours.some(([h1, m1, h2, m2]) => mins >= h1 * 60 + m1 && mins < h2 * 60 + m2);
    el.classList.toggle('is-open', open);
    el.innerHTML = `<i></i> ${open ? 'Abierto ahora · te respondemos enseguida' : 'Ahora cerrado · déjanos tu WhatsApp y te contestamos'}`;
  })();

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#bookingForm');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#formError');
    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').toString().trim();
    if (!nombre) { err.textContent = 'Por favor, indícanos tu nombre.'; form.nombre.focus(); return; }
    if (!form.privacidad.checked) { err.textContent = 'Debes aceptar la política de privacidad.'; return; }
    err.textContent = '';
    const mensaje = (data.get('mensaje') || '').toString().trim();
    const text =
      `Hola, soy ${nombre}. Me gustaría reservar una valoración gratuita en Open Beauty.\n` +
      `• Tratamiento: ${data.get('tratamiento')}\n` +
      `• Preferencia: ${data.get('horario')}` +
      (mensaje ? `\n• Comentario: ${mensaje}` : '');
    window.open(waLink(text), '_blank', 'noopener');
  });

  /* ---------- Modal legal ---------- */
  const modal = $('#legalModal');
  $$('[data-legal]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const l = LEGAL[a.dataset.legal];
    if (!l || !modal) return;
    $('#legalTitle').textContent = l.t;
    $('#legalBody').innerHTML = l.b;
    if (typeof modal.showModal === 'function') modal.showModal();
  }));
  modal && modal.addEventListener('click', e => {
    if (e.target === modal || e.target.hasAttribute('data-close')) modal.close();
  });

  /* ---------- Año ---------- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
