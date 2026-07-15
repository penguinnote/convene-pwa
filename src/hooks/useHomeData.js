import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { enablePush } from "../lib/push";
import { getAutoLive } from "../lib/liveSchedule";
import { goToAnnouncement, goToVerse, goChild } from "../lib/nav";
import { logEvent } from "../lib/track";

// 알림 권한이 아직 결정되지 않았을 때만(default) "알림 받기" 노출.
function initialPermission() {
  return typeof Notification !== "undefined" ? Notification.permission : "unsupported";
}

// 현재 순서 link → 관련 자료 버튼 라벨. 대상이 없으면 null(버튼 숨김).
// (모바일 Home.jsx의 resolveLink와 동일한 규칙)
export function resolveLinkLabel(link, pinned) {
  if (!link) return null;
  switch (link.type) {
    case "verse":
      return "관련 말씀";
    case "versesTab":
      return "말씀 보기";
    case "menu":
      return "메뉴 보기";
    case "playlist":
      return "플레이리스트";
    case "resource":
      return pinned ? "자료실 보기" : null;
    default:
      return null;
  }
}

/**
 * 홈 데이터 구독(공지·고정공지·라이브 메모) + 라이브 자동 계산 + 링크/알림 핸들러.
 * 모바일 Home.jsx와 동일한 데이터·로직을 데스크톱 홈(DesktopHome)에서 재사용한다.
 */
export function useHomeData() {
  const [recent, setRecent] = useState([]);
  const [pinned, setPinned] = useState(null);
  const [note, setNote] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [permission, setPermission] = useState(initialPermission);
  const navigate = useNavigate();
  const location = useLocation();

  // 1분마다 now 갱신 → 자동 현재/다음 순서 전환
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const qRecent = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubRecent = onSnapshot(qRecent, (snap) => {
      setRecent(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const qPinned = query(
      collection(db, "announcements"),
      where("pinned", "==", true),
      limit(1)
    );
    const unsubPinned = onSnapshot(qPinned, (snap) => {
      setPinned(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    });

    const unsubLive = onSnapshot(doc(db, "config", "live"), (snap) => {
      setNote(snap.exists() ? (snap.data().note ?? "") : "");
    });

    return () => {
      unsubRecent();
      unsubPinned();
      unsubLive();
    };
  }, []);

  // 최신 중 고정(pinned)이 아닌 것 딱 1개.
  const topCard = recent.find((r) => !r.pinned) ?? null;

  const { current: liveCurrent, next: liveNext, dayIndex } = getAutoLive(now);
  const liveLinkLabel = liveCurrent ? resolveLinkLabel(liveCurrent.link, pinned) : null;

  // 현재 순서 link 타입별 이동 (모바일 Home.jsx handleLink와 동일)
  function handleLink(link) {
    if (!link) return;
    logEvent("live_link_click", { type: link.type });
    const path = location.pathname;
    switch (link.type) {
      case "verse":
        goToVerse(navigate, path, link.verseId);
        break;
      case "versesTab":
        goChild(navigate, path, "/verses");
        break;
      case "menu":
        goChild(navigate, path, "/menu");
        break;
      case "playlist":
        goChild(navigate, path, "/playlist");
        break;
      case "resource":
        if (pinned) goToAnnouncement(navigate, path, pinned.id);
        break;
      default:
        break;
    }
  }

  async function handleEnablePush() {
    await enablePush();
    setPermission(initialPermission());
  }

  return {
    topCard,
    pinned,
    note,
    now,
    dayIndex,
    liveCurrent,
    liveNext,
    liveLinkLabel,
    handleLink,
    handleEnablePush,
    permission,
  };
}
