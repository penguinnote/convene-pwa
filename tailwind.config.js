/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // 바질 그린 팔레트 (모던 미니멀 · 화이트 베이스)
        basil: {
          50: "#f4f7f2",
          100: "#e6ede2",
          200: "#cdddc6",
          300: "#a9c4a0",
          400: "#7fa473",
          500: "#5d8551",
          600: "#496b3f",
          700: "#3b5534",
          800: "#31452c",
          900: "#293a26",
        },
        ink: {
          DEFAULT: "#1c211b", // 본문 (짙은 그린-블랙)
          soft: "#5b635a", // 보조 텍스트
          faint: "#9aa298", // 흐린 텍스트
        },
      },
      fontFamily: {
        sans: [
          "Spoqa Han Sans Neo",
          "Apple SD Gothic Neo",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
