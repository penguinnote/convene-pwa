import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { verseGroups } from "../data/verses.js";
import { goToVerse } from "../lib/nav";

export default function Verses() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <PageHeader eyebrow="Word" title="말씀 구절" subtitle="강의별 본문 모음" />

      <div className="space-y-7 px-5 py-5 pb-6">
        {verseGroups.map((g) => (
          <section key={g.group}>
            <h2 className="mb-2.5 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
              {g.group}
            </h2>

            <div className="space-y-2.5">
              {g.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToVerse(navigate, location.pathname, item.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-basil-100 bg-white px-4 py-4 text-left"
                >
                  <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 px-2 text-[13px] font-bold text-basil-600">
                    {item.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-keep font-bold leading-snug text-title">
                      {item.title}
                      {item.note && (
                        <span className="ml-1.5 align-middle text-xs font-medium text-ink-faint">
                          {item.note}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-basil-300">›</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
