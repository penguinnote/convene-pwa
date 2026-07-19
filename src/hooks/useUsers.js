import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// users 컬렉션 실시간 구독(약 90개 문서, 무료 한도 내). 팀표·참여자 목록 공용.
export function useUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    return onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);
  return users;
}
