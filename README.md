# portfolio-tech

박영희(PARK Younghee)의 TECH 포트폴리오입니다. Frontend · Backend · Security · Data · AI

남색 밤하늘을 배경으로, 선택한 직무의 기술이 별자리로 이어지는 한 페이지 사이트입니다.

## 직무별로 따로 보이기

이 사이트는 한 번에 한 직무만 보여줍니다 (frontend, backend, security, data, ai).
주소 뒤의 `?v=코드`로 어떤 직무를 보여줄지 정하고, 방문자 화면에는 직무를 바꾸는 버튼이 없습니다.
모든 내용은 **Supabase DB**에 있고, 사이트는 열릴 때 그 직무 내용만 받아옵니다.
사이트 코드에는 다른 직무의 내용도, 링크 코드도, 관리 비밀번호도 들어 있지 않습니다.
방문자는 테이블을 직접 읽을 수 없고, 공개 함수 `get_portfolio`로 그 직무 내용만 받습니다.

직무별 링크 복사와 관리자 모드는 따로 연결되지 않은 관리 페이지(`manage.html`)에서 비밀번호를 넣고 사용합니다.
비밀번호는 DB에서 확인하고, 15분에 10번 틀리면 잠깁니다.

## 내용 고치기

Supabase → **Table Editor** → 왼쪽 위 schema를 **portfolio**로 바꾸면 표가 보입니다. 저장하면 사이트에 바로 반영돼요.

- `profile`: 이름, 생일, 연락처, 링크(`links`의 github · blog), 이력서 주소
- `tracks`(id = tech): 소개 한 문장·본문, 강점 키워드, 지금 하는 것
- `roles`: 직무별 이름, 타이핑 문구(`title`), 첫 화면 소개(`hero_desc`), 색(`accent`), 링크 코드(`code`)
- `skills`: 직무별 기술. `sort` 순서대로 앞의 7개가 첫 화면 별자리에 나옵니다.
- `projects` + `project_roles`: 프로젝트와 보일 직무. `sort`가 작을수록 먼저 나옵니다.
- `posts` + `post_roles`: 블로그 글과 보일 직무

## 기능

- 직무별 화면 분리 (색, 별자리, 기술, 프로젝트, 글)
- 별자리의 별에 마우스를 올리면 그 기술을 쓴 프로젝트 표시, 누르면 이동
- 스크롤에 따라 천천히 움직이는 별 배경 (canvas)
- `⌘K` / `Ctrl+K` 빠른 이동
- 프로젝트 목차가 스크롤 위치를 따라 표시
- 모바일 화면, 키보드 이동, 움직임 줄이기 설정 대응

## 구조

```
index.html
assets/css/style.css
assets/js/db.js     ← Supabase 주소 · 방문자용 공개 키, DB 내용 불러오기
assets/js/main.js   ← 화면 동작
assets/js/admin-bar.js, manage.js ← 관리자 기능
```

빌드 과정 없이 HTML, CSS, JavaScript만으로 동작합니다.

## 배포 (GitHub Pages)

Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main / (root)**로 저장합니다.
