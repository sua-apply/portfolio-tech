import { roles } from './data.js';
import { ADMIN_KEY, isAdmin } from './admin-bar.js';

// 비밀번호의 SHA-256 값입니다. 비밀번호를 바꾸려면 새 비밀번호의 SHA-256 값으로 바꿔주세요.
const PASSWORD_HASH = 'f41052558c8def4a82c4e433b374c6d20fd65af85f9e8a0c01cb663d3f18e40d';
const SESSION_KEY = 'pf-admin-session';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const base = new URL('./', location.href);

function showPanel() {
  $('#gate').hidden = true;
  $('#panel').hidden = false;
  $('#rows').innerHTML = Object.entries(roles).map(([key, r]) => {
    const url = new URL(`?v=${r.code}`, base).href;
    return `<li class="row">
      <div class="row__name"><strong>${esc(r.label)}</strong><span>${esc(key)}</span></div>
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
  const ok = (await sha256($('#pw').value)) === PASSWORD_HASH;
  if (!ok) {
    $('#err').hidden = false;
    $('#pw').select();
    return;
  }
  sessionStorage.setItem(SESSION_KEY, '1');
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
  if (isAdmin()) localStorage.removeItem(ADMIN_KEY);
  else localStorage.setItem(ADMIN_KEY, '1');
  syncMode();
});

$('#logout').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ADMIN_KEY);
  location.reload();
});

if (sessionStorage.getItem(SESSION_KEY) === '1') showPanel();
else $('#pw').focus();
