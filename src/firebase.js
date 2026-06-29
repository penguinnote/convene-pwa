import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";

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
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function getMessagingIfSupported() {
  return (await isSupported()) ? getMessaging(app) : null;
}
