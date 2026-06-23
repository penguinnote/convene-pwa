import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { verses } from "../data/verses.js";

export default function Verses() {
  const [open, setOpen] = useState(0); // 첫 강의 펼침

  return (
    <div>
      <PageHeader eyebrow="Word" title="말씀 구절" subtitle="강의별 본문 모음" />

      <div className="space-y-2.5 px-5 py-4 pb-6">
        {verses.map((v, i) => {
          const isOpen = open === i;
          return (
            <div
              key={v.lecture}
              className="overflow-hidden rounded-2xl border border-basil-100 bg-white"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 text-sm font-bold text-basil-600">
                  {v.lecture.replace("강", "")}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-ink">{v.lecture}</p>
                  <p className="text-sm text-ink-faint">{v.theme}</p>
                </div>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-basil-100 bg-basil-50/40 px-4 py-4">
                  {v.passages.map((p, j) => (
                    <div key={j} className="border-l-2 border-basil-300 pl-3.5">
                      <p className="text-sm font-bold text-basil-600">{p.ref}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink">
                        {p.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-basil-300 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
