import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// config/game.activeRound: 관리자가 연 라운드(0=닫힘, 1/2/3=열림). null=로딩 중.
export function useActiveRound() {
  const [activeRound, setActiveRound] = useState(null);
  useEffect(() => {
    return onSnapshot(doc(db, "config", "game"), (snap) => {
      setActiveRound(snap.exists() ? (snap.data().activeRound ?? 0) : 0);
    });
  }, []);
  return activeRound;
}
