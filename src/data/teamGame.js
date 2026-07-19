export const TEAM_ROUNDS = [
  {
    id: 1,
    theme: "음식",
    questions: [
      { prompt: "그래도 먹을 만한 쪽은?", options: ["시럽 빠진 팬케이크", "고추장 없는 비빔밥"] },
      { prompt: "삼겹살을 구워 먹을 때 최고의 사이다는?", options: ["김치찌개", "된장찌개"] },
      { prompt: "그래도 먹을 만한 쪽은?", options: ["단무지 없이 먹는 짜장면", "김치 없이 먹는 라면"] },
      { prompt: "돈가스, 나는?", options: ["다 썰어놓고 먹는다", "하나씩 썰어 먹어야 제맛"] },
    ],
  },
  {
    id: 2,
    theme: "초능력",
    questions: [
      { prompt: "갖는다면?", options: ["하늘 날기", "물속에서 호흡하기"] },
      { prompt: "굳이 하나를 겪어야 한다면?", options: ["좋아하는 사람이 날 싫어하기", "싫어하는 사람이 날 좋아하기"] },
      { prompt: "평생 이 목소리로 산다면?", options: ["모기 목소리", "매미 목소리"] },
      { prompt: "박수 한 번이면?", options: ["방 청소 끝", "샤워 끝"] },
    ],
  },
  {
    id: 3,
    theme: "성향",
    questions: [
      { prompt: "친구와의 약속이 끝나고 집으로 돌아가는 당신. 우연히 같은 방향으로 걸어가는 친구를 발견했다. 당신의 선택은?", options: ["달려가서 반갑게 인사하며 같이 귀가한다", "최대한 느리게 걸으며 그 친구의 사각지대에서 홀로 귀가한다"] },
      { prompt: "예배당에 도착한 당신이 선택하는 자리는?", options: ["매일 앉는 나의 지정석", "그날그날 마음이 이끄는 자유석"] },
      { prompt: "여름철 당신을 더 불쾌하게 만드는 친구는?", options: ["에어컨 26도 이하로 낮출 때마다 '죽어가는 북극곰이 불쌍하지 않아?'라며 눈치 주는 친구", "지하철 탈 때마다 '요즘 지하철 왜 이리 춥나~'라며 칸 옮기고 민원 넣는 친구"] },
      { prompt: "평생 함께할 배우자를 골라야 한다면?", options: ["매일 출근 전 새벽기도를 함께 출석해야 하는 배우자", "매일 자기 전 말씀 토론 1시간을 해야 잘 수 있는 배우자"] },
    ],
  },
];

export const ZONE_CODES = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D1", "D2", "D3", "D4",
];

export function getZone(answers) {
  const col = "ABCD"[answers[0] * 2 + answers[1]];
  const row = answers[2] * 2 + answers[3] + 1;
  return { col, row, code: `${col}${row}` };
}
