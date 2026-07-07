import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

// 세션 ID: 앱 로드(콜드 스타트/새로고침) 1회 생성
const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);

function platform() {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

export function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true // iOS
  );
}

function todayKST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

export async function logEvent(name, params = {}) {
  try {
    await addDoc(collection(db, "events"), {
      name,
      params,
      uid: auth.currentUser?.uid ?? null,
      sessionId,
      platform: platform(),
      standalone: isStandalone(),
      day: todayKST(),
      ts: serverTimestamp(),
    });
  } catch {
    /* noop */
  }
}
