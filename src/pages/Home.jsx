import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, orderBy, limit, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { enablePush } from "../lib/push";
import { formatRelative } from "../lib/time";
import { truncateTitle } from "../lib/text";
import { firstImageUrl, firstFile } from "../lib/blocks";
import { goToAnnouncement, goToVerse, goChild } from "../lib/nav";
import { getAutoLive } from "../lib/liveSchedule";

// 알림 권한이 아직 결정되지 않았을 때만(default) "알림 받기" 버튼을 노출.
// 미지원 환경에서는 Notification 자체가 없으므로 숨김 처리됨.
function initialPermission() {
  return typeof Notification !== "undefined" ? Notification.permission : "unsupported";
}

export default function Home() {
  const [recent, setRecent] = useState([]); // 최신 몇 개 (pinned 필터용)
  const [pinned, setPinned] = useState(null); // 고정 공지 (없으면 null)
  const [note, setNote] = useState(""); // config/live.note (변동 안내 메모)
  const [now, setNow] = useState(() => new Date()); // 라이브 자동 계산용 시각
  const [pushMsg, setPushMsg] = useState("");
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

    // 변동 안내 메모 실시간 구독 (config/live.note)
    const unsubLive = onSnapshot(doc(db, "config", "live"), (snap) => {
      setNote(snap.exists() ? snap.data().note ?? "" : "");
    });

    return () => {
      unsubRecent();
      unsubPinned();
      unsubLive();
    };
  }, []);

  // 공지 섹션: 최신 중 고정(pinned)이 아닌 것 딱 1개.
  const topCards = recent.filter((r) => !r.pinned).slice(0, 1);

  // 라이브: 시각 자동 계산(관리자 수동 포인터 없음).
  const { current: liveCurrent, next: liveNext } = getAutoLive(now);
  // 현재 순서의 link → 관련 자료 버튼(라벨). 대상 없으면 null.
  const liveLink = liveCurrent ? resolveLink(liveCurrent.link, pinned) : null;

  // 현재 순서 link 타입별 이동
  function handleLink(link) {
    if (!link) return;
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
    setPushMsg("");
    const result = await enablePush();
    setPermission(initialPermission());
    if (result.ok) {
      setPushMsg("알림이 설정되었어요.");
    } else if (result.reason === "unsupported") {
      setPushMsg("이 기기/브라우저에서는 알림을 지원하지 않아요.");
    } else if (result.reason === "denied") {
      setPushMsg("알림 권한이 거부되었어요. 브라우저 설정에서 허용해주세요.");
    } else {
      setPushMsg("알림 설정에 실패했어요. 다시 시도해주세요.");
    }
  }

  return (
    <div>
      {/* 히어로 — 수채화 하늘빛 그라데이션 (안전영역까지 채움) */}
      <section
        className="relative overflow-hidden px-6 pb-6 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1.25rem))]"
        style={{
          background: [
            "radial-gradient(130px 95px at 16% 20%, rgba(255,250,220,.95), transparent 70%)",
            "radial-gradient(160px 130px at 84% 10%, rgba(150,222,236,.92), transparent 70%)",
            "radial-gradient(170px 140px at 68% 74%, rgba(120,206,228,.8), transparent 72%)",
            "radial-gradient(150px 120px at 18% 90%, rgba(178,234,212,.85), transparent 70%)",
            "radial-gradient(210px 170px at 45% 45%, rgba(220,245,245,.7), transparent 75%)",
            "linear-gradient(165deg,#d3f0f3,#e0f2ec 52%,#f6f1e3)",
          ].join(", "),
        }}
      >
        {/* ✦ 반짝임 (흰색) */}
        <Sparkle className="left-7 top-[16%]" size={9} color="#FFFFFF" />
        <Sparkle className="right-8 top-[24%]" size={13} color="#FFFFFF" />
        <Sparkle className="right-14 top-[60%]" size={7} color="#FFFFFF" />
        <Sparkle className="bottom-[18%] left-[24%]" size={11} color="#FFFFFF" />

        <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-basil-600">
          2026 로뎀나무교회 청년대학부 여름말씀캠프
        </p>

        <h1
          className="relative mt-3 leading-[1.3] tracking-tight text-title"
          style={{
            whiteSpace: "nowrap",
            fontWeight: 400,
            fontSize: "clamp(1.4rem, 6.5vw, 1.65rem)",
          }}
        >
          아담아, 네가 어디 있느냐?
        </h1>

        <p className="relative mt-2 text-[22px] font-bold italic text-title">
          Where are you?
        </p>
      </section>

      {/* 공지 — Firestore 실시간 구독 (홈에서 가장 강조되는 영역, 고정 공지는 제외) */}
      <section className="px-6 pt-5">
        {topCards.length > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">공지</p>
              <button
                type="button"
                onClick={() => goChild(navigate, location.pathname, "/announcements")}
                className="text-sm font-medium text-basil-600"
              >
                전체 보기 ›
              </button>
            </div>

            <div className="space-y-3">
              {topCards.map((notice, i) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  highlight={i === 0}
                  onClick={() => goToAnnouncement(navigate, location.pathname, notice.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-3xl border border-basil-100 bg-white p-5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-basil-50 text-basil-600">
              <BellIcon />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">공지사항</p>
              <p className="mt-0.5 break-keep text-sm leading-relaxed text-ink-soft">
                등록된 공지가 없습니다. 캠프 기간 중 새 공지가 올라오면 여기에
                표시됩니다.
              </p>
            </div>
          </div>
        )}

        {permission === "default" && (
          <>
            <button
              type="button"
              onClick={handleEnablePush}
              className="mt-3 w-full rounded-xl border border-basil-100 bg-basil-50 py-2.5 text-sm font-semibold text-basil-700"
            >
              알림 받기
            </button>
            <p className="mt-1.5 break-keep text-center text-[11px] text-ink-faint">
              아이폰은 홈 화면에 추가 후 그 아이콘으로 실행해야 알림을 받을 수
              있어요.
            </p>
          </>
        )}
        {pushMsg && (
          <p className="mt-2 text-center text-xs text-ink-faint">{pushMsg}</p>
        )}
      </section>

      {/* 라이브 현재 순서 — 시각 자동 계산 */}
      {(liveCurrent || liveNext) && (
        <section className="px-6 pt-5">
          <LiveCard
            current={liveCurrent}
            next={liveNext}
            note={note}
            linkLabel={liveLink?.label ?? null}
            onLink={() => handleLink(liveCurrent?.link)}
            onCard={() => goChild(navigate, location.pathname, "/schedule")}
          />
        </section>
      )}

      {/* 자료실 — 고정 공지가 있으면 맨 밑에 표시 */}
      {pinned && (
        <section className="px-6 pt-5">
          <p className="mb-3 text-sm font-semibold text-ink">자료실</p>
          <NoticeCard
            notice={pinned}
            highlight={false}
            onClick={() => goToAnnouncement(navigate, location.pathname, pinned.id)}
          />
        </section>
      )}

      <p className="px-6 py-6 text-center text-xs text-ink-faint">
        로뎀나무교회 청년대학부 · 말씀캠프 앱
      </p>
    </div>
  );
}

// 공지 카드 (홈 상단 공지 + 자료실 고정 공지 공용)
function NoticeCard({ notice, highlight, onClick }) {
  const img = firstImageUrl(notice);
  const file = firstFile(notice);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left ${
        highlight
          ? "rounded-3xl border-2 border-basil-500 bg-basil-50 p-5 shadow-sm"
          : "rounded-3xl border border-basil-100 bg-white p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {highlight ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-basil-600 px-3 py-1 text-[11px] font-semibold text-white">
            <BellIcon />
            공지
          </span>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-[11px] text-basil-400">
          {formatRelative(notice.createdAt)}
        </span>
      </div>

      {/* A형: 좌측 본문 + 우측 64px 썸네일(밑단 정렬) */}
      <div className="mt-3 flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className={`truncate font-bold leading-snug text-title ${
              highlight ? "text-xl" : "text-lg"
            }`}
          >
            {truncateTitle(notice.title)}
          </h2>
          {notice.body && (
            <p className="mt-2 line-clamp-2 break-keep [overflow-wrap:anywhere] text-[15px] leading-relaxed text-ink-soft">
              {notice.body}
            </p>
          )}
          {file && (
            <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-basil-100 px-2.5 py-1 text-[12px] text-basil-700">
              <ClipIcon />
              <span className="truncate">{chipName(file.name)}</span>
            </span>
          )}
        </div>
        {img && (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-basil-100">
            <img src={img} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </button>
  );
}

// 현재 순서 link → 관련 자료 버튼 라벨. 대상이 없으면 null(버튼 숨김).
function resolveLink(link, pinned) {
  if (!link) return null;
  switch (link.type) {
    case "verse":
      return { label: "관련 말씀" };
    case "versesTab":
      return { label: "말씀 보기" };
    case "menu":
      return { label: "메뉴 보기" };
    case "playlist":
      return { label: "플레이리스트" };
    case "resource":
      return pinned ? { label: "자료실 보기" } : null; // 고정 공지 없으면 숨김
    default:
      return null;
  }
}

// 라이브 현재 순서 카드 (공지보다 약한 1px 테두리로 공지 우위 유지)
// current가 있으면 "지금 진행 중", 없으면(첫 일정 이전 등) "다음 일정"만 표시.
function LiveCard({ current, next, note, linkLabel, onLink, onCard }) {
  return (
    <div
      onClick={onCard}
      className="w-full cursor-pointer rounded-3xl border border-basil-100 bg-basil-50 p-5 text-left"
    >
      {current ? (
        <>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basil-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-basil-600" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-600">
              지금 진행 중
            </p>
            {current.day && (
              <span className="text-[11px] text-ink-faint">· {current.day}</span>
            )}
          </div>

          <p className="mt-2 break-keep text-xl font-bold text-title">
            {current.rest ? "취침" : `${current.time} ${current.title}`}
          </p>
          {!current.rest && current.place && (
            <p className="mt-0.5 break-keep text-[13px] text-ink-soft">{current.place}</p>
          )}

          {note && (
            <p className="mt-3 break-keep rounded-xl border border-basil-100 bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-basil-700">
              {note}
            </p>
          )}

          {next && (
            <p className="mt-3 break-keep text-[13px] text-ink-faint">
              다음 {next.time} {next.title}
              {next.place ? ` · ${next.place}` : ""}
            </p>
          )}

          {linkLabel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLink();
              }}
              className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-basil-600 px-3.5 py-1.5 text-[12px] font-semibold text-white"
            >
              <span className="truncate">{linkLabel}</span>
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-600">
            다음 일정
          </p>
          <p className="mt-2 break-keep text-xl font-bold text-title">
            {next.time} {next.title}
          </p>
          {next.place && (
            <p className="mt-0.5 break-keep text-[13px] text-ink-soft">{next.place}</p>
          )}
          {note && (
            <p className="mt-3 break-keep rounded-xl border border-basil-100 bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-basil-700">
              {note}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// 파일명이 10자 초과면 확장자 포함 앞 10자 + …
function chipName(name) {
  if (!name) return "";
  return name.length > 10 ? name.slice(0, 10) + "…" : name;
}

/* --- 아이콘 --- */
const sw = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...sw}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ClipIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...sw} className="shrink-0">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

/* 히어로 위 ✦ 반짝임 (절대위치) */
function Sparkle({ className = "", size = 10, color = "#E6CF94" }) {
  return (
    <span
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ fontSize: size, color, lineHeight: 1 }}
      aria-hidden="true"
    >
      ✦
    </span>
  );
}
