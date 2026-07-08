import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default [
  // 빌드 산출물·의존성은 검사 대상에서 제외
  { ignores: ["dist", "dev-dist", "node_modules", "functions/node_modules"] },

  // src의 React(JSX) 코드
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      // JSX 변환(자동 런타임)에서는 React를 직접 import하지 않아도 됨
      "react/react-in-jsx-scope": "off",
      // 런타임 PropTypes 검사는 이 프로젝트에서 쓰지 않음
      "react/prop-types": "off",
      // 미사용 변수는 에러, 단 _ 접두어(의도적 미사용)는 허용
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },

  // 서비스워커: 브라우저가 아닌 SW 전역(self·clients·registration 등) 사용
  {
    files: ["src/sw.js"],
    languageOptions: {
      globals: { ...globals.serviceworker, __WB_MANIFEST: "readonly" },
    },
  },

  // Prettier와 충돌하는 서식 규칙 비활성화 (항상 마지막)
  prettier,
];
