import { rpc, TRACK } from './db.js';
import { ADMIN_KEY, LINKS_KEY, isAdmin } from './admin-bar.js';

// 비밀번호는 DB에서만 확인해요. 이 파일에는 비밀번호도, 링크 코드도 없어요.
const SESSION_KEY = 'pf-admin-session';
let links = null;

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const base = new URL('./', location.href);

function showPanel() {
  $('#gate').hidden = true;
  $('#panel').hidden = false;
  $('#rows').innerHTML = links.filter((l) => l.track === TRACK).map((r) => {
    const url = new URL(`?v=${encodeURIComponent(r.code)}`, base).href;
    return `<li class="row">
      <div class="row__name"><strong>${esc(r.label)}</strong><span>${esc(r.id)}${r.is_default ? ' · 기본' : ''}</span></div>
      <code class="row__url">${esc(url)}</code>
      <div class="row__actions">
        <button type="button" data-copy="${esc(url)}">복사</button>
        <a href="${esc(url)}" target="_blank" rel="noopener">열기</a>
      </div>
    </li>`;
  }).join('');
  syncMode();
}

function syncMode() {
  const on = isAdmin();
  $('#mode').textContent = on ? '관리자 모드 끄기' : '관리자 모드 켜기';
  $('#mode-state').textContent = on
    ? '켜짐 · 이 브라우저에서 사이트를 열면 오른쪽 아래에 직무 전환 막대가 보여요.'
    : '꺼짐 · 사이트에 직무 전환 막대가 보이지 않아요. 방문자와 똑같은 화면이에요.';
}

$('#gate').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('#gate button[type=submit]') || $('#gate button');
  btn.disabled = true;
  let res;
  try {
    res = await rpc('admin_role_links', { p_password: $('#pw').value });
  } catch {
    $('#err').textContent = 'DB에 연결하지 못했어요. 잠시 후 다시 해주세요.';
    $('#err').hidden = false;
    btn.disabled = false;
    return;
  }
  btn.disabled = false;
  if (!res || !res.ok) {
    $('#err').textContent = res && res.reason === 'locked' ? '너무 많이 틀렸어요. 15분 뒤에 다시 해주세요.' : '비밀번호가 맞지 않아요.';
    $('#err').hidden = false;
    $('#pw').select();
    return;
  }
  links = res.links || [];
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(links));
  if (isAdmin()) localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  $('#pw').value = '';
  showPanel();
});
$('#pw').addEventListener('input', () => { $('#err').hidden = true; });

$('#rows').addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-copy]');
  if (!b) return;
  try {
    await navigator.clipboard.writeText(b.dataset.copy);
    b.textContent = '복사됨';
  } catch {
    b.textContent = '복사 실패';
  }
  setTimeout(() => { b.textContent = '복사'; }, 1400);
});

$('#mode').addEventListener('click', () => {
  // 관리자 모드를 켜면 이 브라우저에만 링크 목록을 저장해서 직무 전환 막대에 써요
  if (isAdmin()) { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem(LINKS_KEY); }
  else { localStorage.setItem(ADMIN_KEY, '1'); localStorage.setItem(LINKS_KEY, JSON.stringify(links)); }
  syncMode();
});

$('#logout').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(LINKS_KEY);
  location.reload();
});

try { links = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { links = null; }
if (Array.isArray(links)) showPanel();
else $('#pw').focus();
