import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { verseGroups } from "../data/verses.js";

export default function Verses() {
  // 기본으로 첫 그룹의 첫 항목만 펼침
  const [openKey, setOpenKey] = useState("0-0");

  return (
    <div>
      <PageHeader eyebrow="Word" title="말씀 구절" subtitle="강의별 본문 모음" />

      <div className="space-y-7 px-5 py-5 pb-6">
        {verseGroups.map((g, gi) => (
          <section key={g.group}>
            <h2 className="mb-2.5 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
              {g.group}
            </h2>

            <div className="space-y-2.5">
              {g.items.map((item, ii) => {
                const key = `${gi}-${ii}`;
                const isOpen = openKey === key;
                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-2xl border border-basil-100 bg-white"
                  >
                    <button
                      onClick={() => setOpenKey(isOpen ? "" : key)}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left"
                    >
                      <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 px-2 text-[13px] font-bold text-basil-600">
                        {item.label}
                      </span>
                      <div className="flex-1">
                        <p className="break-keep font-bold leading-snug text-title">
                          {item.title}
                          {item.note && (
                            <span className="ml-1.5 align-middle text-xs font-medium text-ink-faint">
                              {item.note}
                            </span>
                          )}
                        </p>
                      </div>
                      <ChevronIcon open={isOpen} />
                    </button>

                    {isOpen && (
                      <div className="space-y-4 border-t border-basil-100 bg-basil-50/40 px-4 py-4">
                        {item.passages.map((p, j) => (
                          <div key={j} className="border-l-2 border-basil-300 pl-3.5">
                            <p className="text-sm font-bold text-basil-600">
                              {p.ref}
                            </p>
                            {p.text ? (
                              <p className="mt-1 whitespace-pre-wrap break-keep text-[15px] leading-relaxed text-ink">
                                {p.text}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm italic text-ink-faint">
                                본문은 준비 중입니다
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
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
      className={`shrink-0 text-basil-300 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
