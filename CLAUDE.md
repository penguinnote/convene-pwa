# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 참고하는 지침이다.
프로젝트 소개는 `README.md`, 디자인 의사결정과 기술 함정은 `DESIGN.md`에 있으니 **작업 전 두 문서를 먼저 읽는다.**

---

## 프로젝트 한 줄 요약

교회 청년대학부 여름캠프(80~100명, 3박4일)용 설치형 PWA. QR로 설치하고, 관리자 공지를 전 참가자 폰에 FCM 푸시로 전달한다.

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
  - **Firestore**: `announcements`(공지), `announcements/{id}/comments`(댓글), `tokens`(FCM 토큰), `users`(프로필: nickname·mokjang·photoURL), `config/live`(라이브 현재 순서: `active`·`dayIndex`·`itemIndex`·`note`·`updatedAt`)
  - **정적 파일** `src/data/`: 일정(`schedule.js`)·방배정(`rooms.js`)·말씀(`verses.js`). 변동 없는 데이터라 읽기비용 절감을 위해 DB에 두지 않는다. **`schedule.js`는 현재 임시 테스트 일정(단일 "테스트 일정" day)** — 캠프 전 실제 일정으로 교체한다.
- **푸시 흐름**: Admin이 `announcements` 문서 생성 → Functions `onDocumentCreated` 트리거 → 전체 토큰에 **data-only** 페이로드 발송 → `src/sw.js`가 알림 표시 + 배지 증가.
- **인증**: 익명 로그인(참가자, 프로필·댓글용) + 이메일 로그인(관리자). `isAdmin = !!user.email`.
- **공지 데이터 모델**: `{ title, body, blocks[], pinned, createdAt }`. `blocks`는 `text`/`image`/`file`/`link` 타입의 순서 배열. `body`는 첫 텍스트 블록(미리보기·푸시 본문 하위호환). 첨부는 Storage 업로드, 이미지는 클라이언트 리사이즈.
- **댓글 표시**: `authorUid`로 `users` 문서를 조회(`useUserProfiles`, getDoc+캐시)해 최신 프로필(사진·닉네임·목장)을 반영한다. 조회 실패나 문서 없음(예: 관리자)은 댓글에 저장된 `author*` 필드로 폴백. 쓰기 경로는 하위호환용으로 `author*`를 계속 저장한다.
- **라이브 현재 순서**: 캠프 진행은 수시로 밀리거나 당겨져 시계 자동 계산이 부정확하다. 그래서 관리자가 `config/live` 포인터(`dayIndex`·`itemIndex`)를 **수동으로** 넘긴다(Admin "라이브 진행" 뷰). 홈은 이를 onSnapshot 구독해 `active`일 때만 "현재 순서" 카드를 표시한다. 순서/다음 순서 해석은 `src/lib/liveSchedule.js`, 현재 순서 제목→관련 자료(말씀/자료실) 판별은 순수 함수 `src/lib/liveResource.js`가 담당한다. 라이브는 FCM 푸시와 무관하다.

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
