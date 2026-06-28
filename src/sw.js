import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { incrementBadgeCount } from "./lib/badge";

// 0) 새 SW가 즉시 활성화되고 모든 탭을 제어하게 함 + 오래된 캐시 정리.
//    배포 후 재설치 없이 앱을 닫았다 열면 새 버전이 적용되고,
//    옛/새 파일 불일치(청크 로드 실패)를 막는다.
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// 1) 오프라인 캐싱 (vite-plugin-pwa가 이 자리에 매니페스트 주입)
precacheAndRoute(self.__WB_MANIFEST);

// 2) FCM 백그라운드 수신
const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, async (payload) => {
  const { title, body, id } = payload.data ?? {};
  // 고유 tag로 표시해 여러 알림이 서로 덮어쓰지 않고 쌓이게 한다
  self.registration.showNotification(title ?? "공지", {
    body: body ?? "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    tag: id || `camp-${Date.now()}`,
  });

  // 읽지 않은 공지 수를 1 증가시키고 앱 아이콘 배지 갱신
  // (안드로이드는 자동, iOS는 setAppBadge 수동 호출 필요. 미지원 환경은 무시)
  try {
    const count = await incrementBadgeCount();
    await self.navigator.setAppBadge?.(count);
  } catch {
    // Badging API/IndexedDB 미지원 무시
  }
});

// 3) 알림 클릭 시 앱 열기 (안드로이드에서 탭해도 앱이 안 열리는 문제 대응)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
