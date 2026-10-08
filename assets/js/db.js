// Supabase 연결
// - 아래 키는 '방문자용 공개 키'라 사이트에 보여도 괜찮아요.
//   이 키로는 테이블을 직접 읽을 수 없고, 공개해 둔 함수 두 개만 부를 수 있어요.
//     get_portfolio(트랙, 코드)  → 그 직무 내용만 (코드가 없거나 틀리면 기본 직무)
//     admin_role_links(비밀번호) → 직무별 링크 (비밀번호가 맞을 때만, 15분에 10번 틀리면 잠김)
// - 절대 넣으면 안 되는 것: service_role 키, sb_secret_ 로 시작하는 키, DB 비밀번호
// - 내용 고치는 곳: Supabase → Table Editor → schema 'portfolio'
const SUPABASE_URL = 'https://yuzardhmvsexygmknfcc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-CKlqet6TjLm-jlqJ003DQ_y95Rjx99';
export const TRACK = 'tech';

export async function rpc(name, args = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`DB ${r.status}`);
  return r.json();
}

export const codeFromURL = () => (new URLSearchParams(location.search).get('v') || '').trim();

// DB 모양 → 화면 코드가 쓰던 모양 (예전 data.js 와 같은 이름)
export async function loadPortfolio() {
  const d = await rpc('get_portfolio', { p_track: TRACK, p_code: codeFromURL() || null });
  if (!d || !d.role) throw new Error('empty');
  const id = d.role.id;
  const p = d.profile || {};
  const t = d.track || {};
  const links = p.links || {};
  return {
    profile: {
      nameKo: p.name_ko || '',
      nameEn: p.name_en || '',
      birth: (p.birth || '').replaceAll('-', '.'),
      email: p.email || '',
      github: links.github || '#',
      blog: links.blog || '#',
      resume: p.resume_url || '#',
      location: (p.location || '').split(',')[0],
      intro: d.role.hero_desc || '',
      aboutLead: t.about_lead || '',
      aboutBody: t.about_body || '',
      keywords: t.keywords || [],
      now: t.now_doing || '',
    },
    role: id,
    roles: { [id]: { label: d.role.label, title: d.role.title || '', rgb: d.role.accent || '103, 232, 249' } },
    skills: { [id]: (d.skills || []).map((s) => s.name) },
    projects: (d.projects || []).map((pr) => ({
      id: pr.id,
      title: pr.title,
      short: pr.category || '',
      roles: [id],
      tags: pr.tags || [],
      period: pr.period_label || (pr.date ? pr.date.slice(0, 7).replace('-', '.') : ''),
      team: pr.team || '',
      summary: pr.summary || '',
      problem: pr.problem || '',
      action: pr.action || '',
      result: pr.result || '',
      links: { github: (pr.links || {}).github || '#', demo: (pr.links || {}).demo || '#' },
    })),
    posts: (d.posts || []).map((po) => ({
      date: po.date ? po.date.replaceAll('-', '.') : '',
      title: po.title,
      url: po.url || '#',
      roles: [id],
    })),
  };
}
