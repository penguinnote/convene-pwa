import { INSTANCE } from "./src/config/instance.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // 팔레트(basil/ink/title)는 인스턴스 설정에서 가져온다 (값 동일).
      colors: {
        ...INSTANCE.theme.palette,
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
    },
  },
  plugins: [],
};
