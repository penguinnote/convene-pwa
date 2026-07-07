# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 참고하는 지침이다.
프로젝트 소개는 `README.md`, 디자인 의사결정과 기술 함정은 `DESIGN.md`에 있으니 **작업 전 두 문서를 먼저 읽는다.**

---

## 프로젝트 한 줄 요약

Convene — 워크숍·수련회·캠프용 설치형 PWA. QR로 설치하고, 관리자 공지를 전 참가자
폰에 FCM 푸시로 전달한다. 첫 배포 인스턴스는 로뎀나무교회 청년부 여름캠프
(80~100명, 3박 4일)이며, 참가자 화면 브랜딩·일정·콘텐츠는 인스턴스 설정에 둔다.

---

## 명령어

```bash
npm install              # 의존성 설치
npm run dev              # 개발 서버 (SW 캐싱 꺼짐)
npm run build            # 프로덕션 빌드 → dist/
npm run preview          # PWA(설치·오프라인) 테스트는 build 후 preview로

# 배포
npx firebase-tools deploy --only hosting          # 프론트 배포
npx firebase-tools deploy --only functions        # Cloud Function 배포 (region: asia-northeast3)
npx firebase-tools deploy --only firestore:rules  # Firestore 보안 규칙 배포 (config/live 등 규칙 변경 시)
```

- `.env.local`에 Firebase 설정값이 들어간다(`VITE_FIREBASE_*`, `VITE_FIREBASE_VAPID_KEY`). 커밋 금지.
- 라이브: https://rodemcamp.web.app · 레포: `penguinnote/rodem-camp-pwa` (`main` 브랜치)

---

## 아키텍처

- **스택**: React 18 + React Router + Vite 5 + Tailwind. 백엔드는 Firebase(Firestore·Auth·Storage·FCM·Functions·Hosting).
- **데이터 위치** (중요):
  - **Firestore**: `announcements`(공지), `tokens`(FCM 토큰), `users`(프로필: nickname·mokjang·photoURL), `config/live`(라이브 변동 안내: `note`·`updatedAt`만. 현재 순서는 시각 자동 계산이라 포인터를 저장하지 않는다)
  - **정적 파일** `src/data/`: 일정(`schedule.js`)·방배정(`rooms.js`)·말씀(`verses.js`)·식단(`menu.js`). 변동 없는 데이터라 읽기비용 절감을 위해 DB에 두지 않는다. `schedule.js`는 실제 4일 일정이며 각 item에 라이브 카드용 `link`(`verse`/`versesTab`/`menu`/`playlist`/`resource`)를 갖는다(표시엔 안 쓰임). `verses.js`의 각 item은 스케줄 `link.verseId`·상세 라우트(`/verses/:id`)와 매칭되는 안정적 `id`(`topic-1~5`·`opening`·`closing`·`gbs-1~3`·`dawn-1~3`)를 갖는다(`getVerseById`로 조회). `menu.js`(식단표)는 스캐폴드만 있고 내용은 추후 입력.
- **푸시 흐름**: Admin이 `announcements` 문서 생성 → Functions `onDocumentCreated` 트리거 → 전체 토큰에 **data-only** 페이로드 발송 → `src/sw.js`가 알림 표시 + 배지 증가.
- **인증**: 익명 로그인(참가자, 프로필용) + 이메일 로그인(관리자). `isAdmin = !!user.email`.
- **공지 데이터 모델**: `{ title, body, blocks[], pinned, createdAt }`. `blocks`는 `text`/`image`/`file`/`link` 타입의 순서 배열. `body`는 첫 텍스트 블록(미리보기·푸시 본문 하위호환). 첨부는 Storage 업로드, 이미지는 클라이언트 리사이즈.
- **라이브 현재 순서**: 홈 중앙 "현재 순서" 카드는 **시각 자동 계산**이다. 순수 함수 `getAutoLive(now)`(`src/lib/liveSchedule.js`)가 `LIVE_ANCHOR` 기준 경과일 mod `schedule.length`로 dayIndex를, 현재 시:분으로 current/next를 뽑는다(테스트 중 매일 1일차부터 순환, 캠프 땐 `LIVE_ANCHOR="2026-07-29"`). 자정~그날 첫 순서(07:00) 사이엔 current를 합성 "취침"(`rest:true`) 항목으로 채우고 다음 순서로 07:00을 가리킨다. 홈은 `now`를 60초마다 갱신한다. 각 순서의 `link`(schedule.js) 타입에 따라 관련 말씀(`goToVerse`)·자료실(고정 공지)·말씀탭·메뉴·플레이리스트로 이동한다. 시각이 밀리면 관리자가 `config/live.note`(변동 안내)만 얹는다(Admin "라이브 진행" 뷰는 자동 계산된 순서를 읽기 전용으로 보여주고 메모 저장/지우기만 제공). 라이브는 FCM 푸시와 무관하다.
- **화면 계층·뒤로가기**: 홈을 스택 베이스로 두고 상세는 목록을 히스토리에 먼저 쌓는 2단계 구조다. 공지 상세(`/announcements/:id`)와 말씀 상세(`/verses/:id`)는 각각 `goToAnnouncement`·`goToVerse`(`src/lib/nav.js`)로 이동하고, `/info` 하위(`/rooms`·`/menu`·`/playlist`)와 함께 `goHome`에서 2단계(-2)로 접힌다. 말씀 탭은 목록(`Verses`)→개별 본문(`VerseDetail`) 구조다.

주요 파일: `src/App.jsx`(라우팅·스플래시·토스트), `src/sw.js`(캐싱+FCM+알림클릭), `src/pages/Admin.jsx`(공지 작성/발송), `src/hooks/useBackControl.js`(안드로이드 계층 뒤로가기), `src/hooks/useAuth.jsx`, `functions/index.js`(푸시 발송).

---

## 하지 말 것 (가드레일)

- **일정/방배정/말씀을 함부로 Firestore로 옮기지 않는다.** 정적 파일 유지가 의도된 설계다(읽기비용). 옮길 때는 반드시 사전 논의.
- **푸시 페이로드에 `notification` 필드를 넣지 않는다.** data-only를 유지한다. notification을 넣으면 FCM 자동표시 + SW 표시로 알림이 2번 온다.
- **`src/App 2.jsx`는 오래된 중복본이다.** 참조·수정 금지. (정리 시 삭제 대상)
- 공지 **수정**은 새 푸시를 보내지 않는다(createdAt 유지, 목록 순서 보존). 이 동작을 깨지 않는다.
- 서비스워커(`src/sw.js`) 변경은 기존 설치기기 갱신이 지연될 수 있으니 캠프 전에 완료한다.

---

## 컨벤션

- **커밋 메시지**: `feat:` / `fix:` / `docs:` / `revert:` 접두어 + 한글 요약. 예: `feat: 홈 고정 공지 + 링크 블록`.
- **디자인 토큰**(DESIGN.md 팔레트): 강조 `#3F7D99`, 제목 `#2F5E72`, 카드배경 `#F2F8FA`, 테두리 `#D4E6EC`, 본문 `#21343C`. 폰트는 Gowun Batang. 색상은 Tailwind 설정 한 곳에서 관리.
- 모바일 우선. 최상위는 `100dvh` flex 컬럼, 본문만 내부 스크롤, 하단 탭은 flex 자식으로 고정.
- 한글 줄바꿈은 `word-break: keep-all` + `overflow-wrap`으로 긴 문자열 오버플로우 방지.

---

## 작업 방식

이 프로젝트는 Cowork에서 기능 분석·프롬프트 작성을 하고, 실제 코딩은 Claude Code가 맡는다. 코드 변경과 함께 관련 `.md` 문서(README·DESIGN·이 파일)도 최신 상태로 함께 갱신한다.
