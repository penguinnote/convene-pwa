// 캠프 일정 더미 데이터.
// 캠프 전에 실제 일정으로 교체하면 됩니다. (DB 없이 이 파일만 수정해도 동작)
export const schedule = [
  {
    day: "1일차",
    date: "7/29 (수)",
    items: [
      { time: "14:00", title: "집결 및 출발", place: "교회 주차장" },
      { time: "17:00", title: "수련회장 도착 · 방배정", place: "리셉션" },
      { time: "18:00", title: "저녁 식사", place: "식당" },
      { time: "19:30", title: "개회예배 · 1강", place: "본관 강당" },
      { time: "22:00", title: "조모임", place: "각 방" },
    ],
  },
  {
    day: "2일차",
    date: "7/30 (목)",
    items: [
      { time: "07:00", title: "기상 · QT", place: "각 방" },
      { time: "08:00", title: "아침 식사", place: "식당" },
      { time: "09:30", title: "2강", place: "본관 강당" },
      { time: "12:00", title: "점심 식사", place: "식당" },
      { time: "14:00", title: "레크리에이션", place: "운동장" },
      { time: "18:00", title: "저녁 식사", place: "식당" },
      { time: "19:30", title: "3강 · 찬양집회", place: "본관 강당" },
    ],
  },
  {
    day: "3일차",
    date: "7/31 (금)",
    items: [
      { time: "07:00", title: "기상 · QT", place: "각 방" },
      { time: "08:00", title: "아침 식사", place: "식당" },
      { time: "09:30", title: "4강", place: "본관 강당" },
      { time: "12:00", title: "점심 식사", place: "식당" },
      { time: "14:00", title: "조별 사역 · 나눔", place: "야외" },
      { time: "19:30", title: "5강 · 헌신예배", place: "본관 강당" },
    ],
  },
  {
    day: "4일차",
    date: "8/1 (토)",
    items: [
      { time: "07:00", title: "기상 · QT", place: "각 방" },
      { time: "08:00", title: "아침 식사 · 짐 정리", place: "식당" },
      { time: "09:30", title: "파송예배", place: "본관 강당" },
      { time: "11:00", title: "출발 · 귀가", place: "주차장" },
    ],
  },
];
