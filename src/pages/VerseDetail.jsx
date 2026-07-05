import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVerseById } from "../data/verses.js";

export default function VerseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState("ko");
  const en = lang === "en";

  const item = getVerseById(id);

  return (
    <div>
      {/* 상단 뒤로가기 */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-basil-100 bg-white/90 px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-basil-600"
        >
          <BackIcon />
          뒤로
        </button>
        {item && <LangToggle lang={lang} onChange={setLang} />}
      </header>

      <div className="px-6 py-6">
        {!item ? (
          <p className="rounded-2xl border border-basil-100 bg-white p-6 text-sm text-ink-soft">
            말씀을 찾을 수 없습니다.
          </p>
        ) : (
          <article>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
              {en ? item.groupEn : item.group}
            </p>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 px-2 text-[13px] font-bold text-basil-600">
                {item.label}
              </span>
              <span className="text-[13px] font-medium text-ink-faint">
                {en ? item.noteEn : item.note}
              </span>
            </div>

            <h1 className="mt-3 break-keep text-2xl font-bold leading-snug text-title">
              {en ? item.titleEn : item.title}
            </h1>

            <div className="mt-6 space-y-5">
              {item.passages.map((p, j) => {
                const ref = en ? p.refEn : p.ref;
                const text = en ? p.textEn : p.text;
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
          </article>
        )}
      </div>
    </div>
  );
}

function LangToggle({ lang, onChange }) {
  const isEn = lang === "en";
  return (
    <button
      type="button"
      onClick={() => onChange(isEn ? "ko" : "en")}
      className="relative flex h-7 w-[4.5rem] items-center rounded-full border border-basil-200 bg-basil-50 transition-colors"
      aria-label={isEn ? "Switch to Korean" : "Switch to English"}
    >
      <span
        className={`absolute left-0.5 h-6 w-8 rounded-full bg-basil-600 shadow-sm transition-transform ${
          isEn ? "translate-x-[calc(100%-2px)]" : ""
        }`}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-bold ${
          isEn ? "text-basil-400" : "text-white"
        }`}
      >
        한글
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-bold ${
          isEn ? "text-white" : "text-basil-400"
        }`}
      >
        EN
      </span>
    </button>
  );
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
