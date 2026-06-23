import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { enablePush } from "../lib/push";
import { formatRelative } from "../lib/time";

// 알림 권한이 아직 결정되지 않았을 때만(default) "알림 받기" 버튼을 노출.
// 미지원 환경에서는 Notification 자체가 없으므로 숨김 처리됨.
function initialPermission() {
  return typeof Notification !== "undefined" ? Notification.permission : "unsupported";
}

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [pushMsg, setPushMsg] = useState("");
  const [permission, setPermission] = useState(initialPermission);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(2)
    );
    return onSnapshot(q, (snap) => {
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

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
      {/* 히어로 (eyebrow + 제목) */}
      <section className="px-6 pb-6 pt-[max(3rem,calc(env(safe-area-inset-top)+2rem))]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-basil-500">
          2026 청년대학부 여름말씀캠프
        </p>

        <h1
          className="mt-4 font-bold leading-[1.3] tracking-tight text-ink"
          style={{
            whiteSpace: "nowrap",
            fontSize: "clamp(1.1rem, 5.5vw, 1.4rem)",
          }}
        >
          아담아, 네가 어디 있느냐?
        </h1>
      </section>

      {/* 구분선 (좌우 본문 패딩 20px 안쪽 · 배경 흰색 유지) */}
      <div className="mx-5 h-[1.5px] bg-basil-300" />

      {/* 주제 말씀 */}
      <section className="px-6 pb-9 pt-6">
        <blockquote className="rounded-2xl border border-basil-100 bg-basil-50/60 p-5">
          <p className="break-keep text-[15px] leading-relaxed text-ink">
            “여호와 하나님이 아담을 부르시며 그에게 이르시되 네가 어디
            있느냐?”
          </p>
          <footer className="mt-2 text-sm font-semibold text-basil-600">
            창세기 3:9
          </footer>
        </blockquote>
      </section>

      {/* 공지 — Firestore 실시간 구독 (홈에서 가장 강조되는 영역) */}
      <section className="px-6">
        {notices.length > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">공지</p>
              <Link to="/announcements" className="text-sm font-medium text-basil-600">
                전체 보기 ›
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map((notice, i) => (
                <button
                  key={notice.id}
                  type="button"
                  onClick={() => navigate(`/announcements/${notice.id}`)}
                  className={`block w-full text-left ${
                    i === 0
                      ? "rounded-3xl border-2 border-basil-500 bg-basil-50 p-6 shadow-sm"
                      : "rounded-3xl border border-basil-100 bg-white p-5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-basil-600 px-3 py-1 text-[11px] font-semibold text-white">
                        <BellIcon />
                        공지
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 text-[11px] text-ink-faint">
                      {formatRelative(notice.createdAt)}
                    </span>
                  </div>
                  <h2
                    className={`mt-3 break-keep font-bold leading-snug text-ink ${
                      i === 0 ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {notice.title}
                  </h2>
                  {notice.body && (
                    <p className="mt-2 line-clamp-2 break-keep text-[15px] leading-relaxed text-ink-soft">
                      {notice.body}
                    </p>
                  )}
                </button>
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

      <p className="px-6 py-9 text-center text-xs text-ink-faint">
        로뎀 청년대학부 · 말씀캠프 앱
      </p>
    </div>
  );
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
