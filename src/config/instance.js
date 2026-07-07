// 이 파일 하나가 "이 행사"의 정체성을 담는다.
// 새 행사에 배포하려면 이 파일만 교체하면 된다.
export const INSTANCE = {
  // 앱 이름 (매니페스트 · 브라우저 탭 · iOS 홈 아이콘 이름)
  appName: "2026 여름말씀캠프",
  shortName: "말씀캠프",
  description: "2026 청년대학부 여름말씀캠프 · 일정 · 방배정 · 말씀구절 · 공지",

  // 홈 히어로
  org: "2026 로뎀나무교회 청년대학부 여름말씀캠프", // eyebrow(상단 작은 글씨)
  slogan: "아담아, 네가 어디 있느냐?",             // 대표 표어(h1)
  sloganEn: "Where are you?",                     // 이탤릭 영문 표어

  // 외부 링크
  photosAlbumUrl: "https://photos.app.goo.gl/nZAFegzZbWZtQnx8A",

  // 캠프 1일차 날짜 (라이브 '현재 순서' 계산 기준). 실제 캠프 날짜로 둔다.
  liveAnchor: "2026-07-29",

  // 브랜드 색 (tailwind와 매니페스트가 참조)
  theme: {
    palette: {
      basil: {
        50: "#F2F8FA", 100: "#E3EEF0", 200: "#CFE6EE", 300: "#A9C4CF",
        400: "#7BB0C4", 500: "#5A93AC", 600: "#3F7D99", 700: "#356A83",
        800: "#2A5468", 900: "#21343C",
      },
      ink: { DEFAULT: "#21343C", soft: "#52707D", faint: "#8AA6B3" },
      title: "#2F5E72",
    },
    manifestThemeColor: "#D3F0F3",
    manifestBackgroundColor: "#ffffff",
  },
};
