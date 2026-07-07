import { schedule } from "../data/schedule";
import { INSTANCE } from "../config/instance.js";

// 라이브 "현재 순서" 자동 계산 기준일. 인스턴스 설정(liveAnchor)에서 가져온다.
export const LIVE_ANCHOR = INSTANCE.liveAnchor;

// "HH:MM" → 분(minute) 단위 정수
function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// schedule item에 소속 day 라벨을 얹은 표시용 뷰(link 포함)
function itemView(dayIndex, item) {
  return {
    day: schedule[dayIndex].day,
    time: item.time,
    title: item.title,
    place: item.place,
    link: item.link ?? null,
  };
}

// 순수 함수: now 기준 자동 현재/다음 순서를 계산한다.
// dayIndex는 LIVE_ANCHOR로부터 지난 일수 mod schedule.length(음수 보정)라
// 오늘=1일차, 내일=2일차 … schedule.length일 뒤 다시 1일차로 순환한다.
export function getAutoLive(now = new Date()) {
  const len = schedule.length;
  const anchorMid = new Date(`${LIVE_ANCHOR}T00:00:00`);
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDiff = Math.round((nowMid - anchorMid) / 86400000);
  const dayIndex = ((dayDiff % len) + len) % len;

  const items = schedule[dayIndex].items;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // current = 현재 시각 이하의 마지막 항목(첫 항목 시각 이전이면 null)
  // next = 현재 시각 초과의 첫 항목(없으면 다음 날 순환 첫 항목)
  let current = null;
  let next = null;
  for (const item of items) {
    if (timeToMin(item.time) <= nowMin) current = item;
    else {
      next = item;
      break;
    }
  }

  let nextView;
  if (next) {
    nextView = itemView(dayIndex, next);
  } else {
    const nextDay = (dayIndex + 1) % len;
    nextView = itemView(nextDay, schedule[nextDay].items[0]);
  }

  // 그날 첫 순서(07:00) 이전(=자정~07:00)에는 current가 없으므로 "취침"으로 채운다.
  // next는 그대로 그날 첫 항목(07:00)을 가리킨다. 취침에는 관련 자료 링크를 두지 않는다.
  const currentView = current
    ? itemView(dayIndex, current)
    : {
        day: schedule[dayIndex].day,
        time: "",
        title: "취침",
        place: "",
        link: null,
        rest: true,
      };

  return {
    dayIndex,
    current: currentView,
    next: nextView,
  };
}
