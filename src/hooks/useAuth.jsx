import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [mokjang, setMokjang] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setNickname(snap.data().nickname ?? "");
          setMokjang(snap.data().mokjang ?? "");
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

  async function saveProfile({ nickname: n, mokjang: m }) {
    if (!user) return;
    const data = {};
    if (n !== undefined) data.nickname = n.trim();
    if (m !== undefined) data.mokjang = m.trim();
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    if (n !== undefined) setNickname(n.trim());
    if (m !== undefined) setMokjang(m.trim());
  }

  return (
    <AuthContext.Provider value={{ user, nickname, mokjang, saveProfile, ready, isAdmin: !!user?.email }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
