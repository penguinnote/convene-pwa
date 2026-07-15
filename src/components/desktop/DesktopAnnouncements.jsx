import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { formatRelative } from "../../lib/time";
import { truncateTitle } from "../../lib/text";
import { hasImage, hasFile } from "../../lib/blocks";

// 데스크톱 공지 목록: 반응형 auto-fit 카드 그리드.
export default function DesktopAnnouncements() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Notice
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">공지사항</h1>
      </div>

      {notices.length === 0 ? (
        <p className="rounded-2xl border border-basil-100 bg-white p-6 text-center text-sm text-ink-soft">
          등록된 공지가 없습니다.
        </p>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {notices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => navigate(`/announcements/${notice.id}`)}
              className="flex flex-col rounded-2xl border border-basil-100 bg-white p-5 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 flex-1 break-keep text-base font-bold leading-snug text-title">
                  {truncateTitle(notice.title, 40)}
                </h2>
                <span className="shrink-0 text-[11px] text-ink-faint">
                  {formatRelative(notice.createdAt)}
                </span>
              </div>
              {notice.body && (
                <p className="mt-2 line-clamp-3 break-keep [overflow-wrap:anywhere] text-sm leading-relaxed text-ink-soft">
                  {notice.body}
                </p>
              )}
              {(hasImage(notice) || hasFile(notice)) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hasImage(notice) && (
                    <span className="rounded-full bg-basil-50 px-2 py-0.5 text-[11px] font-medium text-basil-700">
                      사진
                    </span>
                  )}
                  {hasFile(notice) && (
                    <span className="rounded-full bg-basil-50 px-2 py-0.5 text-[11px] font-medium text-basil-700">
                      파일
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
