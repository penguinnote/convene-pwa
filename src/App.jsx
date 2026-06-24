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

      <div className="mx-auto flex min-h-full max-w-md flex-col bg-white">
      {/* 콘텐츠 영역 (하단 탭 높이만큼 패딩) */}
      <main className="flex-1 pb-24">
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
