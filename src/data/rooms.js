// 방배정 초기 시드 + 오프라인 폴백. 실데이터는 Firestore config/rooms(useRooms 훅)이며,
// 문서가 없거나 비었을 때만 이 배열이 쓰인다. 삭제 금지.
// group: 섹션 구분("형제"/"자매"). id: 방 번호가 섹션 간 겹치므로 고유 키. leader: 방장(members 첫 번째).
export const rooms = [
  // 형제
  { id: "b-mok", name: "목사님 방", group: "형제", floor: "형제", leader: "목사님", members: ["목사님", "사모님"] },
  { id: "b-1", name: "1호실", group: "형제", floor: "형제", leader: "황윤서", members: ["황윤서", "조아린", "황지원", "장예은"] },
  { id: "b-2", name: "2호실", group: "형제", floor: "형제", leader: "안도현", members: ["안도현", "장정우", "류다인"] },
  { id: "b-3", name: "3호실", group: "형제", floor: "형제", leader: "박지안", members: ["박지안", "허지훈", "노현우", "배지훈"] },
  { id: "b-4", name: "4호실", group: "형제", floor: "형제", leader: "최준서", members: ["최준서", "신은서", "김시우", "심은서"] },
  { id: "b-5", name: "5호실", group: "형제", floor: "형제", leader: "허유준", members: ["허유준", "유수아", "허지우", "류채원"] },
  { id: "b-6", name: "6호실", group: "형제", floor: "형제", leader: "류소율", members: ["류소율", "최시현", "허하은 목사님", "전예준"] },
  { id: "b-7", name: "7호실", group: "형제", floor: "형제", leader: "남서아", members: ["남서아", "오소율", "배세아", "심아린"] },
  { id: "b-8", name: "8호실", group: "형제", floor: "형제", leader: "이태윤", members: ["이태윤", "배시현", "김준우", "김정빈", "고우진"] },
  { id: "b-9", name: "9호실", group: "형제", floor: "형제", leader: "심다인", members: ["심다인", "서지우", "강지우", "최지훈", "정예준"] },
  { id: "b-10", name: "10호실", group: "형제", floor: "형제", leader: "이성민", members: ["이성민", "홍지우", "전하람", "백예은", "강승우", "안유나"] },
  // 자매
  { id: "s-1", name: "1호실", group: "자매", floor: "자매", leader: "강재원", members: ["강재원", "정나윤", "장윤서", "서현우", "심윤서", "손예은"] },
  { id: "s-2", name: "2호실", group: "자매", floor: "자매", leader: "노유준", members: ["노유준", "안주원", "오준서", "류유나", "홍우진", "장지원"] },
  { id: "s-3", name: "3호실", group: "자매", floor: "자매", leader: "강민재", members: ["강민재", "장시현", "유예준", "신지호", "홍서아", "한휘소", "정진실"] },
  { id: "s-4", name: "4호실", group: "자매", floor: "자매", leader: "남나윤", members: ["남나윤", "문민재", "허도현", "전채원", "허나윤", "손선우", "안준우"] },
  { id: "s-5", name: "5호실", group: "자매", floor: "자매", leader: "심하은", members: ["심하은", "손시우", "정지훈", "박채은", "이유나", "오지안"] },
  { id: "s-6", name: "6호실", group: "자매", floor: "자매", leader: "신지안", members: ["신지안", "김예준", "한도윤", "이채원", "매기", "오수아", "김예은"] },
  { id: "s-7", name: "7호실", group: "자매", floor: "자매", leader: "황준우", members: ["황준우", "오채원", "김서아", "Sara", "이예린"] },
];
