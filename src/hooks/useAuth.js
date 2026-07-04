import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) setNickname(snap.data().nickname ?? "");
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

  async function saveNickname(name) {
    if (!user || !name.trim()) return;
    const trimmed = name.trim();
    await setDoc(doc(db, "users", user.uid), { nickname: trimmed }, { merge: true });
    setNickname(trimmed);
  }

  return { user, nickname, saveNickname, ready, isAdmin: !!user?.email };
}
