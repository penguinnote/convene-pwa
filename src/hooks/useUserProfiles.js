import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// uid → { nickname, mokjang, photoURL } | null(문서 없음). 모듈 레벨 캐시로 재조회 방지.
const cache = new Map();

async function loadProfile(uid) {
  if (cache.has(uid)) return cache.get(uid);
  try {
    const snap = await getDoc(doc(db, "users", uid));
    const data = snap.exists()
      ? {
          nickname: snap.data().nickname ?? "",
          mokjang: snap.data().mokjang ?? "",
          photoURL: snap.data().photoURL ?? "",
        }
      : null;
    cache.set(uid, data);
    return data;
  } catch {
    cache.set(uid, null);
    return null;
  }
}

// uid 배열 → { [uid]: { nickname, mokjang, photoURL } } 맵. 문서 없는 uid는 제외(호출부 폴백).
export function useUserProfiles(uids) {
  const key = uids.join(",");
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    let alive = true;
    const list = key ? key.split(",") : [];
    Promise.all(list.map((uid) => loadProfile(uid).then((p) => [uid, p]))).then((entries) => {
      if (!alive) return;
      const map = {};
      for (const [uid, p] of entries) {
        if (p) map[uid] = p;
      }
      setProfiles(map);
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return profiles;
}
