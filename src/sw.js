import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

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

onBackgroundMessage(messaging, (payload) => {
  const { title, body } = payload.notification ?? payload.data ?? {};
  self.registration.showNotification(title ?? "공지", {
    body: body ?? "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  });
});
