import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVerseById } from "../data/verses.js";
import { useVerseFontLevel } from "../hooks/useVerseFontLevel";
import FontStepper from "../components/FontStepper.jsx";

export default function VerseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState("gae"); // "gae"(개역개정) | "sae"(새번역) | "en"(NIV)
  const en = lang === "en";
  const { level, change, size } = useVerseFontLevel();

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
        {item && (
          <div className="flex items-center gap-1.5">
            <LangSegment lang={lang} onChange={setLang} />
            <FontStepper level={level} onChange={change} />
          </div>
        )}
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
                const text =
                  lang === "gae" ? p.text : lang === "sae" ? p.textSae : p.textEn;
                return (
                  <div key={j} className="border-l-2 border-basil-300 pl-4">
                    <p className="break-keep [overflow-wrap:anywhere] text-sm font-bold text-basil-600">
                      {ref}
                    </p>
                    {text ? (
                      /* 절마다 개별 <p> + space-y로 절 사이 한 줄 띈 간격.
                         원문의 빈 줄(비연속 구간)은 spacer로 남겨 더 큰 간격이 된다. */
                      <div className="mt-1.5 space-y-3">
                        {text.split("\n").map((line, k) =>
                          line.trim() ? (
                            <p
                              key={k}
                              className="break-keep [overflow-wrap:anywhere] text-ink"
                              style={{ fontSize: size.fs, lineHeight: size.lh }}
                            >
                              {line}
                            </p>
                          ) : (
                            <div key={k} className="h-2" aria-hidden="true" />
                          )
                        )}
                      </div>
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

// 3단 언어 세그먼트 컨트롤 (개역개정/새번역/NIV).
// 각 칸이 독립 버튼이라 선택 칸이 항상 꽉 채워진다(슬라이딩 노브의 채움 틈 없음).
const LANG_OPTIONS = [
  { value: "gae", label: "개역개정" },
  { value: "en", label: "NIV" },
  { value: "sae", label: "새번역" },
];

function LangSegment({ lang, onChange }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-basil-200 bg-basil-50 p-0.5">
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
