# 🌿 로뎀 청년대학부 여름말씀캠프 PWA

> QR 코드로 설치하고, 관리자 공지를 전 참가자 폰에 **실시간 푸시 알림**으로 전달하는 캠프 전용 프로그레시브 웹앱(PWA). 실제 캠프에서 96명이 사용했다.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FCM%20%7C%20Firestore%20%7C%20Functions%20%7C%20Storage-FFCA28?logo=firebase&logoColor=black">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white">
</p>

🔗 **Live demo:** https://rodemcamp.web.app

**실제 캠프 96명 전원 채택 · 참가자 94%가 공지 941회 열람 · 데이터로 검증한 실사용 PWA**

---

## 📖 프로젝트 소개

교회 청년대학부 여름 캠프(3박 4일, 참가자 96명)를 위해 기획부터 배포까지 직접 만든 모바일 웹앱이다. 앱스토어 심사 없이 **QR 코드 스캔만으로 설치**할 수 있고, 캠프 일정과 말씀 본문을 오프라인에서도 확인할 수 있으며, 운영진이 입력한 공지가 **모든 참가자의 폰에 푸시 알림**으로 즉시 전달된다.

iOS의 까다로운 PWA 푸시 제약, 서비스워커 충돌, 플랫폼별 알림 동작 차이 등 실제 프로덕션에서 마주치는 문제들을 데이터로 규명하고 해결한 것이 핵심이다.

---

## 📊 프로젝트 성과 (실제 운영 데이터)

2026 로뎀나무교회 청년대학부 여름말씀캠프(3박 4일, 2026.7.29–8.1, 참가자 96명)에서 실제로 운영되었다. 아래 지표는 직접 구축한 **관리자 통계 대시보드**로 수집·분석했다.

![운영 지표](docs/camp_metrics_v4.png)

### 사실상 참가자 전원이 채택했다
참가자 96명이 앱을 사용했으며, 재설치와 노트북·태블릿 등 다중 기기 사용으로 총 123개 디바이스가 등록되었다. 목표 대상의 거의 100%가 앱을 채택했다.

### 참여와 리텐션
- **공지 도달**: 참가자의 **94%(90명)**가 공지를 열람했고, 누적 **941회**(1인당 평균 약 10회) 열람되었다. 앱의 핵심 목적인 공지 전달을 달성했다.
- **푸시 알림**: 도달률은 참가자의 **63%**(토큰 60/96), 권한을 요청받은 사용자의 **98%가 허용**(52/53)했다. 도달률이 허용률보다 낮은 이유는 iOS가 홈 화면 설치 후에만 권한을 요청할 수 있어 프롬프트까지 도달한 인원이 제한되었기 때문이다.
- **리텐션**: 활성 사용은 첫날 이후에도 캠프 마지막 날까지 지속되었다.
- **사용 깊이**: 4일간 세션 1,616회, 세션당 평균 5.1화면 조회.
- **크로스플랫폼**: iOS 58%, Android 42%에서 안정 운영.

### 개선 지점
푸시 허용률(98%)은 매우 높으나 도달률(63%)이 낮았다. 원인은 iOS 설치 강제 정책으로, 설치 유도 온보딩 강화를 다음 개선 과제로 도출했다.

---

## 🖼️ 스크린샷

> `docs/` 폴더에 이미지를 넣고 아래 경로를 맞춘다.

| 홈 | 말씀 | 공지 푸시 |
|---|---|---|
| ![home](docs/home.png) | ![word](docs/word.png) | ![push](docs/push.png) |

---

## ✨ 주요 기능

- **QR 설치형 PWA**: 앱스토어 없이 홈 화면에 설치, 오프라인 캐싱으로 네트워크가 불안정한 캠프장에서도 조회 가능.
- **실시간 공지 푸시**: 관리자가 공지를 작성하면 전 사용자 폰에 백그라운드 푸시 알림이 전달된다.
- **리치 공지 에디터**: 텍스트, 이미지, 파일(PDF), 링크 블록을 순서대로 배치. 상단에 상시 노출되는 **고정 공지(자료 허브)** 지원.
- **인앱 토스트**: 앱을 사용 중일 때는 시스템 알림 대신 화면 상단 토스트로 새 공지를 알린다.
- **공지 댓글과 답글**: 익명 로그인 기반으로 참가자가 댓글과 답글을 남긴다.
- **말씀 본문**: 강의별 본문을 모아 보여주며, **한글(개역개정)과 영어(NIV)를 토글**로 전환한다.
- **캠프 일정**: 일자별 타임라인.
- **정보(마이페이지)**: 닉네임, 목장, 프로필 사진을 관리하고 방배정 등 정보에 접근한다.
- **사진**: Google Photos 공유 앨범 연동.
- **관리자 기능**: 로그인, 공지 작성·수정·삭제, 운영 통계 대시보드.
- **네이티브 경험**: 진입 스플래시 화면, 커스텀 앱 아이콘, 안드로이드 계층적 뒤로가기.

---

## 🏗️ 아키텍처

![아키텍처](docs/architecture.png)

- **DB**: Firestore — 공지, 토큰, 사용자, 댓글
- **푸시**: Firebase Cloud Messaging (웹 푸시, VAPID)
- **발송 서버**: Cloud Functions (Firestore onCreate 트리거로 전체 토큰 일괄 발송, 만료 토큰 자동 정리)
- **인증**: Firebase Auth (관리자 이메일, 참가자 익명 로그인)
- **파일**: Firebase Storage (공지 이미지·파일, 프로필 사진)
- **호스팅**: Firebase Hosting

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React 18, React Router, Vite 5 |
| Styling | Tailwind CSS, Gowun Batang, Hahmlet |
| PWA | vite-plugin-pwa (Workbox, injectManifest) |
| Backend | Firebase Firestore, Cloud Functions, Auth, Storage |
| Push | Firebase Cloud Messaging (FCM) |
| Hosting | Firebase Hosting |

---

## 🧩 기술적으로 신경 쓴 점

실제 배포와 운영 과정에서 마주친 문제와 해결 방법이다.

### 플랫폼별 알림 동작의 차이
- **iOS PWA 푸시 제약**: iOS는 16.4부터만 웹 푸시를 지원하며, 홈 화면에 설치한 앱으로 실행한 상태에서만 권한 요청과 수신이 가능하다. 온보딩과 안내 문구를 이 제약에 맞춰 설계했다.
- **알림 클릭 이동**: iOS는 푸시를 탭하면 자동으로 앱을 열지만 Android는 서비스워커의 notificationclick 핸들러가 있어야 동작한다. 핸들러를 추가해 양 플랫폼에서 동일하게 앱이 열리도록 했다.
- **iOS 앱 아이콘 배지**: Android는 자동 배지를 지원하지만 iOS는 Badging API로 직접 설정해야 하므로, 읽지 않은 공지 수를 setAppBadge로 표시하고 앱 진입 시 초기화했다.

### 서비스워커와 푸시 안정화
- **서비스워커 충돌 해결**: vite-plugin-pwa의 기본 서비스워커와 FCM 서비스워커가 루트 스코프에서 충돌하는 문제를 injectManifest 전략으로 단일 서비스워커에 통합해 해결했다.
- **알림 중복과 덮어쓰기 방지**: data 페이로드로 전환해 중복 표시를 막고, 알림마다 고유 tag를 부여해 여러 공지가 서로 덮어쓰지 않고 쌓이도록 했다.
- **전달 우선순위**: webpush Urgency high 헤더로 절전 상태에서도 즉시 전달되도록 했다.
- **서비스워커 즉시 갱신**: skipWaiting과 clientsClaim, cleanupOutdatedCaches를 적용해 배포 후 앱 재실행만으로 새 버전이 적용되게 하고, 청크 로드 실패 시 자동 복구를 넣었다.
- **포그라운드와 백그라운드 분리**: 백그라운드에서는 시스템 푸시, 포그라운드에서는 Firestore 구독 기반 인앱 토스트로 처리했다.

### 사용자 경험과 렌더링
- **계층적 뒤로가기 제어**: Android 뒤로가기를 popstate로 가로채 도달 경로와 무관하게 지정된 부모 화면으로 이동시키고, 홈에서는 히스토리 누적을 제거해 종료 동작을 일관되게 만들었다.
- **Android WebAPK 설치 경고 대응**: WebAPK의 targetSdkVersion이 낮으면 Play 프로텍트가 경고를 표시한다. 이 값은 앱 코드로 제어할 수 없으므로 온보딩 안내로 대응했다.
- **다이어그램 렌더링 안정화**: GitHub에서 Mermaid 렌더링이 불안정해 아키텍처 다이어그램을 PNG로 교체했다.
- **긴 문자열 오버플로우 방지**: 한글 줄바꿈을 위한 word-break keep-all 환경에서 띄어쓰기 없는 긴 문자열이 화면을 밀어내는 문제를 overflow-wrap으로 해결했다.

### 데이터 기반 운영
- Firebase 데이터를 집계하는 관리자 통계 대시보드를 직접 구축해, 채택·활성화 퍼널·리텐션·기능별 사용량을 측정하고 지표로 관리했다. 이를 통해 푸시 도달률의 병목이 거부가 아니라 iOS 설치 단계에 있음을 규명했다.

---

## 📝 회고 (Lessons Learned)

- **"동작한다"는 한 기기의 착각이다.** 상태바, 설치, 배지, 알림 클릭, WebAPK 경고 등 브라우저와 OS별로 동작이 크게 달라, 실기기(iOS·Android) 검증이 필수임을 체감했다.
- **지표는 정의가 절반이다.** 같은 데이터도 분모를 잘못 잡으면 성과가 하락처럼 보인다. 허용률과 도달률을 구분하고 목표 대상을 분모로 잡았을 때 비로소 성과가 정확히 드러났다.
- **병목은 기술이 아니라 온보딩일 수 있다.** 푸시 도달률의 한계는 발송 로직이 아니라 사용자의 설치 완료율에 있었다.
- **정적과 실시간의 트레이드오프.** 자주 바뀌지 않는 일정·방배정은 정적 파일이 오프라인에 강했고, 공지처럼 즉시성이 필요한 데이터만 실시간으로 두는 것이 합리적이었다.

---

## 📁 프로젝트 구조

```
camp-app/
├─ src/
│  ├─ pages/         # Home, Schedule, Verses, Rooms, Info, Admin,
│  │                 # Announcements, AnnouncementDetail, Welcome
│  ├─ components/    # BottomNav, PageHeader, Toast, SplashScreen
│  ├─ data/          # 일정, 말씀(한글·NIV) 정적 데이터
│  ├─ lib/           # push, time 등 유틸
│  ├─ firebase.js    # Firebase 초기화 (Firestore, Auth, Messaging, Storage)
│  └─ sw.js          # 서비스워커 (캐싱 + FCM 백그라운드 + 배지)
├─ functions/        # Cloud Function (공지 푸시 발송)
├─ firestore.rules   # Firestore 보안 규칙
├─ storage.rules     # Storage 보안 규칙
└─ vite.config.js    # PWA 설정 (injectManifest)
```

---

## 🚀 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # Firebase 설정값 입력
npm run dev
```

### 배포

```bash
npm run build
npx firebase-tools deploy --only hosting
```

푸시 발송 함수와 보안 규칙 구현은 [FIREBASE_PUSH_GUIDE.md](FIREBASE_PUSH_GUIDE.md), 디자인 결정 과정은 [DESIGN.md](DESIGN.md)에 정리했다.

---

## 🔮 향후 개선

- 설치 유도 온보딩을 강화해 푸시 도달률을 높인다.
- 포그라운드 알림 처리와 배지 로직을 더 정교화한다.
- GitHub Actions 기반 CI/CD 자동 배포를 구성한다.
- 일정·방배정 등 정보를 관리자 페이지에서 실시간 편집하도록 확장한다.

---

## 👤 만든 사람

허지훈 · 로뎀 청년대학부 · 2026
