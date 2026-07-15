import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { INSTANCE } from "../../config/instance.js";
import { logEvent } from "../../lib/track";
import DesktopHome from "./DesktopHome.jsx";
import DesktopSchedule from "./DesktopSchedule.jsx";
import DesktopVerses from "./DesktopVerses.jsx";
import DesktopRooms from "./DesktopRooms.jsx";
import Info from "../../pages/Info.jsx";
import Menu from "../../pages/Menu.jsx";
import Playlist from "../../pages/Playlist.jsx";
import Admin from "../../pages/Admin.jsx";
import Announcements from "../../pages/Announcements.jsx";
import AnnouncementDetail from "../../pages/AnnouncementDetail.jsx";

// 홈 히어로와 동일한 수채화 그라데이션 값 재사용.
const HERO_BG = [
  "radial-gradient(130px 95px at 16% 20%, rgba(255,250,220,.95), transparent 70%)",
  "radial-gradient(160px 130px at 84% 10%, rgba(150,222,236,.92), transparent 70%)",
  "radial-gradient(170px 140px at 68% 74%, rgba(120,206,228,.8), transparent 72%)",
  "radial-gradient(150px 120px at 18% 90%, rgba(178,234,212,.85), transparent 70%)",
  "radial-gradient(210px 170px at 45% 45%, rgba(220,245,245,.7), transparent 75%)",
  "linear-gradient(165deg,#d3f0f3,#e0f2ec 52%,#f6f1e3)",
].join(", ");

// 데스크톱 공통 셸: 전체 폭 수채화 히어로 + 가로 탭 내비 + 본문 영역(옅은 아쿠아).
// md(≥768px) 이상에서만 렌더된다(모바일은 App.jsx에서 기존 셸 유지).
export default function DesktopShell() {
  return (
    <div className="min-h-screen bg-[#EEF6F7]">
      <DesktopHero />
      <DesktopNav />
      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <Routes>
          <Route path="/" element={<DesktopHome />} />
          <Route path="/schedule" element={<DesktopSchedule />} />
          <Route path="/rooms" element={<DesktopRooms />} />
          <Route path="/verses" element={<DesktopVerses />} />
          <Route path="/verses/:id" element={<DesktopVerses />} />
          <Route path="/info" element={<PageFrame element={<Info />} />} />
          <Route path="/menu" element={<PageFrame element={<Menu />} />} />
          <Route path="/playlist" element={<PageFrame element={<Playlist />} />} />
          <Route
            path="/announcements"
            element={<PageFrame element={<Announcements />} />}
          />
          <Route
            path="/announcements/:id"
            element={<PageFrame element={<AnnouncementDetail />} />}
          />
          <Route path="/admin" element={<PageFrame element={<Admin />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// 홈 외 기존 페이지를 데스크톱 본문 가운데 흰 컬럼으로 감싼다(모바일 페이지 컴포넌트 재사용).
function PageFrame({ element }) {
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-basil-100 bg-white shadow-sm">
      {element}
    </div>
  );
}

function DesktopHero() {
  return (
    <section className="relative overflow-hidden" style={{ background: HERO_BG }}>
      <div className="relative mx-auto max-w-6xl px-8 py-10">
        {/* ✦ 반짝임 (흰색) — 홈 히어로와 동일 */}
        <Sparkle className="left-10 top-[22%]" size={10} />
        <Sparkle className="left-[46%] top-[16%]" size={13} />
        <Sparkle className="right-24 top-[30%]" size={8} />
        <Sparkle className="right-40 bottom-[24%]" size={11} />

        <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-basil-600">
          {INSTANCE.org}
        </p>
        <h1
          className="relative mt-3 leading-[1.2] tracking-tight text-title"
          style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          {INSTANCE.slogan}
        </h1>
        <p className="relative mt-2 text-2xl font-bold italic text-title">
          {INSTANCE.sloganEn}
        </p>
      </div>
    </section>
  );
}

const NAV_TABS = [
  { to: "/", label: "홈", match: (p) => p === "/" },
  { to: "/schedule", label: "일정", match: (p) => p.startsWith("/schedule") },
  { to: "/verses", label: "말씀", match: (p) => p.startsWith("/verses") },
];

function DesktopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="sticky top-0 z-20 border-b border-basil-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 lg:px-8">
        {NAV_TABS.map((tab) => {
          const active = tab.match(path);
          return (
            <button
              key={tab.to}
              type="button"
              onClick={() => navigate(tab.to)}
              className={`relative px-4 py-4 text-[15px] transition-colors ${
                active
                  ? "font-semibold text-basil-600"
                  : "font-medium text-ink-faint hover:text-ink"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-basil-600" />
              )}
            </button>
          );
        })}

        {/* 사진 — 외부 앨범을 새 탭으로 (라우트 아님) */}
        <button
          type="button"
          onClick={() => {
            logEvent("external_open", { target: "photos" });
            window.open(INSTANCE.photosAlbumUrl, "_blank");
          }}
          className="px-4 py-4 text-[15px] font-medium text-ink-faint transition-colors hover:text-ink"
        >
          사진
        </button>
      </div>
    </nav>
  );
}

// 히어로 위 ✦ 반짝임 (흰색, 절대위치)
function Sparkle({ className = "", size = 10 }) {
  return (
    <span
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ fontSize: size, color: "#FFFFFF", lineHeight: 1 }}
      aria-hidden="true"
    >
      ✦
    </span>
  );
}
