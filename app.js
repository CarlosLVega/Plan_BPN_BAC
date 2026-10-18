/* =========================================================================
   ADEX · Plan BPM del ponqué de vainilla — interacción
   Lee el contenido de datos.js (window.CFG) y dibuja cada módulo.
   ========================================================================= */
(() => {
  'use strict';

  const C = window.CFG;
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const state = { section: 'inicio' };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (n, d = 1) => Number(n).toLocaleString('es-CO', { maximumFractionDigits: d });
  const fix = (n, d = 1) => Number(n).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
  const num = (v) => parseFloat(String(v).replace(/\s/g, '').replace(',', '.'));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  function svgEl(tag, attrs = {}, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function throttle(fn, ms) {
    let last = 0;
    return (...a) => { const t = performance.now(); if (t - last >= ms) { last = t; fn(...a); } };
  }

  /* ---------- Iconos ---------- */
  const ICONS = {
    box: '<path class="stroke" d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path class="stroke" d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.2l8.5 4.6"/>',
    cake: '<path class="stroke" d="M4 20.5h16M5 20.5V13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7.5M5 15.2c1.4 1.1 2.9 1.1 4.3 0s2.9-1.1 4.3 0 2.9 1.1 4.4 0M12 11V7.5"/><path class="stroke" d="M12 3.5c.9.9.9 2.1 0 3-.9-.9-.9-2.1 0-3z"/>',
    surface: '<rect class="stroke" x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3 2.4"/><path class="stroke" d="M8.5 15.5l7-7M13 8.5h2.5V11"/>',
    hand: '<path class="stroke" d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 6.5a1.5 1.5 0 0 1 3 0V12M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.6 15.6a1.6 1.6 0 0 1 2.4-2.1L8 14.5"/>',
    drop: '<path class="stroke" d="M12 3.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/><path class="stroke" d="M9.4 15a2.7 2.7 0 0 0 2.6 2.6"/>',
    air: '<path class="stroke" d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5M3 16h7"/>',
    microbe: '<circle class="stroke" cx="12" cy="12" r="5"/><path class="stroke" d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M5.6 18.4l2.5-2.5M15.9 8.1l2.5-2.5"/><circle cx="10.6" cy="11" r="1.1" fill="currentColor"/><circle cx="13.4" cy="13.4" r=".8" fill="currentColor"/>',
    flask: '<path class="stroke" d="M9.5 3.5h5M10 3.5v6L4.8 18.3A1.5 1.5 0 0 0 6.1 20.5h11.8a1.5 1.5 0 0 0 1.3-2.2L14 9.5v-6M7.4 14.5h9.2"/>',
    shard: '<path class="stroke" d="M3.5 19l5-13 3.2 6.5 2.8-3.5 6 10z"/>',
    shield: '<path class="stroke" d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path class="stroke" d="M8.8 12.2l2.3 2.3 4.3-4.6"/>',
    radar: '<circle class="stroke" cx="12" cy="12" r="8.5"/><circle class="stroke" cx="12" cy="12" r="4.5"/><path class="stroke" d="M12 12l6-6"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    target: '<circle class="stroke" cx="12" cy="12" r="8.5"/><path class="stroke" d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
    tap: '<path class="stroke" d="M9 11V5a1.5 1.5 0 0 1 3 0v5.5M12 9.5a1.5 1.5 0 0 1 3 0v1.5M15 10a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-5-2.7L4.4 15.3a1.5 1.5 0 0 1 2.3-1.9L9 15.5"/>',
    doc: '<path class="stroke" d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20zM14 3.5v4h4M9.5 12h6M9.5 15.5h6"/>',
    route: '<circle class="stroke" cx="6" cy="18" r="2.5"/><circle class="stroke" cx="18" cy="6" r="2.5"/><path class="stroke" d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>'
  };
  const icon = (name, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* =======================================================================
     Sonido (sintetizado con Web Audio, sin archivos)
     ======================================================================= */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master = null, noiseBuf = null;
    let on = store.get('adex-sound', '1') === '1';

    function ac() {
      if (!on || !AC) return null;
      if (!ctx) {
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();
        master = ctx.createGain();
        master.gain.value = 0.7;
        master.connect(comp);
        comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(f, o = {}) {
      const c = ac(); if (!c) return;
      const { type = 'sine', dur = 0.14, vol = 0.12, at = 0, attack = 0.006, to = null } = o;
      const t = c.currentTime + at;
      const osc = c.createOscillator(), g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, t);
      if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + dur + 0.05);
    }
    function noise(o = {}) {
      const c = ac(); if (!c) return;
      const { dur = 0.3, vol = 0.05, from = 600, to = 2600, at = 0, q = 0.9, type = 'bandpass' } = o;
      const t = c.currentTime + at;
      if (!noiseBuf) {
        noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const src = c.createBufferSource(); src.buffer = noiseBuf;
      const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
      f.frequency.setValueAtTime(from, t);
      f.frequency.exponentialRampToValueAtTime(to, t + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t); src.stop(t + dur + 0.05);
    }
    const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4, 5 / 2, 3, 10 / 3, 4];
    return {
      get on() { return on; },
      toggle() { on = !on; store.set('adex-sound', on ? '1' : '0'); if (on) this.pop(); return on; },
      click: () => { tone(620, { dur: 0.08, vol: 0.07, to: 1250 }); tone(1900, { dur: 0.05, vol: 0.02, at: 0.03 }); },
      hover: throttle(() => tone(2100 + Math.random() * 500, { dur: 0.04, vol: 0.016 }), 70),
      sparkle: () => [1568, 2093, 2637].forEach((f, i) => tone(f, { dur: 0.18, vol: 0.03, at: i * 0.05 })),
      tick: () => tone(2400, { dur: 0.025, vol: 0.03 }),
      pop: () => tone(420, { dur: 0.12, vol: 0.1, to: 880 }),
      note: (i) => { const f = 392 * SCALE[i % SCALE.length]; tone(f, { type: 'triangle', dur: 0.28, vol: 0.08 }); tone(f * 2, { dur: 0.2, vol: 0.025 }); },
      chime: () => { tone(1046.5, { dur: 0.5, vol: 0.06 }); tone(1568, { dur: 0.6, vol: 0.045, at: 0.06 }); },
      ok: () => { tone(659.25, { type: 'triangle', dur: 0.16, vol: 0.1 }); tone(987.77, { type: 'triangle', dur: 0.32, vol: 0.1, at: 0.08 }); },
      bad: () => { tone(233, { type: 'triangle', dur: 0.18, vol: 0.13, to: 196 }); tone(185, { type: 'triangle', dur: 0.26, vol: 0.11, at: 0.12, to: 150 }); },
      stamp: () => { noise({ dur: 0.12, vol: 0.12, from: 200, to: 90, type: 'lowpass', q: 0.7 }); tone(95, { dur: 0.12, vol: 0.12, to: 50 }); },
      whoosh: () => noise({ dur: 0.32, vol: 0.03, from: 500, to: 2600 }),
      flip: () => noise({ dur: 0.18, vol: 0.03, from: 1200, to: 3400 }),
      win: () => {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { type: 'triangle', dur: 0.35, vol: 0.08, at: i * 0.09 }));
        tone(1567.98, { dur: 0.9, vol: 0.045, at: 0.36 });
      },
      done: () => { tone(587.33, { type: 'triangle', dur: 0.25, vol: 0.08 }); tone(783.99, { type: 'triangle', dur: 0.4, vol: 0.07, at: 0.12 }); },
      alert: () => { tone(880, { dur: 0.18, vol: 0.09 }); tone(880, { dur: 0.18, vol: 0.09, at: 0.24 }); },
      engine: () => { noise({ dur: 1.4, vol: 0.08, from: 90, to: 700, type: 'lowpass', q: 0.6 }); tone(55, { type: 'sawtooth', dur: 1.2, vol: 0.03, to: 140 }); },
      drip: throttle(() => tone(1200, { dur: 0.09, vol: 0.045, to: 520 }), 90),
      slide: throttle((v) => tone(380 + v * 700, { dur: 0.05, vol: 0.028 }), 45)
    };
  })();

  // Clic suave en botones y enlaces internos (los que tienen sonido propio llevan data-quiet)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a[href^="#"]');
    if (t && !t.hasAttribute('data-quiet') && !t.disabled) Sound.click();
  });

  function initToggles() {
    const bs = $('#btnSound');
    const paint = () => {
      bs.classList.toggle('off', !Sound.on);
      bs.setAttribute('aria-label', Sound.on ? 'Silenciar sonidos' : 'Activar sonidos');
    };
    bs.dataset.quiet = '';
    bs.addEventListener('click', () => { Sound.toggle(); paint(); });
    paint();

    const bt = $('#btnTheme');
    bt.dataset.quiet = '';
    bt.addEventListener('click', toggleTheme);
  }
  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('adex-tema', next);
    Sound.whoosh();
    window.dispatchEvent(new Event('themechange'));
  }

  /* =======================================================================
     Efectos: partículas, cursor, estela, ondas, inclinación 3D, títulos
     ======================================================================= */
  const fine = window.matchMedia('(pointer: fine)').matches;
  const PASTEL = () => [css('--accent'), css('--lilac'), css('--peach'), css('--mint'), css('--accent-2')];
  const GLYPHS = ['♥', '✦', '✿', '•', '✧', '❀'];

  function particle(x, y, o = {}) {
    const s = document.createElement('span');
    s.className = 'pfx';
    s.textContent = o.glyph || GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const cols = PASTEL();
    s.style.color = cols[Math.floor(Math.random() * cols.length)];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.fontSize = (o.size || 10 + Math.random() * 10) + 'px';
    document.body.appendChild(s);
    const a = o.angle !== undefined ? o.angle : Math.random() * Math.PI * 2;
    const d = o.dist !== undefined ? o.dist : 30 + Math.random() * 60;
    const fall = o.fall !== undefined ? o.fall : 20;
    const anim = s.animate([
      { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + fall}px)) scale(1) rotate(${(Math.random() - 0.5) * 200}deg)`, opacity: 0 }
    ], { duration: o.dur || 600 + Math.random() * 500, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'forwards' });
    anim.onfinish = () => s.remove();
  }

  // Celebración grande (corazones, flores y destellos)
  function burst(el) {
    if (reduce || !el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + Math.min(r.height / 3, 160);
    for (let i = 0; i < 40; i++) particle(cx, cy, { dist: 80 + Math.random() * 180, fall: 80, size: 11 + Math.random() * 13, dur: 1000 + Math.random() * 800 });
  }
  // Celebración pequeña sobre un elemento
  function pop(el, n = 8) {
    if (reduce || !el) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) particle(r.left + r.width / 2, r.top + r.height / 2, { angle: (i / n) * Math.PI * 2, dist: 26 + Math.random() * 30, fall: 6 });
  }

  function initFx() {
    if (reduce) return;

    // Cada clic: anillo + corazones y destellos
    document.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const x = e.clientX, y = e.clientY;
      const ring = document.createElement('span');
      ring.className = 'click-ring';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
      document.body.appendChild(ring);
      ring.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(3.4)', opacity: 0 }],
        { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => ring.remove();
      for (let i = 0; i < 7; i++) particle(x, y, { angle: (i / 7) * Math.PI * 2 + Math.random() * 0.4, dist: 26 + Math.random() * 34, fall: 8 });

      // Onda dentro de botones y controles
      const t = e.target.closest('.btn, .toggle, .bin, .sample-btn, .proc-item, .tabs [role=tab], .timer, .drawer-btn, .check, .nav-links a, .icon-btn');
      if (t) {
        const r = t.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
        const s = document.createElement('span');
        s.className = 'ripple';
        Object.assign(s.style, { width: size + 'px', height: size + 'px', left: x - r.left - size / 2 + 'px', top: y - r.top - size / 2 + 'px' });
        t.appendChild(s);
        setTimeout(() => s.remove(), 800);
      }
    }, { passive: true });

    // Casillas marcadas: florecitas
    document.addEventListener('change', (e) => {
      const c = e.target;
      if (c.type === 'checkbox' && c.checked) pop(c.nextElementSibling, 7);
    });

    // Sonido suave al pasar por encima de algo que se puede tocar
    let lastHover = null;
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('.btn, .toggle, .bin, .sample-btn, .org-node, .proc-item, .tabs [role=tab], .nav-links a, .flip, .area, .pt, .drawer-btn, .icon-btn, .timer');
      if (t && t !== lastHover) Sound.hover();
      lastHover = t;
    });

    if (!fine) return;

    // Cursor con anillo que sigue al mouse y estela de colores
    const dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'c-dot';
    ring.className = 'c-ring';
    document.body.append(dot, ring);
    let x = -200, y = -200, rx = x, ry = y, lx = 0, ly = 0, lt = 0;
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      const now = performance.now();
      if (now - lt > 40 && Math.hypot(x - lx, y - ly) > 16) {
        lt = now; lx = x; ly = y;
        const s = document.createElement('span');
        s.className = 'trail';
        const cols = PASTEL();
        s.style.background = cols[Math.floor(Math.random() * cols.length)];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        document.body.appendChild(s);
        s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 0.8 }, { transform: 'translate(-50%, calc(-50% + 20px)) scale(0)', opacity: 0 }],
          { duration: 750, easing: 'ease-out' }).onfinish = () => s.remove();
      }
      const hov = e.target.closest && e.target.closest('a, button, input, select, label, [role=button], .area, .pt, .flip, .hero-art');
      ring.classList.toggle('hover', !!hov);
    }, { passive: true });
    addEventListener('pointerdown', () => ring.classList.add('down'));
    addEventListener('pointerup', () => ring.classList.remove('down'));
    document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = ''; });
    (function follow() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(follow);
    })();

    // Tarjetas que se inclinan en 3D con brillo
    const TILT = '.summary .card, #plagasCards .card, .label, .sample-btn, .bin, .flip, .insp-card, .stat, .org-node';
    let tiltEl = null;
    const untilt = (el) => { el.style.transform = ''; el.classList.remove('tilting'); };
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest(TILT);
      if (el !== tiltEl) { if (tiltEl) untilt(tiltEl); tiltEl = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      const max = el.matches('.flip, .insp-card, .label') ? 6 : 10;
      el.classList.add('tilting');
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`;
      el.style.setProperty('--gx', px * 100 + '%');
      el.style.setProperty('--gy', py * 100 + '%');
    }, { passive: true });

    // Botones principales "magnéticos"
    let mag = null;
    document.addEventListener('pointermove', (e) => {
      const b = e.target.closest('.btn.primary, .timer');
      if (mag && mag !== b) { mag.style.translate = ''; mag = null; }
      if (!b) return;
      mag = b;
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.28}px`;
    }, { passive: true });
  }

  // Títulos que entran palabra por palabra
  function splitTitles() {
    $$('.hero-title, .sec-title, .thanks-big').forEach((el) => {
      el.classList.add('split');
      let i = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const w = document.createElement('span');
              w.className = 'w';
              const wi = document.createElement('span');
              wi.className = 'wi';
              wi.style.setProperty('--i', i++);
              wi.textContent = part;
              w.appendChild(wi);
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      walk(el);
    });
  }

  // Cintas de palabras en movimiento
  function initMarquees() {
    $$('.marquee').forEach((m) => {
      const chunk = m.dataset.words.split('|').map((w) => `<span>${w}</span><i>✿</i>`).join('');
      m.innerHTML = `<div class="mq-track">${chunk}${chunk}${chunk}${chunk}</div>`;
    });
  }

  // Pantalla de bienvenida
  function splash(done) {
    if (reduce) { done(); return; }
    const s = document.createElement('div');
    s.className = 'splash';
    s.innerHTML = `<div class="splash-in">
      <img src="logo.webp" class="splash-logo" alt="">
      <p class="splash-t">ADEX <em>sweet and pink</em></p>
      <p class="splash-s">Plan BPM · Ponqué de vainilla</p>
      <span class="splash-bar"></span></div>`;
    document.body.appendChild(s);
    let gone = false;
    const out = () => {
      if (gone) return;
      gone = true;
      s.classList.add('out');
      done();
      setTimeout(() => s.remove(), 1100);
    };
    s.addEventListener('click', out);
    setTimeout(out, 1700);
  }

  /* =======================================================================
     Navegación, progreso y revelado
     ======================================================================= */
  function initNav() {
    const nav = $('#nav'), bar = $('#progress'), navLinks = $('#navLinks');
    const links = $$('a', navLinks);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
        nav.classList.toggle('scrolled', scrollY > 8);
        ticking = false;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        state.section = e.target.id;
        links.forEach((a) => {
          const on = a.hash === '#' + e.target.id;
          a.classList.toggle('active', on);
          if (on && navLinks.scrollWidth > navLinks.clientWidth) {
            navLinks.scrollTo({ left: a.offsetLeft - navLinks.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
          }
        });
      });
    }, { rootMargin: '-45% 0px -54% 0px' });
    $$('main > section').forEach((s) => io.observe(s));
  }

  function initReveal() {
    const els = $$('.rv');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach((e) => io.observe(e));
  }

  function goTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  /* =======================================================================
     Portada
     ======================================================================= */
  function initHero() {
    // Marcas del dial alrededor de la caja de Petri
    const g = $('#dialTicks');
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2, major = i % 6 === 0;
      const r1 = 178, r2 = major ? 186 : 182;
      svgEl('line', {
        x1: (200 + Math.cos(a) * r1).toFixed(2), y1: (200 + Math.sin(a) * r1).toFixed(2),
        x2: (200 + Math.cos(a) * r2).toFixed(2), y2: (200 + Math.sin(a) * r2).toFixed(2),
        class: major ? 'major' : ''
      }, g);
    }

    // Indicadores con conteo animado
    const box = $('#stats');
    box.innerHTML = C.indicadores.map((s, i) => `
      <div class="stat rv" style="--d:${380 + i * 90}ms">
        <div class="stat-n"><span data-count="${s.n}">0</span>${s.sufijo ? `<small>${s.sufijo.trim()}</small>` : ''}</div>
        <div class="stat-t">${s.texto}</div>
      </div>`).join('');
    const counters = $$('[data-count]', box);
    const run = () => counters.forEach((el, i) => countUp(el, +el.dataset.count, 1500, 1500 + i * 140));
    if (!('IntersectionObserver' in window)) run();
    else {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.3 });
      io.observe(box);
    }

    $('#heroStart').addEventListener('click', () => {
      if (!Timer.running) Timer.start();
      goTo('empresa');
    });
    $('#heroStart').dataset.quiet = '';

    // El ponqué y los colores de fondo siguen al mouse; al tocar el ponqué, celebra
    const hero = $('#inicio'), art = $('.cake-svg'), blobs = $('.blobs'), artBox = $('.hero-art');
    if (!reduce) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        art.style.transform = `perspective(1000px) rotateY(${px * 16}deg) rotateX(${-py * 12}deg) translate(${px * 12}px, ${py * 12}px)`;
        blobs.style.transform = `translate(${px * -50}px, ${py * -50}px)`;
      });
      hero.addEventListener('pointerleave', () => { art.style.transform = ''; blobs.style.transform = ''; });
    }
    artBox.addEventListener('click', () => {
      artBox.classList.remove('jelly'); void artBox.offsetWidth; artBox.classList.add('jelly');
      burst(artBox);
      Sound.sparkle();
    });

    microbes();
  }

  function countUp(el, to, dur, delay = 0) {
    if (reduce) { el.textContent = to; return; }
    setTimeout(() => {
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
  }

  // Microorganismos a la deriva (movimiento browniano) detrás de la portada
  function microbes() {
    const cv = $('#microbes'), hero = $('#inicio');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, parts = [], running = false, col = [];
    const mouse = { x: -1e4, y: -1e4 };
    const TYPES = ['coccus', 'diplo', 'bacillus', 'strepto', 'staph', 'bacillus'];

    const colors = () => { col = PASTEL(); };
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(44, Math.max(14, (W * H) / 30000)));
      while (parts.length < n) parts.push(spawn());
      parts.length = n;
    }
    function spawn() {
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: 3 + Math.random() * 4.5, rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.004,
        t: TYPES[Math.floor(Math.random() * TYPES.length)], ci: Math.floor(Math.random() * 5), a: 0.16 + Math.random() * 0.2
      };
    }
    const dot = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
    function capsule(l, w) {
      const r = w / 2;
      ctx.beginPath();
      ctx.moveTo(-l / 2 + r, -r); ctx.lineTo(l / 2 - r, -r);
      ctx.arc(l / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-l / 2 + r, r);
      ctx.arc(-l / 2 + r, 0, r, Math.PI / 2, Math.PI * 1.5);
      ctx.fill();
    }
    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = col[p.ci % col.length];
      const r = p.r;
      switch (p.t) {
        case 'coccus': dot(0, 0, r); break;
        case 'diplo': dot(-r * 0.9, 0, r); dot(r * 0.9, 0, r); break;
        case 'bacillus': capsule(r * 3.6, r * 1.5); break;
        case 'strepto': for (let i = -2; i <= 2; i++) dot(i * r * 1.75, Math.sin(i * 1.2) * r * 0.5, r * 0.82); break;
        case 'staph': [[0, 0], [1.6, 0], [0.8, 1.4], [-0.8, 1.3], [0.8, -1.4], [2.3, 1.3], [-1.5, -0.2]].forEach(([a, b]) => dot(a * r * 0.9, b * r * 0.9, r * 0.78)); break;
      }
      ctx.restore();
    }
    function step() {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        if (d < 130) { const f = (1 - d / 130) * 0.08; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx += (Math.random() - 0.5) * 0.018; p.vy += (Math.random() - 0.5) * 0.018;
        p.vx *= 0.985; p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.9) { p.vx *= 0.9 / sp; p.vy *= 0.9 / sp; }
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.x < -30) p.x = W + 30; else if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30; else if (p.y > H + 30) p.y = -30;
        draw(p);
      }
      if (running) requestAnimationFrame(step);
    }
    colors(); resize();
    addEventListener('resize', () => { resize(); if (!running) step(); });
    window.addEventListener('themechange', () => { colors(); if (!running) step(); });
    hero.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
    if (reduce) { step(); return; }
    new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(step); }
      else if (!vis) running = false;
    }).observe(hero);
  }

  /* =======================================================================
     01 · Empresa
     ======================================================================= */
  function initEmpresa() {
    const box = $('#org'), panel = $('#orgPanel');
    box.innerHTML = [0, 1, 2].map((n) => `
      <div class="org-level l${n}">
        ${C.organigrama.filter((p) => p.nivel === n).map((p) => `
          <button class="org-node" data-id="${p.id}" aria-pressed="false" data-quiet>
            <span class="org-cargo">${p.cargo}</span><span class="org-sub">${p.sub}</span>
          </button>`).join('')}
      </div>`).join('');
    function select(id, sound) {
      const p = C.organigrama.find((x) => x.id === id);
      $$('.org-node', box).forEach((b) => { const on = b.dataset.id === id; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
      panel.innerHTML = `<div class="fade-in"><p class="kicker">Responsabilidades en BPM</p><h4>${p.cargo}</h4><p class="org-p-sub">${p.sub}</p><p>${p.texto}</p></div>`;
      if (sound) Sound.pop();
    }
    box.addEventListener('click', (e) => { const b = e.target.closest('.org-node'); if (b) select(b.dataset.id, true); });
    select('calidad');

    $('#tblFicha').innerHTML = '<tbody>' + C.ficha.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('') + '</tbody>';
  }

  /* =======================================================================
     02 · Plano de la planta
     ======================================================================= */
  const Plan = {};
  function initPlan() {
    const svg = $('#plan'), panel = $('#planPanel'), btn = $('#btnRoute');
    const A = {};
    C.areas.forEach((a) => { A[a.id] = a; });
    // Punto por donde pasa el flujo en cada área (a la derecha en la primera columna para no tapar los nombres)
    const ctr = (id) => {
      const a = A[id];
      let x = a.x + a.w / 2, y = a.y + a.h / 2 + 18;
      if (a.x === 20) x = a.x + a.w - 28;
      if (a.y === 20 && a.x >= 200) y = 160;
      if (id === 'despacho') x = a.x + a.w - 34;
      return [x, y];
    };
    const wrap = (text, max) => {
      const out = [];
      let cur = '';
      text.split(' ').forEach((w) => {
        const next = cur ? cur + ' ' + w : w;
        if (next.length > max && cur) { out.push(cur); cur = w; } else cur = next;
      });
      if (cur) out.push(cur);
      return out;
    };

    const defs = svgEl('defs', {}, svg);
    [['prod', 'm-prod'], ['pers', 'm-pers'], ['resi', 'm-resi']].forEach(([id, cls]) => {
      const m = svgEl('marker', { id: 'arr-' + id, viewBox: '0 0 10 10', refX: '6', refY: '5', markerWidth: '4.5', markerHeight: '4.5', orient: 'auto-start-reverse' }, defs);
      svgEl('path', { d: 'M0 0 L10 5 L0 10 z', class: cls }, m);
    });

    svgEl('rect', { x: 10, y: 10, width: 940, height: 580, rx: 16, class: 'wall' }, svg);

    // Áreas (baldosas interactivas)
    const gA = svgEl('g', { class: 'areas' }, svg);
    C.areas.forEach((a) => {
      const g = svgEl('g', { class: 'area' + (a.zona ? ' ' + a.zona : ''), tabindex: '0', role: 'button', 'data-id': a.id, 'aria-label': `${a.nombre}, ${a.sub}` }, gA);
      svgEl('rect', { class: 'tile', x: a.x + 3, y: a.y + 3, width: a.w - 6, height: a.h - 6, rx: 10 }, g);
    });

    // Puertas
    const gD = svgEl('g', { 'pointer-events': 'none' }, svg);
    C.puertas.forEach(([x, y, w, h]) => svgEl('rect', { x, y, width: w, height: h, rx: 2, class: 'door' }, gD));

    // Flujos (curvas suaves Catmull-Rom → Bézier)
    function segs(pts) {
      const out = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        out.push({ from: p1, d: `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}` });
      }
      return out;
    }
    const pathD = (pts) => `M${pts[0][0]} ${pts[0][1]} ` + segs(pts).map((s) => s.d).join(' ');
    // Línea principal del producto; la refrigeración es un ramal de ida y vuelta desde la bodega
    const mainIds = C.ruta.filter((id) => id !== 'refri');
    const prodPts = [[0, 80], ...mainIds.map(ctr), [582, 618]];
    const [bx, by] = ctr('bodega'), [rx, ry] = ctr('refri');
    const persPts = [[402, 618], [402, 500], [420, 410], [440, 342]];
    const resiPts = [[280, 340], [262, 432], [196, 484], [110, 500], [0, 492]];

    const gF = svgEl('g', { class: 'flows' }, svg);
    svgEl('path', { d: pathD(resiPts), class: 'fl resi', 'marker-end': 'url(#arr-resi)' }, gF);
    svgEl('path', { d: pathD(persPts), class: 'fl pers', 'marker-end': 'url(#arr-pers)' }, gF);
    svgEl('path', { d: pathD(prodPts), class: 'fl prod', 'marker-end': 'url(#arr-prod)' }, gF);
    svgEl('path', { d: `M${bx} ${by + 24} L${rx} ${ry - 18}`, class: 'fl prod', 'marker-start': 'url(#arr-prod)', 'marker-end': 'url(#arr-prod)' }, gF);

    // Nombres de las áreas, encima de los flujos y con halo del color de la baldosa
    const gL = svgEl('g', { class: 'labels', 'pointer-events': 'none', 'aria-hidden': 'true' }, svg);
    C.areas.forEach((a) => {
      const g = svgEl('g', { class: 'lbl' + (a.zona ? ' ' + a.zona : ''), 'data-id': a.id }, gL);
      const names = wrap(a.nombre, Math.floor((a.w - 30 - (a.pc ? 34 : 0)) / 8.8));
      names.forEach((ln, k) => {
        svgEl('text', { x: a.x + 16, y: a.y + 34 + k * 19, class: 'a-name' }, g).textContent = ln;
      });
      const y = a.y + 34 + (names.length - 1) * 19 + 19;
      wrap(a.sub, Math.floor((a.w - 30) / 7.2)).forEach((ln, k) => {
        svgEl('text', { x: a.x + 16, y: y + k * 15, class: 'a-sub' }, g).textContent = ln;
      });
      if (a.pc) {
        const b = svgEl('g', { class: 'pc-badge' }, g);
        svgEl('rect', { x: a.x + a.w - 44, y: a.y + 14, width: 30, height: 20, rx: 10 }, b);
        svgEl('text', { x: a.x + a.w - 29, y: a.y + 28, 'text-anchor': 'middle' }, b).textContent = 'PC';
      }
    });

    // Tramos invisibles para el recorrido animado
    const gS = svgEl('g', { opacity: '0', 'pointer-events': 'none' }, svg);
    const mainSegs = segs(prodPts);
    const segD = (k) => `M${mainSegs[k].from[0]} ${mainSegs[k].from[1]} ${mainSegs[k].d}`;
    const segEls = C.ruta.map((id, i) => {
      if (i === 0) return null;
      let d;
      if (id === 'refri') d = `M${bx} ${by} L${rx} ${ry}`;
      else if (C.ruta[i - 1] === 'refri') d = `M${rx} ${ry} L${bx} ${by} ${mainSegs[mainIds.indexOf(id)].d}`;
      else d = segD(mainIds.indexOf(id));
      return svgEl('path', { d, fill: 'none' }, gS);
    });
    const exitEl = svgEl('path', { d: segD(mainIds.length), fill: 'none' }, gS);

    // Estaciones de plagas
    const gP = svgEl('g', { class: 'pests' }, svg);
    C.estaciones.forEach(([x, y], i) => {
      const g = svgEl('g', { class: 'st ' + (i < 8 ? 'ext' : 'int'), style: `transition-delay:${i * 45}ms` }, gP);
      svgEl('circle', { cx: x, cy: y, r: 12 }, g);
      svgEl('text', { x, y }, g).textContent = i + 1;
    });

    // Punto del recorrido
    const dot = svgEl('g', { class: 'dot' }, svg);
    svgEl('circle', { r: 10, class: 'd-halo' }, dot);
    svgEl('circle', { r: 9, class: 'd-core' }, dot);
    const setDot = (x, y) => dot.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);

    // Panel lateral
    const empty = () => {
      panel.innerHTML = `<div class="p-empty fade-in">${icon('tap')}<p>Toca un área del plano. Cada área muestra su función y los requisitos de la norma.</p></div>`;
    };
    const clearSel = () => $$('.area, .lbl', svg).forEach((g) => g.classList.remove('sel', 'trace'));
    function showArea(id) {
      const a = A[id];
      const chips = [`<span class="chip norm">${a.arts}</span>`];
      if (a.pc) chips.push('<span class="chip warn">Punto de control</span>');
      if (a.zona === 'cold') chips.push('<span class="chip cold">Zona fría</span>');
      if (a.zona === 'waste') chips.push('<span class="chip bad">Zona roja</span>');
      if (a.zona === 'clean') chips.push('<span class="chip ok">Zona limpia</span>');
      panel.innerHTML = `<div class="fade-in"><p class="kicker">Área de la planta</p><h3>${a.nombre}</h3><p class="p-sub">${a.sub}</p><div class="p-chips">${chips.join('')}</div><p class="p-text">${a.texto}</p></div>`;
    }
    function select(id) {
      stopRoute();
      if (tgP.classList.contains('on')) setPests(false, true);
      clearSel();
      $$(`[data-id="${id}"]`, svg).forEach((g) => g.classList.add('sel'));
      showArea(id);
      Sound.pop();
    }
    gA.addEventListener('click', (e) => { const g = e.target.closest('.area'); if (g) select(g.dataset.id); });
    gA.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const g = e.target.closest('.area');
      if (g) { e.preventDefault(); select(g.dataset.id); }
    });

    // Interruptores
    const tgP = $('#tgPests'), tgF = $('#tgFlows');
    function setPests(on, silent) {
      tgP.classList.toggle('on', on);
      tgP.setAttribute('aria-pressed', on);
      gP.classList.toggle('show', on);
      if (silent) return;
      if (on) {
        stopRoute(); clearSel();
        panel.innerHTML = `<div class="fade-in"><p class="kicker">Art. 26 · Control de plagas</p><h3>Mapa de estaciones</h3>
          <div class="p-chips"><span class="chip warn">1 – 8 exteriores</span><span class="chip cold">9 – 13 interiores</span></div>
          <p class="p-text"><b>Estaciones 1 a 8 (ámbar):</b> cebaderos con llave en el perímetro exterior.</p>
          <p class="p-text"><b>Estaciones 9 a 13 (azul):</b> trampas adhesivas y lámpara con lámina adhesiva en puntos de entrada, nunca sobre mesas.</p>
          <p class="p-text">Cada estación se revisa semanalmente y se registra en el F07.</p></div>`;
        Sound.chime();
      } else empty();
    }
    tgP.addEventListener('click', () => setPests(!tgP.classList.contains('on')));
    tgF.addEventListener('click', () => {
      const on = !tgF.classList.contains('on');
      tgF.classList.toggle('on', on);
      tgF.setAttribute('aria-pressed', on);
      gF.classList.toggle('off', !on);
    });

    // Recorrido animado del producto
    let token = 0;
    const label = $('span', btn);
    btn.dataset.quiet = '';
    function stopRoute() {
      if (!btn.classList.contains('playing')) return;
      token++;
      btn.classList.remove('playing');
      label.textContent = 'Reproducir recorrido del producto';
      dot.classList.remove('on');
      clearSel();
    }
    function moveAlong(path, dur, my) {
      return new Promise((res) => {
        const L = path.getTotalLength();
        if (!dur) { const p = path.getPointAtLength(L); setDot(p.x, p.y); res(); return; }
        const t0 = performance.now();
        const f = (t) => {
          if (my !== token) { res(); return; }
          const k = Math.min(1, (t - t0) / dur);
          const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          const p = path.getPointAtLength(e * L);
          setDot(p.x, p.y);
          if (k < 1) requestAnimationFrame(f); else res();
        };
        requestAnimationFrame(f);
      });
    }
    function routeStep(i) {
      const id = C.ruta[i], a = A[id];
      $$('.area, .lbl', svg).forEach((g) => g.classList.toggle('trace', g.dataset.id === id));
      panel.innerHTML = `<div class="fade-in" style="display:flex;flex-direction:column;flex:1">
        <p class="kicker">Recorrido del producto · ${i + 1} de ${C.ruta.length}</p>
        <h3>${a.nombre}</h3><p class="p-sub">${a.sub}</p>
        ${a.pc ? '<div class="p-chips"><span class="chip warn">Punto de control</span></div>' : ''}
        <p class="p-text">${a.recorrido}</p>
        <div class="route-steps">${C.ruta.map((_, j) => `<i class="${j <= i ? 'on' : ''}"></i>`).join('')}</div></div>`;
      Sound.note(i);
    }
    async function play() {
      const my = ++token;
      setPests(false, true);
      clearSel();
      btn.classList.add('playing');
      label.textContent = 'Detener recorrido';
      const [x0, y0] = ctr(C.ruta[0]);
      setDot(x0, y0);
      dot.classList.add('on');
      for (let i = 0; i < C.ruta.length; i++) {
        if (i > 0) await moveAlong(segEls[i], reduce ? 0 : 650, my);
        if (my !== token) return;
        routeStep(i);
        await wait(1300);
        if (my !== token) return;
      }
      await moveAlong(exitEl, reduce ? 0 : 600, my);
      if (my !== token) return;
      btn.classList.remove('playing');
      label.textContent = 'Repetir recorrido del producto';
      dot.classList.remove('on');
      clearSel();
      panel.innerHTML = `<div class="fade-in"><p class="kicker">Recorrido completo</p><h3>De la zona sucia a la limpia</h3>
        <p class="p-text">El producto avanza en un solo sentido, sin regresar ni cruzarse con residuos o con el personal que entra de la calle.</p>
        <div class="p-chips"><span class="chip norm">Arts. 6 y 7</span><span class="chip">${C.ruta.length} áreas</span></div></div>`;
      Sound.done();
    }
    btn.addEventListener('click', () => (btn.classList.contains('playing') ? stopRoute() : play()));

    Plan.showPests = () => { if (!tgP.classList.contains('on')) setPests(true); };
    empty();
    $('#prodIntro').textContent = C.produccionIntro;
  }

  /* =======================================================================
     03 · Proceso productivo
     ======================================================================= */
  const Proc = {};
  function initProceso() {
    const list = $('#procList'), card = $('#procCard');
    let cur = -1;
    list.innerHTML = C.etapas.map((e, i) => `
      <li><button class="proc-item${e.pc ? ' pc' : ''}" data-i="${i}" data-quiet>
        <span class="pi-n">${pad(e.n)}</span><span class="pi-name">${e.etapa}</span>${e.pc ? '<span class="chip warn xs">PC</span>' : ''}
      </button></li>`).join('');
    const hz = (k, label, ic, txt) => `
      <div class="hz ${k}${txt === '—' ? ' none' : ''}">
        <div class="hz-h"><span class="hz-ic">${icon(ic)}</span><span class="hz-t">${label}</span></div>
        <p>${txt}</p>
      </div>`;
    function show(i, user) {
      if (i < 0 || i >= C.etapas.length || i === cur) return;
      const back = i < cur;
      cur = i;
      const e = C.etapas[i];
      $$('.proc-item', list).forEach((b, j) => b.classList.toggle('active', j === i));
      if (user && list.scrollWidth > list.clientWidth + 4) {
        const li = list.children[i];
        list.scrollTo({ left: li.offsetLeft - 16, behavior: 'smooth' });
      }
      card.classList.toggle('pc', e.pc);
      card.innerHTML = `<div class="swap${back ? ' back' : ''}" style="display:flex;flex-direction:column;flex:1">
        <div class="pcd-top"><p class="kicker">Etapa ${e.n} de ${C.etapas.length}</p>${e.pc ? '<span class="chip warn">PC · Punto de control</span>' : ''}</div>
        <h3 class="pcd-title">${e.etapa}</h3>
        <p class="pcd-desc">${e.desc}</p>
        <div class="hazards">${hz('b', 'Biológico', 'microbe', e.b)}${hz('q', 'Químico', 'flask', e.q)}${hz('f', 'Físico', 'shard', e.f)}</div>
        <div class="pcd-control">
          <div><p class="kicker">Control</p><p>${e.control}</p></div>
          <div class="pcd-reg"><p class="kicker">Registro</p><p class="mono">${e.reg}</p></div>
        </div>
        <div class="pcd-nav">
          <button class="btn ghost sm" data-step="-1" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
          <div class="pcd-bar" aria-hidden="true">${C.etapas.map((x, j) => `<i class="${x.pc ? 'pc' : ''}${j <= i ? ' on' : ''}"></i>`).join('')}</div>
          <button class="btn primary sm" data-step="1" ${i === C.etapas.length - 1 ? 'disabled' : ''}>Siguiente →</button>
        </div></div>`;
      if (user) (e.pc ? Sound.chime : Sound.pop)();
    }
    list.addEventListener('click', (ev) => { const b = ev.target.closest('.proc-item'); if (b) show(+b.dataset.i, true); });
    card.addEventListener('click', (ev) => { const b = ev.target.closest('[data-step]'); if (b && !b.disabled) show(cur + +b.dataset.step, true); });
    show(0);
    Proc.next = () => show(cur + 1, true);
    Proc.prev = () => show(cur - 1, true);
  }

  /* =======================================================================
     04 · Recepción: juego del inspector
     ======================================================================= */
  function initRecepcion() {
    const stage = $('#inspStage'), sc = $('#inspScore'), an = $('#inspAns'), dots = $('#inspDots');
    const total = C.entregas.length;
    let order, i, score, answered, res;

    function side() {
      sc.textContent = score;
      an.textContent = answered;
      dots.innerHTML = Array.from({ length: total }, (_, j) =>
        `<i class="${res[j] === true ? 'ok' : res[j] === false ? 'bad' : j === i ? 'cur' : ''}"></i>`).join('');
    }
    function card() {
      if (i >= total) { final(); return; }
      const e = order[i];
      stage.innerHTML = `<div class="insp-card enter">
        <div class="insp-top"><p class="kicker">Entrega ${i + 1} de ${total}</p><span class="chip">F01</span></div>
        <div class="insp-ic">${icon('box')}</div>
        <h3 class="insp-name">${e.insumo}</h3>
        <p class="insp-ve">${e.ve}</p>
        <div class="insp-actions">
          <button class="btn ok" data-a="1" data-quiet>✓ Aceptar</button>
          <button class="btn bad" data-a="0" data-quiet>✕ Rechazar</button>
        </div>
        <div class="stamp" aria-hidden="true"></div>
      </div>`;
      side();
    }
    function answer(a) {
      const e = order[i];
      const correct = (a === 1) === e.ok;
      if (correct) score++;
      answered++;
      res[i] = correct;
      const c = $('.insp-card', stage);
      $$('[data-a]', c).forEach((b) => { b.disabled = true; });
      const st = $('.stamp', c);
      st.textContent = a ? 'ACEPTADO' : 'RECHAZADO';
      st.className = 'stamp show ' + (a ? 'ok' : 'bad');
      const fb = document.createElement('div');
      fb.className = 'insp-fb';
      fb.innerHTML = `<p class="fb-t ${correct ? 'ok' : 'bad'}">${correct ? 'Correcto.' : 'No es así.'}</p>
        <p><b>${e.ok ? 'Se acepta:' : 'Se rechaza:'}</b> ${e.porque}</p>
        <button class="btn primary sm" data-next>${i === total - 1 ? 'Ver resultado' : 'Siguiente entrega'} →</button>`;
      c.appendChild(fb);
      Sound.stamp();
      setTimeout(correct ? Sound.ok : Sound.bad, 120);
      if (correct) setTimeout(() => pop(st, 12), 200);
      else { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
      side();
      $('[data-next]', fb).focus({ preventScroll: true });
    }
    function final() {
      const perfect = score === total;
      stage.innerHTML = `<div class="insp-card final enter">
        <p class="kicker">Inspección terminada</p>
        <p class="big-mark">${score}<small>/${total}</small></p>
        <h3 class="insp-name">Acertaste ${score} de ${total}.</h3>
        <p>${perfect ? 'Recepción impecable: ninguna materia prima de riesgo entró a la planta.' : 'Repasa los criterios de la tabla y vuelve a intentarlo.'}</p>
        <button class="btn primary" data-replay>Volver a jugar</button>
      </div>`;
      side();
      if (perfect) { Sound.win(); burst($('.insp-card', stage)); } else Sound.done();
    }
    function reset() { order = shuffle(C.entregas); i = 0; score = 0; answered = 0; res = []; card(); }

    stage.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a && !a.disabled) { answer(+a.dataset.a); return; }
      if (e.target.closest('[data-next]')) { i++; card(); return; }
      if (e.target.closest('[data-replay]')) reset();
    });
    $('#inspReset').addEventListener('click', reset);
    reset();

    $('#tblCriterios').innerHTML = `<thead><tr><th>Insumo</th><th>Se acepta si</th><th>Se rechaza si</th><th>Almacenamiento</th></tr></thead><tbody>${C.criterios.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>`;
    $('#listReglas').innerHTML = C.reglasAlmacen.map((r) => `<li>${r}</li>`).join('');
  }

  /* =======================================================================
     05 · Personal manipulador
     ======================================================================= */
  const FIGURE = `
    <circle cx="150" cy="268" r="142" class="bg-c" opacity=".55"/>
    <rect x="106" y="336" width="38" height="134" rx="10" class="pants"/>
    <rect x="156" y="336" width="38" height="134" rx="10" class="pants"/>
    <path d="M100 470 h46 v24 q0 8 -8 8 h-42 q-10 0 -10 -10 q0 -14 14 -22z" class="boot"/>
    <path d="M154 470 h46 q14 8 14 22 q0 10 -10 10 h-42 q-8 0 -8 -8z" class="boot"/>
    <path d="M98 146 Q70 170 64 232 L58 318 L80 320 L88 238 Q93 198 108 182 Z" class="coat"/>
    <path d="M202 146 Q230 170 236 232 L242 306 L220 308 L212 238 Q207 198 192 182 Z" class="coat"/>
    <circle cx="68" cy="330" r="13" class="skin"/>
    <circle cx="232" cy="318" r="13" class="skin"/>
    <path d="M96 140 Q150 118 204 140 L214 350 Q150 364 86 350 Z" class="coat"/>
    <path d="M150 134 V346" class="line"/>
    <path d="M118 198 L182 198 L192 354 Q150 364 108 354 Z" class="apron"/>
    <path d="M118 198 L134 146 M182 198 L166 146" class="line" style="stroke:#A9C1E3"/>
    <path d="M110 268 Q150 276 190 268" class="line" style="stroke:#A9C1E3"/>
    <rect x="140" y="108" width="20" height="24" rx="6" class="skin"/>
    <circle cx="150" cy="82" r="34" class="skin"/>
    <path d="M114 78 Q112 34 150 32 Q188 34 186 78 Q170 66 150 68 Q130 66 114 78 Z" class="cap"/>
    <path d="M126 44 Q132 58 130 70 M150 36 V66 M174 44 Q168 58 170 70" class="line"/>
    <circle cx="138" cy="84" r="2.8" class="eye"/>
    <circle cx="162" cy="84" r="2.8" class="eye"/>
    <rect x="127" y="92" width="46" height="26" rx="9" class="mask"/>
    <path d="M127 99 L117 90 M173 99 L183 90 M134 101 H166 M134 108 H166" class="line" style="stroke:#9DBBE0"/>`;

  function initPersonal() {
    const svg = $('#manFig'), panel = $('#manPanel'), count = $('#manCount');
    const N = C.dotacion.length;
    svg.innerHTML = FIGURE + C.dotacion.map((d, i) => `
      <g class="pt" tabindex="0" role="button" data-i="${i}" aria-label="Punto ${i + 1}: ${d.el}">
        <circle class="pt-ring" cx="${d.x}" cy="${d.y}" r="13"/>
        <circle class="pt-core" cx="${d.x}" cy="${d.y}" r="13"/>
        <text x="${d.x}" y="${d.y}">${i + 1}</text>
      </g>`).join('');
    const seen = new Set();
    panel.innerHTML = '<p class="muted">Selecciona un punto para ver su razón sanitaria.</p>';
    function pick(i) {
      const d = C.dotacion[i];
      const first = !seen.has(i);
      seen.add(i);
      $$('.pt', svg).forEach((g, j) => { g.classList.toggle('done', seen.has(j)); g.classList.toggle('cur', j === i); });
      const all = seen.size === N;
      count.textContent = `${seen.size} de ${N} revisados`;
      count.className = 'chip' + (all ? ' ok' : '');
      panel.innerHTML = `<div class="fade-in"><p class="kicker">Art. 14 · Punto ${i + 1}</p><h4>${d.el}</h4><p>${d.razon}</p>${all ? '<span class="chip ok man-done">✓ Dotación completa</span>' : ''}</div>`;
      if (first && all) { Sound.win(); burst(svg); } else Sound.pop();
    }
    svg.addEventListener('click', (e) => { const g = e.target.closest('.pt'); if (g) pick(+g.dataset.i); });
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const g = e.target.closest('.pt');
      if (g) { e.preventDefault(); pick(+g.dataset.i); }
    });

    // Lavado de manos: 40 segundos
    const ring = $('#washRing'), time = $('#washTime'), steps = $('#washSteps'), bS = $('#washStart'), bR = $('#washReset');
    const ringBox = ring.closest('.ring');
    const CIRC = 2 * Math.PI * 70, DUR = 40, S = C.lavado.length;
    ring.style.strokeDasharray = CIRC;
    steps.innerHTML = C.lavado.map((s) => `<li>${s}</li>`).join('');
    const items = $$('li', steps);
    let elapsed = 0, base = 0, t0 = 0, running = false, raf = 0, lastStep = -1;
    bS.dataset.quiet = '';

    function draw() {
      const done = elapsed >= DUR;
      ring.style.strokeDashoffset = CIRC * (1 - elapsed / DUR);
      ringBox.classList.toggle('done', done);
      time.textContent = done ? '✓' : Math.ceil(DUR - elapsed);
      const idx = done ? S : (!running && elapsed === 0 ? -1 : Math.min(S - 1, Math.floor(elapsed / (DUR / S))));
      items.forEach((li, j) => { li.classList.toggle('on', j === idx); li.classList.toggle('done', j < idx); });
      if (running && idx !== lastStep && idx >= 0 && idx < S) Sound.note(idx * 2);
      lastStep = idx;
    }
    function loop(t) {
      elapsed = Math.min(DUR, base + (t - t0) / 1000);
      draw();
      if (elapsed >= DUR) { running = false; bS.textContent = 'Iniciar'; Sound.win(); burst(ringBox); return; }
      raf = requestAnimationFrame(loop);
    }
    bS.addEventListener('click', () => {
      if (running) {
        running = false; cancelAnimationFrame(raf); base = elapsed;
        bS.textContent = 'Continuar'; Sound.click();
        return;
      }
      if (elapsed >= DUR) elapsed = 0;
      base = elapsed; t0 = performance.now(); running = true;
      bS.textContent = 'Pausar'; Sound.pop();
      raf = requestAnimationFrame(loop);
    });
    bR.addEventListener('click', () => {
      running = false; cancelAnimationFrame(raf);
      elapsed = 0; base = 0; lastStep = -1;
      bS.textContent = 'Iniciar';
      draw();
    });
    draw();

    const totalH = C.capacitacion.reduce((s, r) => s + r[3], 0);
    $('#tblCapacitacion').innerHTML = `<thead><tr><th>Cuándo</th><th>Tema</th><th>Metodología</th><th style="text-align:right">Horas</th></tr></thead>
      <tbody>${C.capacitacion.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="num">${fmt(r[3])}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Total anual</td><td></td><td></td><td class="num">${fmt(totalH)}</td></tr></tfoot>`;
  }

  /* =======================================================================
     Pestañas (saneamiento y anexos)
     ======================================================================= */
  function initTabs(box) {
    const bar = $('.tabs', box), btns = $$('[role=tab]', bar), ink = $('.tab-ink', bar);
    const panels = $$(':scope > .tab-panel', box);
    btns.forEach((b) => { b.dataset.quiet = ''; });
    function moveInk() {
      const b = btns.find((x) => x.getAttribute('aria-selected') === 'true');
      if (!b) return;
      ink.style.width = b.offsetWidth + 'px';
      ink.style.transform = `translateX(${b.offsetLeft - 4}px)`;
      ink.style.left = '4px';
    }
    function select(name, user) {
      btns.forEach((b) => { const on = b.dataset.tab === name; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
      moveInk();
      if (user) Sound.whoosh();
    }
    bar.addEventListener('click', (e) => { const b = e.target.closest('[role=tab]'); if (b) select(b.dataset.tab, true); });
    bar.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.stopPropagation();
      const i = btns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
      const n = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
      select(n.dataset.tab, true);
      n.focus();
    });
    addEventListener('resize', moveInk);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
    requestAnimationFrame(moveInk);
    return { select };
  }

  /* =======================================================================
     06 · Plan de saneamiento
     ======================================================================= */
  function initSaneamiento() {
    initTabs($('#sanTabs'));

    // Calculadora de diluciones
    const uso = $('#cUso'), ppm = $('#cPpm'), pct = $('#cPct'), lit = $('#cLit');
    const out = $('#cRes'), txt = $('#cTxt'), liq = $('#flaskLiq'), wave = $('#flaskWave');
    uso.innerHTML = C.usos.map((u, i) => `<option value="${i}">${u.uso}${u.ppm ? ` · ${fmt(u.ppm, 0)} ppm` : ''}</option>`).join('');
    let last = null;
    function err(m) { out.classList.add('err'); out.textContent = m; txt.textContent = ''; last = null; }
    function calc() {
      const p = num(ppm.value), c = num(pct.value), L = num(lit.value);
      if (!(p > 0 && c > 0 && L > 0)) { err('Escribe valores mayores que cero.'); return; }
      if (p > c * 10000) { err('La concentración deseada no puede superar la del producto comercial.'); return; }
      const ml = (p * L * 1000) / (c * 10000);
      out.classList.remove('err');
      out.textContent = `${fmt(ml, ml < 10 ? 2 : 1)} mL`;
      txt.textContent = `de hipoclorito al ${fmt(c, 2)} % y completar con agua potable hasta ${fmt(L, 2)} L, para obtener ${fmt(p, 0)} ppm.`;
      const a = 0.15 + 0.75 * Math.min(1, p / 1000);
      liq.style.fillOpacity = a;
      wave.style.fillOpacity = a;
      if (last !== null && Math.abs(last - ml) > 1e-9) Sound.drip();
      last = ml;
    }
    uso.addEventListener('change', () => { const u = C.usos[+uso.value]; if (u.ppm) ppm.value = u.ppm; else ppm.select(); calc(); });
    ppm.addEventListener('input', () => {
      const v = num(ppm.value);
      const k = C.usos.findIndex((u) => u.ppm === v);
      uso.value = k >= 0 ? k : C.usos.length - 1;
      calc();
    });
    pct.addEventListener('input', calc);
    lit.addEventListener('input', calc);
    calc();

    let cal = '<thead><tr><th>Área o equipo</th><th>Qué se hace</th></tr></thead><tbody>', grp = '';
    C.calendario.forEach(([f, a, q]) => {
      if (f !== grp) { grp = f; cal += `<tr class="grp"><td colspan="2">${f}</td></tr>`; }
      cal += `<tr><td>${a}</td><td>${q}</td></tr>`;
    });
    $('#tblCalendario').innerHTML = cal + '</tbody>';

    initBins();

    // Plagas
    $('#plagasCards').innerHTML = C.plagas.map((p, i) => `
      <article class="card">
        <div class="trio-ic">${icon(['shield', 'radar', 'target'][i])}</div>
        <h3>${p.t}</h3><p>${p.texto}</p>
        ${p.boton ? '<button class="btn ghost sm" data-pests>Ver estaciones en el plano →</button>' : ''}
      </article>`).join('');
    $('#plagasCards').addEventListener('click', (e) => {
      if (!e.target.closest('[data-pests]')) return;
      goTo('plano');
      setTimeout(() => Plan.showPests(), reduce ? 0 : 650);
    });

    initWater();
  }

  function initBins() {
    const row = $('#binsRow'), item = $('#binItem'), n = $('#binN'), sc = $('#binScore'), fb = $('#binFb');
    const top = item.closest('.bins-top');
    const binSVG = (k) => `
      <svg viewBox="0 0 86 104" aria-hidden="true">
        <g class="lid"><rect x="6" y="12" width="74" height="10" rx="4" class="bin-body ${k}"/><rect x="33" y="5" width="20" height="8" rx="3" class="bin-body ${k}"/></g>
        <path d="M12 24 H74 L68 95 Q67 100 62 100 H24 Q19 100 18 95 Z" class="bin-body ${k}"/>
        <path d="M30 36 V88 M43 36 V88 M56 36 V88" stroke="${k === 'blanca' ? '#D3CFDC' : 'rgba(255,255,255,.22)'}" stroke-width="3" stroke-linecap="round"/>
        <rect x="56" y="99" width="12" height="5" rx="2" fill="#6B6777"/>
      </svg>`;
    row.innerHTML = Object.keys(C.canecas).map((k) => `
      <button class="bin" data-c="${k}" data-quiet>${binSVG(k)}<span class="bin-name">${C.canecas[k].nombre}</span><span class="bin-sub">${C.canecas[k].sub}</span></button>`).join('');
    let order, i, ok, tries, locked;

    const score = () => { sc.textContent = `${ok} / ${tries}`; };
    function show() {
      if (i >= order.length) { end(); return; }
      locked = false;
      top.hidden = false; row.hidden = false;
      n.textContent = `${i + 1}/${order.length}`;
      item.textContent = order[i].r;
      item.classList.remove('swap'); void item.offsetWidth; item.classList.add('swap');
      fb.innerHTML = '';
      $$('.bin', row).forEach((b) => { b.disabled = false; b.className = 'bin'; });
      score();
    }
    function pick(k, btn) {
      if (locked) return;
      locked = true;
      const r = order[i], good = k === r.c;
      tries++;
      if (good) ok++;
      score();
      btn.classList.add('open', good ? 'good' : 'wrong');
      if (!good) $(`[data-c="${r.c}"]`, row).classList.add('good', 'open');
      $$('.bin', row).forEach((b) => { b.disabled = true; });
      fb.innerHTML = `<div class="fade-in">
        <p class="fb-t ${good ? 'ok' : 'bad'}">${good ? 'Bien.' : `Va en la caneca ${C.canecas[r.c].nombre.toLowerCase()}.`}</p>
        <p>${r.porque}</p>
        <button class="btn primary sm" data-next>${i === order.length - 1 ? 'Ver resultado' : 'Siguiente residuo'} →</button></div>`;
      (good ? Sound.ok : Sound.bad)();
      if (good) pop(btn, 12);
    }
    function end() {
      top.hidden = true; row.hidden = true;
      const perfect = ok === order.length;
      fb.innerHTML = `<div class="bins-end fade-in"><p class="kicker">Programa de residuos · Res. 2184 de 2019</p>
        <p class="bins-item">¡Planta clasificada! Acertaste ${ok} de ${order.length}.</p>
        <button class="btn primary" data-replay>Repetir</button></div>`;
      if (perfect) { Sound.win(); burst(fb); } else Sound.done();
    }
    function reset() { order = shuffle(C.residuos); i = 0; ok = 0; tries = 0; show(); }

    row.addEventListener('click', (e) => { const b = e.target.closest('.bin'); if (b && !b.disabled) pick(b.dataset.c, b); });
    fb.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) { i++; show(); }
      else if (e.target.closest('[data-replay]')) reset();
    });
    reset();
  }

  function initWater() {
    const cl = $('#wCl'), ph = $('#wPh'), clV = $('#wClV'), phV = $('#wPhV'), liq = $('#tubeLiq');
    const cc = $('#wClChip'), pc = $('#wPhChip'), msg = $('#wMsg');
    let prevOk = null;
    function upd(e) {
      const c = +cl.value, p = +ph.value;
      clV.textContent = `${fix(c, 1)} mg/L`;
      phV.textContent = fix(p, 1);
      const okC = c >= 0.3 && c <= 2.0, okP = p >= 6.5 && p <= 9.0, okAll = okC && okP;
      cc.textContent = okC ? 'Cloro conforme' : 'Cloro fuera de rango';
      cc.className = 'chip ' + (okC ? 'ok' : 'bad');
      pc.textContent = okP ? 'pH conforme' : 'pH fuera de rango';
      pc.className = 'chip ' + (okP ? 'ok' : 'bad');
      liq.style.fill = `rgba(214, 51, 132, ${Math.min(0.9, 0.04 + c / 2.6).toFixed(3)})`;
      msg.className = 'water-msg ' + (okAll ? 'ok' : 'bad');
      msg.textContent = okAll
        ? 'Agua apta para producción. Se anota la lectura en el F09.'
        : 'Se suspende el uso del agua para producción, se informa a la gerente y se verifica el tanque y la cloración.';
      if (e) {
        const t = e.target;
        Sound.slide((t.value - t.min) / (t.max - t.min));
        if (prevOk !== null && prevOk !== okAll) (okAll ? Sound.ok : Sound.bad)();
      }
      prevOk = okAll;
    }
    cl.addEventListener('input', upd);
    ph.addEventListener('input', upd);
    upd();
  }

  /* =======================================================================
     07 · Microbiología: cajas de Petri dibujadas en canvas
     ======================================================================= */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
  }

  function drawPetri(cv, tipo, seed) {
    const S = 150, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = S * dpr; cv.height = S * dpr;
    const x = cv.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, S, S);
    const R = rng(seed), cx = 75, cy = 75, rOut = 68, rAg = 61;
    const dark = root.dataset.theme === 'dark';
    const agarKey = { pca: 'pca', drbc: 'drbc', cromo: 'cromo', 'cromo-ecoli': 'cromo', membrana: 'cromo', bp: 'bp', myp: 'myp' }[tipo];
    const base = C.agar[agarKey];
    const TAU = Math.PI * 2;

    // Caja de vidrio
    x.save();
    x.shadowColor = dark ? 'rgba(0,0,0,.6)' : 'rgba(40,30,80,.22)';
    x.shadowBlur = 14; x.shadowOffsetY = 5;
    x.beginPath(); x.arc(cx, cy, rOut, 0, TAU);
    x.fillStyle = dark ? '#262331' : '#FFFFFF';
    x.fill();
    x.restore();
    x.lineWidth = 1.2;
    x.beginPath(); x.arc(cx, cy, rOut, 0, TAU); x.strokeStyle = dark ? 'rgba(255,255,255,.2)' : 'rgba(60,50,90,.2)'; x.stroke();
    x.beginPath(); x.arc(cx, cy, rOut - 4, 0, TAU); x.strokeStyle = dark ? 'rgba(255,255,255,.08)' : 'rgba(60,50,90,.1)'; x.stroke();

    // Agar
    const g = x.createRadialGradient(cx - 18, cy - 20, 6, cx, cy, rAg);
    g.addColorStop(0, shade(base, 16));
    g.addColorStop(0.75, base);
    g.addColorStop(1, shade(base, -18));
    x.save();
    x.beginPath(); x.arc(cx, cy, rAg, 0, TAU);
    x.fillStyle = g; x.fill(); x.clip();

    function place(n, rmin, rmax, maxD = rAg - 6, ox = cx, oy = cy) {
      const out = [];
      let tries = 0;
      while (out.length < n && tries < n * 80) {
        tries++;
        const r = rmin + R() * (rmax - rmin);
        const a = R() * TAU, d = Math.sqrt(R()) * (maxD - r);
        const p = { x: ox + Math.cos(a) * d, y: oy + Math.sin(a) * d, r };
        if (out.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > q.r + p.r + 1.5)) out.push(p);
      }
      return out;
    }
    function colony(c, o) {
      if (o.halo) {
        const hr = c.r * (o.haloR || 2.2);
        const hg = x.createRadialGradient(c.x, c.y, c.r * 0.9, c.x, c.y, hr);
        hg.addColorStop(0, o.halo); hg.addColorStop(1, 'rgba(255,255,255,0)');
        x.beginPath(); x.arc(c.x, c.y, hr, 0, TAU); x.fillStyle = hg; x.fill();
      }
      x.beginPath(); x.arc(c.x, c.y, c.r, 0, TAU); x.fillStyle = o.fill; x.fill();
      if (o.rim) { x.lineWidth = 0.8; x.strokeStyle = o.rim; x.stroke(); }
      if (c.r > 1.8) { x.beginPath(); x.arc(c.x - c.r * 0.35, c.y - c.r * 0.35, c.r * 0.3, 0, TAU); x.fillStyle = o.shine || 'rgba(255,255,255,.55)'; x.fill(); }
    }
    function mold(c) {
      const mg = x.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      mg.addColorStop(0, '#4E6844'); mg.addColorStop(0.35, '#7E9568'); mg.addColorStop(0.7, '#E9E6DA'); mg.addColorStop(1, 'rgba(250,248,240,.85)');
      x.beginPath(); x.arc(c.x, c.y, c.r, 0, TAU); x.fillStyle = mg; x.fill();
      x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 0.7;
      for (let k = 0; k < 46; k++) {
        const a = R() * TAU, r1 = c.r * (0.75 + R() * 0.2), r2 = c.r * (1.02 + R() * 0.22);
        x.beginPath();
        x.moveTo(c.x + Math.cos(a) * r1, c.y + Math.sin(a) * r1);
        x.lineTo(c.x + Math.cos(a) * r2, c.y + Math.sin(a) * r2);
        x.stroke();
      }
    }

    const SALMON = { fill: '#D9485F', rim: 'rgba(120,20,40,.45)' };
    const BLUE = { fill: '#2E3192', rim: 'rgba(10,10,60,.5)', shine: 'rgba(255,255,255,.4)' };
    switch (tipo) {
      case 'pca':
        place(40, 1.3, 4.4).forEach((c) => colony(c, { fill: '#FBF6E8', rim: 'rgba(150,115,60,.5)' }));
        break;
      case 'drbc': {
        const molds = place(3, 10, 15);
        molds.forEach(mold);
        place(16, 1.6, 3.4).filter((c) => molds.every((m) => Math.hypot(m.x - c.x, m.y - c.y) > m.r + c.r + 3))
          .forEach((c) => colony(c, { fill: '#C93C7B', rim: 'rgba(90,10,40,.4)' }));
        break;
      }
      case 'cromo':
        place(22, 1.5, 4).forEach((c) => colony(c, SALMON));
        break;
      case 'cromo-ecoli':
        place(22, 1.5, 4).forEach((c, k) => colony(c, k % 3 === 0 ? BLUE : SALMON));
        break;
      case 'membrana': {
        const mr = 47;
        x.beginPath(); x.arc(cx, cy, mr, 0, TAU); x.fillStyle = '#F8F4E8'; x.fill();
        x.save(); x.clip();
        x.strokeStyle = 'rgba(46,110,70,.35)'; x.lineWidth = 0.7;
        for (let k = -mr; k <= mr; k += 7.5) {
          x.beginPath(); x.moveTo(cx + k, cy - mr); x.lineTo(cx + k, cy + mr); x.stroke();
          x.beginPath(); x.moveTo(cx - mr, cy + k); x.lineTo(cx + mr, cy + k); x.stroke();
        }
        x.restore();
        x.beginPath(); x.arc(cx, cy, mr, 0, TAU); x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 1; x.stroke();
        place(12, 1.4, 3, mr - 3).forEach((c, k) => colony(c, k % 3 === 0 ? BLUE : SALMON));
        break;
      }
      case 'bp':
        place(13, 2.6, 4.8, rAg - 12).forEach((c) => colony(c, { fill: '#15110D', rim: 'rgba(0,0,0,.6)', halo: 'rgba(250,236,196,.9)', haloR: 2.3, shine: 'rgba(255,255,255,.7)' }));
        break;
      case 'myp':
        place(9, 3.4, 6, rAg - 14).forEach((c) => colony(c, { fill: '#C24E7E', rim: 'rgba(90,20,50,.45)', halo: 'rgba(255,250,245,.9)', haloR: 2.4 }));
        break;
    }
    x.restore();

    // Brillo del vidrio
    x.beginPath(); x.arc(cx, cy, rOut - 8, Math.PI * 1.08, Math.PI * 1.42);
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.lineCap = 'round'; x.stroke();
  }

  function initMicro() {
    const box = $('#samples'), card = $('#sampleCard');
    box.innerHTML = C.muestras.map((m) => `
      <button class="sample-btn" role="tab" aria-selected="false" data-id="${m.id}" data-quiet>${icon(m.icono)}<span>${m.nombre}</span></button>`).join('');
    let cur = null;
    function paint() {
      $$('canvas', card).forEach((cv, i) => drawPetri(cv, cur.cajas[i].tipo, hash(cur.id + ':' + i)));
    }
    function show(id, user) {
      const m = C.muestras.find((x) => x.id === id);
      cur = m;
      $$('.sample-btn', box).forEach((b) => b.setAttribute('aria-selected', b.dataset.id === id));
      const plates = m.cajas.length
        ? `<div class="petris">${m.cajas.map((c, i) => `
            <figure class="petri pop" style="--d:${i * 90}ms">
              <canvas width="150" height="150" aria-hidden="true"></canvas>
              <figcaption><div class="petri-org">${c.org}</div><div class="petri-medio">${c.medio}</div></figcaption>
            </figure>`).join('')}</div>
           <p class="petri-note">Ilustración de referencia del aspecto típico en cada medio. Los métodos y resultados reales los define y reporta el laboratorio.</p>`
        : `<div class="no-plates">${icon('doc')}<p>Sin cajas de Petri: para las materias primas se exige el certificado de análisis del proveedor.</p></div>`;
      card.innerHTML = `<div class="fade-in">
        <div class="sc-head"><h3>${m.nombre}</h3><span class="chip norm">${m.frec}</span></div>
        <div class="sc-cols"><div><p class="kicker">Cómo se toma</p><p>${m.como}</p></div><div><p class="kicker">Por qué</p><p>${m.porque}</p></div></div>
        ${plates}</div>`;
      paint();
      if (user) Sound.pop();
    }
    box.addEventListener('click', (e) => { const b = e.target.closest('.sample-btn'); if (b) show(b.dataset.id, true); });
    card.addEventListener('click', (e) => {
      const p = e.target.closest('.petri');
      if (!p) return;
      p.classList.remove('spin'); void p.offsetWidth; p.classList.add('spin');
      Sound.sparkle();
    });
    window.addEventListener('themechange', () => cur && paint());
    show(C.muestras[0].id);
    $('#controlesPlanta').textContent = C.controlesPlanta;
  }

  /* =======================================================================
     08 · Etiqueta y transporte
     ======================================================================= */
  function barcode(s) {
    let x = 0, bars = '';
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      for (let k = 0; k < 4; k++) {
        const w = ((code >> k) & 1) + 1, gap = ((code >> (k + 3)) & 1) + 1;
        bars += `<rect x="${x}" y="0" width="${w}" height="38"/>`;
        x += w + gap;
      }
    }
    return `<svg viewBox="0 0 ${x} 38" preserveAspectRatio="none" aria-hidden="true"><g fill="#1A1822">${bars}</g></svg>`;
  }

  function initSalida() {
    const f = $('#lFecha'), p = $('#lPres'), nIn = $('#lNum'), box = $('#label'), E = C.etiqueta;
    const today = new Date();
    f.value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const dmy = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    let prev = null;
    function upd() {
      let d = f.value ? new Date(f.value + 'T12:00:00') : new Date();
      if (isNaN(d)) d = new Date();
      const n = Math.max(1, Math.min(99, parseInt(nIn.value, 10) || 1));
      const lote = `PQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(n)}`;
      const v = new Date(d); v.setDate(v.getDate() + 5);
      const vals = { neto: p.value === 'entero' ? '454 g (entero de 1 lb)' : '120 g (porción)', lote, elab: dmy(d), vence: dmy(v) };
      box.innerHTML = `
        <div class="lb-head">
          <img class="lb-logo" src="logo.webp" alt="">
          <div><div class="lb-title">Ponqué de Vainilla</div><div class="lb-brand">ADEX Sweets &amp; Pink</div></div>
        </div>
        <div class="lb-sec"><b>Ingredientes</b>${E.ingredientes}</div>
        <div class="lb-alerg">${E.alergenos}</div>
        <div class="lb-grid">
          <div><span>Contenido neto</span><strong data-k="neto">${vals.neto}</strong></div>
          <div><span>Lote</span><strong data-k="lote">${vals.lote}</strong></div>
          <div><span>Elaborado</span><strong data-k="elab">${vals.elab}</strong></div>
          <div><span>Fecha de vencimiento</span><strong data-k="vence">${vals.vence}</strong></div>
        </div>
        <div class="lb-sec"><b>Conservación</b>${E.conservacion}</div>
        <div class="lb-foot"><p>${E.pie}</p><div class="lb-bar">${barcode(lote)}<span>${lote}</span></div></div>`;
      if (prev) {
        Object.keys(vals).forEach((k) => {
          if (prev[k] === vals[k]) return;
          const el = $(`[data-k="${k}"]`, box);
          el.classList.add('flash');
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('flash')));
        });
      }
      prev = vals;
    }
    const onEdit = () => { upd(); Sound.tick(); };
    f.addEventListener('input', onEdit);
    p.addEventListener('change', onEdit);
    nIn.addEventListener('input', onEdit);
    upd();

    // Inspección del vehículo
    const list = $('#vanChecks'), msg = $('#vanMsg'), go = $('#vanGo'), scene = $('#vanScene'), done = $('#vanDone'), van = $('#van');
    list.innerHTML = C.vehiculo.map((t, i) => `<li><label class="check"><input type="checkbox" data-i="${i}"><span class="box"></span><span class="ck-t">${t}</span></label></li>`).join('');
    const boxes = $$('input', list);
    let sent = false;
    go.dataset.quiet = '';
    function check(sound) {
      const miss = boxes.filter((c) => !c.checked).length, ready = miss === 0;
      const was = scene.classList.contains('ready');
      msg.textContent = ready ? 'Vehículo conforme' : `Faltan ${miss} punto${miss === 1 ? '' : 's'}`;
      msg.className = 'chip' + (ready ? ' ok' : '');
      scene.classList.toggle('ready', ready);
      go.disabled = !ready;
      if (sound) (ready && !was ? Sound.ok : Sound.tick)();
    }
    function reset() {
      sent = false;
      van.style.transition = 'none';
      scene.classList.remove('go', 'ready');
      void van.offsetWidth;
      van.style.transition = '';
      boxes.forEach((c) => { c.checked = false; c.disabled = false; });
      done.textContent = '';
      go.textContent = 'Aprobar despacho';
      check(false);
    }
    list.addEventListener('change', () => check(true));
    go.addEventListener('click', () => {
      if (sent) { Sound.click(); reset(); return; }
      sent = true;
      go.disabled = true;
      boxes.forEach((c) => { c.disabled = true; });
      scene.classList.add('go');
      Sound.engine();
      setTimeout(() => {
        const t = new Date();
        done.textContent = `Despacho aprobado. Hora de salida anotada en el F12: ${pad(t.getHours())}:${pad(t.getMinutes())}.`;
        go.textContent = 'Nueva inspección';
        go.disabled = false;
        Sound.done();
      }, reduce ? 50 : 1500);
    });
    check(false);

    $('#transporteTxt').textContent = C.transporte;
  }

  /* =======================================================================
     Ventana modal y formatos de registro
     ======================================================================= */
  const Modal = (() => {
    const m = $('#modal'), k = $('#modalKicker'), t = $('#modalTitle'), b = $('#modalBody'), foot = $('#modalFoot');
    let last = null;
    function open({ kicker, title, body, back }) {
      const wasOpen = !m.hidden;
      if (!wasOpen) last = document.activeElement;
      k.textContent = kicker;
      t.textContent = title;
      b.innerHTML = `<div class="${wasOpen ? 'fade-in' : ''}">${body}</div>`;
      b.scrollTop = 0;
      foot.innerHTML = (back ? '<button class="btn ghost sm" data-back>← Todos los formatos</button>' : '') + '<button class="btn ghost sm" data-close>Cerrar</button>';
      m.classList.remove('closing');
      m.hidden = false;
      document.body.style.overflow = 'hidden';
      if (!wasOpen) Sound.whoosh();
      setTimeout(() => { const c = $('.modal-head [data-close]', m); if (c) c.focus(); }, 40);
    }
    function close() {
      if (m.hidden) return;
      m.classList.add('closing');
      setTimeout(() => {
        m.hidden = true;
        m.classList.remove('closing');
        document.body.style.overflow = '';
        if (last && last.focus) last.focus({ preventScroll: true });
      }, reduce ? 0 : 230);
    }
    m.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) close();
      else if (e.target.closest('[data-back]')) openFormats();
      else { const f = e.target.closest('[data-fmt]'); if (f) openFormat(f.dataset.fmt); }
    });
    m.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, a[href], input, select, [tabindex]:not([tabindex="-1"])', m).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
    return { open, close, get isOpen() { return !m.hidden; } };
  })();

  function openFormats() {
    const rows = C.formatos.map((f) => `
      <div class="fmt-row">
        <span class="fmt-code">ADX-${f.cod}</span>
        <span class="fmt-name">${f.nombre}</span>
        <span class="muted">${f.frec}</span>
        <span class="muted">${f.resp}</span>
        <span>${f.ejemplo ? `<button class="btn ghost xs" data-fmt="${f.cod}">Ver formato</button>` : ''}</span>
      </div>`).join('');
    Modal.open({
      kicker: 'ADEX Sweets & Pink · Registros del plan BPM',
      title: 'Los 14 formatos de registro',
      body: `<div class="fmt-list"><div class="fmt-row head"><span>Código</span><span>Formato</span><span>Frecuencia</span><span>Responsable</span><span></span></div>${rows}</div>`
    });
  }
  function openFormat(cod) {
    const f = C.formatos.find((x) => x.cod === cod);
    const ex = f.ejemplo;
    Modal.open({
      kicker: `ADEX Sweets & Pink · ADX-${f.cod} · Versión 1 · ${f.resp}`,
      title: f.nombre,
      back: true,
      body: `<div class="tbl-wrap"><table class="tbl">
          <thead><tr>${ex.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${ex.filas.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
          <tr>${ex.cols.map(() => '<td class="empty"></td>').join('')}</tr></tbody>
        </table></div>
        <p class="fmt-note">Filas con datos de ejemplo para mostrar cómo se diligencia.</p>`
    });
  }

  /* =======================================================================
     09 · Cierre y anexos
     ======================================================================= */
  function initCierre() {
    $('#summary').innerHTML = C.resumen.map((r, i) => `
      <article class="card rv" style="--d:${i * 110}ms">
        <div class="sum-n"><span class="chip norm">${r.tag}</span><span>${pad(i + 1)}</span></div>
        <h3>${r.titulo}</h3><p>${r.texto}</p>
      </article>`).join('');
    $('#btnFormats').addEventListener('click', openFormats);
    const thanks = $('.thanks-big');
    thanks.style.cursor = 'pointer';
    thanks.addEventListener('click', () => { burst(thanks); Sound.win(); });
  }

  function initAnexos() {
    const tabs = initTabs($('#anxTabs'));
    $('#toQuestions').addEventListener('click', () => tabs.select('preguntas'));

    // Preguntas que se voltean
    const flips = $('#flips');
    flips.innerHTML = C.preguntas.map(([q, a], i) => `
      <button class="flip" aria-pressed="false" data-quiet>
        <span class="flip-in">
          <span class="flip-face front"><span class="kicker">Pregunta ${i + 1}</span><span class="flip-q">${q}</span><span class="flip-hint">Toca para ver la respuesta</span></span>
          <span class="flip-face back"><span class="kicker">Respuesta</span><span class="flip-a">${a}</span></span>
        </span>
      </button>`).join('');
    flips.addEventListener('click', (e) => {
      const b = e.target.closest('.flip');
      if (!b) return;
      const on = !b.classList.contains('on');
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      Sound.flip();
    });

    // Lista de verificación (se guarda en este navegador)
    const list = $('#ckList'), pct = $('#ckPct'), bar = $('#ckBar');
    let saved = {};
    try { saved = JSON.parse(store.get('adex-check', '{}')) || {}; } catch (e) { saved = {}; }
    let idx = 0;
    list.innerHTML = C.checklist.map((g) => `
      <div class="ck-group"><p class="kicker">${g.grupo}</p>
        <ul class="checks">${g.items.map(([t, n]) => {
          const id = 'k' + idx++;
          return `<li><label class="check"><input type="checkbox" data-id="${id}" ${saved[id] ? 'checked' : ''}><span class="box"></span><span class="ck-t">${t}</span><span class="chip xs ck-norm">${n}</span></label></li>`;
        }).join('')}</ul>
      </div>`).join('');
    const boxes = $$('input', list);
    let reached = false;
    function upd(sound) {
      const n = boxes.filter((b) => b.checked).length;
      const p = Math.round((n / boxes.length) * 100);
      pct.textContent = p;
      bar.style.width = p + '%';
      bar.classList.toggle('goal', p >= 90);
      const s = {};
      boxes.forEach((b) => { if (b.checked) s[b.dataset.id] = 1; });
      store.set('adex-check', JSON.stringify(s));
      if (sound) { if (p >= 90 && !reached) { Sound.win(); burst(bar); } else Sound.tick(); }
      reached = p >= 90;
    }
    list.addEventListener('change', () => upd(true));
    $('#ckReset').addEventListener('click', () => { boxes.forEach((b) => { b.checked = false; }); upd(false); });
    upd(false);

    // Cronograma de 8 semanas
    const g = $('#gantt');
    let h = '<div class="g-h">Actividad</div>' + Array.from({ length: 8 }, (_, i) => `<div class="g-h">S${i + 1}</div>`).join('');
    C.gantt.forEach((r, i) => {
      const one = r.de === r.a;
      h += `<div class="g-act">${r.act}</div><div class="g-bar${one ? ' ms' : ''}" style="grid-column:${r.de + 1} / ${r.a + 2};--d:${i * 110}ms">${one ? 'S' + r.de : `S${r.de} – S${r.a}`}</div>`;
    });
    g.innerHTML = h;
    if ('IntersectionObserver' in window && !reduce) {
      const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { g.classList.add('in'); io.disconnect(); } }, { threshold: 0.2 });
      io.observe(g);
    } else g.classList.add('in');

    $('#refs').textContent = C.referencias;
  }

  /* =======================================================================
     Cronómetro de exposición (20 minutos)
     ======================================================================= */
  const Timer = (() => {
    const el = $('#timer'), tt = $('#timerTime'), now = $('#timerNow'), ring = $('#timerRing');
    const TOTAL = 20 * 60, CIRC = 2 * Math.PI * 15;
    ring.style.strokeDasharray = CIRC;
    ring.style.strokeDashoffset = CIRC;
    el.dataset.quiet = '';
    let running = false, t0 = 0, iv = 0, lastSeg = null, warned = false, overed = false;
    const mmss = (s) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;

    function tick() {
      const sec = (Date.now() - t0) / 1000, rem = TOTAL - sec;
      tt.textContent = rem >= 0 ? mmss(Math.ceil(rem)) : '+' + mmss(-rem);
      const min = sec / 60;
      let i = C.agenda.findIndex((a) => min >= a.desde && min < a.hasta);
      if (i < 0) i = C.agenda.length - 1;
      const cur = C.agenda[i], nx = C.agenda[i + 1];
      now.textContent = rem < 0
        ? `Tiempo extra · ${cur.nombre}`
        : nx ? `Ahora: ${cur.nombre} · sigue ${nx.nombre} en el min ${nx.desde}` : `Ahora: ${cur.nombre} · termina en el min 20`;
      ring.style.strokeDashoffset = CIRC * (1 - Math.min(1, sec / TOTAL));
      el.classList.toggle('warn', rem <= 120 && rem > 0);
      el.classList.toggle('over', rem <= 0);
      if (lastSeg !== i) {
        if (lastSeg !== null) Sound.chime();
        $$('#navLinks a').forEach((a) => a.classList.toggle('now', a.hash === '#' + cur.id));
        lastSeg = i;
      }
      if (rem <= 120 && !warned) { warned = true; Sound.alert(); }
      if (rem <= 0 && !overed) { overed = true; Sound.alert(); setTimeout(Sound.alert, 500); }
    }
    function start() {
      running = true;
      t0 = Date.now();
      lastSeg = null; warned = false; overed = false;
      el.classList.add('run');
      el.setAttribute('aria-label', 'Detener cronómetro');
      tick();
      iv = setInterval(tick, 250);
      Sound.ok();
    }
    function stop() {
      running = false;
      clearInterval(iv);
      el.classList.remove('run', 'warn', 'over');
      el.removeAttribute('aria-label');
      tt.textContent = 'Iniciar 20:00';
      now.textContent = '';
      ring.style.strokeDashoffset = CIRC;
      $$('#navLinks a').forEach((a) => a.classList.remove('now'));
      Sound.click();
    }
    el.addEventListener('click', () => (running ? stop() : start()));
    return { start, stop, toggle: () => (running ? stop() : start()), get running() { return running; } };
  })();

  /* =======================================================================
     Atajos de teclado
     ======================================================================= */
  function initKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && Modal.isOpen) { Modal.close(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest('input, select, textarea, [contenteditable]')) return;
      if (Modal.isOpen) return;
      const k = e.key;
      if (/^[1-9]$/.test(k)) { goTo(C.agenda[+k - 1].id); return; }
      if (k === '0') { goTo('inicio'); return; }
      switch (k.toLowerCase()) {
        case 't': Timer.toggle(); break;
        case 'm': $('#btnSound').click(); break;
        case 'd': toggleTheme(); break;
        case 'arrowright': if (state.section === 'proceso') { e.preventDefault(); Proc.next(); } break;
        case 'arrowleft': if (state.section === 'proceso') { e.preventDefault(); Proc.prev(); } break;
      }
    });
  }

  /* ---------- Cajones "ver más" ---------- */
  function initDrawers() {
    $$('.drawer').forEach((d) => {
      const b = $('.drawer-btn', d);
      b.dataset.quiet = '';
      b.addEventListener('click', () => {
        const open = d.classList.toggle('open');
        b.setAttribute('aria-expanded', open);
        Sound.whoosh();
      });
    });
  }

  /* ---------- Arranque ---------- */
  initMarquees();
  splitTitles();
  initToggles();
  initHero();
  initEmpresa();
  initPlan();
  initProceso();
  initRecepcion();
  initPersonal();
  initSaneamiento();
  initMicro();
  initSalida();
  initCierre();
  initAnexos();
  initDrawers();
  initKeys();
  initNav();
  initFx();
  splash(initReveal);
})();
