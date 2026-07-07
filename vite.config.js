import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { INSTANCE } from "./src/config/instance.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // index.html의 %APP_NAME%/%APP_SHORT_NAME% 토큰을 인스턴스 값으로 치환
    {
      name: "html-instance",
      transformIndexHtml(html) {
        return html
          .replace(/%APP_NAME%/g, INSTANCE.appName)
          .replace(/%APP_SHORT_NAME%/g, INSTANCE.shortName);
      },
    },
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      // 개발 중엔 서비스워커 캐싱을 끔 (옛 화면이 캐시돼 보이는 문제 방지).
      // PWA(홈화면 추가·오프라인)를 테스트할 땐: npm run build && npm run preview
      devOptions: { enabled: false, type: "module" },
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: INSTANCE.appName,
        short_name: INSTANCE.shortName,
        description: INSTANCE.description,
        lang: "ko",
        theme_color: INSTANCE.theme.manifestThemeColor,
        background_color: INSTANCE.theme.manifestBackgroundColor,
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        // 오프라인 대비: 빌드된 정적 자산 전부 프리캐시 (캠프장 와이파이 불안정 대비)
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
    }),
  ],
});
