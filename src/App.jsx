import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import BottomNav from "./components/BottomNav.jsx";
import SplashScreen, { SPLASH_TIMING } from "./components/SplashScreen.jsx";
import Toast from "./components/Toast.jsx";
import { setBadgeCount } from "./lib/badge";
import { goToAnnouncement } from "./lib/nav";
import { useBackControl } from "./hooks/useBackControl";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { logEvent } from "./lib/track";
import Home from "./pages/Home.jsx";
import Schedule from "./pages/Schedule.jsx";
import Rooms from "./pages/Rooms.jsx";
import Verses from "./pages/Verses.jsx";
import VerseDetail from "./pages/VerseDetail.jsx";
import Info from "./pages/Info.jsx";
import Menu from "./pages/Menu.jsx";
import Playlist from "./pages/Playlist.jsx";
import Welcome from "./pages/Welcome.jsx";
import Admin from "./pages/Admin.jsx";
import Announcements from "./pages/Announcements.jsx";
import AnnouncementDetail from "./pages/AnnouncementDetail.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ready, hasProfile, isAdmin, user } = useAuth();

  // 콜드 스타트마다 스플래시 노출 (마운트 시 1회)
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashStage, setSplashStage] = useState(1);
  const [splashLeaving, setSplashLeaving] = useState(false);

  // 포그라운드 새 공지 인앱 토스트
  const [toast, setToast] = useState(null); // { id, title }
  const lastCreatedRef = useRef(0); // 마지막으로 본 최신 공지의 createdAt(ms)

  // 홈 위에 센티넬을 상시 유지 → 홈에서 뒤로가기해도 앱이 종료·재시작되지 않는다.
  useBackControl();

  // app_open — uid 준비된 뒤 세션당 1회
  const openedRef = useRef(false);
  useEffect(() => {
    if (ready && user && !openedRef.current) {
      openedRef.current = true;
      logEvent("app_open");
    }
  }, [ready, user]);

  // page_view — 라우트 변경마다
  useEffect(() => {
    logEvent("page_view", { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    const toStage2 = setTimeout(() => setSplashStage(2), SPLASH_TIMING.stage2At);
    const toLeave = setTimeout(() => setSplashLeaving(true), SPLASH_TIMING.finishAt);
    const toEnd = setTimeout(
      () => setSplashVisible(false),
      SPLASH_TIMING.finishAt + SPLASH_TIMING.fadeOut
    );
    return () => {
      clearTimeout(toStage2);
      clearTimeout(toLeave);
      clearTimeout(toEnd);
    };
  }, []);

  // 앱이 보이게 되면 읽지 않은 공지 카운트와 앱 아이콘 배지를 초기화
  useEffect(() => {
    function clearBadge() {
      if (document.visibilityState !== "visible") return;
      setBadgeCount(0);
      try {
        navigator.clearAppBadge?.();
      } catch {
        // Badging API 미지원 무시
      }
    }
    clearBadge(); // 앱 진입 시 1회
    document.addEventListener("visibilitychange", clearBadge);
    return () => document.removeEventListener("visibilitychange", clearBadge);
  }, []);

  // 포그라운드에서 새 공지(added)만 감지 → 인앱 토스트.
  // 수정(modified)·삭제(removed)에는 토스트를 띄우지 않는다.
  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    let initialized = false;
    return onSnapshot(q, (snap) => {
      // 첫 스냅샷은 기준 시각만 저장하고 토스트를 띄우지 않음
      if (!initialized) {
        initialized = true;
        const ms = snap.docs[0]?.data().createdAt?.toMillis?.() ?? 0;
        lastCreatedRef.current = ms;
        return;
      }
      snap.docChanges().forEach((change) => {
        if (change.type !== "added") return; // 수정/삭제 무시
        const data = change.doc.data();
        const ms = data.createdAt?.toMillis?.() ?? Date.now();
        // 기준 시각보다 새 공지일 때만 (삭제로 밀려 들어온 옛 문서 제외)
        if (ms <= lastCreatedRef.current) return;
        lastCreatedRef.current = ms;
        if (document.visibilityState === "visible") {
          setToast({ id: change.doc.id, title: data.title });
        }
      });
    });
  }, []);

  // 인증 준비 전에는 스플래시만 표시
  if (!ready) {
    return splashVisible ? (
      <SplashScreen stage={splashStage} leaving={splashLeaving} />
    ) : null;
  }

  // 프로필 미설정 시 온보딩 (관리자는 제외)
  if (!hasProfile && !isAdmin) {
    return (
      <>
        {splashVisible && <SplashScreen stage={splashStage} leaving={splashLeaving} />}
        <div className="mx-auto max-w-md">
          <Welcome />
        </div>
      </>
    );
  }

  return (
    <>
      {splashVisible && <SplashScreen stage={splashStage} leaving={splashLeaving} />}

      {toast && (
        <Toast
          key={toast.id}
          title={toast.title}
          onClick={() => {
            const id = toast.id;
            setToast(null);
            goToAnnouncement(navigate, location.pathname, id);
          }}
          onClose={() => setToast(null)}
        />
      )}

      {/* 전체 높이 flex 컬럼: 본문만 내부 스크롤, 하단 탭은 항상 맨 아래 고정 */}
      <div className="mx-auto flex h-screen max-w-md flex-col bg-white">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/verses" element={<Verses />} />
            <Route path="/verses/:id" element={<VerseDetail />} />
            <Route path="/info" element={<Info />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
