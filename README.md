# Convene

> 워크숍, 수련회, 캠프처럼 여러 날 진행되는 오프라인 행사를 위한 설치형 컴패니언 PWA. QR로 설치하고, 운영진 공지를 전 참가자 폰에 실시간 푸시로 보낸다. 제품은 범용으로 설계하고, 각 행사의 정체성은 `instance.js` 한 파일로 분리했다 — 파일 변경시 새 행사에 재배포가 가능하다.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FCM%20%7C%20Firestore%20%7C%20Functions-FFCA28?logo=firebase&logoColor=black">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white">
</p>

🔗 **Live demo (첫 배포 인스턴스):** https://rodemcamp.web.app
📐 **디자인 기록:** [DESIGN.md](DESIGN.md)

---

## 프로젝트 소개

Convene은 다중일 오프라인 행사에서 참가자에게 필요한 정보(실시간 공지, 자료, 일정 등)를 한 곳에 모으고, 운영진 공지를 모든 참가자 폰에 즉시 푸시하는 모바일 웹앱이다. 앱스토어 심사 없이 QR 스캔으로 설치되고, 캠프장 네트워크가 불안정해도 오프라인에서 열람된다.

제품은 범용으로 설계하되 각 행사의 이름, 표어, 색, 일정, 콘텐츠는 인스턴스 설정으로 분리했다. 첫 배포처는 로뎀나무교회 청년대학부 여름캠프(80~100명, 3박 4일)이며, 기획부터 배포까지 직접 진행했다.

---

## 첨부 사진

| 홈 | 일정 | 공지 푸시 |
|---|---|---|
| ![home](docs/home.png) | ![schedule](docs/schedule.png) | ![push](docs/push.png) |

---

## 핵심 기능

- **실시간 공지 푸시** — 관리자가 공지를 올리면 전 참가자 폰에 백그라운드 푸시. 앱을 보고 있는 동안엔 시스템 알림 대신 상단 인앱 토스트로, 알림을 탭하면 해당 공지로 이동하며, iOS에서는 읽지 않은 수를 앱 아이콘 배지로 표시한다.
- **선택적 재발송** — 공지 수정은 기본적으로 푸시하지 않지만(목록 순서 보존), 관리자가 원하면 체크 한 번으로 다시 발송한다.
- **라이브 "현재 순서"** — 일정표 기준으로 "지금 진행 중"과 다음 순서를 시각에 따라 자동 표시하고, 순서 성격에 맞춰 관련 말씀, 자료실, 식단표, 플레이리스트로 한 번에 이동한다. 시간이 밀리면 관리자가 변동 안내 메모만 얹는다.
- **홈 허브** — 앱을 열면 공지 최신 1건, 라이브 현재 순서, 자료실이 한 화면에 들어온다.
- **블록 리치 공지** — 텍스트, 이미지, PDF를 원하는 순서로 배치하는 블록 에디터. 첨부는 Storage에 올리고 이미지는 업로드 전 클라이언트에서 리사이즈한다.
- **콘텐츠 열람** — 일자별 일정, 이름과 방 검색이 되는 방배정, 강의별 말씀 본문(목록에서 개별 페이지로, 한/EN 토글), 식단표, 찬양 플레이리스트.
- **참가자 프로필** — 익명 로그인 기반 온보딩으로 이름, 목장, 프로필 사진(원형 크롭)을 설정한다.
- **설치형 PWA** — QR로 홈 화면에 설치, 오프라인 캐싱, 브랜드 색 앱 아이콘과 진입 스플래시.
- **계층적 뒤로가기** — 안드로이드 하드웨어 뒤로가기를 정보 구조에 맞춰 제어한다.
- **성과 측정 로깅** — 설치, 열람, 푸시 도달 등 핵심 이벤트를 계측한다.

---

## 아키텍처

![아키텍처](docs/architecture.png)

- **DB (Firestore)** — `announcements`(공지), `tokens`(FCM 토큰), `users`(프로필), `config/live`(라이브 변동 메모)
- **정적 데이터** — 일정, 방배정, 말씀, 식단은 변동이 없어 `src/data/`에 두어 읽기 비용을 없앤다
- **푸시 서버 (Cloud Functions)** — 공지 생성 시 `onCreate` 트리거로 전체 토큰에 일괄 발송(만료 토큰 자동 정리). 수정 재발송은 `onUpdate`가 `resendAt` 변경만 감지해 1회 발송
- **인증** — 익명 로그인(참가자 프로필) + 이메일 로그인(관리자)
- **호스팅과 스토리지** — Firebase Hosting, Storage

---

## 제품 = 인스턴스 분리 (재사용 설계)

행사마다 다른 값을 코드 전체에 흩뿌리는 대신 `src/config/instance.js` 한 파일에 모았다. 앱 이름, 히어로 표어, 브랜드 팔레트, 라이브 기준일, 사진 앨범 링크 등 "행사의 정체성"이 여기 담긴다. 새 행사에 배포하려면 이 파일만 교체하면 되고, 앱 전체 색은 이 팔레트를 Tailwind와 매니페스트가 함께 참조한다.

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React 18, React Router, Vite 5 |
| Styling | Tailwind CSS |
| Font | Gowun Batang |
| PWA | vite-plugin-pwa (Workbox, injectManifest) |
| Backend | Firebase Firestore, Cloud Functions, Auth |
| Storage / Push / Hosting | Firebase Storage, Cloud Messaging(FCM), Hosting |

---

## 엔지니어링 하이라이트

실제 배포에서 마주친 문제와 해결이다.

**1. iOS PWA 푸시 제약 대응.** iOS는 16.4+에서, 그것도 "홈 화면에 추가"로 설치하고 실행한
상태에서만 웹 푸시 권한 요청과 수신이 된다. 온보딩 흐름과 안내를 이 제약에 맞춰 설계하고,
권한이 이미 허용된 경우 "알림 받기" 버튼을 숨겨 UI를 단순화했다.

**2. 단일 서비스워커로 캐싱과 FCM 통합, 즉시 갱신.** `vite-plugin-pwa`의 기본 `generateSW`가
FCM 백그라운드용 서비스워커와 루트 스코프에서 충돌해, **`injectManifest`로 전환**해 커스텀
`sw.js` 하나가 오프라인 캐싱과 FCM 수신을 모두 담당하게 했다. `skipWaiting`, `clientsClaim`,
`cleanupOutdatedCaches`로 앱 재실행만으로 새 버전이 적용되고, 청크 로드 실패 시 1회 자동
새로고침으로 옛 빌드와 새 빌드의 파일 불일치를 복구한다.

**3. 중복 푸시 제거 (data-only).** `notification` 페이로드는 FCM 자동 표시와
`onBackgroundMessage`가 겹쳐 알림이 두 번 왔다. **`data` 페이로드로 전환**해 서비스워커가
한 번만 표시하고, 공지 문서 id를 고유 `tag`로 부여해 여러 알림이 서로 덮어쓰지 않고 쌓이게 했다.

**4. 선택적 푸시 재발송.** 새 공지는 `onCreate` 트리거로 발송하고, 수정은 기본적으로 푸시하지
않는다(순서와 `createdAt` 보존). 관리자가 재발송을 선택하면 `resendAt`가 갱신되고, `onUpdate`
트리거가 **그 필드 변경만** 감지해 1회 재발송한다. 고정 토글 같은 다른 수정은 무시된다.

**5. 포그라운드와 백그라운드 분리, 플랫폼별 알림 클릭.** 백그라운드는 시스템 푸시,
포그라운드는 Firestore 구독 기반 인앱 토스트로 처리한다. iOS는 푸시 탭 시 앱이 자동으로 열리지만
안드로이드는 서비스워커의 `notificationclick` 핸들러가 있어야 열려, 핸들러를 추가해 양쪽을 맞췄다.

**6. iOS 앱 아이콘 배지.** 안드로이드는 자동이나 iOS는 Badging API로 직접 설정해야 한다.
읽지 않은 공지 수를 IndexedDB에 누적해 `setAppBadge`로 표시하고, 앱 진입 시 초기화한다.

**7. 읽기비용 기준 데이터 배치.** 변동 없는 일정, 방배정, 말씀, 식단은 정적 파일에, 실시간
변동되는 공지, 토큰, 프로필, 라이브 메모만 Firestore에 두어 읽기 비용을 최소화했다. Cloud Functions
컨테이너 이미지 정리 정책으로 불필요한 Artifact Registry 비용도 차단했다.

**8. 계층적 뒤로가기.** 안드로이드 뒤로가기를 `popstate`로 가로채, 도달 경로와 무관하게 지정된
부모 화면으로 복귀시킨다(상세에서 목록으로, 목록에서 홈으로). 홈에서는 더미 히스토리로 앱 종료를
막고, 방배정에서는 검색만 해제한다. iOS 홈 PWA엔 시스템 뒤로가기가 없어 화면 내 버튼으로 대응한다.

---

## 성과 측정

배포로 끝내지 않고 실제로 쓰이는지 보려고 핵심 이벤트를 계측한다. 앱 열림(`app_open`),
화면 조회(`page_view`), 설치 감지(`install_detected`), 외부 링크 이동, 푸시 도달 등을 남겨
설치율, 열람, 알림 도달을 확인할 수 있게 했다.

---

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # Firebase 설정값 입력
npm run dev
```

### 배포

```bash
npm run build
npx firebase-tools deploy --only hosting                 # 프론트
npx firebase-tools deploy --only functions               # 푸시 발송 함수 (region: asia-northeast3)
npx firebase-tools deploy --only firestore:rules         # 보안 규칙 변경 시
```
