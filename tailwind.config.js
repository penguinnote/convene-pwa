import { INSTANCE } from "./src/config/instance.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // 팔레트(basil/ink/title)는 인스턴스 설정에서 가져온다 (값 동일).
      colors: {
        ...INSTANCE.theme.palette,
        // 라이브 "지금 진행 중" 빨강: ◎(테두리·가운데 점) + 확산 링
        live: { DEFAULT: "#E53935", ring: "#F5A3A0" },
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
      // "지금 진행 중" ◎: 커졌다 작아졌다 라이브 펄스
      keyframes: {
        livebeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.28)" },
        },
      },
      animation: {
        livebeat: "livebeat 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
