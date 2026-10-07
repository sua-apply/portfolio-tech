// 관리자 모드일 때만 화면 구석에 직무 전환 막대를 띄웁니다.
// 관리자 모드는 manage.html 에서 비밀번호를 넣어야 켜지고, 이 브라우저에만 저장됩니다.
export const ADMIN_KEY = 'pf-admin-mode';

export function isAdmin() {
  try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; }
}

export function roleFromURL(roles, defaultRole) {
  const v = new URLSearchParams(location.search).get('v');
  const hit = Object.keys(roles).find((k) => roles[k].code === v);
  return hit || defaultRole;
}

export function mountAdminBar(roles, getCurrent, onPick) {
  if (!isAdmin()) return;
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
  const render = () => {
    const cur = getCurrent();
    bar.innerHTML = `<span class="admin-bar__tag">admin</span>${Object.keys(roles).map((k) =>
      `<button type="button" data-k="${k}" aria-pressed="${k === cur}">${roles[k].label}</button>`).join('')}<a href="manage.html">관리</a>`;
  };
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]');
    if (!b) return;
    const url = new URL(location.href);
    url.searchParams.set('v', roles[b.dataset.k].code);
    history.replaceState(null, '', url);
    onPick(b.dataset.k);
    render();
  });
  render();
  document.body.appendChild(bar);
}
