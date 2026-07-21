import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { INSTANCE } from "../../config/instance.js";
import { logEvent } from "../../lib/track";
import DesktopHome from "./DesktopHome.jsx";
import DesktopSchedule from "./DesktopSchedule.jsx";
import DesktopVerses from "./DesktopVerses.jsx";
import DesktopRooms from "./DesktopRooms.jsx";
import DesktopAnnouncements from "./DesktopAnnouncements.jsx";
import DesktopMenu from "./DesktopMenu.jsx";
import DesktopPlaylist from "./DesktopPlaylist.jsx";
import DesktopTeamGame from "./DesktopTeamGame.jsx";
import DesktopParticipants from "./DesktopParticipants.jsx";
import Info from "../../pages/Info.jsx";
import Admin from "../../pages/Admin.jsx";
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

// 데스크톱 공통 셸: 전체 폭 수채화 히어로 + 가로 탭 내비 + 본문 영역(흰 배경, 카드 테두리로 구분).
// md(≥768px) 이상에서만 렌더된다(모바일은 App.jsx에서 기존 셸 유지).
export default function DesktopShell() {
  const { pathname } = useLocation();
  // 말씀 2단만 본문 높이를 정확히 채워(안 넘침) 좌·우 패널이 각자 스크롤하게 한다.
  // 다른 페이지는 기존대로 본문이 늘어나며 바깥이 스크롤(패딩 유지).
  const versesRoute = pathname === "/verses" || pathname.startsWith("/verses/");
  // 관리자는 히어로·가로 탭 없는 독립 화면(넓은 표·폼 작업 공간 확보).
  const adminRoute = pathname === "/admin";

  // 탭 전환 시 본문 스크롤을 맨 위로 리셋(이전 위치 남지 않게). 일정 페이지의
  // 현재-순서 스크롤은 rAF로 이 리셋 다음에 실행되므로 그대로 유지된다.
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0; // lg: 내부 스크롤 컨테이너
    window.scrollTo(0, 0); // md: 페이지(window) 스크롤
  }, [pathname]);
  return (
    // lg+: 화면 높이 세로 flex → 상단(히어로+탭) 고정, 본문만 내부 스크롤. md/모바일은 기존대로.
    <div className="min-h-screen bg-white lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
      {/* 상단 고정부 (lg에서 스크롤되지 않음). /admin에서는 숨긴다. */}
      {!adminRoute && (
        <div className="lg:shrink-0">
          <DesktopHero />
          <DesktopNav />
        </div>
      )}

      {/* 본문 스크롤 영역 (lg에서 이 영역만 내부 스크롤) */}
      <div ref={bodyRef} className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* 말씀 라우트: main을 본문 높이에 정확히 맞춘 flex 컬럼(lg:h-full, 안 넘침)으로 두어
            안의 좌·우 패널만 스크롤. 그 외 라우트: 기존처럼 콘텐츠대로 늘어나 바깥이 스크롤. */}
        <main
          className={`mx-auto max-w-6xl px-6 py-8 lg:px-8${
            versesRoute ? " lg:flex lg:h-full lg:flex-col lg:overflow-hidden" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<DesktopHome />} />
            <Route path="/schedule" element={<DesktopSchedule />} />
            <Route path="/rooms" element={<DesktopRooms />} />
            <Route path="/verses" element={<DesktopVerses />} />
            <Route path="/verses/:id" element={<DesktopVerses />} />
            <Route path="/info" element={<PageFrame element={<Info />} />} />
            <Route path="/menu" element={<DesktopMenu />} />
            <Route path="/playlist" element={<DesktopPlaylist />} />
            <Route
              path="/team"
              element={<PageFrame element={<DesktopTeamGame />} width="max-w-6xl" />}
            />
            <Route
              path="/participants"
              element={<PageFrame element={<DesktopParticipants />} />}
            />
            <Route path="/announcements" element={<DesktopAnnouncements />} />
            <Route
              path="/announcements/:id"
              element={
                <PageFrame element={<AnnouncementDetail />} width="max-w-[720px]" />
              }
            />
            <Route
              path="/admin"
              element={<PageFrame element={<Admin />} width="max-w-5xl" />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// 홈 외 기존 페이지를 데스크톱 본문 가운데 흰 컬럼으로 감싼다(모바일 페이지 컴포넌트 재사용).
function PageFrame({ element, width = "max-w-2xl" }) {
  return (
    <div
      className={`mx-auto ${width} overflow-hidden rounded-3xl border border-basil-100 bg-white shadow-sm`}
    >
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
