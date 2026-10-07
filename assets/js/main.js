import { profile, roles, defaultRole, skills, projects, posts } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const roleKeys = Object.keys(roles);

/* ---------- 고정 정보 채우기 ---------- */
$$('[data-bind]').forEach((el) => { el.textContent = profile[el.dataset.bind] ?? ''; });
$$('[data-href]').forEach((el) => { el.href = profile[el.dataset.href] || '#'; });
$('#mail-link').href = `mailto:${profile.email}`;
$('#keywords').innerHTML = profile.keywords.map((k) => `<span class="chip">${esc(k)}</span>`).join('');

/* ---------- 직무(?role=) ---------- */
function readRole() {
  const r = new URLSearchParams(location.search).get('role');
  return roleKeys.includes(r) ? r : defaultRole;
}
let currentRole = readRole();

const tabs = $('#role-tabs');
tabs.innerHTML = roleKeys.map((k) => `<button type="button" role="tab" data-role="${k}">${k}</button>`).join('');
tabs.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-role]');
  if (btn) setRole(btn.dataset.role);
});
tabs.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const i = roleKeys.indexOf(currentRole);
  const next = roleKeys[(i + (e.key === 'ArrowRight' ? 1 : roleKeys.length - 1)) % roleKeys.length];
  setRole(next);
  $(`button[data-role="${next}"]`, tabs).focus();
});

function setRole(role, { push = true } = {}) {
  if (!roles[role]) return;
  currentRole = role;
  if (push) {
    const url = new URL(location.href);
    url.searchParams.set('role', role);
    history.replaceState(null, '', url);
  }
  applyRole();
}

let typeTimer;
function typeTitle(text) {
  const el = $('#role-title');
  clearInterval(typeTimer);
  if (reduceMotion) { el.textContent = text; return; }
  let i = 0;
  el.textContent = '';
  typeTimer = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(typeTimer);
  }, 38);
}

function applyRole() {
  const r = roles[currentRole];
  document.documentElement.style.setProperty('--rgb', r.rgb);
  $$('button[data-role]', tabs).forEach((b) => {
    const on = b.dataset.role === currentRole;
    b.setAttribute('aria-selected', on);
    b.tabIndex = on ? 0 : -1;
  });
  $$('[data-role-name]').forEach((el) => { el.textContent = currentRole; });
  $('#constellation-role').textContent = currentRole;
  typeTitle(r.title);
  $('#stack').innerHTML = skills[currentRole].map((s, i) => `<span class="chip" style="animation-delay:${i * 40}ms">${esc(s)}</span>`).join('');
  renderConstellation();
  renderProjects();
  renderLog();
  starfield.refresh();
}

/* ---------- 별자리 ---------- */
const VIEW = { w: 600, h: 540 };
const NODES = [[90, 130], [230, 70], [370, 160], [470, 262], [520, 440], [300, 320], [150, 410]];
const BIG = new Set([0, 2]);
const EDGES = [
  { d: 'M90 130 L230 70 L370 160 L470 262 L520 440' },
  { d: 'M370 160 L300 320 L150 410' },
  { d: 'M300 320 L470 262', faint: true },
];

function renderConstellation() {
  const box = $('#constellation');
  const list = skills[currentRole].slice(0, NODES.length);
  const svg = `<svg viewBox="0 0 ${VIEW.w} ${VIEW.h}" preserveAspectRatio="none" aria-hidden="true">${EDGES.map((e, i) => `<path d="${e.d}" class="${e.faint ? 'faint' : ''}" style="animation-delay:${i * 0.25}s"></path>`).join('')}</svg>`;
  const nodes = list.map((skill, i) => {
    const [x, y] = NODES[i];
    const big = BIG.has(i);
    const flip = x > 420;
    const used = projects.filter((p) => p.tags.includes(skill));
    const tip = used.length ? `사용한 프로젝트: ${used.map((p) => p.title).join(', ')}` : '이 기술을 쓴 프로젝트를 추가해 보세요';
    const offset = big ? 15 : 12;
    const transform = flip ? `translate(calc(-100% + ${offset}px), -50%)` : `translate(-${offset}px, -50%)`;
    return `<button type="button" class="star-node${big ? ' star-node--big' : ''}" data-skill="${esc(skill)}"
      style="left:${(x / VIEW.w) * 100}%;top:${(y / VIEW.h) * 100}%;transform:${transform};flex-direction:${flip ? 'row-reverse' : 'row'};animation-delay:${0.15 + i * 0.12}s"
      aria-label="${esc(skill)}. ${esc(tip)}">
      <span class="star-node__dot" style="animation-delay:${i * 0.37}s"></span>
      <span class="star-node__label">${esc(skill)}</span>
      <span class="star-node__tip" style="${flip ? 'left:auto;right:34px' : ''}">${esc(tip)}</span>
    </button>`;
  }).join('');
  box.innerHTML = svg + nodes;
}

$('#constellation').addEventListener('click', (e) => {
  const node = e.target.closest('.star-node');
  if (!node) return;
  const p = projects.find((pr) => pr.tags.includes(node.dataset.skill));
  const target = p ? document.getElementById(p.id) : $('#about');
  target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
});

/* ---------- 프로젝트 ---------- */
function orderedProjects() {
  const match = projects.filter((p) => p.roles.includes(currentRole))
    .sort((a, b) => a.roles.indexOf(currentRole) - b.roles.indexOf(currentRole));
  const rest = projects.filter((p) => !p.roles.includes(currentRole));
  return { match, rest };
}

function cardHTML(p, featured) {
  const meta = `${esc(p.period)} · ${esc(p.team)} · ${p.roles.map(esc).join(' / ')}`;
  const tags = `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
  if (!featured) {
    return `<article class="card card--minor reveal" id="${p.id}">
      <div class="card__body">
        <div class="card__meta">${meta}</div>
        <h3 class="card__title">${esc(p.title)} <span class="arrow">↗</span></h3>
        <p class="muted">${esc(p.summary)}</p>
        ${tags}
      </div>
    </article>`;
  }
  return `<article class="card reveal" id="${p.id}">
    <div class="card__thumb">[스크린샷]</div>
    <div class="card__body">
      <div class="card__meta"><span class="badge">대표</span>${meta}</div>
      <h3 class="card__title">${esc(p.title)} <span class="arrow">↗</span></h3>
      <dl class="par">
        <dt>문제</dt><dd>${esc(p.problem)}</dd>
        <dt>한 일</dt><dd>${esc(p.action)}</dd>
        <dt>성과</dt><dd>${esc(p.result)}</dd>
      </dl>
      ${tags}
      <div class="card__links">
        <a href="${esc(p.links.github)}" target="_blank" rel="noopener">GitHub →</a>
        <a href="${esc(p.links.demo)}" target="_blank" rel="noopener">Demo →</a>
      </div>
    </div>
  </article>`;
}

let indexObserver;
function renderProjects() {
  const { match, rest } = orderedProjects();
  const list = $('#project-list');
  list.innerHTML = match.map((p) => cardHTML(p, true)).join('')
    + (rest.length ? `<p class="group-label">// 그 밖의 프로젝트</p>${rest.map((p) => cardHTML(p, false)).join('')}` : '');

  const all = [...match, ...rest];
  $('#project-index').innerHTML = all.map((p, i) =>
    `<a href="#${p.id}" data-id="${p.id}" class="${p.roles.includes(currentRole) ? 'is-match' : ''}${i === 0 ? ' is-active' : ''}">0${i + 1} ${esc(p.short)}</a>`).join('');

  $$('.card', list).forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  indexObserver?.disconnect();
  indexObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$('#project-index a').forEach((a) => a.classList.toggle('is-active', a.dataset.id === en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.card', list).forEach((c) => indexObserver.observe(c));
  observeReveals(list);
}

/* ---------- 블로그 ---------- */
function renderLog() {
  const sorted = [...posts].sort((a, b) => Number(b.roles.includes(currentRole)) - Number(a.roles.includes(currentRole)));
  $('#log-list').innerHTML = sorted.map((p) => `<li class="reveal is-in"><a href="${esc(p.url)}" target="_blank" rel="noopener">
    <span class="log__date">${esc(p.date)}</span>
    <span class="log__title">${esc(p.title)}</span>
    <span class="log__tag">#${esc(p.roles.includes(currentRole) ? currentRole : p.roles[0])}</span>
  </a></li>`).join('');
}

/* ---------- GitHub 잔디 (예시) ---------- */
(function renderGrass() {
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const cells = [];
  for (let i = 0; i < 7 * 40; i++) {
    const v = rnd();
    const a = v < 0.35 ? 0 : v < 0.6 ? 0.25 : v < 0.82 ? 0.5 : v < 0.95 ? 0.75 : 1;
    cells.push(a ? `<i style="background:rgba(var(--rgb),${a})"></i>` : '<i></i>');
  }
  $('#grass').innerHTML = cells.join('');
})();

/* ---------- 서울 시간 ---------- */
(function clock() {
  const el = $('#clock');
  const fmt = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { el.textContent = `${fmt.format(new Date())} KST · UTC+9`; };
  tick();
  setInterval(tick, 30000);
})();

/* ---------- 밤하늘 별 ---------- */
const starfield = (() => {
  const canvas = $('#sky');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w = 0;
  let h = 0;
  let accent = roles[defaultRole].rgb;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() < 0.88 ? Math.random() * 0.9 + 0.4 : Math.random() * 1.2 + 1,
      depth: Math.random() * 0.25 + 0.05,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.002 + 0.0008,
      tinted: Math.random() < 0.08,
    }));
  }

  function draw(t = 0) {
    ctx.clearRect(0, 0, w, h);
    const sy = window.scrollY;
    for (const s of stars) {
      const y = (((s.y - sy * s.depth) % h) + h) % h;
      const a = reduceMotion ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.tinted ? `rgba(${accent}, ${a})` : `rgba(255, 246, 216, ${a})`;
      ctx.fill();
    }
  }

  function loop(t) {
    draw(t);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  if (reduceMotion) {
    draw();
    window.addEventListener('scroll', () => draw(), { passive: true });
  } else {
    requestAnimationFrame(loop);
  }
  return { refresh() { accent = roles[currentRole].rgb; if (reduceMotion) draw(); } };
})();

/* ---------- 스크롤 등장 효과 ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver.unobserve(en.target); }
  });
}, { threshold: 0.12 });
function observeReveals(root = document) {
  $$('.reveal:not(.is-in)', root).forEach((el) => revealObserver.observe(el));
}

const nav = $('.nav');
window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

/* ---------- ⌘K 빠른 이동 ---------- */
const palette = (() => {
  const root = $('#palette');
  const input = $('#palette-input');
  const list = $('#palette-list');
  let items = [];
  let filtered = [];
  let index = 0;
  let lastFocus = null;

  function buildItems() {
    items = [
      { label: 'About', hint: 'section', run: () => go('#about') },
      { label: 'Projects', hint: 'section', run: () => go('#projects') },
      { label: 'Log', hint: 'section', run: () => go('#log') },
      { label: 'Contact', hint: 'section', run: () => go('#contact') },
      ...roleKeys.map((k) => ({ label: `직무 바꾸기: ${k}`, hint: '?role', run: () => setRole(k) })),
      ...projects.map((p) => ({ label: p.title, hint: 'project', run: () => go(`#${p.id}`) })),
      { label: 'GitHub', hint: 'link', run: () => window.open(profile.github, '_blank', 'noopener') },
    ];
  }
  function go(hash) { document.querySelector(hash)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  function render() {
    const q = input.value.trim().toLowerCase();
    filtered = items.filter((it) => it.label.toLowerCase().includes(q) || it.hint.includes(q));
    index = Math.min(index, Math.max(filtered.length - 1, 0));
    list.innerHTML = filtered.length
      ? filtered.map((it, i) => `<li role="option" data-i="${i}" aria-selected="${i === index}"><span>${esc(it.label)}</span><span>${esc(it.hint)}</span></li>`).join('')
      : '<li aria-disabled="true"><span>결과가 없어요</span><span></span></li>';
  }
  function open() {
    lastFocus = document.activeElement;
    buildItems();
    root.hidden = false;
    input.value = '';
    index = 0;
    render();
    input.focus();
  }
  function close() {
    root.hidden = true;
    lastFocus?.focus?.();
  }
  function choose(i) {
    const it = filtered[i];
    if (!it) return;
    close();
    it.run();
  }
  input.addEventListener('input', () => { index = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); index = (index + 1) % Math.max(filtered.length, 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); index = (index - 1 + filtered.length) % Math.max(filtered.length, 1); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(index); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) choose(Number(li.dataset.i)); });
  root.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) close(); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden ? open() : close(); }
    else if (e.key === 'Escape' && !root.hidden) close();
  });
  $('#palette-open').addEventListener('click', open);
  return { open, close };
})();

/* ---------- 시작 ---------- */
applyRole();
observeReveals();
window.addEventListener('popstate', () => setRole(readRole(), { push: false }));
