import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { logEvent, isStandalone } from "../lib/track";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [mokjang, setMokjang] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          setNickname(d.nickname ?? "");
          setMokjang(d.mokjang ?? "");
          setPhotoURL(d.photoURL ?? "");
        }
        // 설치(홈화면 추가) 실행은 이벤트로만 기록(설치당 1회, localStorage 플래그).
        // users 문서는 온보딩(saveProfile)에서 처음 생성 — 이름 없는 유령 문서 방지.
        if (isStandalone() && !localStorage.getItem("installLogged")) {
          localStorage.setItem("installLogged", "1");
          logEvent("install_detected");
        }
        // 이메일 관리자 로그인 기록(관리자 수 통계용). 익명 사용자는 기록하지 않는다.
        if (u.email) {
          try {
            await setDoc(
              doc(db, "admins", u.uid),
              { email: u.email, lastLoginAt: serverTimestamp() },
              { merge: true }
            );
          } catch {
            // 기록 실패 무시
          }
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch {
          // 익명 로그인 실패 시 무시
        }
      }
      setReady(true);
    });
  }, []);

  async function saveProfile({ nickname: n, mokjang: m, photoURL: p }) {
    if (!user) return;
    const data = {};
    if (n !== undefined) data.nickname = n.trim();
    if (m !== undefined) data.mokjang = m.trim();
    if (p !== undefined) data.photoURL = p;
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    if (n !== undefined) setNickname(n.trim());
    if (m !== undefined) setMokjang(m.trim());
    if (p !== undefined) setPhotoURL(p);
  }

  async function uploadPhoto(file) {
    if (!user || !file) return;
    const path = `profiles/${user.uid}/${Date.now()}.jpg`;
    const task = uploadBytesResumable(ref(storage, path), file);
    return new Promise((resolve, reject) => {
      task.on("state_changed", null, reject, async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await saveProfile({ photoURL: url });
        resolve(url);
      });
    });
  }

  async function removePhoto() {
    if (!user) return;
    try {
      const folderRef = ref(storage, `profiles/${user.uid}`);
      const list = await listAll(folderRef);
      await Promise.all(list.items.map((item) => deleteObject(item)));
    } catch {
      // 삭제 실패 무시 (파일 없음 등)
    }
    await saveProfile({ photoURL: "" });
  }

  const hasProfile = !!nickname;

  return (
    <AuthContext.Provider
      value={{
        user,
        nickname,
        mokjang,
        photoURL,
        saveProfile,
        uploadPhoto,
        removePhoto,
        ready,
        hasProfile,
        isAdmin: !!user?.email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
