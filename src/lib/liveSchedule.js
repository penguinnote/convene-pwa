import { schedule } from "../data/schedule";

// config/live 포인터(dayIndex·itemIndex)를 schedule 실제 항목으로 해석하는 헬퍼.
// Home(표시)과 Admin(진행 제어)이 같은 규칙을 공유하도록 한 곳에 둔다.

// 해당 위치의 item에 소속 day 라벨을 얹어 반환. 범위를 벗어나면 null.
export function getLiveItem(dayIndex, itemIndex) {
  const day = schedule[dayIndex];
  const item = day?.items?.[itemIndex];
  if (!item) return null;
  return { day: day.day, time: item.time, title: item.title, place: item.place };
}

// 다음 순서의 위치: 같은 day의 다음 item, 없으면 다음 day의 첫 item. 마지막이면 null.
export function getNextIndex(dayIndex, itemIndex) {
  const day = schedule[dayIndex];
  if (!day) return null;
  if (itemIndex + 1 < day.items.length) return { dayIndex, itemIndex: itemIndex + 1 };
  if (schedule[dayIndex + 1]?.items?.length) return { dayIndex: dayIndex + 1, itemIndex: 0 };
  return null;
}

// 다음 순서 item(표시용). 마지막이면 null.
export function getNextItem(dayIndex, itemIndex) {
  const n = getNextIndex(dayIndex, itemIndex);
  return n ? getLiveItem(n.dayIndex, n.itemIndex) : null;
}
