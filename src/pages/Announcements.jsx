import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { formatRelative } from "../lib/time";
import { truncateTitle } from "../lib/text";
import { hasImage, hasFile } from "../lib/blocks";
import PageHeader from "../components/PageHeader.jsx";

export default function Announcements() {
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
      <PageHeader eyebrow="Notice" title="공지사항" subtitle="캠프 안내 · 변경사항" />

      <div className="px-5 py-5">
        {notices.length === 0 ? (
          <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
            등록된 공지가 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {notices.map((notice) => (
              <li key={notice.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/announcements/${notice.id}`)}
                  className="block w-full rounded-2xl border border-basil-100 bg-white p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 flex-1 truncate text-base font-bold leading-snug text-title">
                      {truncateTitle(notice.title)}
                    </h2>
                    <span className="shrink-0 text-[11px] text-ink-faint">
                      {formatRelative(notice.createdAt)}
                    </span>
                  </div>
                  {notice.body && (
                    <p className="mt-1.5 line-clamp-2 break-keep [overflow-wrap:anywhere] text-sm leading-relaxed text-ink-soft">
                      {notice.body}
                    </p>
                  )}
                  {(hasImage(notice) || hasFile(notice)) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
