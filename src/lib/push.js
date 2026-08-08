import { getToken } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getMessagingIfSupported } from "../firebase";
import { auth } from "../firebase";
import { logEvent } from "./track";

// 권한이 허용된 상태에서 현재 기기 토큰을 발급받아 tokens에 upsert.
// 토큰을 문서 ID로 쓰므로 몇 번을 호출해도 중복 없이 갱신만 된다(idempotent).
async function saveCurrentToken() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return { ok: false, reason: "unsupported" };

  // vite-plugin-pwa가 등록한 SW를 사용
  const swReg = await navigator.serviceWorker.ready;
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: swReg,
  });
  if (!token) return { ok: false, reason: "no-token" };

  await setDoc(doc(db, "tokens", token), {
    token,
    uid: auth.currentUser?.uid ?? null,
    ua: navigator.userAgent,
    createdAt: serverTimestamp(),
  });
  return { ok: true, token };
}

// 앱 진입 후 사용자가 "알림 받기"를 누르면 호출.
// iOS는 반드시 홈화면 추가 → 앱으로 실행한 상태에서만 권한 요청이 동작한다.
export async function enablePush() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return { ok: false, reason: "unsupported" };

  const permission = await Notification.requestPermission();
  logEvent("push_permission", { result: permission });
  if (permission !== "granted") return { ok: false, reason: permission };

  return saveCurrentToken();
}

// 앱을 열 때마다 호출: 권한이 이미 허용된 기기는 토큰을 조용히 재등록한다.
// tokens 컬렉션을 비워도 사용자가 앱을 다시 열기만 하면 자동 복구된다.
export async function refreshPushToken() {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    await saveCurrentToken();
  } catch {
    /* 백그라운드 재등록 실패는 무시 */
  }
}
