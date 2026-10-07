# portfolio-tech

박영희(PARK Younghee)의 TECH 포트폴리오입니다. Frontend · Backend · Security · Data · AI

남색 밤하늘을 배경으로, 선택한 직무의 기술이 별자리로 이어지는 한 페이지 사이트입니다.

## 직무별 링크

주소 뒤에 `?role=`을 붙이면 그 직무에 맞게 색, 별자리, 프로젝트 순서가 바뀝니다.

| 직무 | 링크 |
|---|---|
| Frontend | `https://[아이디].github.io/portfolio-tech/?role=frontend` |
| Backend | `https://[아이디].github.io/portfolio-tech/?role=backend` |
| Security | `https://[아이디].github.io/portfolio-tech/?role=security` |
| Data | `https://[아이디].github.io/portfolio-tech/?role=data` |
| AI | `https://[아이디].github.io/portfolio-tech/?role=ai` |

## 내용 고치기

글, 프로젝트, 기술 목록은 모두 `assets/js/data.js` 한 파일에 있습니다. `[ ]`로 표시된 곳을 채우면 됩니다.

- `profile`: 이름, 소개, 연락처, 링크
- `skills`: 직무별 기술. 앞의 7개가 첫 화면 별자리에 나옵니다.
- `projects`: 프로젝트. `roles`의 첫 번째 직무에서 가장 먼저 보입니다.
- `posts`: 블로그 글 목록

## 기능

- `?role=` 직무 전환 (색, 별자리, 기술, 프로젝트 순서)
- 별자리의 별에 마우스를 올리면 그 기술을 쓴 프로젝트 표시, 누르면 이동
- 스크롤에 따라 천천히 움직이는 별 배경 (canvas)
- `⌘K` / `Ctrl+K` 빠른 이동
- 프로젝트 목차가 스크롤 위치를 따라 표시
- 모바일 화면, 키보드 이동, 움직임 줄이기 설정 대응

## 구조

```
index.html
assets/css/style.css
assets/js/data.js   ← 내용
assets/js/main.js   ← 화면 동작
```

빌드 과정 없이 HTML, CSS, JavaScript만으로 동작합니다.

## 배포 (GitHub Pages)

Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main / (root)**로 저장합니다.
