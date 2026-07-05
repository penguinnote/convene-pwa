// 캠프 실제 4일 일정. 정적 데이터(읽기비용 절감을 위해 DB에 두지 않음).
// 각 item의 link는 라이브 "현재 순서" 카드가 사용할 이동 대상이다(표시에는 안 쓰임).
//   - { type: "verse", verseId } : 말씀 강의(verses.js의 verseId와 매칭)
//   - { type: "versesTab" }       : 말씀 탭 전체
//   - { type: "menu" }            : 식단표
//   - { type: "playlist" }        : 캠프 플레이리스트
//   - { type: "resource" }        : 자료실(고정 공지)
// verseId 규칙: 주제강의 topic-1~5, 개회 opening, 폐회 closing, GBS gbs-1~3, 새벽(아침묵상) dawn-1~3.
// place는 임시값이니 확정 시 교체한다.
export const schedule = [
  { day: "1일차", date: "7/29 (수)", items: [
    { time: "07:00", title: "가자! 연수원으로~~", place: "교회 → 충주", link: { type: "playlist" } },
    { time: "10:30", title: "짐 풀기", place: "숙소" },
    { time: "12:00", title: "점심식사 & 휴식", place: "식당", link: { type: "menu" } },
    { time: "13:30", title: "개회 메시지", place: "본관 강당", link: { type: "verse", verseId: "opening" } },
    { time: "14:20", title: "Break Time", place: "", link: { type: "playlist" } },
    { time: "14:30", title: "공동체 레크레이션", place: "운동장", link: { type: "resource" } },
    { time: "16:15", title: "Tea Time", place: "", link: { type: "playlist" } },
    { time: "16:30", title: "GBS 1강", place: "각 조", link: { type: "verse", verseId: "gbs-1" } },
    { time: "17:45", title: "저녁식사", place: "식당", link: { type: "menu" } },
    { time: "19:00", title: "다함께 찬양을~~", place: "본관 강당", link: { type: "playlist" } },
    { time: "19:30", title: "주제 1강", place: "본관 강당", link: { type: "verse", verseId: "topic-1" } },
    { time: "20:50", title: "Tea Time", place: "", link: { type: "playlist" } },
    { time: "21:00", title: "Life Testimony", place: "본관 강당", link: { type: "resource" } },
    { time: "22:20", title: "개인 기도 및 취침", place: "각 방", link: { type: "playlist" } },
  ]},
  { day: "2일차", date: "7/30 (목)", items: [
    { time: "07:00", title: "아침묵상", place: "본관 강당", link: { type: "verse", verseId: "dawn-1" } },
    { time: "08:00", title: "아침식사", place: "식당", link: { type: "menu" } },
    { time: "09:00", title: "GBS 2강", place: "각 조", link: { type: "verse", verseId: "gbs-2" } },
    { time: "10:15", title: "Break Time", place: "", link: { type: "playlist" } },
    { time: "10:30", title: "주제 2강", place: "본관 강당", link: { type: "verse", verseId: "topic-2" } },
    { time: "12:00", title: "점심식사 & 휴식", place: "식당", link: { type: "menu" } },
    { time: "13:30", title: "Book Talk", place: "본관 강당", link: { type: "resource" } },
    { time: "14:30", title: "묵상 & 정리", place: "각 방", link: { type: "versesTab" } },
    { time: "16:30", title: "소그룹 나눔", place: "각 조", link: { type: "playlist" } },
    { time: "17:45", title: "저녁식사", place: "식당", link: { type: "menu" } },
    { time: "19:00", title: "다함께 찬양을~~", place: "본관 강당", link: { type: "playlist" } },
    { time: "19:30", title: "주제 3강", place: "본관 강당", link: { type: "verse", verseId: "topic-3" } },
    { time: "20:50", title: "Tea Time", place: "", link: { type: "playlist" } },
    { time: "21:00", title: "공동체 기도", place: "본관 강당" },
    { time: "22:20", title: "영혼의 대화 & 취침", place: "각 방", link: { type: "playlist" } },
  ]},
  { day: "3일차", date: "7/31 (금)", items: [
    { time: "07:00", title: "아침묵상", place: "본관 강당", link: { type: "verse", verseId: "dawn-2" } },
    { time: "08:00", title: "아침식사", place: "식당", link: { type: "menu" } },
    { time: "09:00", title: "GBS 3강", place: "각 조", link: { type: "verse", verseId: "gbs-3" } },
    { time: "10:15", title: "Break Time", place: "", link: { type: "playlist" } },
    { time: "10:30", title: "주제 4강", place: "본관 강당", link: { type: "verse", verseId: "topic-4" } },
    { time: "12:00", title: "점심식사 & 휴식", place: "식당", link: { type: "menu" } },
    { time: "13:30", title: "공동체 활동", place: "야외", link: { type: "resource" } },
    { time: "14:30", title: "묵상 & 정리 and 자유 시간", place: "각 방", link: { type: "versesTab" } },
    { time: "16:30", title: "소그룹 나눔", place: "각 조", link: { type: "playlist" } },
    { time: "17:45", title: "저녁식사", place: "식당", link: { type: "menu" } },
    { time: "19:00", title: "다함께 찬양을~~", place: "본관 강당", link: { type: "playlist" } },
    { time: "19:30", title: "주제 5강", place: "본관 강당", link: { type: "verse", verseId: "topic-5" } },
    { time: "20:50", title: "Tea Time", place: "", link: { type: "playlist" } },
    { time: "21:00", title: "돌아온 자들의 페스타", place: "본관 강당" },
    { time: "22:20", title: "합심 기도 & 취침", place: "각 방", link: { type: "playlist" } },
  ]},
  { day: "4일차", date: "8/1 (토)", items: [
    { time: "07:00", title: "아침묵상", place: "본관 강당", link: { type: "verse", verseId: "dawn-3" } },
    { time: "08:00", title: "아침식사", place: "식당", link: { type: "menu" } },
    { time: "09:00", title: "폐회 메시지", place: "본관 강당", link: { type: "verse", verseId: "closing" } },
    { time: "10:15", title: "소감 정리", place: "각 방", link: { type: "versesTab" } },
    { time: "10:30", title: "전체 소감 발표", place: "본관 강당" },
    { time: "12:00", title: "점심식사", place: "식당", link: { type: "menu" } },
    { time: "13:00", title: "다시 사명의 땅으로~~", place: "충주 → 교회", link: { type: "playlist" } },
  ]},
];
