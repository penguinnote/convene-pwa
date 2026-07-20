import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { rooms as staticRooms } from "../data/rooms.js";

// 방배정: config/rooms 단일 문서 실시간 구독(읽기비용 최소화를 위해 방마다
// 문서로 쪼개지 않는다). 문서가 없거나 rooms가 비었거나 로딩 전이면 번들된
// 정적 rooms.js로 폴백해 오프라인·초기 표시를 보장한다.
export function useRooms() {
  const [rooms, setRooms] = useState(staticRooms);
  useEffect(() => {
    return onSnapshot(doc(db, "config", "rooms"), (snap) => {
      const list = snap.exists() ? snap.data().rooms : null;
      setRooms(Array.isArray(list) && list.length ? list : staticRooms);
    });
  }, []);
  return rooms;
}
