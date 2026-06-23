import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { schedule } from "../data/schedule.js";

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(0);
  const day = schedule[activeDay];

  return (
    <div>
      <PageHeader eyebrow="Schedule" title="캠프 일정" subtitle="3박 4일 전체 스케줄" />

      {/* 일자 탭 */}
      <div className="sticky top-[92px] z-10 border-b border-basil-100 bg-white/90 backdrop-blur-md">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
          {schedule.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(i)}
              className={`flex flex-col items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm transition ${
                i === activeDay
                  ? "bg-basil-600 text-white"
                  : "bg-basil-50 text-ink-soft"
              }`}
            >
              <span className="font-semibold">{d.day}</span>
              <span
                className={`text-[11px] ${
                  i === activeDay ? "text-white/80" : "text-ink-faint"
                }`}
              >
                {d.date.replace(/\s/g, "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        <ol className="relative ml-2 border-l border-basil-200 pl-6">
          {day.items.map((item, i) => (
            <li key={i} className="relative mb-6 last:mb-0">
              <span className="absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-basil-500 bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-basil-500" />
              </span>
              <p className="text-[13px] font-bold tracking-wide text-basil-600">
                {item.time}
              </p>
              <p className="mt-0.5 font-semibold text-ink">{item.title}</p>
              {item.place && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-faint">
                  <PinIcon />
                  {item.place}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
