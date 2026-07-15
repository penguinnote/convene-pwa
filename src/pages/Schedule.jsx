import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { schedule } from "../data/schedule.js";
import { getAutoLive } from "../lib/liveSchedule";

// 가장 가까운 스크롤 가능한 조상(없으면 null → window).
function getScrollParent(node) {
  let el = node?.parentElement;
  while (el) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight)
      return el;
    el = el.parentElement;
  }
  return null;
}

export default function Schedule() {
  const live = getAutoLive(new Date());
  const [activeDay, setActiveDay] = useState(live.dayIndex); // 진입 시 현재 일차 자동 선택
  const userSwitched = useRef(false);
  const rootRef = useRef(null);
  const stickyRef = useRef(null);
  const currentItemRef = useRef(null);
  const day = schedule[activeDay];
  const isToday = activeDay === live.dayIndex;

  // 오늘 & 실제 진행 중(취침·첫 순서 이전 제외) 항목의 인덱스. 없으면 -1.
  const currentIdx =
    isToday && live.current && !live.current.rest
      ? day.items.findIndex(
          (it) => it.time === live.current.time && it.title === live.current.title
        )
      : -1;

  // 진입 시: 현재 항목을 맨 위로. 사용자가 날짜를 바꾸면 위에서부터.
  useEffect(() => {
    const scroller = getScrollParent(rootRef.current);
    const toTop = () =>
      scroller ? scroller.scrollTo({ top: 0 }) : window.scrollTo({ top: 0 });

    if (userSwitched.current) {
      toTop(); // 수동 전환: 위에서부터, 자동 스크롤 안 함
      return;
    }
    if (currentIdx < 0 || !currentItemRef.current) return; // 현재 항목 없음: 그대로 위에서부터

    // 상단 고정(헤더+일자 탭)에 가려지지 않게 오프셋을 준 뒤 현재 항목을 맨 위로.
    const offset = (stickyRef.current?.offsetHeight ?? 0) + 12;
    currentItemRef.current.style.scrollMarginTop = `${offset}px`;
    requestAnimationFrame(() => {
      currentItemRef.current?.scrollIntoView({ block: "start" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  function selectDay(i) {
    if (i === activeDay) return;
    userSwitched.current = true;
    setActiveDay(i);
  }

  return (
    <div ref={rootRef}>
      {/* 헤더 + 일자 탭을 하나의 sticky 덩어리로 묶어 함께 고정 */}
      <div ref={stickyRef} className="sticky top-0 z-10">
        <PageHeader
          eyebrow="Schedule"
          title="캠프 일정"
          subtitle="3박 4일 전체 스케줄"
          sticky={false}
        />

        {/* 일자 탭 */}
        <div className="border-b border-basil-100 bg-white/90 backdrop-blur-md">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
            {schedule.map((d, i) => (
              <button
                key={d.day}
                onClick={() => selectDay(i)}
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
      </div>

      <div className="px-5 py-5">
        <ol className="relative ml-2 border-l border-basil-200 pl-6">
          {day.items.map((item, i) => {
            const now = i === currentIdx;
            return (
              <li
                key={i}
                ref={now ? currentItemRef : undefined}
                className="relative mb-6 last:mb-0"
              >
                <span
                  className={`absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-white ${
                    now ? "border-basil-600" : "border-basil-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      now ? "bg-basil-600" : "bg-basil-500"
                    }`}
                  />
                </span>
                {now && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-basil-600">
                    지금 진행 중
                  </p>
                )}
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
            );
          })}
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
