// 포트폴리오 내용은 이 파일에서만 고치면 됩니다.
// 나중에 Supabase를 연결하면 이 파일 대신 DB에서 같은 모양의 데이터를 불러옵니다.
// [ ] 로 표시된 곳이 채워야 할 부분입니다.

export const profile = {
  nameKo: '박영희',
  nameEn: 'PARK Younghee',
  birth: '1999.01.01',
  email: '[your@email.com]',
  github: 'https://github.com/[아이디]',
  blog: 'https://velog.io/@[아이디]',
  resume: '#',
  location: 'Seoul',
  intro: '[나를 소개하는 두 줄. 예: 밤하늘의 별자리처럼, 흩어진 기술을 이어 하나의 서비스로 만드는 개발자입니다.]',
  aboutLead: '[나는 어떤 개발자인가 한 문장]',
  aboutBody: '[개발을 시작한 계기, 관심 분야, 일하는 방식을 두세 문장으로. 데이터·보안·AI에도 관심이 있어 화면 뒤의 흐름까지 이해하려 한다는 점을 살릴 수 있어요.]',
  keywords: ['[강점 키워드 1]', '[강점 키워드 2]', '[강점 키워드 3]'],
  now: '[지금 공부하거나 만들고 있는 것]',
};

// 직무별 표시 이름, 색 (RGB), 비밀 코드
// 지원할 때는 주소 뒤에 ?v=코드 를 붙여서 보냅니다. 예: /portfolio-tech/?v=e302f3
// 코드는 다른 직무를 짐작하지 못하게 하는 용도입니다. 바꾸고 싶으면 아무 글자로 바꿔도 됩니다.
export const roles = {
  frontend: { label: 'Frontend', title: 'frontend developer', rgb: '103, 232, 249', code: 'e302f3' },
  backend: { label: 'Backend', title: 'backend developer', rgb: '110, 231, 183', code: '886757' },
  security: { label: 'Security', title: 'security engineer', rgb: '249, 168, 212', code: 'a15501' },
  data: { label: 'Data', title: 'data analyst', rgb: '253, 230, 138', code: 'd02cf2' },
  ai: { label: 'AI', title: 'ai engineer', rgb: '196, 181, 253', code: '9adf88' },
};

export const defaultRole = 'frontend';

// 직무별 기술. 앞의 7개가 첫 화면 별자리에 표시됩니다.
export const skills = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Framer Motion', 'Vite', 'Storybook', 'Jest'],
  backend: ['Node.js', 'NestJS', 'PostgreSQL', 'Supabase', 'REST API', 'Docker', 'Redis', 'CI/CD'],
  security: ['OWASP', 'Burp Suite', 'Wireshark', 'Linux', 'Python', 'JWT', 'Nmap', 'CTF'],
  data: ['Python', 'pandas', 'SQL', 'BigQuery', 'Tableau', 'Jupyter', 'Statistics', 'A/B Test'],
  ai: ['PyTorch', 'LLM API', 'RAG', 'LangChain', 'Hugging Face', 'Prompting', 'Python', 'MLOps'],
};

// roles: 이 프로젝트가 해당하는 직무. 앞에 올수록 그 직무의 대표 프로젝트로 우선 표시됩니다.
export const projects = [
  {
    id: 'frontend-project',
    title: '[프론트엔드 프로젝트]',
    short: 'Frontend',
    roles: ['frontend'],
    tags: ['React', 'TypeScript', 'Tailwind'],
    period: '[2025.00 ~ 2025.00]',
    team: '[팀 N명]',
    summary: '[한 줄 요약]',
    problem: '[어떤 문제가 있었나]',
    action: '[내가 직접 한 일]',
    result: '[수치로 보이는 결과]',
    links: { github: '#', demo: '#' },
  },
  {
    id: 'dashboard-project',
    title: '[데이터 대시보드 프로젝트]',
    short: 'Dashboard',
    roles: ['data', 'frontend'],
    tags: ['Next.js', 'SQL', 'Chart.js'],
    period: '[2025.00 ~ 2025.00]',
    team: '[팀 N명]',
    summary: '[한 줄 요약]',
    problem: '[어떤 문제가 있었나]',
    action: '[내가 직접 한 일]',
    result: '[수치로 보이는 결과]',
    links: { github: '#', demo: '#' },
  },
  {
    id: 'api-project',
    title: '[백엔드 API 프로젝트]',
    short: 'API Server',
    roles: ['backend'],
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    period: '[2025.00 ~ 2025.00]',
    team: '[팀 N명]',
    summary: '[한 줄 요약]',
    problem: '[어떤 문제가 있었나]',
    action: '[내가 직접 한 일]',
    result: '[수치로 보이는 결과]',
    links: { github: '#', demo: '#' },
  },
  {
    id: 'security-project',
    title: '[보안 점검 프로젝트]',
    short: 'Security',
    roles: ['security', 'backend'],
    tags: ['Python', 'Burp Suite', 'OWASP'],
    period: '[2025.00 ~ 2025.00]',
    team: '[팀 N명]',
    summary: '[한 줄 요약]',
    problem: '[어떤 문제가 있었나]',
    action: '[내가 직접 한 일]',
    result: '[수치로 보이는 결과]',
    links: { github: '#', demo: '#' },
  },
  {
    id: 'ai-project',
    title: '[AI 챗봇 프로젝트]',
    short: 'AI Chatbot',
    roles: ['ai', 'frontend'],
    tags: ['LLM API', 'RAG', 'React'],
    period: '[2025.00 ~ 2025.00]',
    team: '[팀 N명]',
    summary: '[한 줄 요약]',
    problem: '[어떤 문제가 있었나]',
    action: '[내가 직접 한 일]',
    result: '[수치로 보이는 결과]',
    links: { github: '#', demo: '#' },
  },
];

export const posts = [
  { date: '[2026.09.00]', title: '[최근 블로그 글 제목. 트러블슈팅이나 회고]', url: '#', roles: ['frontend'] },
  { date: '[2026.08.00]', title: '[블로그 글 제목. 공부한 기술 정리]', url: '#', roles: ['backend', 'security'] },
  { date: '[2026.07.00]', title: '[블로그 글 제목. 프로젝트 회고]', url: '#', roles: ['data', 'ai'] },
];
