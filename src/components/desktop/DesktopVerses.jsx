import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verseGroups, getVerseById } from "../../data/verses.js";

// 3단 언어 세그먼트 (개역개정/NIV/새번역) — VerseDetail과 동일 규칙.
const LANG_OPTIONS = [
  { value: "gae", label: "개역개정" },
  { value: "en", label: "NIV" },
  { value: "sae", label: "새번역" },
];

// 데스크톱 말씀: 왼쪽 강의 목록 + 오른쪽 본문(라우트 이동 없이 선택 상태로 전환).
export default function DesktopVerses() {
  const { id } = useParams();
  const firstId = verseGroups[0]?.items[0]?.id;
  const [selectedId, setSelectedId] = useState(id ?? firstId);
  const [lang, setLang] = useState("gae");

  // 외부에서 /verses/:id로 진입(예: 라이브 "관련 말씀")하면 그 강의를 선택.
  useEffect(() => {
    if (id) setSelectedId(id);
  }, [id]);

  const item = getVerseById(selectedId);
  const en = lang === "en";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* 목록 패널 */}
      <aside className="rounded-3xl border border-basil-100 bg-white p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        {verseGroups.map((g) => (
          <div key={g.group} className="mb-4 last:mb-0">
            <p className="mb-2 px-1 text-[12px] font-bold uppercase tracking-wider text-basil-600">
              {g.group}
            </p>
            <div className="space-y-1">
              {g.items.map((it) => {
                const active = it.id === selectedId;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setSelectedId(it.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-basil-600 text-white" : "text-ink hover:bg-basil-50"
                    }`}
                  >
                    <span
                      className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[12px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-basil-50 text-basil-600"
                      }`}
                    >
                      {it.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {it.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      {/* 본문 패널 */}
      <section className="rounded-3xl border border-basil-100 bg-white p-6 lg:p-8">
        {!item ? (
          <p className="text-sm text-ink-soft">강의를 선택하세요.</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
                  {en ? item.groupEn : item.group}
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-basil-50 px-2 text-[13px] font-bold text-basil-600">
                    {item.label}
                  </span>
                  {(en ? item.noteEn : item.note) && (
                    <span className="text-[13px] font-medium text-ink-faint">
                      {en ? item.noteEn : item.note}
                    </span>
                  )}
                </div>
                <h1 className="mt-3 break-keep text-2xl font-bold leading-snug text-title">
                  {en ? item.titleEn : item.title}
                </h1>
              </div>
              <LangSegment lang={lang} onChange={setLang} />
            </div>

            <div className="mt-6 space-y-5">
              {item.passages.map((p, j) => {
                const ref = en ? p.refEn : p.ref;
                const text =
                  lang === "gae" ? p.text : lang === "sae" ? p.textSae : p.textEn;
                return (
                  <div key={j} className="border-l-2 border-basil-300 pl-4">
                    <p className="text-sm font-bold text-basil-600">{ref}</p>
                    {text ? (
                      <p className="mt-1.5 whitespace-pre-wrap break-keep text-[15px] leading-[1.8] text-ink">
                        {text}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-sm italic text-ink-faint">
                        {en ? "Translation coming soon" : "본문은 준비 중입니다"}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function LangSegment({ lang, onChange }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-basil-200 bg-basil-50 p-0.5">
      {LANG_OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
              active ? "bg-basil-600 text-white" : "text-basil-500"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
