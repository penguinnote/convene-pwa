import { INSTANCE } from "./src/config/instance.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // 팔레트(basil/ink/title)는 인스턴스 설정에서 가져온다 (값 동일).
      colors: {
        ...INSTANCE.theme.palette,
        // 라이브 "지금 진행 중" 코랄: 코어 + 확산 링
        live: { DEFAULT: "#E8785A", ring: "#F0A98F" },
      },
      fontFamily: {
        sans: [
          "Gowun Batang",
          "Apple SD Gothic Neo",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "serif",
        ],
      },
      // "지금 진행 중" 점: 커졌다 작아졌다 + 밝기 변화 라이브 펄스
      keyframes: {
        livebeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: ".7" },
        },
      },
      animation: {
        livebeat: "livebeat 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
