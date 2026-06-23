import { getToken } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getMessagingIfSupported } from "../firebase";

// 앱 진입 후 사용자가 "알림 받기"를 누르면 호출.
// iOS는 반드시 홈화면 추가 → 앱으로 실행한 상태에서만 권한 요청이 동작한다.
export async function enablePush() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return { ok: false, reason: "unsupported" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: permission };

  // vite-plugin-pwa가 등록한 SW를 사용
  const swReg = await navigator.serviceWorker.ready;
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: swReg,
  });
  if (!token) return { ok: false, reason: "no-token" };

  // 토큰을 문서 ID로 저장 (중복 자동 제거)
  await setDoc(doc(db, "tokens", token), {
    token,
    ua: navigator.userAgent,
    createdAt: serverTimestamp(),
  });
  return { ok: true, token };
}
