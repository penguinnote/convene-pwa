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
  const rootRef = useRef(null);
  const stickyRef = useRef(null);
  const currentItemRef = useRef(null);
  const scrollToCurrentRef = useRef(false);
  const day = schedule[activeDay];
  const isToday = activeDay === live.dayIndex;

  // 오늘 & 실제 진행 중(취침·첫 순서 이전 제외) 항목의 인덱스. 없으면 -1.
  const currentIdx =
    isToday && live.current && !live.current.rest
      ? day.items.findIndex(
          (it) => it.time === live.current.time && it.title === live.current.title
        )
      : -1;

  // 현재 캠프 일차의 "지금 진행 중" 순서 인덱스(활성 일차와 무관). 없으면 -1 → 버튼 숨김.
  const liveCurrentIdx =
    live.current && !live.current.rest
      ? schedule[live.dayIndex].items.findIndex(
          (it) => it.time === live.current.time && it.title === live.current.title
        )
      : -1;

  // 진입/일차 전환 시 맨 위(자동 스크롤 없음). "현재 순서로" 버튼으로 온 경우만 현재 순서로.
  useEffect(() => {
    const scroller = getScrollParent(rootRef.current);
    if (scrollToCurrentRef.current) {
      scrollToCurrentRef.current = false;
      scrollToCurrent();
    } else {
      scroller ? scroller.scrollTo({ top: 0 }) : window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  // 현재 순서 직전 항목을 스크롤 영역 맨 위(헤더 아래)에 → 현재 순서는 위에서 두 번째.
  function scrollToCurrent() {
    const el = currentItemRef.current;
    if (!el) return;
    const scroller = getScrollParent(rootRef.current);
    const prev = el.previousElementSibling;
    requestAnimationFrame(() => {
      if (!prev) {
        // 현재가 그날 첫 항목: 그냥 맨 위로
        scroller ? scroller.scrollTo({ top: 0 }) : window.scrollTo({ top: 0 });
        return;
      }
      const offset = (stickyRef.current?.offsetHeight ?? 0) + 12;
      prev.style.scrollMarginTop = `${offset}px`;
      prev.scrollIntoView({ block: "start" });
    });
  }

  // "현재 순서로" 버튼: 현재 일차가 아니면 전환 후, 현재 순서로 스크롤.
  function goToCurrent() {
    if (liveCurrentIdx < 0) return;
    if (activeDay !== live.dayIndex) {
      scrollToCurrentRef.current = true;
      setActiveDay(live.dayIndex);
    } else {
      scrollToCurrent();
    }
  }

  function selectDay(i) {
    if (i === activeDay) return;
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

          {/* 현재 순서로 바로가기 (현재 진행 중 순서가 있을 때만) */}
          {liveCurrentIdx >= 0 && (
            <div className="flex justify-center px-5 pb-3">
              <button
                type="button"
                onClick={goToCurrent}
                className="inline-flex items-center gap-1.5 rounded-full bg-basil-600 px-4 py-1.5 text-sm font-semibold text-white"
              >
                <TargetIcon />
                현재 순서로
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 하단에 큰 여백 → 마지막·마지막 직전 순서도 "위 1개 + 아래 여백" 위치로 스크롤 가능 */}
      <div className="px-5 pt-5 pb-[70vh]">
        <ol className="relative ml-2 border-l border-[#D9D9D9] pl-6">
          {day.items.map((item, i) => {
            const now = i === currentIdx;
            return (
              <li
                key={i}
                ref={now ? currentItemRef : undefined}
                className="relative mb-6 last:mb-0"
              >
                {/* 점 중심을 타임라인 선(x축)에 정확히 정렬(-translate-x-1/2).
                    펄스 scale은 안쪽 ◎에만 걸어 중심 정렬을 깨지 않게 합성. */}
                {now ? (
                  // 빨강 라이브 ◎: 확산 링(animate-ping) + 빨강 ◎(animate-livebeat)
                  <span className="absolute left-[-24.5px] top-1 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-ring opacity-75" />
                    <span className="relative flex h-3.5 w-3.5 animate-livebeat items-center justify-center rounded-full border-2 border-live bg-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-live" />
                    </span>
                  </span>
                ) : (
                  <span className="absolute left-[-24.5px] top-1 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1A1A1A]" />
                  </span>
                )}
                {now && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-live">
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

// ◎ 타깃 아이콘 ("현재 순서로" 버튼)
function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
