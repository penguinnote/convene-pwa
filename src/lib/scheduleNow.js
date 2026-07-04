import { schedule } from "../data/schedule";

// 그날 마지막 일정의 대략 지속 시간(시간). 야간 공백·캠프 종료 판정에 사용.
const TRAILING_HOURS = 3;

// dateISO("2026-07-29") + time("14:00") → 로컬 기준 절대 시각
function toDate(dateISO, time) {
  return new Date(`${dateISO}T${time}:00`);
}

// schedule을 평탄화: 각 item에 절대 시작 시각·소속 day 라벨을 얹는다.
function buildItems() {
  const items = [];
  for (const day of schedule) {
    for (const it of day.items) {
      items.push({
        day: day.day,
        date: day.date,
        dateISO: day.dateISO,
        time: it.time,
        title: it.title,
        place: it.place,
        start: toDate(day.dateISO, it.time),
      });
    }
  }
  return items;
}

// 표시용 뷰(내부 start 등 제거)
function view(it) {
  return { day: it.day, time: it.time, title: it.title, place: it.place };
}

// 순수 함수: now 기준 캠프 진행 상태를 계산한다.
export function getScheduleStatus(now = new Date()) {
  const items = buildItems();
  const first = items[0];
  const last = items[items.length - 1];

  // 캠프 시작 전 → D-Day
  if (now < first.start) {
    const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startMid = toDate(first.dateISO, "00:00");
    const dday = Math.round((startMid - todayMid) / 86400000);
    const startLabel = `${first.date} ${first.time} ${first.title}`;
    return { phase: "before", dday, startLabel };
  }

  // 캠프 종료 후(마지막 일정 + 약 3시간)
  const campEnd = new Date(last.start.getTime() + TRAILING_HOURS * 3600000);
  if (now >= campEnd) {
    return { phase: "after" };
  }

  // 진행 중: current = 시작이 now 이하인 가장 최근 item(진행 중), next = 시작이 now 초과인 첫 item
  let current = null;
  let next = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].start <= now) {
      // 이 item의 대략 종료 시각: 같은 날 다음 일정 시작, 없으면(그날 마지막) start + 3시간
      const after = items[i + 1];
      const end =
        after && after.dateISO === items[i].dateISO
          ? after.start
          : new Date(items[i].start.getTime() + TRAILING_HOURS * 3600000);
      // now가 종료 시각을 지났으면 야간 공백 → current 없음
      current = now < end ? items[i] : null;
    } else {
      next = items[i];
      break;
    }
  }

  return {
    phase: "during",
    current: current ? view(current) : null,
    next: next ? view(next) : null,
  };
}
