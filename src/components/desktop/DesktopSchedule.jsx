import { useEffect, useRef, useState } from "react";
import { schedule } from "../../data/schedule.js";
import { getAutoLive } from "../../lib/liveSchedule";

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

// 데스크톱 일정: 일자 탭(가운데) + 가운데 정렬 넓은 타임라인.
// 진입 시 맨 위(일차만 현재로 자동 선택). "현재 순서로" 버튼으로 현재 순서로 이동.
export default function DesktopSchedule() {
  const live = getAutoLive(new Date());
  const [activeDay, setActiveDay] = useState(live.dayIndex);
  const rootRef = useRef(null);
  const currentItemRef = useRef(null);
  const scrollToCurrentRef = useRef(false);
  const day = schedule[activeDay];
  const isToday = activeDay === live.dayIndex;

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

  // 현재 순서 직전(이전) 항목을 스크롤 영역 상단에 → 현재 순서는 위에서 두 번째.
  function scrollToCurrent() {
    const el = currentItemRef.current;
    if (!el) return;
    const scroller = getScrollParent(rootRef.current);
    const prev = el.previousElementSibling;
    const PAD = 12;
    requestAnimationFrame(() => {
      if (!prev) {
        // 현재가 그날 첫 항목: 그냥 맨 위로
        scroller ? scroller.scrollTo({ top: 0 }) : window.scrollTo({ top: 0 });
        return;
      }
      if (scroller) {
        // lg 내부 스크롤 컨테이너: 컨테이너 상단이 곧 보이는 상단(내비 겹침 없음).
        const delta =
          prev.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        scroller.scrollTo({ top: scroller.scrollTop + delta - PAD });
      } else {
        // md: 페이지 스크롤 + sticky 내비가 겹치므로 내비 높이만큼 보정.
        const navH = document.querySelector("nav")?.offsetHeight ?? 0;
        const y = prev.getBoundingClientRect().top + window.scrollY - navH - PAD;
        window.scrollTo({ top: Math.max(0, y) });
      }
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
    <div ref={rootRef} className="mx-auto max-w-[640px]">
      <div className="mb-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Schedule
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">캠프 일정</h1>
      </div>

      {/* 일자 탭 (가운데 정렬) */}
      <div className="mb-4 mt-4 flex justify-center gap-2">
        {schedule.map((d, i) => (
          <button
            key={d.day}
            type="button"
            onClick={() => selectDay(i)}
            className={`flex flex-col items-center whitespace-nowrap rounded-xl px-5 py-2 text-sm transition ${
              i === activeDay ? "bg-basil-600 text-white" : "bg-basil-50 text-ink-soft"
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
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={goToCurrent}
            className="inline-flex items-center gap-1.5 rounded-full bg-basil-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <TargetIcon />
            현재 순서로
          </button>
        </div>
      )}

      {/* 타임라인 */}
      <ol className="relative ml-3 border-l-2 border-[#D9D9D9] pl-8">
        {day.items.map((item, i) => {
          const now = i === currentIdx;
          return (
            <li
              key={i}
              ref={now ? currentItemRef : undefined}
              className="relative mb-4 last:mb-0"
            >
              {/* 점 중심을 타임라인 선(x축)에 정확히 정렬(-translate-x-1/2).
                  펄스 scale은 안쪽 ◎에만 걸어 중심 정렬을 깨지 않게 합성. */}
              {now ? (
                // 빨강 라이브 ◎: 확산 링(animate-ping) + 빨강 ◎(animate-livebeat)
                <span className="absolute left-[-33px] top-5 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-ring opacity-75" />
                  <span className="relative flex h-3.5 w-3.5 animate-livebeat items-center justify-center rounded-full border-2 border-live bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-live" />
                  </span>
                </span>
              ) : (
                <span className="absolute left-[-33px] top-5 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A1A1A]" />
                </span>
              )}
              <div
                className={`rounded-2xl px-6 py-4 text-center ${
                  now
                    ? "border-2 border-basil-500 bg-basil-50"
                    : "border border-basil-100 bg-white"
                }`}
              >
                {now && (
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-live">
                    지금 진행 중
                  </p>
                )}
                <p className="text-sm font-bold tracking-wide text-basil-600">
                  {item.time}
                </p>
                <p className="mt-1 break-keep text-lg font-semibold text-ink">
                  {item.title}
                </p>
                {item.place && (
                  <p className="mt-1 break-keep text-sm text-ink-faint">{item.place}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* 하단 여백 → 마지막·마지막 직전 순서도 "위 1개 + 아래 여백" 위치로 스크롤 가능 */}
      <div aria-hidden className="h-[70vh]" />
    </div>
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
