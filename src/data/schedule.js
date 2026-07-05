// 임시 테스트 일정 — 캠프 전 실제 일정으로 교체.
// 라이브 "현재 순서" 카드는 관리자가 config/live 포인터로 수동 제어하므로,
// 이 파일은 표시(day/date/items)와 라이브 포인터 대상 목록으로만 쓰인다.
export const schedule = [
  {
    day: "테스트 일정",
    date: "매일 반복",
    items: [
      { time: "06:30", title: "기상", place: "각 방" },
      { time: "07:00", title: "새벽 말씀 · QT", place: "본관 강당" },
      { time: "08:00", title: "아침 식사", place: "식당" },
      { time: "09:30", title: "1강", place: "본관 강당" },
      { time: "12:00", title: "점심 식사", place: "식당" },
      { time: "14:00", title: "레크리에이션 · 조별활동", place: "운동장" },
      { time: "18:00", title: "저녁 식사", place: "식당" },
      { time: "19:30", title: "저녁 집회 · 2강", place: "본관 강당" },
      { time: "22:00", title: "조모임 · GBS", place: "각 방" },
      { time: "23:30", title: "취침", place: "각 방" },
    ],
  },
];
