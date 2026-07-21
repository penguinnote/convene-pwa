import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import {
  getAnalytics,
  isSupported as analyticsSupported,
} from "firebase/analytics";

const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
// 신규 프로젝트는 .firebasestorage.app, 구형은 .appspot.com 버킷을 쓴다.
if (
  storageBucket &&
  !storageBucket.endsWith(".appspot.com") &&
  !storageBucket.endsWith(".firebasestorage.app")
) {
  console.warn("Firebase storage bucket looks unusual:", storageBucket);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// GA4(Firebase Analytics): measurementId가 있고 지원 환경일 때만 초기화.
// 미설정·미지원이면 null 유지 — 앱과 자체 Firestore 통계는 그대로 동작한다.
// (live binding export — 초기화 완료 후 track.js에서 참조된다.)
export let analytics = null;
analyticsSupported()
  .then((ok) => {
    if (ok && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {});

export async function getMessagingIfSupported() {
  return (await isSupported()) ? getMessaging(app) : null;
}
