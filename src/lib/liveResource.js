import { verseGroups } from "../data/verses";

// 라이브 "현재 순서" title로 연결할 관련 자료를 판별하는 순수 함수.
// 대상을 못 찾으면 항상 안전하게 링크 없이 폴백한다.
//
// 매핑 규칙(위에서부터 우선):
//   1) "N강"(1~5강) 포함        → 주제 강의 N강 말씀      { kind:"verse", to:"/verses", ... }
//   2) "개회" 포함              → 개회 말씀
//      "폐회"/"파송" 포함        → 폐회 말씀
//   3) "식사"(아침/점심/저녁) 포함 → 식단표 미구현이라 링크 없음  { kind:"meal" }
//   4) 그 외 프로그램            → 자료실(고정 공지) 상세      { kind:"resource", to }
//   5) 어디에도 안 맞으면        → null (링크 없음)
//
// 항목 추가는 이 규칙 사이에 case를 넣는 식으로 확장한다.

// 주어진 그룹에서 label이 일치하는 강의 항목을 찾아 표시용 정보로 변환.
function findVerse(groupName, label) {
  const group = verseGroups.find((g) => g.group === groupName);
  const item = group?.items.find((it) => it.label === label);
  if (!item) return null;
  return {
    kind: "verse",
    to: "/verses",
    label: item.label,
    verseTitle: item.title,
    ref: item.passages?.[0]?.ref ?? "",
  };
}

export function getLiveResource(item, pinnedId = null) {
  const title = item?.title ?? "";

  // 1) 주제 강의 N강 (예: "1강", "저녁 집회 · 2강", "개회예배 · 1강")
  const gang = title.match(/([1-5])강/);
  if (gang) return findVerse("주제 강의", `${gang[1]}강`);

  // 2) 개회 / 폐회·파송 말씀
  if (title.includes("개회")) return findVerse("개회·폐회 메시지", "개회");
  if (title.includes("폐회") || title.includes("파송"))
    return findVerse("개회·폐회 메시지", "폐회");

  // 3) 식사 — 식단표 미구현, 링크 없음
  if (title.includes("식사")) return { kind: "meal" };

  // 4) 그 외 프로그램 — 자료실(고정 공지) 상세로. 고정 공지 없으면 링크 없음.
  if (pinnedId) return { kind: "resource", to: `/announcements/${pinnedId}` };

  // 5) 안전 폴백
  return null;
}
