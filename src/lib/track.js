import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { logEvent as gaLogEvent } from "firebase/analytics";
import { db, auth, analytics } from "../firebase";

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
  // GA4 병행 전송(초기화된 경우만). 이벤트명·params는 GA4 규칙에 부합해 그대로 보낸다.
  // 자체 Firestore 통계가 주 데이터이고 GA4는 표준 대시보드·기기 정보 보완용.
  try {
    if (analytics) gaLogEvent(analytics, name, params);
  } catch {
    /* GA 전송 실패 무시 */
  }
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
