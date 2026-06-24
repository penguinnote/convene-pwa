import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";
import SplashScreen, { SPLASH_TIMING } from "./components/SplashScreen.jsx";
import Home from "./pages/Home.jsx";
import Schedule from "./pages/Schedule.jsx";
import Rooms from "./pages/Rooms.jsx";
import Verses from "./pages/Verses.jsx";
import Admin from "./pages/Admin.jsx";
import Announcements from "./pages/Announcements.jsx";
import AnnouncementDetail from "./pages/AnnouncementDetail.jsx";

export default function App() {
  // 콜드 스타트마다 스플래시 노출 (마운트 시 1회)
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashStage, setSplashStage] = useState(1);
  const [splashLeaving, setSplashLeaving] = useState(false);

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

  return (
    <>
      {splashVisible && (
        <SplashScreen stage={splashStage} leaving={splashLeaving} />
      )}

      {/* 전체 높이 flex 컬럼: 본문만 내부 스크롤, 하단 탭은 항상 맨 아래 고정 */}
      {/* iOS standalone PWA에는 브라우저 툴바가 없어 100vh가 화면 전체를 정확히 잡는다
          (dvh/svh/%는 standalone에서 화면보다 짧게 잡혀 하단 공백이 생김) */}
      <div className="mx-auto flex h-screen max-w-md flex-col bg-white">
        {/* 콘텐츠 영역 (이 안에서만 스크롤) */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/verses" element={<Verses />} />
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
