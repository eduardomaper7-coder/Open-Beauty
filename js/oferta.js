/* =========================================================
   OPEN BEAUTY — Landing "Pack Armonía Octubre"
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN (edita aquí) ---------- */
  const CONFIG = {
    email: 'openbeautybymg@gmail.com',            // destino de FormSubmit
    offerEnd: '2026-10-31T23:59:59+01:00',        // fin de la oferta (hora de Madrid)
    precio: 550,
    precioHabitual: null,                         // p. ej. 790 → muestra "Antes 790 € · Ahorras 240 €". null = oculto
    gracias: 'gracias.html'                       // página de agradecimiento (conversión de Google Ads)
  };

  const LEGAL = {
    aviso: { t: 'Aviso legal', b: '<p>Titular: [Razón social] · NIF: [NIF] · Domicilio: Av. de Alfonso XIII, 151, 28016 Madrid · Contacto: 608 41 00 97 · ' + CONFIG.email + '.</p><p>[Nº de registro sanitario del centro, si procede].</p><p>La información de esta web es orientativa y no sustituye a una valoración profesional individualizada.</p>' },
    privacidad: { t: 'Política de privacidad', b: '<p>Responsable: [Razón social]. Finalidad: gestionar tu solicitud de cita y contactarte por teléfono o email en relación con la promoción. Legitimación: tu consentimiento. Los datos se envían por email al centro a través del servicio FormSubmit y no se ceden a terceros con otros fines.</p><p>Puedes ejercer tus derechos de acceso, rectificación, supresión y demás escribiendo a ' + CONFIG.email + '.</p>' },
    cookies: { t: 'Política de cookies', b: '<p>Esta página puede utilizar cookies de Google Ads para medir la eficacia de nuestras campañas. Puedes configurarlas o rechazarlas desde tu navegador.</p>' }
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Medición (Google Ads / GA4, si están instalados) ---------- */
  function track(event, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', event, params || {}); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event }, params || {})); } catch (e) {}
  }
  $$('[data-track]').forEach(el => el.addEventListener('click', () => track('click_' + el.dataset.track)));


  /* ---------- Precio habitual (opcional) ---------- */
  if (CONFIG.precioHabitual && CONFIG.precioHabitual > CONFIG.precio) {
    const old = $('#oldPrice');
    old.innerHTML = `${CONFIG.precioHabitual} €<b>Ahorras ${CONFIG.precioHabitual - CONFIG.precio} €</b>`;
    old.hidden = false;
  }

  /* ---------- Cuenta atrás ---------- */
  const end = new Date(CONFIG.offerEnd).getTime();
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const diff = end - Date.now();
    if (diff <= 0) {
      $$('[data-countdown="inline"]').forEach(el => { el.textContent = 'hoy'; });
      $$('[data-countdown="blocks"] b').forEach(b => { b.textContent = '00'; });
      return false;
    }
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    $$('[data-countdown="inline"]').forEach(el => {
      el.textContent = d > 0 ? `${d} ${d === 1 ? 'día' : 'días'} ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
    });
    $$('[data-countdown="blocks"]').forEach(box => {
      $('[data-u="d"]', box).textContent = pad(d);
      $('[data-u="h"]', box).textContent = pad(h);
      $('[data-u="m"]', box).textContent = pad(m);
      $('[data-u="s"]', box).textContent = pad(s);
    });
    return true;
  }
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }

  /* ---------- Selector de zonas ---------- */
  const state = { ha: [], btx: [] };
  const groups = $$('.picker__group');
  const list = $('#pickList');
  const fZonas = $('#fZonas');
  const mini = $('#zonesMini'), miniTxt = $('#zonesMiniTxt'), miniBtn = $('#zonesMiniBtn');

  function render() {
    groups.forEach(g => {
      const key = g.dataset.group, max = +g.dataset.max;
      $('[data-count]', g).textContent = `${state[key].length}/${max}`;
      $$('.zone-btn', g).forEach(b => {
        const on = state[key].includes(b.dataset.zone);
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
    const slots = [
      ['Hialurónico', state.ha[0]],
      ['Hialurónico', state.ha[1]],
      ['Bótox', state.btx[0]]
    ];
    list.innerHTML = slots.map(([t, z], i) =>
      `<li class="${z ? '' : 'is-empty'}"><span>${i + 1}</span> ${t} · ${z || 'elige zona'}</li>`).join('');

    const chosen = [...state.ha.map(z => z + ' (hialurónico)'), ...state.btx.map(z => z + ' (bótox)')];
    if (chosen.length) {
      fZonas.value = chosen.join(', ');
      miniTxt.textContent = [...state.ha, ...state.btx].join(' · ');
      miniBtn.textContent = 'Cambiar';
      mini.classList.remove('is-empty');
    } else {
      fZonas.value = 'Las decidimos en la valoración';
      miniTxt.textContent = 'aún sin elegir';
      miniBtn.textContent = 'Elegir zonas';
      mini.classList.add('is-empty');
    }
  }

  groups.forEach(g => {
    const key = g.dataset.group, max = +g.dataset.max;
    $$('.zone-btn', g).forEach(b => b.addEventListener('click', () => {
      const z = b.dataset.zone, arr = state[key], i = arr.indexOf(z);
      if (i > -1) arr.splice(i, 1);
      else if (max === 1) arr.splice(0, 1, z);           // bótox: sustituye
      else if (arr.length < max) arr.push(z);
      else { arr.shift(); arr.push(z); }                  // hialurónico: rota la más antigua
      render();
      track('select_zone', { zona: z, grupo: key });
    }));
  });
  render();
  $('#pickCta').addEventListener('click', () => track('click_reservar_zonas'));

  /* ---------- Origen del lead (gclid / utm) ---------- */
  try {
    const p = new URLSearchParams(location.search);
    const parts = ['utm_source', 'utm_campaign', 'utm_term', 'gclid'].filter(k => p.get(k)).map(k => `${k}=${p.get(k)}`);
    $('#fOrigen').value = parts.length ? parts.join(' · ') : (document.referrer ? 'Ref: ' + document.referrer : 'Directo');
  } catch (e) {}

  /* ---------- Formulario → FormSubmit ---------- */
  const form = $('#leadForm');
  const err = $('#formError');
  const btn = $('#submitBtn');
  const thanksUrl = new URL(CONFIG.gracias, location.href).href;
  form.querySelector('[name="_next"]').value = thanksUrl;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = form.Nombre.value.trim();
    const tel = form['Teléfono'].value.replace(/[^\d+]/g, '');
    const email = form.email.value.trim();
    if (!nombre) { err.textContent = 'Por favor, indícanos tu nombre.'; form.Nombre.focus(); return; }
    if (tel.replace(/\D/g, '').length < 9) { err.textContent = 'Revisa tu teléfono: necesitamos al menos 9 cifras.'; form['Teléfono'].focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Revisa el email o déjalo en blanco.'; form.email.focus(); return; }
    if (!form['Acepta privacidad'].checked) { err.textContent = 'Debes aceptar la política de privacidad.'; return; }
    if (form._honey.value) return; // bot
    err.textContent = '';
    btn.disabled = true; btn.classList.add('is-loading');

    const data = new FormData(form);
    if (!email) data.delete('email');
    else data.set('_replyto', email);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'Error');
      track('generate_lead', { value: CONFIG.precio, currency: 'EUR' });
      try { sessionStorage.setItem('ob_lead', nombre); } catch (e2) {}
      location.href = thanksUrl;
    } catch (ex) {
      // Si falla la petición AJAX, enviamos el formulario de forma clásica (FormSubmit redirige a _next)
      form.submit();
    }
  });

  /* ---------- FAQ: solo una abierta ---------- */
  const accs = $$('.acc');
  accs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) accs.forEach(o => { if (o !== d) o.open = false; });
  }));

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
})();
