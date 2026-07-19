# Convene

> 워크숍·수련회·캠프처럼 여러 날 진행되는 오프라인 행사를 위한 설치형 컴패니언 PWA. QR로 설치하고, 운영진 공지를 전 참가자 폰에 실시간 푸시로 보낸다. 제품은 범용으로 설계하고 각 행사의 정체성은 `instance.js` 한 파일로 분리해, 파일만 교체하면 새 행사에 재배포된다.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FCM%20%7C%20Firestore%20%7C%20Functions-FFCA28?logo=firebase&logoColor=black">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white">
</p>

🔗 **Live (첫 배포 인스턴스):** https://rodemcamp.web.app
📐 **디자인 기록:** [DESIGN.md](DESIGN.md)

---

## 프로젝트 소개

Convene은 다중일 오프라인 행사에서 참가자에게 필요한 정보(실시간 공지, 자료, 일정, 조 편성 등)를 한곳에 모으고, 운영진 공지를 모든 참가자 폰에 즉시 푸시하는 모바일 웹앱이다. 앱스토어 심사 없이 QR 스캔으로 설치되고, 캠프장 네트워크가 불안정해도 오프라인에서 열람된다.

제품은 범용으로 설계하되 행사별 이름·표어·색·일정·콘텐츠는 인스턴스 설정으로 분리했다. 첫 배포처는 로뎀나무교회 청년대학부 여름캠프(80~100명, 3박 4일)이며, 기획·디자인·개발·운영을 직접 진행했다.

---

## 스크린샷

| 홈                     | 일정                           | 공지 푸시              |
| ---------------------- | ------------------------------ | ---------------------- |
| ![home](docs/home.png) | ![schedule](docs/schedule.png) | ![push](docs/push.png) |

---

## 핵심 기능

**공지 & 푸시**
- **실시간 공지 푸시** — 관리자가 공지를 올리면 전 참가자 폰에 백그라운드 푸시. 앱을 보는 중엔 시스템 알림 대신 인앱 토스트로 뜨고, 탭하면 해당 공지로 이동하며, iOS는 읽지 않은 수를 앱 아이콘 배지로 표시한다.
- **선택적 재발송** — 공지 수정은 기본적으로 푸시하지 않지만(목록 순서 보존), 관리자가 원하면 체크 한 번으로 다시 발송한다.
- **블록 리치 공지** — 텍스트·이미지·PDF를 원하는 순서로 배치하는 블록 에디터. 첨부는 Storage에 올리고 이미지는 업로드 전 클라이언트에서 리사이즈한다.

**라이브 & 홈**
- **라이브 "현재 순서"** — 일정표 기준으로 "지금 진행 중"과 다음 순서를 시각에 따라 자동 표시하고, 순서 성격에 맞춰 말씀·자료실·식단표·플레이리스트·조 편성으로 한 번에 이동한다. 시간이 밀리면 관리자가 변동 안내 메모만 얹는다.
- **홈 허브** — 앱을 열면 최신 공지, 라이브 현재 순서, 자료실이 한 화면에 들어온다.

**레크레이션 조 편성 게임**
- 취향 질문으로 팀을 나누는 게임형 조 편성. 3라운드(음식·초능력·성향) × 4문제 2지선다에 답하면 16개 구역(A1~D4) 중 하나로 배정되고, 현장 표지로 이동을 안내한다.
- 답변 조합과 구역 코드가 1:1 대응(전단사)이라 서버 계산 없이 결정되며, 결과 화면은 배정과 함께 내가 고른 선택지도 복원해 보여 준다.
- 전체 참여자의 배정을 16칸 표로 실시간 공유(Firestore)하고, 관리자는 라운드별 시작·종료·재시작과 인원 이동·삭제를 제어한다.

**참여자 커뮤니티**
- **참여자 디렉토리** — 전체 참가자의 이름·목장·사진을 실시간으로 모아 보여 준다.
- **팔로우 연출** — 프로필 카드에 "팔로워·팔로잉"을 전 참가자 수로 표시해, 모두가 서로의 동역자임을 드러낸다(관계 그래프 없이 커뮤니티 메시지만).

**콘텐츠 열람**
- 일자별 일정, 이름·방 검색이 되는 방배정, 강의별 말씀 본문(개역개정·NIV·새번역 3역본 토글, 절 단위 가독성 레이아웃, 4단계 글씨 크기 조절), 식단표, 찬양 플레이리스트.

**관리자 콘솔**
- 이메일 로그인 관리자 전용. 공지 작성·수정·삭제, 라이브 변동 메모, 조 편성 진행 관리, 참여자 조회·수정·삭제를 폰/데스크톱에서 모두 수행한다.

**플랫폼**
- **데스크톱 레이아웃** — ≥768px에선 전체 폭 히어로 + 가로 탭의 데스크톱 셸과 홈 대시보드를 제공하고, 폰(<768px)은 기존 모바일 UI(하단 5탭)를 그대로 유지한다.
- **설치형 PWA** — QR로 홈 화면 설치, 오프라인 캐싱, 브랜드 색 아이콘과 스플래시.
- **계층적 뒤로가기** — 안드로이드 하드웨어 뒤로가기를 정보 구조에 맞춰 제어한다.
- **성과 측정 로깅** — 설치·열람·푸시 도달 등 핵심 이벤트를 계측한다.

---

## 아키텍처

![아키텍처](docs/architecture.png)

- **DB (Firestore)** — `announcements`(공지), `tokens`(FCM 토큰), `users`(프로필 + 팀 배정 `teams`), `config/live`(라이브 변동 메모), `config/game`(열린 라운드), `events`(로그)
- **정적 데이터 (`src/data/`)** — 일정·방배정·말씀·식단·조 편성 질문·목장 목록. 변동이 없어 파일에 두어 읽기 비용을 없앤다
- **푸시 서버 (Cloud Functions)** — 공지 생성 시 `onCreate`로 전체 토큰 일괄 발송(만료 토큰 자동 정리), 수정 재발송은 `onUpdate`가 `resendAt` 변경만 감지해 1회 발송
- **인증** — 익명 로그인(참가자 프로필·팀 배정) + 이메일 로그인(관리자). `isAdmin = !!user.email`
- **호스팅·스토리지** — Firebase Hosting, Storage

---

## 제품 = 인스턴스 분리 (재사용 설계)

행사마다 다른 값을 코드 전체에 흩뿌리는 대신 `src/config/instance.js` 한 파일에 모았다. 앱 이름, 히어로 표어, 브랜드 팔레트, 라이브 기준일, 사진 앨범 링크 등 "행사의 정체성"이 여기 담긴다. 새 행사에 배포하려면 이 파일만 교체하면 되고, 앱 전체 색은 이 팔레트를 Tailwind와 매니페스트가 함께 참조한다.

---

## 기술 스택

| 구분                     | 기술                                            |
| ------------------------ | ----------------------------------------------- |
| Frontend                 | React 18, React Router 6, Vite 5                |
| Styling                  | Tailwind CSS 3                                  |
| Font                     | Gowun Batang                                    |
| PWA                      | vite-plugin-pwa (Workbox, injectManifest)       |
| Backend                  | Firebase Firestore, Cloud Functions, Auth       |
| Storage / Push / Hosting | Firebase Storage, Cloud Messaging(FCM), Hosting |

---

## 엔지니어링 하이라이트

실제 배포에서 마주친 문제와 해결이다.

**1. 단일 서비스워커로 캐싱과 FCM 통합, 즉시 갱신.** `vite-plugin-pwa`의 기본 `generateSW`가 FCM 백그라운드 서비스워커와 루트 스코프에서 충돌해, `injectManifest`로 전환해 커스텀 `sw.js` 하나가 오프라인 캐싱과 FCM 수신을 모두 담당하게 했다. `skipWaiting`·`clientsClaim`·`cleanupOutdatedCaches`로 앱 재실행만으로 새 버전이 적용되고, 청크 로드 실패 시 1회 자동 새로고침으로 옛/새 빌드 파일 불일치를 복구한다.

**2. 중복 푸시 제거 (data-only).** `notification` 페이로드는 FCM 자동 표시와 `onBackgroundMessage`가 겹쳐 알림이 두 번 왔다. `data` 페이로드로 전환해 서비스워커가 한 번만 표시하고, 공지 문서 id를 고유 `tag`로 부여해 여러 알림이 덮어쓰지 않고 쌓이게 했다.

**3. iOS PWA 푸시·배지 제약 대응.** iOS는 16.4+에서 "홈 화면에 추가"로 설치·실행한 상태에서만 웹 푸시가 되고, 앱 아이콘 배지도 Badging API로 직접 설정해야 한다. 온보딩을 이 제약에 맞춰 설계하고, 읽지 않은 공지 수를 IndexedDB에 누적해 `setAppBadge`로 표시한 뒤 앱 진입 시 초기화한다.

**4. 선택적 푸시 재발송.** 새 공지는 `onCreate`로 발송하고 수정은 기본적으로 푸시하지 않는다(순서·`createdAt` 보존). 관리자가 재발송을 선택하면 `resendAt`가 갱신되고 `onUpdate`가 그 필드 변경만 감지해 1회 재발송한다.

**5. 서버 없는 결정적 조 편성.** 4개 2지선다 답을 4비트로 보아 앞 2문제로 열(A~D), 뒤 2문제로 행(1~4)을 정하는 전단사 매핑으로 16개 구역을 만든다. 답변↔구역 코드가 가역이라, 결과 화면에서 배정 코드만으로 "내가 고른 선택지"를 되복원해 별도 저장 없이 보여 준다.

**6. 무료 한도 안에서의 실시간 집계.** 팀 배정을 참가자 프로필 문서(`users.teams`) 한곳에 denormalize하고, `users` 컬렉션(약 90개 문서)을 `onSnapshot`으로 구독해 16칸 팀 표·참여자 목록·팔로우 수를 실시간으로 만든다. 관리자 재시작은 `writeBatch`로 일괄 갱신한다.

**7. 관리자 접근 통제 (다층 방어).** 앱이 전원 익명 로그인시키는 구조 탓에 "로그인 여부"만으로는 관리자를 가릴 수 없었다. UI 게이트를 이메일 보유(`user.email`) 기준으로 바꾸고, Firestore 규칙에서 공지·설정 쓰기를 `request.auth.token.email` 조건으로 제한해 UI와 데이터 양쪽에서 막았다.

**8. 읽기비용 기준 데이터 배치.** 변동 없는 일정·방배정·말씀·식단·조 편성 질문은 정적 파일에, 실시간 변동되는 공지·토큰·프로필·라이브 메모만 Firestore에 두어 읽기 비용을 최소화했다. Functions 컨테이너 이미지 정리 정책으로 불필요한 Artifact Registry 비용도 차단했다.

**9. 계층적 뒤로가기.** 안드로이드 뒤로가기를 `popstate`로 가로채, 도달 경로와 무관하게 지정된 부모 화면으로 복귀시킨다(상세→목록, 자식→홈). 홈에서는 더미 히스토리로 앱 종료를 막고, 방배정에서는 검색만 해제한다. iOS 홈 PWA엔 시스템 뒤로가기가 없어 화면 내 버튼으로 대응한다.

---

## 성과 측정

배포로 끝내지 않고 실제 사용을 확인하려 핵심 이벤트를 계측한다. 앱 열림(`app_open`), 화면 조회(`page_view`), 설치 감지(`install_detected`), 외부 링크 이동, 푸시 도달 등을 남겨 설치율·열람·알림 도달을 볼 수 있게 했다.

---

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # Firebase 설정값 입력
npm run dev
npm run lint                        # ESLint 검사 (선택)
```

### 배포

```bash
npm run build
npx firebase-tools deploy --only hosting            # 프론트
npx firebase-tools deploy --only functions          # 푸시 발송 함수 (region: asia-northeast3)
npx firebase-tools deploy --only firestore:rules    # 보안 규칙 변경 시
```
