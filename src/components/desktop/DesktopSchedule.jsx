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

// 데스크톱 일정: 일자 탭(가운데) + 가운데 정렬 넓은 타임라인. 진입 시 현재 순서로 자동 스크롤.
export default function DesktopSchedule() {
  const live = getAutoLive(new Date());
  const [activeDay, setActiveDay] = useState(live.dayIndex);
  const userSwitched = useRef(false);
  const rootRef = useRef(null);
  const currentItemRef = useRef(null);
  const day = schedule[activeDay];
  const isToday = activeDay === live.dayIndex;

  const currentIdx =
    isToday && live.current && !live.current.rest
      ? day.items.findIndex(
          (it) => it.time === live.current.time && it.title === live.current.title
        )
      : -1;

  useEffect(() => {
    const scroller = getScrollParent(rootRef.current);
    const toTop = () =>
      scroller ? scroller.scrollTo({ top: 0 }) : window.scrollTo({ top: 0 });

    // 수동 전환·현재 항목 없음·현재가 첫 항목(위에 항목 없음) → 위에서부터.
    if (userSwitched.current || currentIdx < 1 || !currentItemRef.current) {
      toTop();
      return;
    }

    // 현재 순서를 "위에서 두 번째"로: 바로 앞(이전) 항목을 스크롤 영역 상단에 건다.
    const prev = currentItemRef.current.previousElementSibling ?? currentItemRef.current;
    const PAD = 12;
    requestAnimationFrame(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  function selectDay(i) {
    if (i === activeDay) return;
    userSwitched.current = true;
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
      <div className="mb-6 mt-4 flex justify-center gap-2">
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

      {/* 타임라인 */}
      <ol className="relative ml-3 border-l-2 border-basil-200 pl-8">
        {day.items.map((item, i) => {
          const now = i === currentIdx;
          return (
            <li
              key={i}
              ref={now ? currentItemRef : undefined}
              className="relative mb-4 last:mb-0"
            >
              <span
                className={`absolute -left-[39px] top-5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-white ${
                  now ? "border-basil-600" : "border-basil-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    now ? "bg-basil-600" : "bg-basil-400"
                  }`}
                />
              </span>
              <div
                className={`rounded-2xl px-6 py-4 text-center ${
                  now
                    ? "border-2 border-basil-500 bg-basil-50"
                    : "border border-basil-100 bg-white"
                }`}
              >
                {now && (
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-600">
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
    </div>
  );
}
