// 관리자 모드일 때만 화면 구석에 직무 전환 막대를 띄웁니다.
// 관리자 모드는 manage.html 에서 비밀번호(DB에서 확인)를 넣고 켜야 하고, 이 브라우저에만 저장됩니다.
// 직무별 링크 코드도 관리자 모드를 켠 브라우저에만 저장돼요. 사이트 코드에는 들어 있지 않아요.
import { TRACK } from './db.js';

export const ADMIN_KEY = 'pf-admin-mode';
export const LINKS_KEY = 'pf-admin-links';

export function isAdmin() {
  try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; }
}

function savedLinks() {
  try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '[]').filter((l) => l.track === TRACK); } catch { return []; }
}

export function mountAdminBar(currentId) {
  if (!isAdmin()) return;
  const links = savedLinks();
  const style = document.createElement('style');
  style.textContent = `
    .admin-bar{position:fixed;right:16px;bottom:16px;z-index:200;display:flex;align-items:center;gap:4px;padding:6px;border-radius:14px;background:rgba(20,20,24,.88);backdrop-filter:blur(8px);box-shadow:0 10px 40px rgba(0,0,0,.35);font:13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#d8d8e0}
    .admin-bar__tag{padding:0 8px;color:#9a9aa8}
    .admin-bar button{min-height:34px;padding:0 12px;border:0;border-radius:9px;background:transparent;color:#d8d8e0;font:inherit;cursor:pointer}
    .admin-bar button:hover{background:rgba(255,255,255,.08)}
    .admin-bar button[aria-pressed=true]{background:#fff;color:#111;font-weight:700}
    .admin-bar a{padding:0 8px;color:#9a9aa8;text-decoration:none}
    .admin-bar a:hover{color:#fff}
    @media (max-width:640px){.admin-bar{left:8px;right:8px;bottom:8px;overflow-x:auto}}`;
  document.head.appendChild(style);
  const bar = document.createElement('div');
  bar.className = 'admin-bar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', '관리자 직무 전환');
  bar.innerHTML = `<span class="admin-bar__tag">admin</span>${links.map((l) =>
    `<button type="button" data-c="${l.code}" aria-pressed="${l.id === currentId}">${l.label}</button>`).join('')}<a href="manage.html">관리</a>`;
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-c]');
    if (!b) return;
    const url = new URL(location.href);
    url.searchParams.set('v', b.dataset.c);
    location.href = url.toString(); // 그 직무 내용을 DB에서 새로 받아요
  });
  document.body.appendChild(bar);
}
