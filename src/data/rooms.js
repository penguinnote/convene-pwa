// 방배정 초기 시드 + 오프라인 폴백. 실데이터는 Firestore config/rooms(useRooms 훅)이며,
// 문서가 없거나 비었을 때만 이 배열이 쓰인다. 삭제 금지.
// group: 섹션 구분("4인실"/"6인실"). id: 방 번호가 섹션 간 겹치므로 고유 키. leader: 방장(members 첫 번째).
export const rooms = [
  // 4인실
  { id: "4-1", name: "1호실", group: "4인실", floor: "4인실", leader: "목사님", members: ["목사님", "사모님"] },
  { id: "4-2", name: "2호실", group: "4인실", floor: "4인실", leader: "황윤서", members: ["황윤서", "조아린", "황지원", "장예은"] },
  { id: "4-3", name: "3호실", group: "4인실", floor: "4인실", leader: "안도현", members: ["안도현", "장정우", "윤상원"] },
  { id: "4-4", name: "4호실", group: "4인실", floor: "4인실", leader: "박지안", members: ["박지안", "허지훈", "노현우", "배지훈"] },
  { id: "4-5", name: "5호실", group: "4인실", floor: "4인실", leader: "최준서", members: ["최준서", "신은서", "김시우", "정예준"] },
  { id: "4-6", name: "6호실", group: "4인실", floor: "4인실", leader: "허유준", members: ["허유준", "유수아", "허지우", "류채원"] },
  { id: "4-7", name: "7호실", group: "4인실", floor: "4인실", leader: "서지우", members: ["서지우", "최지훈", "강지우"] },
  { id: "4-8", name: "8호실", group: "4인실", floor: "4인실", leader: "남서아", members: ["남서아", "오소율", "배세아", "심아린"] },
  { id: "4-9", name: "9호실", group: "4인실", floor: "4인실", leader: "심다인", members: ["심다인", "전예준", "최시현", "류소율"] },
  // 6인실
  { id: "6-1", name: "1호실", group: "6인실", floor: "6인실", leader: "황준우", members: ["황준우", "오채원", "김서아", "이예린", "Sara", "서현우", "박수연2"] },
  { id: "6-2", name: "2호실", group: "6인실", floor: "6인실", leader: "노유준", members: ["노유준", "심윤서", "장지원", "안주원", "오준서", "류유나"] },
  { id: "6-3", name: "3호실", group: "6인실", floor: "6인실", leader: "강민재", members: ["강민재", "장시현", "유예준", "김명원", "신지호", "홍서아"] },
  { id: "6-4", name: "4호실", group: "6인실", floor: "6인실", leader: "남나윤", members: ["남나윤", "문민재", "허도현", "정나윤", "손예은", "강재원", "전채원"] },
  { id: "6-5", name: "5호실", group: "6인실", floor: "6인실", leader: "심하은", members: ["심하은", "오지안", "손시우", "정지훈", "박채은", "이유나"] },
  { id: "6-6", name: "6호실", group: "6인실", floor: "6인실", leader: "신지안", members: ["신지안", "김예준", "이채원", "한도윤", "매기", "김예은", "허나윤", "손선우"] },
  { id: "6-7", name: "7호실", group: "6인실", floor: "6인실", leader: "이태윤", members: ["이태윤", "배시현", "김준우", "김정빈"] },
  { id: "6-8", name: "8호실", group: "6인실", floor: "6인실", leader: "이성민", members: ["이성민", "홍지우", "강승우", "전하람", "백예은", "안유나"] },
];
