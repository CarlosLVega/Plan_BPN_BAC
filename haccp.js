/* =========================================================================
   ADEX · Plan HACCP del ponqué de vainilla — panel derecho
   1) Dibuja el contenido de datos-haccp.js (window.HCFG) en #haccpRoot.
   2) Maneja el deslizamiento entre los dos paneles (BPM ⟷ HACCP).
   3) Cuando app.js termina (evento adex:ready) activa cada módulo interactivo
      usando los mismos sonidos, efectos y ventana modal del plan BPM.
   ========================================================================= */
(() => {
  'use strict';

  const H = window.HCFG;
  const CB = window.CFG || {};
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, '0');
  const fix = (n, d = 1) => Number(n).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = () => window.ADEX || null;
  const snd = (name, ...args) => { const a = A(); if (a && a.Sound && a.Sound[name]) a.Sound[name](...args); };

  /* ---------- Iconos (mismo trazo que los del plan BPM) ---------- */
  const HIC = {
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.2l8.5 4.6"/>',
    cake: '<path d="M4 20.5h16M5 20.5V13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7.5M5 15.2c1.4 1.1 2.9 1.1 4.3 0s2.9-1.1 4.3 0 2.9 1.1 4.4 0M12 11V7.5"/><path d="M12 3.5c.9.9.9 2.1 0 3-.9-.9-.9-2.1 0-3z"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 6.5a1.5 1.5 0 0 1 3 0V12M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.6 15.6a1.6 1.6 0 0 1 2.4-2.1L8 14.5"/>',
    drop: '<path d="M12 3.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/><path d="M9.4 15a2.7 2.7 0 0 0 2.6 2.6"/>',
    air: '<path d="M3 8h10.5a2.5 2.5 0 1 0-2.5-2.5M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5M3 16h7"/>',
    microbe: '<circle cx="12" cy="12" r="5"/><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M5.6 18.4l2.5-2.5M15.9 8.1l2.5-2.5"/>',
    flask: '<path d="M9.5 3.5h5M10 3.5v6L4.8 18.3A1.5 1.5 0 0 0 6.1 20.5h11.8a1.5 1.5 0 0 0 1.3-2.2L14 9.5v-6M7.4 14.5h9.2"/>',
    shard: '<path d="M3.5 19l5-13 3.2 6.5 2.8-3.5 6 10z"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.3 2.3 4.3-4.6"/>',
    radar: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6-6"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4"/><circle cx="12" cy="12" r="2"/>',
    tap: '<path d="M9 11V5a1.5 1.5 0 0 1 3 0v5.5M12 9.5a1.5 1.5 0 0 1 3 0v1.5M15 10a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-5-2.7L4.4 15.3a1.5 1.5 0 0 1 2.3-1.9L9 15.5"/>',
    doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20zM14 3.5v4h4M9.5 12h6M9.5 15.5h6"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    bin: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 10.5v6.5M14 10.5v6.5"/>',
    truck: '<path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.6M17.5 13.6a5.5 5.5 0 0 1 3 5.4"/>',
    alert: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.5M12 17h.01"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    baby: '<path d="M10 3.5h4M10.5 3.5v3l-2 2.5v10a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5V9l-2-2.5v-3M8.5 12h7M8.5 15.5h7"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    sieve: '<path d="M3.5 9.5h17M4.5 9.5a7.5 7.5 0 0 0 15 0M8 12.5h8M9 15h6M9.5 9.5v6M14.5 9.5v6M12 9.5v7.5M20.5 9.5l2-1.5"/>',
    thermo: '<path d="M10 14.8V5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0z"/><circle cx="8" cy="8" r="1.6"/>',
    rocket: '<path d="M12 3c3.5 2.2 5 5.8 4.5 10.5l-2 2.5h-5l-2-2.5C7 8.8 8.5 5.2 12 3z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M7.5 13.5L5 16.5l3 .5M16.5 13.5l2.5 3-3 .5M10.5 18.5L12 21l1.5-2.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    archive: '<rect x="3.5" y="4" width="17" height="4.5" rx="1"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 12.5h4"/>',
    oven: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 8.5h17M7 6.2h.01M10 6.2h.01"/><rect x="7" y="11.5" width="10" height="5.5" rx="1"/>',
    snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    cap: '<path d="M2.5 9L12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3v-5M21.5 9v5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    question: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.7M12 16.8h.01"/>',
    bag: '<path d="M5.5 8h13l-1 12.5h-11zM9 8V6.5a3 3 0 0 1 6 0V8"/>',
    tree: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M12 7v3M12 10H6v7M12 10h6"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
    reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4"/>'
  };
  const ic = (name, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true">${(HIC[name] || '').replace(/<(path|circle|rect)(?![^>]*fill=)/g, '<$1 class="stroke"')}</svg>`;
  const TIPO = { B: 'Biológico', Q: 'Químico', F: 'Físico' };
  const TIPO_IC = { B: 'microbe', Q: 'flask', F: 'shard' };
  const minOf = (id) => { const a = H.agenda.find((x) => x.id === id); return a ? `${a.desde}–${a.hasta}` : ''; };

  /* =======================================================================
     1 · Marcado del panel HACCP
     ======================================================================= */
  function head(id, num, norm, title, sub) {
    return `<header class="sec-head rv">
      <div class="sec-meta"><span class="sec-num">${num}</span><span class="chip">Min ${minOf(id)}</span>${norm ? `<span class="chip norm">${norm}</span>` : ''}</div>
      <h2 class="sec-title">${title}</h2>${sub ? `<p class="sec-sub">${sub}</p>` : ''}
    </header>`;
  }
  const drawer = (title, inner) => `<div class="drawer rv"><button class="drawer-btn" aria-expanded="false"><span>${title}</span><span class="drawer-ic" aria-hidden="true"></span></button><div class="drawer-body"><div class="drawer-inner">${inner}</div></div></div>`;
  const table = (cols, rows, cls = '') => `<div class="tbl-wrap"><table class="tbl ${cls}"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  function rHero() {
    const R = 170;
    const nodes = H.pasos.map((p, i) => {
      const a = (-90 + i * 30) * Math.PI / 180;
      const x = (200 + Math.cos(a) * R).toFixed(1), y = (200 + Math.sin(a) * R).toFixed(1);
      return `<g class="hd-node ${p.n <= 5 ? 'pre' : 'pri'}" data-step="${p.n}" tabindex="0" role="button" aria-label="Paso ${p.n}: ${p.nombre}" style="--i:${i}">
        <circle cx="${x}" cy="${y}" r="16" class="hd-halo"/><circle cx="${x}" cy="${y}" r="15" class="hd-c"/><text x="${x}" y="${y}">${p.n}</text><title>Paso ${p.n} · ${p.nombre}</title></g>`;
    }).join('');
    const arc = (a0, a1, r) => {
      const p0 = [200 + Math.cos(a0 * Math.PI / 180) * r, 200 + Math.sin(a0 * Math.PI / 180) * r];
      const p1 = [200 + Math.cos(a1 * Math.PI / 180) * r, 200 + Math.sin(a1 * Math.PI / 180) * r];
      return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
    };
    return `
<section id="h-inicio" class="hero h-hero">
  <div class="blobs h-blobs" aria-hidden="true"><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i><i class="blob b4"></i></div>
  <div class="hero-grid wrap">
    <div class="hero-copy">
      <p class="eyebrow rv">Unidad 6 · Sistema HACCP y de gestión de la inocuidad · Complemento del Plan BPM (Res. 2674 de 2013)</p>
      <h1 class="hero-title rv" style="--d:80ms">Plan HACCP del <em>ponqué de vainilla</em></h1>
      <p class="hero-lead rv" style="--d:160ms">Análisis de Peligros y Puntos Críticos de Control para la línea de ponqué de vainilla de ADEX Sweets &amp; Pink: los 12 pasos del Codex Alimentarius y sus siete principios, aterrizados a cada lote.</p>
      <div class="hero-cta rv" style="--d:240ms">
        <button class="btn primary" id="hStart" data-quiet>
          <svg viewBox="0 0 24 24" class="ic"><circle cx="12" cy="13.5" r="7.5" class="stroke"/><path class="stroke" d="M12 13.5V9.5M9.5 2.5h5"/></svg>
          Iniciar exposición
        </button>
        <a class="btn ghost" href="#h-objetivos">Recorrer el plan <span aria-hidden="true">↓</span></a>
      </div>
      <dl class="hero-meta rv" style="--d:320ms">
        <div><dt>Integrantes</dt><dd>${H.integrantes.join('<br>')}</dd></div>
        <div><dt>Programa</dt><dd>Bacteriología y Laboratorio Clínico, UDES</dd></div>
        <div><dt>Entrega</dt><dd>Semana 13 · 2026</dd></div>
      </dl>
    </div>
    <div class="hero-art h-art rv" style="--d:200ms">
      <svg viewBox="0 0 400 400" class="h-dial" aria-label="Los 12 pasos del HACCP alrededor del logo">
        <defs>
          <radialGradient id="hDishGlow" cx=".5" cy=".45" r=".6"><stop offset="0" class="dg-0"/><stop offset="1" class="dg-1"/></radialGradient>
          <clipPath id="hLogoClip"><circle cx="200" cy="200" r="122"/></clipPath>
        </defs>
        <circle cx="200" cy="200" r="196" class="hd-dish"/>
        <circle cx="200" cy="200" r="196" class="dish-rim"/>
        <g class="dial"><circle cx="200" cy="200" r="140" class="dish-dash"/></g>
        <path d="${arc(-90, 30, R)}" class="hd-arc pre"/>
        <path d="${arc(60, 240, R)}" class="hd-arc pri"/>
        <g class="cake-float">
          <circle cx="200" cy="205" r="122" class="logo-shadow"/>
          <image href="logo.webp" x="78" y="78" width="244" height="244" clip-path="url(#hLogoClip)" preserveAspectRatio="xMidYMid slice"/>
          <circle cx="200" cy="200" r="122" class="logo-rim"/>
        </g>
        <g class="hd-nodes">${nodes}</g>
      </svg>
      <span class="h-float f1"><b>PCC 1</b> Tamizado</span>
      <span class="h-float f2"><b>PCC 2</b> Horneo</span>
      <span class="h-float f3"><b>PCC 3</b> Enfriamiento</span>
      <span class="h-float f4"><b>PCC 4</b> Rotulado</span>
    </div>
  </div>
  <div class="wrap"><div class="stats" id="hStats">${H.indicadores.map((s, i) => `
    <div class="stat rv" style="--d:${380 + i * 90}ms"><div class="stat-n"><span data-hcount="${s.n}">0</span></div><div class="stat-t">${s.texto}</div></div>`).join('')}</div></div>
</section>
<div class="marquee" aria-hidden="true" data-words="Análisis de peligros|Puntos críticos de control|Límites críticos|Monitoreo|Acciones correctivas|Verificación|Registros|Codex Alimentarius"></div>`;
  }

  function rObjetivos() {
    const v = H.vacio;
    return `
<section id="h-objetivos" class="sec">
  <div class="wrap">
    ${head('h-objetivos', '01', 'Codex Alimentarius', 'Del plan BPM al plan HACCP', 'El plan BPM es la base. El HACCP encuentra las etapas donde un error puede volver peligroso el ponqué y dice qué hacer cuando eso ocurre.')}
    <div class="gap3">
      <article class="card gap-card ok rv"><span class="gap-ic">${ic('shield')}</span><p class="kicker">Lo que ya existe · Plan BPM</p><p>${v.bpm}</p></article>
      <span class="gap-arrow rv" aria-hidden="true">→</span>
      <article class="card gap-card warn rv" style="--d:100ms"><span class="gap-ic">${ic('question')}</span><p class="kicker">El vacío</p><p>${v.falta}</p></article>
      <span class="gap-arrow rv" aria-hidden="true">→</span>
      <article class="card gap-card hot rv" style="--d:200ms"><span class="gap-ic">${ic('target')}</span><p class="kicker">Lo que agrega · Plan HACCP</p><p>${v.haccp}</p></article>
    </div>
    <div class="grid-2 obj-grid">
      <article class="card obj-gen rv">
        <p class="kicker">Objetivo general</p>
        <p class="big-text">${H.objetivoGeneral}</p>
        <div class="obj-tags"><span class="chip norm">12 pasos</span><span class="chip norm">7 principios</span><span class="chip ok">Integrado con BPM</span></div>
      </article>
      <article class="card rv" style="--d:100ms">
        <div class="card-head"><p class="kicker">Objetivos específicos</p><span class="chip" id="objCount">0 de ${H.objetivos.length}</span></div>
        <p class="muted small">Toca cada objetivo para marcarlo; la flecha lleva a donde se cumple.</p>
        <ol class="obj-list" id="objList">${H.objetivos.map((o, i) => `
          <li class="obj" data-i="${i}">
            <button class="obj-main" data-quiet aria-pressed="false"><span class="obj-n">${i + 1}</span><span class="obj-t">${o.t}</span></button>
            <a class="obj-go" href="#${o.ir}" title="Ir a ${o.donde}">${o.donde} <span aria-hidden="true">→</span></a>
          </li>`).join('')}</ol>
      </article>
    </div>
  </div>
</section>`;
  }

  function rMarco() {
    const C = H.calidad;
    return `
<section id="h-marco" class="sec alt">
  <div class="wrap">
    ${head('h-marco', '02', 'Unidad 6', 'Marco conceptual aplicado a ADEX', 'Prerrequisitos, historia, calidad frente a inocuidad, ruta del sistema de gestión, FSMA y GFSI.')}
    <div class="tabset rv" id="hMarcoTabs">
      <div class="tabs" role="tablist" aria-label="Marco conceptual">
        <button role="tab" aria-selected="true" data-tab="ppr"><span class="tab-n">1</span>Prerrequisitos</button>
        <button role="tab" aria-selected="false" data-tab="historia"><span class="tab-n">2</span>Historia</button>
        <button role="tab" aria-selected="false" data-tab="calidad"><span class="tab-n">3</span>Calidad e inocuidad</button>
        <button role="tab" aria-selected="false" data-tab="ruta"><span class="tab-n">4</span>Ruta SGIA</button>
        <button role="tab" aria-selected="false" data-tab="normas"><span class="tab-n">5</span>FSMA y GFSI</button>
        <span class="tab-ink" aria-hidden="true"></span>
      </div>

      <div class="tab-panel active" role="tabpanel" data-panel="ppr">
        <p class="lead-sm">${H.pprIntro}</p>
        <div class="ppr card">
          <div class="house" id="house">
            <button class="roof" id="roof" data-quiet><span class="roof-k">Plan HACCP</span><span class="roof-t">4 PCC</span></button>
            <div class="bricks" id="bricks">${H.ppr.map((b, i) => `
              <button class="brick" data-i="${i}" data-quiet style="--k:${i}"><span class="brick-ic">${ic(b.ic)}</span><span class="brick-t">${b.p}</span><span class="brick-r mono">${b.reg}</span></button>`).join('')}
            </div>
            <div class="ground">Programas prerrequisito · BPM, Res. 2674 de 2013</div>
          </div>
          <div class="ppr-side">
            <button class="toggle" id="tgNoPpr" aria-pressed="false" data-quiet><span class="tg-dot"></span>Simular sin prerrequisitos</button>
            <div class="ppr-panel" id="pprPanel" aria-live="polite"></div>
          </div>
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="historia">
        <div class="tl card">
          <p class="kicker">Del espacio a la planta de ADEX · toca un año</p>
          <div class="tl-scroll"><div class="tl-track" id="tlTrack">
            <div class="tl-line"><i class="tl-fill" id="tlFill"></i></div>
            ${H.historia.map((h, i) => `<button class="tl-dot" data-i="${i}" data-quiet style="--x:${(i / (H.historia.length - 1)) * 100}%"><i></i><span>${h.anio}</span></button>`).join('')}
            <span class="tl-rocket" id="tlRocket" aria-hidden="true">${ic('rocket')}</span>
          </div></div>
          <div class="tl-card" id="tlCard" aria-live="polite"></div>
          <div class="tl-nav"><button class="btn ghost sm" id="tlPrev" data-quiet>← Anterior</button><button class="btn primary sm" id="tlNext" data-quiet>Siguiente →</button></div>
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="calidad">
        <div class="qi-grid">
          <div class="stack">
            <article class="card qi-def inoc"><p class="kicker">Inocuidad</p><p class="big-text">${C.inocuidad}</p></article>
            <article class="card qi-def cal"><p class="kicker">Calidad</p><p class="big-text">${C.calidad}</p></article>
            <p class="callout">${C.regla}</p>
          </div>
          <div class="qi-game" id="qiGame"></div>
        </div>
        <div class="drawer"><button class="drawer-btn" aria-expanded="false"><span>Tabla comparativa: calidad frente a inocuidad</span><span class="drawer-ic" aria-hidden="true"></span></button><div class="drawer-body"><div class="drawer-inner">
          ${table(['Aspecto', 'Calidad', 'Inocuidad'], C.tabla.map((r) => [`<b>${r[0]}</b>`, r[1], r[2]]))}
        </div></div></div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="ruta">
        <p class="lead-sm">${H.rutaIntro}</p>
        <div class="stairs card">
          <div class="stair-row" id="stairs">${H.ruta.map((r, i) => `
            <button class="stair${r.aqui ? ' here' : ''}" data-i="${i}" data-quiet style="--h:${36 + i * 20}%; --k:${i}">
              ${r.aqui ? `<span class="pin"><span>ADEX está aquí</span></span>` : ''}
              <span class="stair-n">${i + 1}</span><span class="stair-t">${r.etapa}</span>
            </button>`).join('')}</div>
          <div class="stair-panel" id="stairPanel" aria-live="polite"></div>
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="normas">
        <div class="grid-2 normas">${H.normas.map((n) => `
          <article class="card norma">
            <p class="kicker">${n.kicker}</p>
            <h3 class="norma-t">${n.titulo}</h3><p class="norma-s">${n.sub}</p>
            <p>${n.texto}</p>
            <div class="norma-k">${n.claves.map((k) => `<span class="chip">${k}</span>`).join('')}</div>
            <div class="callout"><b>Relevancia para ADEX.</b> ${n.adex}</div>
          </article>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  function rPasos() {
    const ph = H.phNota;
    return `
<section id="h-pasos" class="sec">
  <div class="wrap">
    ${head('h-pasos', '03', 'Pasos 1 a 3', 'Los 12 pasos del HACCP', 'Cinco pasos preliminares preparan el terreno y los siete restantes son los principios del sistema. Toca un paso para ir a él.')}
    <div class="steps12 rv" id="steps12">${H.pasos.map((p, i) => `
      <button class="st12 ${p.n <= 5 ? 'pre' : 'pri'}" data-i="${i}" data-quiet style="--k:${i}">
        <span class="st12-n">${pad(p.n)}</span><span class="st12-t">${p.nombre}</span><span class="st12-k">${p.tipo}</span>
      </button>`).join('')}</div>
    <ul class="legend st12-legend rv"><li><i class="sq pre"></i>Pasos preliminares</li><li><i class="sq pri"></i>Siete principios</li></ul>

    <div class="tabset rv" id="hPasoTabs">
      <div class="tabs" role="tablist" aria-label="Pasos preliminares">
        <button role="tab" aria-selected="true" data-tab="equipo"><span class="tab-n">1</span>Equipo HACCP</button>
        <button role="tab" aria-selected="false" data-tab="producto"><span class="tab-n">2</span>Descripción del producto</button>
        <button role="tab" aria-selected="false" data-tab="uso"><span class="tab-n">3</span>Uso previsto</button>
        <span class="tab-ink" aria-hidden="true"></span>
      </div>

      <div class="tab-panel active" role="tabpanel" data-panel="equipo">
        <div class="team-card card">
          <div class="card-head"><p class="kicker">Paso 1 · Equipo multidisciplinario</p><span class="muted small">Toca un integrante</span></div>
          <div class="team" id="team">
            <div class="tm-row r0">${H.equipo.filter((e) => e.nivel === 0).map(teamNode).join('')}</div>
            <div class="tm-row r1">${H.equipo.filter((e) => e.nivel === 1).map(teamNode).join('')}</div>
            <div class="tm-row r2">${H.equipo.filter((e) => e.nivel === 2).map(teamNode).join('')}</div>
          </div>
          <div class="team-panel" id="teamPanel" aria-live="polite"></div>
        </div>
        <div class="team-rules">
          <p class="kicker">Reglas de funcionamiento</p>
          <ol class="chain chain-sm">${H.equipoReglas.map((r) => `<li>${r}</li>`).join('')}</ol>
          <p class="muted">${H.equipoNota}</p>
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="producto">
        <div class="grid-2 prod-grid">
          <article class="card">
            <p class="kicker">Paso 2 · Ficha del producto</p>
            <div class="tbl-wrap"><table class="tbl kv"><tbody>${H.producto.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</tbody></table></div>
            <p class="muted small mt">${H.productoNota}</p>
          </article>
          <article class="card lab-card">
            <p class="kicker">Laboratorio de estabilidad · mueve los controles</p>
            <label class="range aw-range">
              <span class="range-top"><span>Actividad de agua (aw)</span><b class="mono" id="awV">0,84</b></span>
              <span class="gauge" aria-hidden="true">
                <span class="g-band" style="left:${(0.80 - 0.6) / 0.4 * 100}%; width:${(0.08) / 0.4 * 100}%"><i>Ponqué 0,80 – 0,88</i></span>
                <span class="g-mark" style="left:${(0.93 - 0.6) / 0.4 * 100}%"><i>B. cereus ≈ 0,93</i></span>
              </span>
              <input type="range" id="awR" min="0.60" max="1.00" step="0.01" value="0.84">
              <span class="range-scale mono"><span>0,60</span><span>0,80</span><span>1,00</span></span>
            </label>
            <p class="water-msg ok" id="awMsg"></p>
            <div class="ph-box">
              <div class="range-top"><span>pH del ponqué</span><b class="mono">6,8 – 7,8</b></div>
              <div class="ph-bar" aria-hidden="true">
                <span class="ph-acid">Medio ácido · el sorbato actúa mejor</span>
                <span class="ph-band" style="left:${6.8 / 14 * 100}%; width:${1 / 14 * 100}%"></span>
              </div>
              <div class="range-scale mono"><span>0</span><span>7</span><span>14</span></div>
            </div>
          </article>
        </div>
        <div class="drawer"><button class="drawer-btn" aria-expanded="false"><span>${ph.titulo}</span><span class="drawer-ic" aria-hidden="true"></span></button><div class="drawer-body"><div class="drawer-inner">
          <p>${ph.texto}</p><p class="callout">${ph.mientras}</p>
        </div></div></div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="uso">
        <p class="lead-sm">Paso 3 · Un mismo producto puede ser seguro para un adulto sano y riesgoso para un grupo vulnerable. Aquí la elaboración de alimentos se cruza con la salud.</p>
        <div class="uso-grid" id="usoGrid" role="tablist" aria-label="Consumidores">${H.uso.map((u, i) => `
          <button class="sample-btn uso-btn" role="tab" aria-selected="false" data-i="${i}" data-quiet>${ic(u.ic)}<span>${u.t}</span></button>`).join('')}</div>
        <article class="card uso-card" id="usoCard" aria-live="polite"></article>
      </div>
    </div>
  </div>
</section>`;
  }
  function teamNode(e) {
    return `<button class="org-node tm-node${e.nivel === 2 ? ' ext' : ''}" data-id="${e.id}" aria-pressed="false" data-quiet>
      <span class="tm-rol">${e.rol}</span><span class="org-cargo">${e.cargo}</span></button>`;
  }

  function rFlujo() {
    return `
<section id="h-flujo" class="sec alt">
  <div class="wrap">
    ${head('h-flujo', '04', 'Pasos 4 y 5', 'Diagrama de flujo', 'De la recepción al despacho en 11 etapas. Las etapas con borde rosado grueso son los Puntos Críticos de Control; las demás se controlan con los prerrequisitos.')}
    <div class="plan-tools rv">
      <button class="btn primary sm" id="flowPlay" data-quiet>
        <svg viewBox="0 0 24 24" class="ic ic-play"><path d="M8 5.5v13l10.5-6.5z"/></svg>
        <svg viewBox="0 0 24 24" class="ic ic-stop"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></svg>
        <span>Reproducir el flujo</span>
      </button>
      <ul class="legend"><li><i class="lg-pcc"></i>Punto crítico de control</li><li><i class="lg-out"></i>Salida del proceso</li></ul>
    </div>
    <div class="flow-layout">
      <ol class="flow rv" id="flow">${H.flujo.map((f, i) => `
        <li class="fl-step${f.pcc ? ' pcc' : ''}">
          <button class="fnode" data-i="${i}" data-quiet>
            <span class="fn-n">${pad(f.n)}</span>
            <span class="fn-b"><span class="fn-t">${f.etapa}</span><span class="fn-d">${f.det}</span></span>
            ${f.pcc ? `<span class="fn-pcc">PCC ${f.pcc}</span>` : ''}
          </button>
          ${f.salida ? `<span class="fl-out">${f.salida}</span>` : ''}
        </li>`).join('')}</ol>
      <aside class="flow-panel card rv" id="flowPanel" aria-live="polite"></aside>
    </div>

    <article class="insitu card rv" id="h-insitu">
      <div class="insitu-head">
        <div>
          <p class="kicker">Paso 5 · Confirmación in situ · F18</p>
          <h3 class="card-title">Recorrido por la planta</h3>
        </div>
        <div class="insitu-score"><span class="check-pct"><span id="isPct">0</span><small>/${H.insitu.length}</small></span><button class="btn ghost sm" id="isReset" data-quiet>Reiniciar</button></div>
      </div>
      <p class="lead-sm">${H.insituIntro} Marca cada etapa cuando confirmes que coincide con el plano.</p>
      <div class="meter"><div class="meter-fill" id="isBar"></div></div>
      <ul class="checks insitu-list" id="isList">${H.insitu.map((r, i) => `
        <li><label class="check"><input type="checkbox" data-i="${i}"><span class="box"></span>
          <span class="ck-t"><b>${r[0]}</b> <span class="muted">→ ${r[1]}</span><span class="is-obs">${r[2]}</span></span>
          <span class="chip xs ok is-yes">Coincide</span></label></li>`).join('')}</ul>
      <div class="stamp is-stamp" id="isStamp" aria-hidden="true">DIAGRAMA VERIFICADO</div>
    </article>
  </div>
</section>`;
  }

  function rPeligros() {
    return `
<section id="h-peligros" class="sec">
  <div class="wrap">
    ${head('h-peligros', '05', 'Principio 1 · Paso 6', 'Análisis de peligros', H.peligrosIntro)}
    <div class="risk-layout">
      <article class="card risk-card rv">
        <div class="card-head"><p class="kicker">Matriz probabilidad × severidad</p></div>
        <p class="muted small">Toca una casilla para ver los peligros que caen en ella.</p>
        <div class="risk" id="risk"></div>
        <p class="risk-out" id="riskOut" aria-live="polite"></p>
        <ul class="legend"><li><i class="sq nsig"></i>No significativo (&lt; 4)</li><li><i class="sq sig"></i>Significativo (≥ 4)</li></ul>
      </article>
      <article class="card hz-card rv" style="--d:100ms">
        <div class="hz-top">
          <p class="kicker">Peligros por etapa</p>
          <button class="toggle" id="tgSig" aria-pressed="false" data-quiet><span class="tg-dot"></span>Solo significativos</button>
        </div>
        <div class="hz-stages" id="hzStages">${H.peligros.map((s, i) => `
          <button class="hz-stage" data-i="${i}" data-quiet><span class="mono">${pad(i + 1)}</span>${s.etapa}${s.items.some((it) => score(it) >= 4) ? '<i class="hz-sigdot" title="Tiene peligros significativos"></i>' : ''}</button>`).join('')}</div>
        <div class="hz-title" id="hzTitle"></div>
        <div class="hz-list" id="hzList" aria-live="polite"></div>
      </article>
    </div>
    ${drawer('Escala de severidad', `<ul class="ticks">${Object.keys(H.severidad).map((k) => `<li>${H.severidad[k]}</li>`).join('')}</ul>`)}
  </div>
</section>`;
  }
  const PV = { A: 3, M: 2, B: 1 };
  const PL = { A: 'alta', M: 'media', B: 'baja' };
  const score = (it) => PV[it.p] * PV[it.s];

  function rPcc() {
    return `
<section id="h-pcc" class="sec alt">
  <div class="wrap">
    ${head('h-pcc', '06', 'Principio 2 · Paso 7', 'Árbol de decisiones', 'Cada peligro significativo se pasa por las cuatro preguntas del Codex. Elige uno y mira el camino, o resuélvelo tú.')}
    <p class="lead rv">${H.pccIntro}</p>
    <div class="tree-layout rv">
      <div class="cases" id="cases" role="tablist" aria-label="Peligros significativos">${H.casos.map((c, i) => `
        <button class="case" role="tab" aria-selected="false" data-i="${i}" data-quiet>
          <span class="case-t t-${c.t}">${c.t}</span><span class="case-b"><span class="case-e">${c.etapa}</span><span class="case-p">${c.peligro}</span></span>
          ${c.pcc ? `<span class="chip xs case-pcc">PCC ${c.pcc}</span>` : ''}
        </button>`).join('')}</div>
      <article class="card tree-card" id="treeCard">
        <div class="tree-top">
          <div><p class="kicker" id="treeK"></p><h3 class="tree-h" id="treeH"></h3></div>
          <div class="seg" id="treeMode" role="group" aria-label="Modo">
            <button class="on" data-m="ver" data-quiet>Ver solución</button><button data-m="yo" data-quiet>Resolver yo</button>
          </div>
        </div>
        <ol class="tree" id="tree">${H.arbol.map((q, i) => `
          <li class="tq" data-q="${i}">
            <span class="tq-n">P${i + 1}</span>
            <div class="tq-b"><p class="tq-q">${q.q}</p><div class="tq-a"></div></div>
            <span class="tq-exit"></span>
          </li>`).join('')}</ol>
        <div class="verdict" id="verdict" aria-live="polite"></div>
      </article>
    </div>
    <div class="result rv" id="pccResult">
      <div class="res-big"><span class="res-n">4</span><span class="res-t">PCC en<br>11 etapas</span></div>
      <div class="res-dots" aria-hidden="true">${H.flujo.map((f, k) => `<i class="${f.pcc ? 'on' : ''}" style="--k:${k}" title="${f.etapa}${f.pcc ? ' · PCC ' + f.pcc : ''}">${f.n}</i>`).join('')}</div>
      <div class="res-cards">${H.pccs.map((p) => `
        <div class="res-card t-${p.tipo}"><span class="res-ic">${ic(p.ic)}</span><b>PCC ${p.n} · ${p.nombre}</b><span>${TIPO[p.tipo]}: ${p.peligro.toLowerCase()}</span></div>`).join('')}</div>
      <p class="res-note">${H.resultadoNota}</p>
    </div>
  </div>
</section>`;
  }

  function rLimites() {
    const P = H.pccs;
    const dirIc = { down: '↓', up: '↑', neq: '≠', zero: '0' };
    const info = (p) => `
      <article class="card lim-info">
        <p class="kicker">Límite crítico</p>
        <p class="lim-crit">${p.criticoCorto}</p>
        <p class="muted small">${p.critico}</p>
        <div class="lim-row"><div><p class="kicker">Límite operativo</p><p>${p.operativo}</p></div></div>
        <div class="lim-dir"><span class="lim-dir-ic">${dirIc[p.dir]}</span><span>${p.direccion}</span></div>
        <p class="lim-fund"><b>Fundamento.</b> ${p.fundamento}</p>
        <div class="lim-status" data-status></div>
      </article>`;
    return `
<section id="h-limites" class="sec">
  <div class="wrap">
    ${head('h-limites', '07', 'Principio 3 · Paso 8', 'Límites críticos', H.limitesIntro)}
    <div class="tabset rv" id="hLimTabs">
      <div class="tabs" role="tablist" aria-label="Puntos críticos de control">
        ${P.map((p, i) => `<button role="tab" aria-selected="${i === 0}" data-tab="pcc${p.n}"><span class="tab-n">PCC ${p.n}</span>${p.nombre}</button>`).join('')}
        <span class="tab-ink" aria-hidden="true"></span>
      </div>

      <div class="tab-panel active" role="tabpanel" data-panel="pcc1">
        <div class="lim-grid">
          <article class="card sim sim-sieve">
            <div class="card-head"><p class="kicker">Simulador · tamiz de malla fina</p><span class="chip" id="svState">Listo</span></div>
            <svg viewBox="0 0 320 270" class="sieve-svg" id="sieveSvg" aria-hidden="true">
              <defs>
                <pattern id="hMesh" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0H7M0 0V7" class="mesh-l"/></pattern>
                <clipPath id="hSieveClip"><ellipse cx="160" cy="132" rx="118" ry="26"/></clipPath>
              </defs>
              <ellipse cx="160" cy="240" rx="96" ry="16" class="bowl-in"/>
              <path d="M64 236 Q70 266 160 266 Q250 266 256 236" class="bowl"/>
              <ellipse cx="160" cy="236" rx="96" ry="16" class="bowl-rim"/>
              <ellipse cx="160" cy="132" rx="134" ry="34" class="sieve-glow"/>
              <g clip-path="url(#hSieveClip)"><rect x="40" y="100" width="240" height="70" fill="url(#hMesh)"/></g>
              <path d="M70 128 Q100 92 140 96 Q165 70 190 94 Q228 92 250 128 Q160 140 70 128z" class="heap"/>
              <g class="heap-bits"><circle cx="118" cy="104" r="3"/><circle cx="196" cy="102" r="2.4"/><path d="M150 96 l6 -2 l5 3 l-1 5 l-7 1z"/></g>
              <path d="M188 128 l9 -5 7 6 -3 9 -10 1 -6 -5z" class="hole"/>
              <ellipse cx="160" cy="132" rx="118" ry="26" class="sieve-rim"/>
              <path d="M278 128 L312 116" class="sieve-handle"/>
              <g id="sieveParts"></g>
            </svg>
            <div class="sim-ctrl">
              <button class="btn primary sm" id="svRun" data-quiet>${ic('sieve', 'ic')}Tamizar el lote</button>
              <button class="btn ghost sm" id="svLook" data-quiet>${ic('eye', 'ic')}Inspeccionar a contraluz</button>
              <button class="toggle" id="svBroken" aria-pressed="false" data-quiet><span class="tg-dot"></span>Malla rota</button>
            </div>
            <div class="sv-ret" id="svRet"></div>
          </article>
          ${info(P[0])}
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="pcc2">
        <div class="lim-grid">
          <article class="card sim sim-oven">
            <div class="card-head"><p class="kicker">Simulador · termómetro de punzón</p><span class="chip" id="ovChip"></span></div>
            <svg viewBox="0 0 340 230" class="oven-svg" aria-hidden="true">
              <defs><linearGradient id="hCrust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" id="ovC1"/><stop offset="1" id="ovC2"/></linearGradient></defs>
              <g class="heat" id="ovHeat"><path d="M70 40 q8 -10 0 -20 q-8 -10 0 -20"/><path d="M130 40 q8 -10 0 -20 q-8 -10 0 -20"/><path d="M190 40 q8 -10 0 -20 q-8 -10 0 -20"/></g>
              <path d="M30 196 L44 92 Q48 70 74 66 L196 66 Q222 70 226 92 L240 196 Z" fill="url(#hCrust)" class="loaf"/>
              <path d="M46 186 L57 100 Q60 84 80 82 L190 82 Q210 84 213 100 L224 186 Z" class="crumb" id="ovCrumb"/>
              <g class="crumb-holes" id="ovHoles"><circle cx="90" cy="120" r="3"/><circle cx="120" cy="150" r="2.4"/><circle cx="170" cy="112" r="2.8"/><circle cx="185" cy="160" r="2.2"/><circle cx="105" cy="168" r="2"/><circle cx="150" cy="134" r="2.4"/></g>
              <circle cx="135" cy="136" r="14" class="core" id="ovCore"/>
              <path d="M135 136 L135 20" class="probe"/><rect x="118" y="6" width="34" height="18" rx="5" class="probe-h"/>
              <g transform="translate(150 6)"><rect width="72" height="30" rx="8" class="readout"/><text x="36" y="20" class="readout-t" id="ovRead">96 °C</text></g>
              <g class="thermo" transform="translate(276 18)">
                <rect x="0" y="0" width="26" height="180" rx="13" class="th-bg"/>
                <rect x="5" y="5" width="16" height="170" rx="8" class="th-fill" id="ovFill"/>
                <line x1="-8" x2="34" y1="${(5 + 170 * (1 - (71 - 40) / 60)).toFixed(1)}" y2="${(5 + 170 * (1 - (71 - 40) / 60)).toFixed(1)}" class="th-crit"/>
                <line x1="-8" x2="34" y1="${(5 + 170 * (1 - (93 - 40) / 60)).toFixed(1)}" y2="${(5 + 170 * (1 - (93 - 40) / 60)).toFixed(1)}" class="th-op"/>
                <text x="-12" y="${(9 + 170 * (1 - (71 - 40) / 60)).toFixed(1)}" class="th-lbl crit" text-anchor="end">71</text>
                <text x="-12" y="${(9 + 170 * (1 - (93 - 40) / 60)).toFixed(1)}" class="th-lbl op" text-anchor="end">93</text>
              </g>
            </svg>
            <label class="range">
              <span class="range-top"><span>Temperatura en el centro del ponqué</span><b class="mono" id="ovV">96 °C</b></span>
              <input type="range" id="ovR" min="40" max="100" step="1" value="96" style="--lo:${(71 - 40) / 60 * 100}%;--hi:100%">
              <span class="range-scale mono"><span>40 °C</span><span>Crítico 71 · operativo 93</span><span>100 °C</span></span>
            </label>
          </article>
          ${info(P[1])}
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="pcc3">
        <div class="lim-grid">
          <article class="card sim sim-cool">
            <div class="card-head"><p class="kicker">Simulador · área de enfriamiento</p><span class="chip" id="clClock">${ic('clock', 'ic')}<span id="clClockT">1 h 45 min</span></span></div>
            <svg viewBox="0 0 340 200" class="cool-svg" id="coolSvg" aria-hidden="true">
              <g class="spores" id="clSpores">${Array.from({ length: 14 }, (_, i) => `<circle cx="${30 + (i * 23) % 290}" cy="${10 + (i * 37) % 60}" r="${1.6 + (i % 3) * 0.6}" style="--k:${i}"/>`).join('')}</g>
              <g class="steam" id="clSteam"><path d="M120 92 q8 -12 0 -24 q-8 -12 0 -24"/><path d="M170 88 q8 -12 0 -24 q-8 -12 0 -24"/><path d="M220 92 q8 -12 0 -24 q-8 -12 0 -24"/></g>
              <path d="M76 160 L86 104 Q90 92 104 92 L236 92 Q250 92 254 104 L264 160 Z" class="loaf2"/>
              <path d="M60 168 H280" class="rack"/><path d="M70 168 v20 M270 168 v20" class="rack"/>
              <path d="M54 166 Q54 52 170 52 Q286 52 286 166" class="dome" id="clDome"/>
              <g class="drops" id="clDrops">${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${80 + i * 20}" cy="${72 + (i % 3) * 8}" rx="2.4" ry="3.4"/>`).join('')}</g>
            </svg>
            <label class="range">
              <span class="range-top"><span>Temperatura interna</span><b class="mono" id="clTV">28 °C</b></span>
              <input type="range" id="clT" min="20" max="60" step="1" value="28" style="--lo:0%;--hi:${(30 - 20) / 40 * 100}%">
              <span class="range-scale mono"><span>20 °C</span><span>Límite ≤ 30 °C</span><span>60 °C</span></span>
            </label>
            <label class="range">
              <span class="range-top"><span>Tiempo desde la salida del horno</span><b class="mono" id="clHV">1,75 h</b></span>
              <input type="range" id="clH" min="0" max="5" step="0.25" value="1.75" style="--lo:0%;--hi:${3 / 5 * 100}%">
              <span class="range-scale mono"><span>0 h</span><span>Límite ≤ 3 h · operativo 1,5–2 h</span><span>5 h</span></span>
            </label>
            <button class="toggle on" id="clCover" aria-pressed="true" data-quiet><span class="tg-dot"></span>Producto cubierto en área cerrada</button>
          </article>
          ${info(P[2])}
        </div>
      </div>

      <div class="tab-panel" role="tabpanel" data-panel="pcc4">
        <div class="lim-grid">
          <article class="card sim sim-label">
            <div class="card-head"><p class="kicker">Revisión del 100 % · ¿la dejarías salir?</p><span class="chip" id="lbScore">0 / 0</span></div>
            <div class="master"><span class="kicker">Etiqueta maestra</span><span class="chip xs ok">Gluten, huevo y leche</span><span class="chip xs ok">Lote</span><span class="chip xs ok">Vence = elaboración + 5 días</span><span class="chip xs ok">Sellado íntegro</span></div>
            <div class="lbg-stage" id="lbgStage"></div>
            <div class="dots lbg-dots" id="lbgDots"></div>
          </article>
          ${info(P[3])}
        </div>
      </div>
    </div>
    ${drawer('Tabla de límites críticos y operativos', table(['PCC', 'Peligro', 'Límite crítico', 'Límite operativo', 'Dirección del riesgo', 'Fundamento'],
      P.map((p) => [`<b>PCC ${p.n}</b><br>${p.nombre}`, `${p.tipo}: ${p.peligro.toLowerCase()}`, p.critico, p.operativo, p.direccion, p.fundamento])))}
  </div>
</section>`;
  }

  function rMonitoreo() {
    const today = new Date();
    const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    return `
<section id="h-monitoreo" class="sec alt">
  <div class="wrap">
    ${head('h-monitoreo', '08', 'Principio 4 · Paso 9', 'Sistema de monitoreo', H.monitoreoIntro)}
    <div class="mon-head rv">
      <div class="seg seg-lg" id="monSeg" role="group" aria-label="Pregunta del monitoreo">
        <button class="on" data-f="que" data-quiet>¿Qué?</button><button data-f="como" data-quiet>¿Cómo?</button><button data-f="cuando" data-quiet>¿Cuándo?</button><button data-f="quien" data-quiet>¿Quién?</button>
      </div>
    </div>
    <div class="mon-grid rv" id="monGrid">${H.pccs.map((p) => `
      <article class="card mon-card t-${p.tipo}">
        <div class="mon-top"><span class="mon-ic">${ic(p.ic)}</span><div><p class="kicker">PCC ${p.n}</p><h3>${p.nombre}</h3></div></div>
        <p class="mon-txt" data-pcc="${p.n}">${p.mon.que}</p>
        <div class="mon-foot"><span class="chip xs">${p.mon.cuando}</span><span class="chip xs norm">${p.mon.reg}</span></div>
      </article>`).join('')}</div>

    <article class="card lote rv" id="lote">
      <div class="card-head"><div><p class="kicker">Práctica · registro F15</p><h3 class="card-title">Monitorea un lote</h3></div><span class="chip mono" id="loteCode">PQ-</span></div>
      <p class="muted">Escribe las mediciones del lote y regístralo. La página revisa cada PCC contra su límite crítico y, si hay una desviación, abre la fila del F16.</p>
      <div class="lote-form">
        <fieldset class="lf-g"><legend>Lote</legend>
          <label class="field"><span>Elaboración</span><input type="date" id="lfFecha" value="${iso}"></label>
          <label class="field"><span>Lote n.º</span><input type="number" id="lfNum" min="1" max="99" value="1"></label>
        </fieldset>
        <fieldset class="lf-g"><legend>PCC 1 · Tamiz</legend>
          <button type="button" class="toggle on" id="lfTa" aria-pressed="true" data-quiet><span class="tg-dot"></span>Malla íntegra antes</button>
          <button type="button" class="toggle on" id="lfTd" aria-pressed="true" data-quiet><span class="tg-dot"></span>Malla íntegra después</button>
        </fieldset>
        <fieldset class="lf-g"><legend>PCC 2 · Horneo</legend>
          <div class="field-row">
            <label class="field"><span>Horno °C</span><input type="number" id="lfHo" value="175"></label>
            <label class="field"><span>Tiempo (min)</span><input type="number" id="lfMin" value="50"></label>
          </div>
          <label class="field"><span>Centro °C</span><input type="number" id="lfCen" value="96"></label>
        </fieldset>
        <fieldset class="lf-g"><legend>PCC 3 · Enfriamiento</legend>
          <div class="field-row">
            <label class="field"><span>Salida del horno</span><input type="time" id="lfSal" value="10:50"></label>
            <label class="field"><span>Empaque</span><input type="time" id="lfEmp" value="12:35"></label>
          </div>
          <label class="field"><span>T° al empacar (°C)</span><input type="number" id="lfTe" value="28"></label>
        </fieldset>
        <fieldset class="lf-g"><legend>PCC 4 · Rotulado</legend>
          <label class="field"><span>Etiquetas correctas (de 20)</span><input type="number" id="lfEt" min="0" max="20" value="20"></label>
          <button type="button" class="toggle on" id="lfSel" aria-pressed="true" data-quiet><span class="tg-dot"></span>Sellado íntegro</button>
        </fieldset>
      </div>
      <div class="lote-actions">
        <button class="btn primary" id="lfAdd" data-quiet>${ic('doc', 'ic')}Registrar en el F15</button>
        <button class="btn ghost sm" id="lfDemo" data-quiet>Cargar los lotes del ejemplo</button>
        <button class="btn ghost sm" id="lfClear" data-quiet>Limpiar</button>
      </div>
      <p class="lote-msg" id="lfMsg" aria-live="polite"></p>
      <div class="lote-out" id="lfOut" hidden>
        <p class="kicker">ADX-F15 · Monitoreo de PCC por lote</p>
        <div class="tbl-wrap"><table class="tbl f15"><thead><tr><th>Lote</th><th>PCC 1 Tamiz</th><th>PCC 2 Horno / centro</th><th>PCC 3 Tiempo / T°</th><th>PCC 4 Etiquetas</th><th>Conforme</th></tr></thead><tbody id="lfRows"></tbody></table></div>
        <div id="lf16" hidden>
          <p class="kicker mt">ADX-F16 · Desviaciones y acciones correctivas</p>
          <div class="tbl-wrap"><table class="tbl f16"><thead><tr><th>Lote</th><th>PCC</th><th>Desviación</th><th>Acción sobre el producto</th><th>Responsable</th></tr></thead><tbody id="lf16Rows"></tbody></table></div>
        </div>
      </div>
    </article>
  </div>
</section>`;
  }

  function rAcciones() {
    const devs = [];
    H.pccs.forEach((p) => p.acciones.forEach((a) => devs.push({ p, a })));
    return `
<section id="h-acciones" class="sec">
  <div class="wrap">
    ${head('h-acciones', '09', 'Principio 5 · Paso 10', 'Acciones correctivas', H.accionesIntro)}
    <p class="kicker rv">Regla general en ADEX</p>
    <ol class="chain rv" aria-label="Regla general ante una desviación">${H.reglaGeneral.map((r, i) => `<li${i === 3 ? ' class="hl"' : ''}>${r}</li>`).join('')}</ol>
    <div class="alts rv"><span class="muted small">Alternativas inmediatas para no parar la planta:</span>${H.alternativas.map((a) => `<span class="chip ok">${a}</span>`).join('')}</div>
    <div class="devs" id="devs">${devs.map(({ p, a }, i) => `
      <article class="card dev rv t-${p.tipo}" style="--d:${(i % 3) * 80}ms" data-i="${i}">
        <div class="dev-top"><span class="chip warn">PCC ${p.n} · ${p.nombre}</span><span class="dev-ic">${ic('alert')}</span></div>
        <h3 class="dev-t">${a.desv}</h3>
        <div class="seg seg-sm" role="group" aria-label="Tipo de acción"><button class="on" data-v="producto" data-quiet>Sobre el producto</button><button data-v="proceso" data-quiet>Sobre la causa</button></div>
        <p class="dev-txt" data-producto="${encodeURIComponent(a.producto)}" data-proceso="${encodeURIComponent(a.proceso)}">${a.producto}</p>
        <div class="dev-foot"><span class="chip xs">${a.resp}</span><span class="chip xs norm">${a.reg}</span></div>
      </article>`).join('')}</div>
    <article class="card escal rv">
      <div class="escal-l">
        <p class="kicker">Regla de escalamiento</p>
        <p class="big-text">${H.escalamiento}</p>
      </div>
      <div class="escal-r">
        <p class="small muted">Desviaciones del mismo PCC este mes</p>
        <div class="counter"><button class="icon-btn" id="esMinus" aria-label="Menos" data-quiet>−</button><span class="counter-n" id="esN">0</span><button class="icon-btn" id="esPlus" aria-label="Más" data-quiet>+</button></div>
        <p class="escal-msg" id="esMsg" aria-live="polite"></p>
      </div>
    </article>
  </div>
</section>`;
  }

  function rVerificacion() {
    const groups = ['Semanal', 'Mensual', 'Semestral', 'Anual'];
    return `
<section id="h-verificacion" class="sec alt">
  <div class="wrap">
    ${head('h-verificacion', '10', 'Principio 6 · Paso 11', 'Verificación y validación', 'Validar es demostrar que el límite sirve. Verificar es demostrar que se cumple.')}
    <div class="vv rv">
      <article class="card vv-card"><p class="kicker">Validación · antes de implementar y cada año</p><p class="big-text">${H.validacionDef}</p></article>
      <span class="vv-neq" aria-hidden="true">≠</span>
      <article class="card vv-card"><p class="kicker">Verificación · durante la operación</p><p class="big-text">${H.verificacionDef}</p></article>
    </div>

    <div class="val-grid">
      <article class="card oven-map rv">
        <div class="card-head"><p class="kicker">${H.validacion[0].t}</p><span class="chip" id="omChip">0 de 9 medidas</span></div>
        <p class="muted small">${H.validacion[0].texto}</p>
        <div class="om-oven"><div class="om-grid" id="omGrid">${H.hornoDemo.map((_, i) => `<button class="om-cell" data-i="${i}" data-quiet><span class="om-pos">${['Arriba', 'Centro', 'Abajo'][Math.floor(i / 3)]} · ${['izq.', 'centro', 'der.'][i % 3]}</span><span class="om-v">—</span></button>`).join('')}</div></div>
        <div class="row"><button class="btn primary sm" id="omAll" data-quiet>Medir todas las posiciones</button><button class="btn ghost sm" id="omReset" data-quiet>Reiniciar</button></div>
        <p class="om-msg" id="omMsg" aria-live="polite"></p>
        <p class="muted small">Valores de ejemplo para la demostración; los reales salen de los tres lotes de validación.</p>
      </article>
      <div class="stack">
        <article class="card rv" style="--d:80ms">
          <p class="kicker">${H.validacion[1].t}</p>
          <p class="muted small">${H.validacion[1].texto}</p>
          <div class="lots" id="lots">${[1, 2, 3].map((n) => `<button class="lot" data-quiet><span class="lot-ic">${ic('check')}</span>Lote ${n}</button>`).join('')}</div>
        </article>
        <article class="card rv" style="--d:140ms">
          <p class="kicker">${H.validacion[2].t}</p>
          <div class="vu" id="vu">
            <div class="vu-line"><i class="vu-fill" id="vuFill"></i></div>
            ${H.vidaUtil.map((d, i) => `<button class="vu-dot${d.dia === 6 ? ' over' : ''}" data-i="${i}" data-quiet style="--x:${d.dia / 6 * 100}%"><i></i><span>${d.t}</span></button>`).join('')}
            <span class="vu-label" style="left:0; width:${5 / 6 * 100}%">Vida útil declarada · 5 días</span>
          </div>
          <p class="vu-txt" id="vuTxt" aria-live="polite"></p>
        </article>
      </div>
    </div>

    <div class="vboard-head rv"><p class="kicker">Actividades de verificación</p><span class="muted small">${H.verificacion.length} actividades organizadas por frecuencia</span></div>
    <div class="vboard rv">${groups.map((g) => {
      const items = H.verificacion.filter((v) => v.frec === g);
      return `<div class="vcol"><div class="vcol-h"><span>${g}</span><span class="chip xs">${items.length}</span></div>${items.map((v) => `
        <div class="vitem"><p>${v.act}</p>${v.nota ? `<p class="vnote">${v.nota}</p>` : ''}<div class="vitem-f"><span class="muted small">${v.resp}</span><span class="chip xs norm">${v.reg}</span></div></div>`).join('')}</div>`;
    }).join('')}</div>

    <div class="grid-2 vrow">
      <article class="card ice rv">
        <div class="ice-l">
          <p class="kicker">Verificación semanal · F17</p>
          <h3 class="card-title">Termómetro en agua con hielo</h3>
          <p class="muted">Debe marcar <b>0 °C ± 1 °C</b>. Si no, no se usa para monitorear hasta calibrarlo.</p>
          <button class="btn primary sm" id="iceGo" data-quiet>${ic('snow', 'ic')}Sumergir y leer</button>
          <p class="ice-msg" id="iceMsg" aria-live="polite"></p>
        </div>
        <div class="ice-r"><div class="ice-read mono" id="iceRead">— °C</div>
          <svg viewBox="0 0 120 150" class="ice-svg" aria-hidden="true">
            <path d="M18 20 L28 140 Q30 146 36 146 H84 Q90 146 92 140 L102 20" class="glass"/>
            <path d="M24 60 L30 138 Q31 142 36 142 H84 Q89 142 90 138 L96 60 Z" class="water"/>
            <rect x="34" y="70" width="20" height="18" rx="4" class="cube" transform="rotate(-12 44 79)"/><rect x="60" y="92" width="22" height="18" rx="4" class="cube" transform="rotate(10 71 101)"/><rect x="40" y="110" width="18" height="16" rx="4" class="cube"/>
            <path d="M66 8 L66 120" class="probe2"/><circle cx="66" cy="122" r="4" class="probe2-tip"/>
          </svg>
        </div>
      </article>
      <article class="card rv" style="--d:80ms">
        <p class="kicker">Auditorías</p>
        <p class="big-text">${H.auditorias}</p>
        <div class="obj-tags"><span class="chip norm">Observación sin aviso · mensual</span><span class="chip norm">Auditoría interna · semestral</span><span class="chip norm">Revisión del plan · anual</span></div>
      </article>
    </div>
  </div>
</section>`;
  }

  function rRegistros() {
    return `
<section id="h-registros" class="sec">
  <div class="wrap">
    ${head('h-registros', '11', 'Principio 7 · Paso 12', 'Documentación y registros', H.registrosIntro)}
    <div class="docs rv">${H.documentos.map((d, i) => `
      <article class="card doc-card" style="--d:${i * 80}ms"><span class="trio-ic">${ic(['shield', 'doc', 'route'][i])}</span><h3>${d.t}</h3><p>${d.texto}</p></article>`).join('')}
      <article class="card doc-card arch"><span class="trio-ic">${ic('archive')}</span><h3>2 años</h3><p>Tiempo mínimo de archivo de todos los registros en la oficina.</p></article>
    </div>
    <div class="files-head rv">
      <div><p class="kicker">Registros del sistema</p><p class="files-sum"><span class="fs-a">14</span> BPM <span class="fs-op">+</span> <span class="fs-b">6</span> HACCP <span class="fs-op">=</span> <span class="fs-c" id="fsTotal">20</span></p></div>
      <button class="btn primary sm" id="fmtAll" data-quiet>${ic('doc', 'ic')}Ver los 6 formatos HACCP</button>
    </div>
    <div class="files rv" id="files">
      ${H.formatosBPM.map((n, i) => `<div class="file bpm" style="--k:${i}" title="F${pad(i + 1)} · ${n}"><span class="file-c mono">F${pad(i + 1)}</span><span class="file-n">${n}</span></div>`).join('')}
      ${H.formatosH.map((f, i) => `<button class="file hac" data-hf="${f.cod}" style="--k:${14 + i}" data-quiet><span class="file-c mono">${f.cod}</span><span class="file-n">${f.nombre}</span>${f.ejemplo ? '<span class="file-ex">Ver ejemplo</span>' : ''}</button>`).join('')}
    </div>
  </div>
</section>`;
  }

  function rMatriz() {
    const cols = [
      { t: 'PCC', p: 2 }, { t: 'Peligro', p: 1 }, { t: 'Límite crítico', p: 3 }, { t: 'Monitoreo', p: 4 },
      { t: 'Acción correctiva', p: 5 }, { t: 'Verificación', p: 6 }, { t: 'Registro', p: 7 }
    ];
    const rows = H.pccs.map((p) => [
      `<b>${p.n}. ${p.nombre}</b>`, `${p.tipo}: ${p.peligro.toLowerCase()}`,
      p.criticoCorto + (p.dir === 'down' ? ' <span class="muted">(riesgo por debajo)</span>' : p.dir === 'up' ? ' <span class="muted">(riesgo por encima)</span>' : p.dir === 'zero' ? ' <span class="muted">(tolerancia cero)</span>' : ''),
      `${p.mon.que} · ${p.mon.cuando.toLowerCase()} · ${p.mon.quien.toLowerCase()}`,
      p.accionCorta, p.verif, p.regs
    ]);
    const capT = H.capacitacion;
    return `
<section id="h-matriz" class="sec alt">
  <div class="wrap">
    ${head('h-matriz', '12', 'Los 7 principios en una vista', 'Matriz del plan HACCP', 'Es la tabla que se presenta en la exposición y la que se pega en el área de producción.')}
    <div class="plan-tools rv">
      <button class="btn primary sm" id="mxPlay" data-quiet>
        <svg viewBox="0 0 24 24" class="ic ic-play"><path d="M8 5.5v13l10.5-6.5z"/></svg>
        <svg viewBox="0 0 24 24" class="ic ic-stop"><rect x="6.5" y="6.5" width="11" height="11" rx="2"/></svg>
        <span>Recorrer por principio</span>
      </button>
      <span class="chip norm mx-cap" id="mxCap">Pasa el cursor o toca una columna</span>
    </div>
    <div class="mx-wrap card rv">
      <table class="mx" id="mx">
        <thead><tr>${cols.map((c, i) => `<th data-c="${i}"><span class="mx-p">P${c.p}</span>${c.t}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((r, ri) => `<tr data-r="${ri}" class="t-${H.pccs[ri].tipo}">${r.map((c, i) => `<td data-c="${i}" data-l="${cols[i].t}">${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>

    <article class="card cap rv">
      <div class="cap-l">
        <p class="kicker">Capacitación HACCP agregada al plan · F10</p>
        <h3 class="card-title">10 h + 2 h = 12 h al año</h3>
        <p class="muted">${H.capacitacionIntro}</p>
      </div>
      <div class="cap-bar" aria-label="10 horas BPM más 2 horas HACCP">
        <div class="cap-seg bpm" style="--w:${10 / 12 * 100}%"><span>Plan BPM · 10 h</span></div>
        <div class="cap-seg hac" style="--w:${2 / 12 * 100}%"><span>HACCP · 2 h</span></div>
      </div>
      ${drawer('Detalle de la capacitación HACCP', table(['Momento', 'Tema', 'Metodología', 'Horas'], capT))}
    </article>
  </div>
</section>`;
  }

  function rCierre() {
    return `
<div class="marquee alt-mq" aria-hidden="true" data-words="Identificar|Controlar|Medir|Corregir|Verificar|Documentar|Inocuidad en cada lote"></div>
<section id="h-cierre" class="sec">
  <div class="wrap">
    ${head('h-cierre', '13', '', 'En resumen', '')}
    <div class="trio summary">${H.resumen.map((r, i) => `
      <article class="card rv" style="--d:${i * 110}ms">
        <div class="sum-n"><span class="chip norm">${r.tag}</span><span>${pad(i + 1)}</span></div>
        <h3>${r.titulo}</h3><p>${r.texto}</p>
      </article>`).join('')}</div>
    <div class="h-q rv">
      <p class="kicker">Preguntas que puede hacer el evaluador · toca para ver la respuesta</p>
      <div class="flips" id="hFlips">${H.preguntas.map(([q, a], i) => `
        <button class="flip" aria-pressed="false" data-quiet>
          <span class="flip-in">
            <span class="flip-face front"><span class="kicker">Pregunta ${i + 1}</span><span class="flip-q">${q}</span><span class="flip-hint">Toca para ver la respuesta</span></span>
            <span class="flip-face back"><span class="kicker">Respuesta</span><span class="flip-a">${a}</span></span>
          </span>
        </button>`).join('')}</div>
    </div>
    <div class="thanks rv">
      <p class="thanks-big h-thanks">Gracias<span>.</span></p>
      <div class="row"><a href="#h-inicio" class="btn ghost">Volver al inicio <span aria-hidden="true">↑</span></a><button class="btn primary" data-go="0" data-quiet>← Plan BPM</button></div>
    </div>
  </div>
</section>
<footer class="foot">
  <div class="wrap">
    <p class="kicker">Referencias</p>
    <ul class="foot-refs h-refs">${H.referencias.map((r) => `<li>${r}</li>`).join('')}</ul>
    <p class="foot-keys mono">Atajos: <kbd>1</kbd>–<kbd>9</kbd> secciones · <kbd>0</kbd> portada · <kbd>T</kbd> cronómetro · <kbd>H</kbd> o <kbd>Shift</kbd>+<kbd>←</kbd><kbd>→</kbd> cambiar de plan · <kbd>M</kbd> sonido · <kbd>D</kbd> tema</p>
  </div>
</footer>`;
  }

  const host = $('#haccpRoot');
  host.innerHTML = rHero() + rObjetivos() + rMarco() + rPasos() + rFlujo() + rPeligros() + rPcc() + rLimites() + rMonitoreo() + rAcciones() + rVerificacion() + rRegistros() + rMatriz() + rCierre();
  $('#navLinksH').innerHTML = H.agenda.map((a) => `<a href="#${a.id}">${a.nombre}</a>`).join('');
  const hint = $('#swipeHint');
  if (hint) hint.innerHTML = `<span class="sh-hand">${ic('tap')}</span><span>Desliza a la izquierda para ver el <b>Plan HACCP</b></span>`;

  /* =======================================================================
     2 · Dos paneles con deslizamiento (BPM ⟷ HACCP)
     ======================================================================= */
  const Deck = (() => {
    const deck = $('#deck'), panels = [$('#pBPM'), $('#pHACCP')];
    const sw = $('#deckSwitch'), tabs = $$('[role=tab]', sw);
    const nav = $('#nav'), bar = $('#progress');
    let idx = root.dataset.panel === 'haccp' ? 1 : 0, raf = 0, user = false, settle = 0;
    const W = () => deck.clientWidth || innerWidth;

    function progress() {
      const el = panels[idx];
      const max = el.scrollHeight - el.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, el.scrollTop / max) : 0})`;
      nav.classList.toggle('scrolled', el.scrollTop > 8);
    }
    function setIdx(i, sound) {
      idx = i;
      root.dataset.panel = i ? 'haccp' : 'bpm';
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach((p, k) => p.setAttribute('aria-hidden', k !== i));
      document.title = i ? 'Plan HACCP · Ponqué de vainilla' : 'Plan BPM · Ponqué de vainilla';
      progress();
      if (sound) snd('whoosh');
      if (i === 1) hideHint(true);
      window.dispatchEvent(new CustomEvent('panelchange', { detail: { panel: i } }));
    }
    function paint() {
      raf = 0;
      const p = Math.max(0, Math.min(1, deck.scrollLeft / W()));
      sw.style.setProperty('--p', p.toFixed(4));
      root.style.setProperty('--deck-p', p.toFixed(4));
      const cur = p > 0.5 ? 1 : 0;
      if (cur !== idx) setIdx(cur, true);
      panels.forEach((el, i) => {
        const d = Math.abs(p - i);
        if (!reduce && d > 0.003 && d < 0.997) {
          el.style.transform = `scale(${(1 - d * 0.07).toFixed(4)})`;
          el.style.borderRadius = (d * 40).toFixed(1) + 'px';
          el.classList.add('moving');
        } else if (el.classList.contains('moving')) {
          el.style.transform = ''; el.style.borderRadius = ''; el.classList.remove('moving');
        }
      });
    }
    deck.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(paint);
      clearTimeout(settle);
      settle = setTimeout(paint, 120);
    }, { passive: true });
    panels.forEach((el, i) => el.addEventListener('scroll', () => { if (i === idx) progress(); }, { passive: true }));

    function go(i, smooth = true) {
      i = Math.max(0, Math.min(1, i));
      deck.scrollTo({ left: i * W(), behavior: smooth && !reduce ? 'smooth' : 'instant' });
    }
    function toggle() { go(idx ? 0 : 1); }

    // Botones que cambian de plan (selector superior, pestañas laterales, enlaces)
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (!b) return;
      e.preventDefault();
      const to = +b.dataset.go;
      if (to === idx) { panels[idx].scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
      go(to);
    });
    // La marca del menú lleva a la portada del plan que se está viendo
    $('.brand').addEventListener('click', (e) => {
      if (idx !== 1) return;
      e.preventDefault();
      panels[1].scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    addEventListener('resize', () => deck.scrollTo({ left: idx * W(), behavior: 'instant' }));

    // Aviso para deslizar (solo pantallas táctiles, una vez)
    const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } } };
    let hintT = 0;
    function hideHint(forever) {
      if (!hint || hint.hidden) { if (forever) store.set('adex-swipe', '1'); return; }
      hint.classList.add('out');
      setTimeout(() => { hint.hidden = true; hint.classList.remove('out'); }, 400);
      if (forever) store.set('adex-swipe', '1');
    }
    function maybeHint() {
      if (!hint || idx !== 0 || store.get('adex-swipe') || !matchMedia('(pointer: coarse)').matches) return;
      hint.hidden = false;
      hintT = setTimeout(() => hideHint(false), 7000);
    }
    if (hint) hint.addEventListener('click', () => { clearTimeout(hintT); hideHint(true); go(1); });

    // Posición inicial
    setIdx(idx, false);
    if (idx === 1) { deck.style.scrollBehavior = 'auto'; deck.scrollLeft = W(); requestAnimationFrame(() => { deck.style.scrollBehavior = ''; }); }
    paint();

    return { go, toggle, get idx() { return idx; }, panels, maybeHint, progress };
  })();

  /* =======================================================================
     3 · Interacción (cuando app.js está listo)
     ======================================================================= */
  function bind() {
    const X = window.ADEX;
    const { Sound, Modal, burst, pop, initTabs } = X;
    const panel = Deck.panels[1];
    const goTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
    const shake = (el) => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };

    /* ---------- Navegación del panel HACCP ---------- */
    const navH = $('#navLinksH'), linksH = $$('a', navH);
    const ioNav = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      linksH.forEach((a) => {
        const on = a.hash === '#' + e.target.id;
        a.classList.toggle('active', on);
        if (on && navH.scrollWidth > navH.clientWidth) navH.scrollTo({ left: a.offsetLeft - navH.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
      });
    }), { rootMargin: '-45% 0px -54% 0px' });
    $$('#haccpRoot > section').forEach((s) => ioNav.observe(s));

    /* ---------- Portada ---------- */
    const art = $('.h-art'), dial = $('.h-dial'), hero = $('#h-inicio'), blobs = $('.h-blobs');
    if (!reduce) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        dial.style.transform = `perspective(1000px) rotateY(${px * 14}deg) rotateX(${-py * 10}deg)`;
        blobs.style.transform = `translate(${px * -50}px, ${py * -50}px)`;
      });
      hero.addEventListener('pointerleave', () => { dial.style.transform = ''; blobs.style.transform = ''; });
    }
    const stepGo = (n) => {
      const p = H.pasos[n - 1];
      if (['equipo', 'producto', 'uso'].includes(p.ir)) { pasoTabs.select(p.ir, true); goTo('hPasoTabs'); } else goTo(p.ir);
    };
    $('.hd-nodes').addEventListener('click', (e) => {
      const g = e.target.closest('.hd-node');
      if (g) { e.stopPropagation(); Sound.note(+g.dataset.step - 1); stepGo(+g.dataset.step); }
    });
    $('.hd-nodes').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const g = e.target.closest('.hd-node');
      if (g) { e.preventDefault(); stepGo(+g.dataset.step); }
    });
    art.addEventListener('click', (e) => {
      if (e.target.closest('.hd-node')) return;
      art.classList.remove('jelly'); void art.offsetWidth; art.classList.add('jelly');
      burst(art); Sound.sparkle();
    });
    const counters = $$('[data-hcount]');
    const ioStats = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      ioStats.disconnect();
      counters.forEach((el, i) => X.countUp(el, +el.dataset.hcount, 1400, 300 + i * 140));
    }, { threshold: 0.3 });
    ioStats.observe($('#hStats'));
    $('#hStart').addEventListener('click', () => { if (!TimerH.running) TimerH.start(); goTo('h-objetivos'); });

    /* ---------- 01 · Objetivos ---------- */
    const objList = $('#objList'), objCount = $('#objCount');
    objList.addEventListener('click', (e) => {
      const b = e.target.closest('.obj-main');
      if (!b) return;
      const li = b.parentElement, on = !li.classList.contains('done');
      li.classList.toggle('done', on);
      b.setAttribute('aria-pressed', on);
      const n = $$('.obj.done', objList).length, all = n === H.objetivos.length;
      objCount.textContent = `${n} de ${H.objetivos.length}`;
      objCount.className = 'chip' + (all ? ' ok' : '');
      if (on) { pop($('.obj-n', li), 8); if (all) { Sound.win(); burst(objList); } else Sound.ok(); } else Sound.tick();
    });

    /* ---------- 02 · Marco ---------- */
    initTabs($('#hMarcoTabs'));
    // Prerrequisitos
    const bricks = $('#bricks'), pprPanel = $('#pprPanel'), house = $('#house'), tgNo = $('#tgNoPpr');
    const pprEmpty = () => { pprPanel.innerHTML = `<div class="fade-in p-empty">${ic('tap')}<p>Cada ladrillo es un programa prerrequisito que ADEX ya tiene. Toca uno, o toca el techo.</p></div>`; };
    function pickBrick(i) {
      const b = H.ppr[i];
      $$('.brick', bricks).forEach((x, k) => x.classList.toggle('on', k === i));
      pprPanel.innerHTML = `<div class="fade-in"><p class="kicker">Programa prerrequisito ${i + 1} de ${H.ppr.length}</p><h4>${b.p}</h4><p>${b.como}</p><div class="p-chips"><span class="chip norm">Registro ${b.reg}</span></div></div>`;
      Sound.pop();
    }
    bricks.addEventListener('click', (e) => { const b = e.target.closest('.brick'); if (b && !house.classList.contains('broken')) pickBrick(+b.dataset.i); });
    $('#roof').addEventListener('click', () => {
      $$('.brick', bricks).forEach((x) => x.classList.remove('on'));
      pprPanel.innerHTML = `<div class="fade-in"><p class="kicker">El techo</p><h4>El HACCP se apoya en los PPR</h4><p>${H.sinPpr}</p></div>`;
      Sound.chime();
    });
    tgNo.addEventListener('click', () => {
      const on = !tgNo.classList.contains('on');
      tgNo.classList.toggle('on', on);
      tgNo.setAttribute('aria-pressed', on);
      house.classList.toggle('broken', on);
      $$('.brick', bricks).forEach((x) => x.classList.remove('on'));
      if (on) {
        pprPanel.innerHTML = `<div class="fade-in bad-box"><p class="kicker">Sin prerrequisitos</p><h4>El sistema se cae</h4><p>${H.sinPpr}</p></div>`;
        Sound.bad();
      } else { pprEmpty(); Sound.ok(); }
    });
    pprEmpty();

    // Historia
    const tlTrack = $('#tlTrack'), tlCard = $('#tlCard'), tlFill = $('#tlFill'), rocket = $('#tlRocket');
    let tl = -1;
    function showTl(i, user) {
      if (i < 0 || i >= H.historia.length) return;
      const back = i < tl;
      tl = i;
      const h = H.historia[i], x = (i / (H.historia.length - 1)) * 100;
      $$('.tl-dot', tlTrack).forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('past', k < i); });
      tlFill.style.width = x + '%';
      rocket.style.left = x + '%';
      tlCard.innerHTML = `<div class="swap${back ? ' back' : ''}"><span class="tl-year">${h.anio}</span><div><h4>${h.t}</h4><p>${h.texto}</p></div></div>`;
      $('#tlPrev').disabled = i === 0;
      $('#tlNext').disabled = i === H.historia.length - 1;
      if (user) Sound.note(i);
    }
    tlTrack.addEventListener('click', (e) => { const d = e.target.closest('.tl-dot'); if (d) showTl(+d.dataset.i, true); });
    $('#tlPrev').addEventListener('click', () => showTl(tl - 1, true));
    $('#tlNext').addEventListener('click', () => showTl(tl + 1, true));
    showTl(0);

    // Calidad o inocuidad: juego
    const qi = $('#qiGame');
    let qOrder, qi_i, qOk, qRes;
    function qCard() {
      if (qi_i >= qOrder.length) { qEnd(); return; }
      const it = qOrder[qi_i];
      qi.innerHTML = `<div class="insp-card qi-card enter">
        <div class="insp-top"><p class="kicker">¿Calidad o inocuidad? · ${qi_i + 1} de ${qOrder.length}</p><span class="chip mono">${qOk} ✓</span></div>
        <div class="insp-ic">${ic('cake')}</div>
        <h3 class="insp-name">${it.t}</h3>
        <div class="insp-actions"><button class="btn qi-c" data-a="calidad" data-quiet>Calidad</button><button class="btn qi-i" data-a="inocuidad" data-quiet>Inocuidad</button></div>
        <div class="dots qi-dots">${qOrder.map((_, k) => `<i class="${qRes[k] === true ? 'ok' : qRes[k] === false ? 'bad' : k === qi_i ? 'cur' : ''}"></i>`).join('')}</div>
      </div>`;
    }
    function qAnswer(a, btn) {
      const it = qOrder[qi_i], good = a === it.c;
      if (good) qOk++;
      qRes[qi_i] = good;
      const c = $('.qi-card', qi);
      $$('[data-a]', c).forEach((b) => { b.disabled = true; });
      const fb = document.createElement('div');
      fb.className = 'insp-fb';
      fb.innerHTML = `<p class="fb-t ${good ? 'ok' : 'bad'}">${good ? 'Correcto.' : `Es ${it.c}.`}</p><p>${it.porque}</p><button class="btn primary sm" data-next data-quiet>${qi_i === qOrder.length - 1 ? 'Ver resultado' : 'Siguiente'} →</button>`;
      c.appendChild(fb);
      (good ? Sound.ok : Sound.bad)();
      if (good) pop(btn, 10); else shake(c);
    }
    function qEnd() {
      const perfect = qOk === qOrder.length;
      qi.innerHTML = `<div class="insp-card final qi-card enter"><p class="kicker">Resultado</p><p class="big-mark">${qOk}<small>/${qOrder.length}</small></p>
        <p>${perfect ? 'Distingues perfectamente calidad de inocuidad.' : 'Recuerda: lo que puede enfermar o lesionar es inocuidad; lo que satisface al cliente es calidad.'}</p>
        <button class="btn primary" data-replay data-quiet>Volver a jugar</button></div>`;
      if (perfect) { Sound.win(); burst(qi); } else Sound.done();
    }
    function qReset() { qOrder = X.shuffle(H.calidad.juego); qi_i = 0; qOk = 0; qRes = []; qCard(); }
    qi.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]');
      if (a && !a.disabled) { qAnswer(a.dataset.a, a); return; }
      if (e.target.closest('[data-next]')) { qi_i++; Sound.click(); qCard(); return; }
      if (e.target.closest('[data-replay]')) { Sound.click(); qReset(); }
    });
    qReset();

    // Ruta SGIA
    const stairs = $('#stairs'), stairPanel = $('#stairPanel');
    function pickStair(i, user) {
      const r = H.ruta[i];
      $$('.stair', stairs).forEach((s, k) => s.classList.toggle('on', k === i));
      stairPanel.innerHTML = `<div class="fade-in"><p class="kicker">Escalón ${i + 1} de ${H.ruta.length}</p><h4>${r.etapa}</h4><p>${r.que}</p><div class="p-chips"><span class="chip ${r.tipo}">${r.estado}</span></div></div>`;
      if (user) Sound.note(i * 2);
    }
    stairs.addEventListener('click', (e) => { const s = e.target.closest('.stair'); if (s) pickStair(+s.dataset.i, true); });
    pickStair(1);

    /* ---------- 03 · Pasos ---------- */
    const pasoTabs = initTabs($('#hPasoTabs'));
    $('#steps12').addEventListener('click', (e) => {
      const b = e.target.closest('.st12');
      if (!b) return;
      const i = +b.dataset.i;
      Sound.note(i);
      pop(b, 6);
      stepGo(i + 1);
    });
    // Equipo
    const team = $('#team'), teamPanel = $('#teamPanel');
    function pickTeam(id, user) {
      const p = H.equipo.find((x) => x.id === id);
      $$('.tm-node', team).forEach((b) => { const on = b.dataset.id === id; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
      teamPanel.innerHTML = `<div class="fade-in team-grid"><div><p class="kicker">${p.rol}</p><h4>${p.cargo}</h4></div>
        <div><p class="kicker">Formación / conocimiento</p><p>${p.formacion}</p></div>
        <div><p class="kicker">Funciones en el equipo HACCP</p><p>${p.funciones}</p></div></div>`;
      if (user) Sound.pop();
    }
    team.addEventListener('click', (e) => { const b = e.target.closest('.tm-node'); if (b) pickTeam(b.dataset.id, true); });
    pickTeam('calidad');
    // Producto: actividad de agua
    const awR = $('#awR'), awV = $('#awV'), awMsg = $('#awMsg');
    let awPrev = null;
    function aw(e) {
      const v = +awR.value, ok = v < 0.93, inBand = v >= 0.80 && v <= 0.88;
      awV.textContent = fix(v, 2);
      awMsg.className = 'water-msg ' + (ok ? 'ok' : 'bad');
      awMsg.textContent = ok
        ? (inBand ? 'Rango del ponqué: B. cereus no puede multiplicarse; sus esporas no llegan a niveles peligrosos en los 5 días de vida útil.' : 'Por debajo de 0,93: B. cereus todavía no puede multiplicarse.')
        : 'Con esta aw B. cereus podría multiplicarse: habría que revisar la formulación, la vida útil y el análisis de peligros.';
      if (e) { Sound.slide((v - 0.6) / 0.4); if (awPrev !== null && awPrev !== ok) (ok ? Sound.ok : Sound.bad)(); }
      awPrev = ok;
    }
    awR.addEventListener('input', aw);
    aw();
    // Uso previsto
    const usoGrid = $('#usoGrid'), usoCard = $('#usoCard');
    function pickUso(i, user) {
      const u = H.uso[i];
      $$('.uso-btn', usoGrid).forEach((b, k) => b.setAttribute('aria-selected', k === i));
      usoCard.innerHTML = `<div class="fade-in uso-in"><span class="uso-ic ${u.tipo || ''}">${ic(u.ic)}</span><div><div class="sc-head"><h3>${u.t}</h3><span class="chip ${u.tipo || 'norm'}">${u.tag}</span></div><p class="big-text">${u.texto}</p></div></div>`;
      if (user) Sound.pop();
    }
    usoGrid.addEventListener('click', (e) => { const b = e.target.closest('.uso-btn'); if (b) pickUso(+b.dataset.i, true); });
    pickUso(0);

    /* ---------- 04 · Flujo ---------- */
    const flow = $('#flow'), flowPanel = $('#flowPanel'), flowBtn = $('#flowPlay');
    const fnodes = $$('.fnode', flow);
    const areaOf = (n) => { const r = H.insitu.find((x) => { const m = x[0].match(/^(\d+)(?:-(\d+))?\./); return m && n >= +m[1] && n <= +(m[2] || m[1]); }); return r ? r[1] : ''; };
    function showFlow(i, label) {
      const f = H.flujo[i];
      fnodes.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('past', !!label && k < i); });
      flowPanel.innerHTML = `<div class="fade-in" style="display:flex;flex-direction:column;flex:1">
        <p class="kicker">${label || 'Etapa'} ${f.n} de ${H.flujo.length}</p>
        <h3>${f.etapa}</h3>
        <div class="p-chips">${f.pcc ? `<span class="chip pcc-chip">PCC ${f.pcc} · ${H.pccs[f.pcc - 1].peligro}</span>` : '<span class="chip">Controlada por prerrequisitos</span>'}</div>
        <p class="p-text">${f.det}</p>
        ${areaOf(f.n) ? `<p class="p-text small muted">Área del plano: <b>${areaOf(f.n)}</b></p>` : ''}
        ${f.salida ? `<p class="fl-out inline">${f.salida}</p>` : ''}
        ${f.pcc ? `<button class="btn ghost sm" data-limit="${f.pcc}" data-quiet>Ver el límite del PCC ${f.pcc} →</button>` : ''}
        <div class="route-steps">${H.flujo.map((x, k) => `<i class="${k <= i ? 'on' : ''}${x.pcc ? ' pc' : ''}"></i>`).join('')}</div></div>`;
    }
    const flowEmpty = () => { flowPanel.innerHTML = `<div class="p-empty fade-in">${ic('route')}<p>Toca una etapa o reproduce el flujo completo. Los cuatro PCC llevan borde rosado.</p></div>`; };
    flow.addEventListener('click', (e) => { const b = e.target.closest('.fnode'); if (!b) return; stopFlow(); showFlow(+b.dataset.i); (H.flujo[+b.dataset.i].pcc ? Sound.chime : Sound.pop)(); });
    let fTok = 0;
    function stopFlow() {
      if (!flowBtn.classList.contains('playing')) return;
      fTok++; flowBtn.classList.remove('playing'); $('span', flowBtn).textContent = 'Reproducir el flujo';
    }
    async function playFlow() {
      const my = ++fTok;
      flowBtn.classList.add('playing'); $('span', flowBtn).textContent = 'Detener';
      for (let i = 0; i < H.flujo.length; i++) {
        if (my !== fTok) return;
        showFlow(i, 'Recorrido ·');
        if (H.flujo[i].pcc) { Sound.chime(); pop(fnodes[i], 10); } else Sound.note(i);
        await wait(H.flujo[i].pcc ? 1500 : 950);
      }
      if (my !== fTok) return;
      flowBtn.classList.remove('playing'); $('span', flowBtn).textContent = 'Repetir el flujo';
      fnodes.forEach((b) => b.classList.remove('on', 'past'));
      flowPanel.innerHTML = `<div class="fade-in"><p class="kicker">Recorrido completo</p><h3>4 PCC en 11 etapas</h3><p class="p-text">Tamizado, horneo, enfriamiento y empaque con rotulado. Las demás etapas se sostienen con los programas prerrequisito del plan BPM.</p><div class="p-chips"><span class="chip pcc-chip">PCC 1</span><span class="chip pcc-chip">PCC 2</span><span class="chip pcc-chip">PCC 3</span><span class="chip pcc-chip">PCC 4</span></div></div>`;
      Sound.done();
    }
    flowBtn.addEventListener('click', () => (flowBtn.classList.contains('playing') ? stopFlow() : playFlow()));
    flowEmpty();

    // Verificación in situ
    const isList = $('#isList'), isBoxes = $$('input', isList), isBar = $('#isBar'), isPct = $('#isPct'), isStamp = $('#isStamp');
    let isDone = false;
    function isUpd(sound) {
      const n = isBoxes.filter((b) => b.checked).length, all = n === isBoxes.length;
      isPct.textContent = n;
      isBar.style.width = (n / isBoxes.length) * 100 + '%';
      isBar.classList.toggle('goal', all);
      isStamp.className = 'stamp is-stamp ok' + (all ? ' show' : '');
      if (sound) {
        if (all && !isDone) { Sound.stamp(); setTimeout(Sound.win, 160); burst(isStamp); } else Sound.tick();
      }
      isDone = all;
    }
    isList.addEventListener('change', () => isUpd(true));
    $('#isReset').addEventListener('click', () => { isBoxes.forEach((b) => { b.checked = false; }); isUpd(false); });
    isUpd(false);

    /* ---------- 05 · Peligros ---------- */
    const ALL = [];
    H.peligros.forEach((st, si) => st.items.forEach((it) => ALL.push(Object.assign({}, it, { si, etapa: st.etapa, sc: score(it) }))));
    const risk = $('#risk'), riskOut = $('#riskOut'), hzList = $('#hzList'), hzTitle = $('#hzTitle'), hzStages = $('#hzStages'), tgSig = $('#tgSig');
    const SL = ['', 'baja', 'media', 'alta'];
    let rh = '<div class="rk-corner"><span>P ↓ · S →</span></div>' + [1, 2, 3].map((s) => `<div class="rk-h">Severidad ${SL[s]} (${s})</div>`).join('');
    [3, 2, 1].forEach((p) => {
      rh += `<div class="rk-h rk-row">Probabilidad ${SL[p]} (${p})</div>`;
      [1, 2, 3].forEach((s) => {
        const n = ALL.filter((h) => PV[h.p] === p && PV[h.s] === s).length, sc = p * s;
        rh += `<button class="rk ${sc >= 4 ? 'sig' : 'nsig'} s${sc}" data-p="${p}" data-s="${s}" data-quiet><span class="rk-sc">${sc}</span><span class="rk-n">${n ? n + (n === 1 ? ' peligro' : ' peligros') : '—'}</span></button>`;
      });
    });
    risk.innerHTML = rh;
    const hzCard = (h, showStage) => {
      const sig = h.sc >= 4;
      return `<article class="hzc${sig ? ' sig' : ''}" data-p="${PV[h.p]}" data-s="${PV[h.s]}">
        <div class="hzc-top"><span class="hz-ic t-${h.t}">${ic(TIPO_IC[h.t])}</span><span class="hzc-k">${TIPO[h.t]}</span>${showStage ? `<span class="chip xs">${h.si + 1}. ${h.etapa}</span>` : ''}<span class="hzc-sc${sig ? ' sig' : ''}" title="P × S">${h.sc}</span></div>
        <p class="hzc-p">${h.peligro}</p>
        <div class="hzc-ps"><span class="chip xs">Probabilidad ${PL[h.p]}</span><span class="chip xs">Severidad ${PL[h.s]}</span><span class="chip xs ${sig ? 'warn' : 'ok'}">${sig ? 'Significativo' : 'No significativo'}</span></div>
        <p class="hzc-j"><b>Justificación.</b> ${h.just}</p>
        <p class="hzc-c"><b>Medida de control.</b> ${h.control}</p>
      </article>`;
    };
    let hzMode = { stage: 0 };
    function renderHz() {
      let list, title;
      const sig = tgSig.classList.contains('on');
      $$('.rk', risk).forEach((c) => c.classList.toggle('on', !!hzMode.cell && +c.dataset.p === hzMode.cell[0] && +c.dataset.s === hzMode.cell[1]));
      $$('.hz-stage', hzStages).forEach((b, k) => b.classList.toggle('on', hzMode.stage === k));
      if (hzMode.cell) {
        const [p, s] = hzMode.cell;
        list = ALL.filter((h) => PV[h.p] === p && PV[h.s] === s);
        title = `Casilla P ${p} × S ${s} = ${p * s} · ${p * s >= 4 ? 'significativo' : 'no significativo'}`;
      } else if (sig) {
        list = ALL.filter((h) => h.sc >= 4);
        title = `${list.length} peligros significativos de ${ALL.length} · pasan al árbol de decisiones`;
      } else {
        const st = H.peligros[hzMode.stage];
        list = ALL.filter((h) => h.si === hzMode.stage);
        title = `Etapa ${hzMode.stage + 1} · ${st.etapa}`;
      }
      hzTitle.innerHTML = `<p class="hz-tt">${title}</p>`;
      hzList.innerHTML = list.length ? `<div class="hz-grid fade-in">${list.map((h) => hzCard(h, !!(hzMode.cell || sig))).join('')}</div>` : '<p class="muted">Ningún peligro de esta lista cae en esta casilla.</p>';
      riskOut.innerHTML = hzMode.cell ? `P × S = <b>${hzMode.cell[0] * hzMode.cell[1]}</b> → ${hzMode.cell[0] * hzMode.cell[1] >= 4 ? '<span class="t-warn">significativo, pasa al árbol de decisiones</span>' : 'no significativo, lo controlan los prerrequisitos'}` : 'Un peligro es significativo cuando P × S ≥ 4.';
    }
    risk.addEventListener('click', (e) => {
      const c = e.target.closest('.rk');
      if (!c) return;
      const cell = [+c.dataset.p, +c.dataset.s];
      hzMode = { cell };
      setSig(false, true);
      renderHz();
      (cell[0] * cell[1] >= 4 ? Sound.chime : Sound.pop)();
      pop(c, 6);
    });
    hzStages.addEventListener('click', (e) => {
      const b = e.target.closest('.hz-stage');
      if (!b) return;
      hzMode = { stage: +b.dataset.i };
      setSig(false, true);
      renderHz();
      Sound.pop();
    });
    function setSig(on, silent) {
      tgSig.classList.toggle('on', on);
      tgSig.setAttribute('aria-pressed', on);
      if (silent) return;
      hzMode = on ? { sig: true } : { stage: 0 };
      renderHz();
      (on ? Sound.chime : Sound.pop)();
    }
    tgSig.addEventListener('click', () => setSig(!tgSig.classList.contains('on')));
    // Pasar el cursor por un peligro ilumina su casilla
    hzList.addEventListener('pointerover', (e) => {
      const h = e.target.closest('.hzc');
      $$('.rk', risk).forEach((c) => c.classList.toggle('ping', !!h && c.dataset.p === h.dataset.p && c.dataset.s === h.dataset.s));
    });
    hzList.addEventListener('pointerleave', () => $$('.rk', risk).forEach((c) => c.classList.remove('ping')));
    renderHz();

    /* ---------- 06 · Árbol de decisiones ---------- */
    const cases = $('#cases'), tree = $('#tree'), verdict = $('#verdict'), modeSeg = $('#treeMode');
    const tqs = $$('.tq', tree);
    let caseI = -1, tMode = 'ver', tTok = 0, tStep = 0, tHits = 0, tAsked = 0;
    const exitTxt = (q, ans) => (ans === 'Sí' ? H.arbol[q].si : H.arbol[q].no);
    function resetTree() {
      tqs.forEach((t) => { t.className = 'tq'; $('.tq-a', t).innerHTML = ''; $('.tq-exit', t).textContent = ''; });
      verdict.innerHTML = ''; verdict.className = 'verdict';
    }
    function markAnswer(q, ans, good) {
      const t = tqs[q], c = H.casos[caseI];
      t.classList.add('on', ans === 'Sí' ? 'yes' : 'no');
      if (good === false) t.classList.add('miss');
      $('.tq-a', t).innerHTML = `<span class="ans ${ans === 'Sí' ? 'yes' : 'no'}">${ans}${q === 3 && c.extra && ans === 'Sí' ? ` · ${c.extra}` : ''}</span>${good === false ? '<span class="ans-miss">Respuesta correcta</span>' : ''}`;
      $('.tq-exit', t).textContent = exitTxt(q, ans);
    }
    function showVerdict() {
      const c = H.casos[caseI];
      tqs.forEach((t, q) => { if (c.r[q] === null) t.classList.add('skip'); });
      verdict.className = 'verdict show ' + (c.pcc ? 'is-pcc' : 'no-pcc');
      verdict.innerHTML = `<span class="v-badge">${c.pcc ? `PCC ${c.pcc}` : 'No es PCC'}</span><div><p class="v-t">${c.decision}</p>${c.nota ? `<p class="v-n">${c.nota}</p>` : ''}${tMode === 'yo' ? `<p class="v-n">Acertaste ${tHits} de ${tAsked} respuestas.</p>` : ''}</div>`;
      if (c.pcc) { Sound.chime(); pop($('.v-badge', verdict), 14); } else Sound.done();
      if (tMode === 'yo' && tHits === tAsked) setTimeout(() => { Sound.win(); burst(verdict); }, 300);
    }
    async function playCase() {
      const my = ++tTok, c = H.casos[caseI];
      resetTree();
      for (let q = 0; q < 4; q++) {
        if (c.r[q] === null) break;
        await wait(q ? 650 : 250);
        if (my !== tTok) return;
        markAnswer(q, c.r[q]);
        Sound.note(q * 2);
      }
      await wait(500);
      if (my !== tTok) return;
      showVerdict();
    }
    function askStep() {
      const c = H.casos[caseI];
      if (tStep >= 4 || c.r[tStep] === null) { showVerdict(); return; }
      const t = tqs[tStep];
      t.classList.add('ask');
      $('.tq-a', t).innerHTML = '<button class="btn ok xs" data-ans="Sí" data-quiet>Sí</button><button class="btn bad xs" data-ans="No" data-quiet>No</button>';
    }
    tree.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ans]');
      if (!b || tMode !== 'yo') return;
      const c = H.casos[caseI], right = c.r[tStep], good = b.dataset.ans === right;
      tAsked++; if (good) tHits++;
      tqs[tStep].classList.remove('ask');
      markAnswer(tStep, right, good);
      if (good) { Sound.ok(); pop(tqs[tStep], 6); } else { Sound.bad(); shake(tqs[tStep]); }
      tStep++;
      setTimeout(askStep, 450);
    });
    function pickCase(i, user) {
      caseI = i;
      const c = H.casos[i];
      $$('.case', cases).forEach((b, k) => b.setAttribute('aria-selected', k === i));
      $('#treeK').textContent = `${c.etapa} · ${TIPO[c.t]}`;
      $('#treeH').textContent = c.peligro;
      tTok++;
      if (tMode === 'ver') playCase();
      else { resetTree(); tStep = 0; tHits = 0; tAsked = 0; askStep(); }
      if (user) Sound.pop();
    }
    cases.addEventListener('click', (e) => { const b = e.target.closest('.case'); if (b) pickCase(+b.dataset.i, true); });
    modeSeg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.classList.contains('on')) return;
      $$('button', modeSeg).forEach((x) => x.classList.toggle('on', x === b));
      tMode = b.dataset.m;
      Sound.whoosh();
      pickCase(caseI);
    });
    // Antes de animar, el árbol ya muestra el caso del horneo
    (() => { const c = H.casos[6]; caseI = 6; $$('.case', cases).forEach((b, k) => b.setAttribute('aria-selected', k === 6)); $('#treeK').textContent = `${c.etapa} · ${TIPO[c.t]}`; $('#treeH').textContent = c.peligro; })();
    let treeSeen = false;
    cases.addEventListener('click', () => { treeSeen = true; }, true);
    modeSeg.addEventListener('click', () => { treeSeen = true; }, true);
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); if (!treeSeen) { treeSeen = true; pickCase(caseI); } } }, { threshold: 0.35 }).observe($('#treeCard'));
    const resIO = new IntersectionObserver((es) => { if (es[0].isIntersecting) { $('#pccResult').classList.add('lit'); resIO.disconnect(); } }, { threshold: 0.4 });
    resIO.observe($('#pccResult'));

    /* ---------- 07 · Límites críticos ---------- */
    const limTabs = initTabs($('#hLimTabs'));
    const status = (n, cls, title, text) => {
      const el = $(`[data-panel="pcc${n}"] [data-status]`);
      el.className = 'lim-status show ' + cls;
      el.innerHTML = `<p class="ls-t">${title}</p>${text ? `<p>${text}</p>` : ''}`;
    };
    flowPanel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-limit]');
      if (!b) return;
      limTabs.select('pcc' + b.dataset.limit, true);
      goTo('h-limites');
    });

    // PCC 1 · Tamizado
    const svg = $('#sieveSvg'), parts = $('#sieveParts'), svRun = $('#svRun'), svLook = $('#svLook'), svBroken = $('#svBroken'), svRet = $('#svRet'), svState = $('#svState');
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
    const CONT = [
      { k: 'insecto', d: 'M-5 0 a5 3.4 0 1 0 10 0 a5 3.4 0 1 0 -10 0 M-3 -3 l-3 -3 M3 -3 l3 -3 M-4 2 l-4 3 M4 2 l4 3 M0 -3.4 l0 -3', cls: 'ct-bug' },
      { k: 'hilo', d: 'M-12 0 q4 -6 8 0 t8 0 t8 0', cls: 'ct-thread' },
      { k: 'piedra', d: 'M-5 -3 l6 -2 l5 3 l-1 5 l-7 1 l-4 -3z', cls: 'ct-stone' }
    ];
    let svBusy = false;
    function sieveIdle() {
      const broken = svBroken.classList.contains('on');
      svState.textContent = broken ? 'Malla rota' : 'Listo';
      svState.className = 'chip' + (broken ? ' bad' : '');
      status(1, '', 'Inspecciona la malla o tamiza el lote', 'Antes y después de cada lote: malla a contraluz y revisión de lo retenido (F15).');
    }
    async function runSieve() {
      if (svBusy) return;
      svBusy = true; svRun.disabled = true;
      parts.innerHTML = ''; svRet.innerHTML = '';
      const broken = svBroken.classList.contains('on');
      svg.classList.add('sifted');
      Sound.whoosh();
      const anims = [];
      for (let i = 0; i < 34; i++) {
        const c = mk('circle', { r: (1.6 + Math.random() * 1.6).toFixed(1), class: 'flour' }, parts);
        const x0 = 80 + Math.random() * 160, y0 = 20 + Math.random() * 40, xs = 70 + Math.random() * 180, x1 = 100 + Math.random() * 120, y1 = 232 + Math.random() * 10;
        anims.push(c.animate([
          { transform: `translate(${x0}px, ${y0}px)`, opacity: 0 },
          { transform: `translate(${xs}px, 130px)`, opacity: 1, offset: 0.5 },
          { transform: `translate(${x1}px, ${y1}px)`, opacity: 0.9 }
        ], { duration: reduce ? 1 : 1100 + Math.random() * 700, delay: reduce ? 0 : Math.random() * 500, easing: 'cubic-bezier(.45,0,.7,1)', fill: 'forwards' }).finished);
      }
      CONT.forEach((ct, i) => {
        const g = mk('g', { class: 'ct' }, parts);
        mk('path', { d: ct.d, class: ct.cls }, g);
        const x0 = 110 + i * 50, xs = broken ? 192 + i * 3 : 100 + i * 55;
        const frames = broken
          ? [{ transform: `translate(${x0}px, 30px)`, opacity: 0 }, { transform: `translate(${xs}px, 128px)`, opacity: 1, offset: 0.55 }, { transform: `translate(${150 + i * 14}px, 236px)`, opacity: 1 }]
          : [{ transform: `translate(${x0}px, 30px)`, opacity: 0 }, { transform: `translate(${xs}px, 126px)`, opacity: 1, offset: 0.7 }, { transform: `translate(${xs}px, 120px)`, opacity: 1, offset: 0.85 }, { transform: `translate(${xs}px, 124px)`, opacity: 1 }];
        anims.push(g.animate(frames, { duration: reduce ? 1 : 1500, delay: reduce ? 0 : 300 + i * 200, easing: 'ease-in', fill: 'forwards' }).finished);
        if (broken) g.classList.add('bad');
      });
      await Promise.all(anims);
      svBusy = false; svRun.disabled = false;
      if (broken) {
        svState.textContent = 'Desviación'; svState.className = 'chip bad';
        svRet.innerHTML = '<span class="chip bad">Materia extraña pasó al bowl</span>';
        status(1, 'bad', 'Desviación del PCC 1', H.pccs[0].acciones[0].producto);
        Sound.alert(); shake(svg);
      } else {
        svState.textContent = 'Conforme'; svState.className = 'chip ok';
        svRet.innerHTML = '<span class="muted small">Retenido en la malla:</span><span class="chip warn">1 insecto</span><span class="chip warn">1 hilo</span><span class="chip warn">1 piedra</span>';
        status(1, 'ok', 'Conforme · malla íntegra', 'La malla retuvo la materia extraña. Se revisa lo retenido, se inspecciona la malla después del lote y se anota en el F15.');
        Sound.ok(); pop(svg, 10);
      }
    }
    svRun.addEventListener('click', runSieve);
    svLook.addEventListener('click', () => {
      const broken = svBroken.classList.contains('on');
      svg.classList.remove('look'); void svg.getBoundingClientRect(); svg.classList.add('look');
      if (broken) { status(1, 'bad', 'Malla rota a contraluz', 'No se puede tamizar con ella. Se cambia por el tamiz de repuesto y se busca el fragmento faltante de la malla.'); Sound.bad(); }
      else { status(1, 'ok', 'Malla íntegra a contraluz', 'Sin roturas, deformaciones ni hilos sueltos: se puede tamizar.'); Sound.sparkle(); }
    });
    svBroken.addEventListener('click', () => {
      const on = !svBroken.classList.contains('on');
      svBroken.classList.toggle('on', on); svBroken.setAttribute('aria-pressed', on);
      svg.classList.toggle('broken', on);
      svg.classList.remove('sifted');
      parts.innerHTML = ''; svRet.innerHTML = '';
      sieveIdle(); (on ? Sound.bad : Sound.ok)();
    });
    sieveIdle();

    // PCC 2 · Horneo
    const ovR = $('#ovR'), ovV = $('#ovV'), ovRead = $('#ovRead'), ovFill = $('#ovFill'), ovChip = $('#ovChip');
    const ovC1 = $('#ovC1'), ovC2 = $('#ovC2'), ovCrumb = $('#ovCrumb'), ovCore = $('#ovCore'), ovHeat = $('#ovHeat'), ovHoles = $('#ovHoles');
    const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)); const A1 = p(a), B1 = p(b); return `rgb(${A1.map((v, k) => Math.round(v + (B1[k] - v) * t)).join(',')})`; };
    let ovPrev = null;
    function oven(e) {
      const v = +ovR.value, t = Math.max(0, Math.min(1, (v - 40) / 60));
      ovV.textContent = ovRead.textContent = `${v} °C`;
      const h = 170 * t;
      ovFill.setAttribute('y', (175 - h).toFixed(1)); ovFill.setAttribute('height', h.toFixed(1));
      ovC1.setAttribute('stop-color', mix('#EED9A0', '#D9A04F', t)); ovC2.setAttribute('stop-color', mix('#E2C27E', '#A86A2A', t));
      ovCrumb.style.fill = mix('#F1D27A', '#FBEBC2', t);
      ovCore.style.opacity = (1 - t) * 0.9;
      ovHoles.style.opacity = 0.2 + t * 0.6;
      ovHeat.style.opacity = t;
      const st = v < 71 ? 'bad' : v < 93 ? 'warn' : 'ok';
      ovFill.setAttribute('class', 'th-fill ' + st);
      ovChip.textContent = st === 'bad' ? 'Bajo el límite crítico' : st === 'warn' ? 'Cumple, sin margen' : 'Conforme';
      ovChip.className = 'chip ' + st;
      if (st === 'bad') status(2, 'bad', `Centro ${v} °C · por debajo de 71 °C`, H.pccs[1].acciones[0].producto);
      else if (st === 'warn') status(2, 'warn', `Centro ${v} °C · cumple el límite crítico`, 'Pero no llega al límite operativo (≥ 93 °C): se corrige antes de llegar al crítico, revisando la temperatura real del horno y el tiempo.');
      else status(2, 'ok', `Centro ${v} °C · conforme`, 'Por encima del límite operativo: la Salmonella del huevo se destruye con margen de seguridad. Se anota en el F15.');
      if (e) { Sound.slide(t); if (ovPrev && ovPrev !== st) (st === 'bad' ? Sound.bad : st === 'ok' ? Sound.ok : Sound.tick)(); }
      ovPrev = st;
    }
    ovR.addEventListener('input', oven);
    oven();

    // PCC 3 · Enfriamiento
    const clT = $('#clT'), clH = $('#clH'), clCover = $('#clCover'), coolSvg = $('#coolSvg');
    let clPrev = null;
    const hfmt = (h) => { const m = Math.round(h * 60); return `${Math.floor(m / 60)} h ${pad(m % 60)} min`; };
    function cool(e) {
      const T = +clT.value, t = +clH.value, cov = clCover.classList.contains('on');
      $('#clTV').textContent = `${T} °C`;
      $('#clHV').textContent = `${fix(t, 2)} h`;
      $('#clClockT').textContent = hfmt(t);
      coolSvg.style.setProperty('--hot', Math.max(0, Math.min(1, (T - 30) / 25)).toFixed(2));
      coolSvg.style.setProperty('--steam', Math.max(0, Math.min(1, (T - 26) / 30)).toFixed(2));
      coolSvg.classList.toggle('open', !cov);
      let st;
      if (!cov) { st = 'bad'; status(3, 'bad', 'Producto descubierto o área abierta', H.pccs[2].acciones[1].producto); }
      else if (t > 3) { st = 'bad'; status(3, 'bad', `${hfmt(t)} de exposición · más de 3 h`, H.pccs[2].acciones[1].producto); }
      else if (T > 30) { st = 'warn'; status(3, 'warn', `${T} °C · todavía no se empaca`, 'Empacar caliente condensa vapor en la bolsa y favorece los mohos. ' + H.pccs[2].acciones[0].producto); }
      else if (t >= 1.5 && t <= 2) { st = 'ok'; status(3, 'ok', 'Listo para empacar · límite operativo', `${T} °C y ${hfmt(t)}: dentro de la ventana ideal de 1,5 a 2 h. Se anota en el F15.`); }
      else { st = 'ok'; status(3, 'ok', 'Cumple el límite crítico', `${T} °C y ${hfmt(t)}, producto cubierto: se puede empacar. Lo ideal es hacerlo entre 1,5 y 2 h.`); }
      if (e) { if (e.type === 'input') Sound.slide(e.target === clT ? (T - 20) / 40 : t / 5); if (clPrev && clPrev !== st) (st === 'bad' ? Sound.bad : st === 'ok' ? Sound.ok : Sound.tick)(); }
      clPrev = st;
    }
    clT.addEventListener('input', cool);
    clH.addEventListener('input', cool);
    clCover.addEventListener('click', (e) => { const on = !clCover.classList.contains('on'); clCover.classList.toggle('on', on); clCover.setAttribute('aria-pressed', on); cool(e); });
    cool();

    // PCC 4 · Rotulado: juego de etiquetas
    const lbgStage = $('#lbgStage'), lbgDots = $('#lbgDots'), lbScore = $('#lbScore');
    const E = CB.etiqueta || { ingredientes: '', alergenos: 'Contiene: trigo (gluten), huevo y leche.', conservacion: '', pie: '' };
    const ESC = [
      { ok: true, porque: 'Declara gluten, huevo y leche, tiene lote, vence a los 5 días y el sellado está íntegro.' },
      { ok: false, alerg: false, porque: 'No declara los alérgenos (gluten, huevo, leche): puede causar anafilaxia en una persona alérgica.', acc: 0 },
      { ok: false, venc: 8, porque: 'El vencimiento no es elaboración + 5 días: se separa y se reetiqueta.', acc: 0 },
      { ok: true, porque: 'Coincide con la etiqueta maestra en todos los puntos.' },
      { ok: false, lote: false, porque: 'No tiene código de lote: sin él no hay trazabilidad ni retiro posible.', acc: 0 },
      { ok: false, sello: false, porque: 'El sellado está abierto: la bolsa no protege el ponqué.', acc: 1 }
    ];
    let lOrder, lI, lOk, lRes;
    const dmy = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    function lbCard() {
      lbgDots.innerHTML = ESC.map((_, k) => `<i class="${lRes[k] === true ? 'ok' : lRes[k] === false ? 'bad' : k === lI ? 'cur' : ''}"></i>`).join('');
      lbScore.textContent = `${lOk} / ${lRes.length}`;
      if (lI >= lOrder.length) { lbEnd(); return; }
      const s = lOrder[lI], d = new Date(), v = new Date(d);
      v.setDate(v.getDate() + (s.venc || 5));
      const lote = `PQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(lI + 1)}`;
      lbgStage.innerHTML = `<div class="lbg enter">
        <div class="seal ${s.sello === false ? 'open' : ''}"><span>${s.sello === false ? 'Sellado abierto' : 'Sellado ✓'}</span></div>
        <div class="label lbg-label">
          <div class="lb-head"><img class="lb-logo" src="logo.webp" alt=""><div><div class="lb-title">Ponqué de Vainilla</div><div class="lb-brand">ADEX Sweets &amp; Pink</div></div></div>
          <div class="lb-sec"><b>Ingredientes</b>${E.ingredientes}</div>
          ${s.alerg === false ? '' : `<div class="lb-alerg">${E.alergenos}</div>`}
          <div class="lb-grid">
            <div><span>Contenido neto</span><strong>454 g (entero de 1 lb)</strong></div>
            <div><span>Lote</span><strong>${s.lote === false ? '&nbsp;' : lote}</strong></div>
            <div><span>Elaborado</span><strong>${dmy(d)}</strong></div>
            <div><span>Fecha de vencimiento</span><strong>${dmy(v)}</strong></div>
          </div>
          <div class="lb-foot"><p>${E.pie}</p>${s.lote === false ? '' : `<div class="lb-bar">${X.barcode(lote)}<span>${lote}</span></div>`}</div>
        </div>
        <div class="insp-actions lbg-act"><button class="btn ok" data-l="1" data-quiet>✓ Conforme</button><button class="btn bad" data-l="0" data-quiet>✕ No conforme</button></div>
        <div class="stamp lbg-stamp" aria-hidden="true"></div>
      </div>`;
      status(4, '', `Unidad ${lI + 1} de ${lOrder.length}`, 'Compara la etiqueta y el sellado con la etiqueta maestra. Tolerancia cero.');
    }
    function lbAnswer(a, btn) {
      const s = lOrder[lI], good = (a === 1) === s.ok;
      if (good) lOk++;
      lRes[lI] = good;
      const box = $('.lbg', lbgStage);
      $$('[data-l]', box).forEach((b) => { b.disabled = true; });
      const st = $('.lbg-stamp', box);
      st.textContent = a ? 'LIBERADA' : 'RETENIDA';
      st.className = 'stamp lbg-stamp show ' + (a ? 'ok' : 'bad');
      Sound.stamp();
      setTimeout(good ? Sound.ok : Sound.bad, 120);
      if (good) setTimeout(() => pop(st, 10), 200); else shake(box);
      const fb = document.createElement('div');
      fb.className = 'insp-fb';
      fb.innerHTML = `<p class="fb-t ${good ? 'ok' : 'bad'}">${good ? 'Correcto.' : 'Revisa otra vez.'}</p><p><b>${s.ok ? 'Conforme:' : 'No conforme:'}</b> ${s.porque}</p>
        <button class="btn primary sm" data-lnext data-quiet>${lI === lOrder.length - 1 ? 'Ver resultado' : 'Siguiente unidad'} →</button>`;
      box.appendChild(fb);
      if (s.ok) status(4, 'ok', 'Unidad conforme', 'Sale con su etiqueta y sellado íntegro.');
      else status(4, 'bad', 'Unidad no conforme', H.pccs[3].acciones[s.acc].producto);
      lbgDots.innerHTML = ESC.map((_, k) => `<i class="${lRes[k] === true ? 'ok' : lRes[k] === false ? 'bad' : k === lI ? 'cur' : ''}"></i>`).join('');
      lbScore.textContent = `${lOk} / ${lRes.length}`;
    }
    function lbEnd() {
      const perfect = lOk === lOrder.length;
      lbgStage.innerHTML = `<div class="insp-card final enter"><p class="kicker">Lote revisado</p><p class="big-mark">${lOk}<small>/${lOrder.length}</small></p>
        <p>${perfect ? 'Ninguna etiqueta errada salió de la planta. Así funciona la tolerancia cero.' : 'Con tolerancia cero, una sola etiqueta errada que salga es una desviación del PCC 4.'}</p>
        <button class="btn primary" data-lreplay data-quiet>Revisar otro lote</button></div>`;
      status(4, perfect ? 'ok' : 'warn', perfect ? 'Lote liberado' : 'Repasa la etiqueta maestra', perfect ? 'Se anota «✓ 20/20» en el F15.' : 'Toda unidad dudosa se separa y se reetiqueta antes de salir.');
      if (perfect) { Sound.win(); burst(lbgStage); } else Sound.done();
    }
    function lbReset() { lOrder = X.shuffle(ESC); lI = 0; lOk = 0; lRes = []; lbCard(); }
    lbgStage.addEventListener('click', (e) => {
      const a = e.target.closest('[data-l]');
      if (a && !a.disabled) { lbAnswer(+a.dataset.l, a); return; }
      if (e.target.closest('[data-lnext]')) { lI++; Sound.click(); lbCard(); return; }
      if (e.target.closest('[data-lreplay]')) { Sound.click(); lbReset(); }
    });
    lbReset();

    /* ---------- 08 · Monitoreo ---------- */
    const monSeg = $('#monSeg'), monTxt = $$('.mon-txt');
    monSeg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b || b.classList.contains('on')) return;
      $$('button', monSeg).forEach((x) => x.classList.toggle('on', x === b));
      monTxt.forEach((p) => {
        p.classList.remove('flipin'); void p.offsetWidth;
        p.textContent = H.pccs[+p.dataset.pcc - 1].mon[b.dataset.f];
        p.classList.add('flipin');
      });
      Sound.flip();
    });

    // Registro de un lote (F15 y F16)
    const lf = (id) => $('#' + id);
    const toggles = ['lfTa', 'lfTd', 'lfSel'].map(lf);
    toggles.forEach((t) => t.addEventListener('click', () => { const on = !t.classList.contains('on'); t.classList.toggle('on', on); t.setAttribute('aria-pressed', on); Sound.tick(); }));
    const code = () => {
      const d = lf('lfFecha').value ? new Date(lf('lfFecha').value + 'T12:00:00') : new Date();
      const n = Math.max(1, Math.min(99, parseInt(lf('lfNum').value, 10) || 1));
      return `PQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(n)}`;
    };
    const updCode = () => { lf('loteCode').textContent = code(); };
    ['lfFecha', 'lfNum'].forEach((id) => lf(id).addEventListener('input', updCode));
    updCode();
    const mins = (s) => { const [h, m] = (s || '0:0').split(':').map(Number); return h * 60 + m; };
    const rowsEl = lf('lfRows'), rows16 = lf('lf16Rows'), lfMsg = lf('lfMsg');
    function addLote(v) {
      const r = v || {
        lote: code(), ta: lf('lfTa').classList.contains('on'), td: lf('lfTd').classList.contains('on'),
        ho: +lf('lfHo').value, min: +lf('lfMin').value, cen: +lf('lfCen').value,
        sal: lf('lfSal').value, emp: lf('lfEmp').value, te: +lf('lfTe').value,
        et: Math.max(0, Math.min(20, +lf('lfEt').value)), sel: lf('lfSel').classList.contains('on')
      };
      const dt = mins(r.emp) - mins(r.sal);
      const c1 = r.ta && r.td;
      const c2 = r.cen >= 71;
      const op2 = r.ho >= 170 && r.ho <= 180 && r.min >= 45 && r.min <= 55 && r.cen >= 93;
      const c3 = r.te <= 30 && dt >= 0 && dt <= 180;
      const op3 = dt >= 90 && dt <= 120;
      const c4 = r.et === 20 && r.sel;
      const ok = c1 && c2 && c3 && c4;
      const cell = (good, txt, warn) => `<td class="${good ? (warn ? 'c-warn' : 'c-ok') : 'c-bad'}">${txt}</td>`;
      rowsEl.insertAdjacentHTML('beforeend', `<tr class="fade-in">
        <td class="mono">${r.lote}</td>
        ${cell(c1, `${r.ta ? '✓' : '✕'} / ${r.td ? '✓' : '✕'}`)}
        ${cell(c2, `${r.ho} °C · ${r.min} min<br><b>${r.cen} °C</b>`, !op2)}
        ${cell(c3, `${dt >= 0 ? hfmt(dt / 60) : '—'}<br><b>${r.te} °C</b>`, !op3)}
        ${cell(c4, `${r.et}/20 · ${r.sel ? 'sellado ✓' : 'sellado ✕'}`)}
        <td><span class="chip xs ${ok ? 'ok' : 'bad'}">${ok ? 'Sí' : 'No'}</span></td></tr>`);
      const devs = [];
      if (!c1) devs.push([1, 'Malla rota, deformada u objeto extraño', H.pccs[0].acciones[0]]);
      if (!c2) devs.push([2, `Centro ${r.cen} °C (< 71 °C)`, H.pccs[1].acciones[0]]);
      if (!c3) {
        if (dt > 180 || dt < 0) devs.push([3, `${dt < 0 ? 'Horas inválidas' : hfmt(dt / 60) + ' de exposición (> 3 h)'}`, H.pccs[2].acciones[1]]);
        if (r.te > 30) devs.push([3, `${r.te} °C al empacar (> 30 °C)`, H.pccs[2].acciones[0]]);
      }
      if (!c4) {
        if (r.et < 20) devs.push([4, `${20 - r.et} etiqueta(s) errada(s)`, H.pccs[3].acciones[0]]);
        if (!r.sel) devs.push([4, 'Sellado defectuoso', H.pccs[3].acciones[1]]);
      }
      devs.forEach(([n, d, a]) => rows16.insertAdjacentHTML('beforeend', `<tr class="fade-in"><td class="mono">${r.lote}</td><td><span class="chip xs warn">PCC ${n}</span></td><td>${d}</td><td>${a.producto}</td><td>${a.resp}</td></tr>`));
      lf('lfOut').hidden = false;
      lf('lf16').hidden = !rows16.children.length;
      if (ok) {
        lfMsg.className = 'lote-msg ok';
        lfMsg.textContent = (!op2 || !op3) ? `${r.lote} conforme. Ojo: un valor quedó fuera del límite operativo (celda ámbar); se corrige antes de llegar al crítico.` : `${r.lote} conforme en los cuatro PCC.`;
        if (!v) { Sound.ok(); pop(lf('lfAdd'), 10); }
      } else {
        lfMsg.className = 'lote-msg bad';
        lfMsg.textContent = `${r.lote}: ${devs.length} desviación${devs.length === 1 ? '' : 'es'}. Se aplica la acción correctiva y se anota en el F16.`;
        if (!v) { Sound.bad(); shake(lf('lote')); }
      }
      if (!v) lf('lfNum').value = Math.min(99, (parseInt(lf('lfNum').value, 10) || 1) + 1), updCode();
    }
    lf('lfAdd').addEventListener('click', () => addLote());
    lf('lfDemo').addEventListener('click', () => {
      rowsEl.innerHTML = ''; rows16.innerHTML = '';
      addLote({ lote: 'PQ-261102-01', ta: true, td: true, ho: 175, min: 50, cen: 96, sal: '10:50', emp: '12:35', te: 28, et: 20, sel: true });
      addLote({ lote: 'PQ-261102-02', ta: true, td: true, ho: 172, min: 48, cen: 68, sal: '13:05', emp: '14:50', te: 29, et: 20, sel: true });
      lfMsg.className = 'lote-msg warn';
      lfMsg.innerHTML = 'Ejemplo del plan: en el lote 02 el centro marcó 68 °C. Se devolvió al horno 7 minutos, alcanzó 95 °C y la desviación quedó en el F16.';
      Sound.chime();
    });
    lf('lfClear').addEventListener('click', () => { rowsEl.innerHTML = ''; rows16.innerHTML = ''; lf('lfOut').hidden = true; lfMsg.textContent = ''; lfMsg.className = 'lote-msg'; });

    /* ---------- 09 · Acciones correctivas ---------- */
    $('#devs').addEventListener('click', (e) => {
      const b = e.target.closest('.seg button');
      if (!b || b.classList.contains('on')) return;
      const card = b.closest('.dev'), p = $('.dev-txt', card);
      $$('.seg button', card).forEach((x) => x.classList.toggle('on', x === b));
      p.classList.remove('flipin'); void p.offsetWidth;
      p.textContent = decodeURIComponent(p.dataset[b.dataset.v]);
      p.classList.add('flipin');
      Sound.flip();
    });
    let esN = 0;
    const esUpd = (s) => {
      $('#esN').textContent = esN;
      const m = $('#esMsg');
      const hot = esN >= 2;
      $('.escal').classList.toggle('hot', hot);
      m.className = 'escal-msg ' + (hot ? 'bad' : esN ? 'warn' : '');
      m.textContent = hot ? 'Se activa la regla: reunión del equipo, análisis de causa raíz y capacitación específica (F10).' : esN ? 'Una desviación: se corrige y se registra en el F16.' : 'Sin desviaciones este mes.';
      if (s) { if (hot && esN === 2) Sound.alert(); else Sound.tick(); }
    };
    $('#esPlus').addEventListener('click', () => { esN = Math.min(9, esN + 1); esUpd(true); });
    $('#esMinus').addEventListener('click', () => { esN = Math.max(0, esN - 1); esUpd(true); });
    esUpd(false);

    /* ---------- 10 · Verificación ---------- */
    const omGrid = $('#omGrid'), omCells = $$('.om-cell', omGrid), omChip = $('#omChip'), omMsg = $('#omMsg');
    const omSeen = new Set();
    const tColor = (v) => { const t = Math.max(0, Math.min(1, (v - 93) / 6)); return `color-mix(in srgb, var(--peach) ${Math.round(t * 100)}%, var(--lilac))`; };
    function measure(i, quiet) {
      if (omSeen.has(i)) return;
      omSeen.add(i);
      const c = omCells[i], v = H.hornoDemo[i], el = $('.om-v', c);
      c.classList.add('done');
      c.style.setProperty('--tc', tColor(v));
      X.countUp(el, v, reduce ? 0 : 600);
      setTimeout(() => { el.textContent = v + ' °C'; }, reduce ? 0 : 650);
      omChip.textContent = `${omSeen.size} de 9 medidas`;
      if (!quiet) Sound.note(i);
      if (omSeen.size === 9) setTimeout(omDone, reduce ? 0 : 700);
    }
    function omDone() {
      const min = Math.min(...H.hornoDemo), k = H.hornoDemo.indexOf(min);
      omCells[k].classList.add('cold');
      omChip.textContent = 'Mapeo completo'; omChip.className = 'chip ok';
      omMsg.innerHTML = `Punto más frío: <b>${$('.om-pos', omCells[k]).textContent} (${min} °C)</b>. Ahí se ubica el ponqué donde se mide el PCC 2 en cada lote.`;
      Sound.chime(); pop(omCells[k], 12);
    }
    omGrid.addEventListener('click', (e) => { const c = e.target.closest('.om-cell'); if (c) measure(+c.dataset.i); });
    $('#omAll').addEventListener('click', () => omCells.forEach((_, i) => setTimeout(() => measure(i, i % 2 === 1), reduce ? 0 : i * 110)));
    $('#omReset').addEventListener('click', () => {
      omSeen.clear();
      omCells.forEach((c) => { c.classList.remove('done', 'cold'); $('.om-v', c).textContent = '—'; });
      omChip.textContent = '0 de 9 medidas'; omChip.className = 'chip'; omMsg.textContent = '';
    });
    $('#lots').addEventListener('click', (e) => {
      const b = e.target.closest('.lot');
      if (!b) return;
      b.classList.toggle('on');
      const all = $$('.lot.on').length === 3;
      if (b.classList.contains('on')) { pop(b, 8); if (all) { Sound.win(); burst($('#lots')); } else Sound.ok(); } else Sound.tick();
    });
    const vu = $('#vu'), vuTxt = $('#vuTxt'), vuFill = $('#vuFill');
    function pickVu(i, user) {
      const d = H.vidaUtil[i];
      $$('.vu-dot', vu).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('past', k < i); });
      vuFill.style.width = (d.dia / 6) * 100 + '%';
      vuTxt.innerHTML = `<b>${d.t}.</b> ${d.texto}`;
      if (user) Sound.note(i * 2);
    }
    vu.addEventListener('click', (e) => { const b = e.target.closest('.vu-dot'); if (b) pickVu(+b.dataset.i, true); });
    pickVu(0);
    const iceGo = $('#iceGo'), iceRead = $('#iceRead'), iceMsg = $('#iceMsg');
    iceGo.addEventListener('click', () => {
      iceGo.disabled = true; iceMsg.textContent = ''; iceMsg.className = 'ice-msg';
      const target = Math.random() < 0.8 ? (Math.random() * 1.8 - 0.9) : (Math.random() < 0.5 ? -1.6 : 1.5);
      const t0 = performance.now(), from = 24, dur = reduce ? 1 : 1600;
      Sound.drip();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = from + (target - from) * e;
        iceRead.textContent = `${fix(v, 1)} °C`;
        if (k < 1) requestAnimationFrame(step);
        else {
          const ok = Math.abs(target) <= 1;
          iceRead.className = 'ice-read mono ' + (ok ? 'ok' : 'bad');
          iceMsg.className = 'ice-msg ' + (ok ? 'ok' : 'bad');
          iceMsg.textContent = ok ? 'Dentro de 0 °C ± 1 °C: el termómetro sirve. Se anota en el F17.' : 'Fuera de 0 °C ± 1 °C: no se usa para monitorear hasta calibrarlo con laboratorio acreditado (F17).';
          (ok ? Sound.ok : Sound.bad)();
          iceGo.disabled = false;
        }
      };
      requestAnimationFrame(step);
    });

    /* ---------- 11 · Registros ---------- */
    function openHFormats() {
      Modal.open({
        kicker: 'ADEX Sweets & Pink · Registros del plan HACCP',
        title: 'Los 6 formatos nuevos',
        body: `<div class="fmt-list"><div class="fmt-row head"><span>Código</span><span>Formato</span><span>Frecuencia</span><span>Responsable</span><span></span></div>${H.formatosH.map((f) => `
          <div class="fmt-row"><span class="fmt-code">ADX-${f.cod}</span><span class="fmt-name">${f.nombre}<br><span class="muted small">${f.det}</span></span><span class="muted">${f.frec}</span><span class="muted">${f.resp}</span>
          <span>${f.ejemplo ? `<button class="btn ghost xs" data-hf="${f.cod}" data-quiet>Ver ejemplo</button>` : ''}</span></div>`).join('')}</div>
          <p class="fmt-note">Se suman a los 14 formatos del plan BPM (F01 a F14), que funcionan como registros de los programas prerrequisito.</p>`
      });
    }
    function openHFormat(cod) {
      const f = H.formatosH.find((x) => x.cod === cod);
      if (!f.ejemplo) { openHFormats(); return; }
      const ex = H[f.ejemplo];
      Modal.open({
        kicker: `ADEX Sweets & Pink · ADX-${f.cod} · Versión 1 · ${f.resp}`,
        title: f.nombre,
        body: `<div class="tbl-wrap"><table class="tbl"><thead><tr>${ex.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${ex.filas.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}<tr>${ex.cols.map(() => '<td class="empty"></td>').join('')}</tr></tbody></table></div>
          <p class="fmt-note">${ex.nota}</p><div class="row mt"><button class="btn ghost sm" data-hall data-quiet>← Los 6 formatos HACCP</button></div>`
      });
    }
    $('#fmtAll').addEventListener('click', openHFormats);
    $('#files').addEventListener('click', (e) => { const b = e.target.closest('[data-hf]'); if (b) { pop(b, 8); openHFormat(b.dataset.hf); } });
    $('#modal').addEventListener('click', (e) => {
      const b = e.target.closest('[data-hf]');
      if (b) { openHFormat(b.dataset.hf); return; }
      if (e.target.closest('[data-hall]')) openHFormats();
    });
    const files = $('#files');
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { files.classList.add('in'); o.disconnect(); X.countUp($('#fsTotal'), 20, 1400, 600); } }, { threshold: 0.25 }).observe(files);

    /* ---------- 12 · Matriz ---------- */
    const mx = $('#mx'), mxCap = $('#mxCap'), mxPlay = $('#mxPlay');
    const PRIN = ['', 'Análisis de peligros', 'Determinación de los PCC', 'Límites críticos', 'Monitoreo', 'Acciones correctivas', 'Verificación', 'Registros'];
    const colP = [2, 1, 3, 4, 5, 6, 7];
    function hiCol(c) {
      $$('[data-c]', mx).forEach((el) => el.classList.toggle('hi', c !== null && +el.dataset.c === c));
      mx.classList.toggle('dim', c !== null);
      mxCap.textContent = c === null ? 'Pasa el cursor o toca una columna' : `Principio ${colP[c]} · ${PRIN[colP[c]]}`;
    }
    mx.addEventListener('pointerover', (e) => { if (mxPlay.classList.contains('playing')) return; const td = e.target.closest('[data-c]'); if (td) hiCol(+td.dataset.c); });
    mx.addEventListener('pointerleave', () => { if (!mxPlay.classList.contains('playing')) hiCol(null); });
    mx.addEventListener('click', (e) => { const td = e.target.closest('[data-c]'); if (td) { hiCol(+td.dataset.c); Sound.pop(); } });
    let mxTok = 0;
    async function playMx() {
      const my = ++mxTok;
      mxPlay.classList.add('playing'); $('span', mxPlay).textContent = 'Detener';
      const order = [1, 0, 2, 3, 4, 5, 6];
      for (let k = 0; k < order.length; k++) {
        if (my !== mxTok) return;
        hiCol(order[k]); Sound.note(k);
        await wait(2400);
      }
      if (my !== mxTok) return;
      stopMx(); Sound.done();
    }
    function stopMx() { mxTok++; mxPlay.classList.remove('playing'); $('span', mxPlay).textContent = 'Recorrer por principio'; hiCol(null); }
    mxPlay.addEventListener('click', () => (mxPlay.classList.contains('playing') ? stopMx() : playMx()));
    const capBar = $('.cap-bar');
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { capBar.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }).observe(capBar);

    /* ---------- 13 · Cierre ---------- */
    $('#hFlips').addEventListener('click', (e) => {
      const b = e.target.closest('.flip');
      if (!b) return;
      const on = !b.classList.contains('on');
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      Sound.flip();
    });
    const thanks = $('.h-thanks');
    thanks.style.cursor = 'pointer';
    thanks.addEventListener('click', () => { burst(thanks); Sound.win(); });

    /* ---------- Atajos de teclado en el panel HACCP ---------- */
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest('input, select, textarea, [contenteditable]')) return;
      if (Modal.isOpen) return;
      const k = e.key;
      if (k.toLowerCase() === 'h' || (e.shiftKey && (k === 'ArrowRight' || k === 'ArrowLeft'))) {
        e.preventDefault(); e.stopImmediatePropagation();
        if (k === 'ArrowRight') Deck.go(1); else if (k === 'ArrowLeft') Deck.go(0); else Deck.toggle();
        return;
      }
      if (Deck.idx !== 1) return;
      if (/^[1-9]$/.test(k)) { goTo(H.agenda[+k - 1].id); return; }
      if (k === '0') { panel.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
      switch (k.toLowerCase()) {
        case 't': TimerH.toggle(); break;
        case 'm': $('#btnSound').click(); break;
        case 'd': X.toggleTheme(); break;
      }
    });

    // Si el enlace pedía una sección del HACCP, ir a ella
    const h = location.hash;
    if (h.indexOf('#h-') === 0 && document.getElementById(h.slice(1))) setTimeout(() => goTo(h.slice(1)), 60);
    setTimeout(Deck.maybeHint, 2600);
  }

  /* ---------- Cronómetro de la exposición HACCP (20 minutos) ---------- */
  const TimerH = (() => {
    const el = $('#timerH'), tt = $('#timerTimeH'), now = $('#timerNowH'), ring = $('#timerRingH');
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
      let i = H.agenda.findIndex((a) => min >= a.desde && min < a.hasta);
      if (i < 0) i = H.agenda.length - 1;
      const cur = H.agenda[i], nx = H.agenda[i + 1];
      now.textContent = rem < 0 ? `Tiempo extra · ${cur.nombre}` : nx ? `Ahora: ${cur.nombre} · sigue ${nx.nombre} en el min ${nx.desde}` : `Ahora: ${cur.nombre} · termina en el min 20`;
      ring.style.strokeDashoffset = CIRC * (1 - Math.min(1, sec / TOTAL));
      el.classList.toggle('warn', rem <= 120 && rem > 0);
      el.classList.toggle('over', rem <= 0);
      if (lastSeg !== i) {
        if (lastSeg !== null) snd('chime');
        $$('#navLinksH a').forEach((a) => a.classList.toggle('now', a.hash === '#' + cur.id));
        lastSeg = i;
      }
      if (rem <= 120 && !warned) { warned = true; snd('alert'); }
      if (rem <= 0 && !overed) { overed = true; snd('alert'); setTimeout(() => snd('alert'), 500); }
    }
    function start() {
      running = true; t0 = Date.now(); lastSeg = null; warned = false; overed = false;
      el.classList.add('run'); el.setAttribute('aria-label', 'Detener cronómetro');
      tick(); iv = setInterval(tick, 250); snd('ok');
    }
    function stop() {
      running = false; clearInterval(iv);
      el.classList.remove('run', 'warn', 'over'); el.removeAttribute('aria-label');
      tt.textContent = 'Iniciar 20:00'; now.textContent = '';
      ring.style.strokeDashoffset = CIRC;
      $$('#navLinksH a').forEach((a) => a.classList.remove('now'));
      snd('click');
    }
    el.addEventListener('click', () => (running ? stop() : start()));
    return { start, stop, toggle: () => (running ? stop() : start()), get running() { return running; } };
  })();

  if (window.ADEX) bind();
  else document.addEventListener('adex:ready', bind, { once: true });
})();
