// 방배정 초기 시드 + 오프라인 폴백. 실데이터는 Firestore config/rooms(useRooms 훅)이며,
// 문서가 없거나 비었을 때만 이 배열이 쓰인다. 삭제 금지.
// group: 섹션 구분("형제"/"자매"). id: 방 번호가 섹션 간 겹치므로 고유 키. leader: 방장(members 첫 번째).
export const rooms = [
  // 형제 (4인실)
  { id: "b-mok", name: "목사님 방", group: "형제", floor: "형제", leader: "목사님", members: ["목사님", "사모님"] },
  { id: "b-1", name: "1호실", group: "형제", floor: "형제", leader: "황윤서", members: ["황윤서", "황지원", "조아린", "장예은", "황지안"] },
  { id: "b-2", name: "2호실", group: "형제", floor: "형제", leader: "이태윤", members: ["이태윤", "안도현", "장정우", "고우진"] },
  { id: "b-3", name: "3호실", group: "형제", floor: "형제", leader: "박지안", members: ["박지안", "심다인", "배지훈"] },
  { id: "b-4", name: "4호실", group: "형제", floor: "형제", leader: "최준서", members: ["최준서", "신은서", "김시우", "심은서"] },
  { id: "b-5", name: "5호실", group: "형제", floor: "형제", leader: "류채원", members: ["류채원", "허유준", "유수아", "허지우"] },
  { id: "b-6", name: "6호실", group: "형제", floor: "형제", leader: "류소율", members: ["류소율", "최시현", "허하은 목사님", "최정우"] },
  { id: "b-7", name: "7호실", group: "형제", floor: "형제", leader: "남서아", members: ["남서아", "심아린", "류다인", "노현우"] },
  // 형제 (6인실 중 형제 방)
  { id: "b-8", name: "8호실", group: "형제", floor: "형제", leader: "서지우", members: ["서지우", "허지훈", "강지우", "최지훈", "정예준"] },
  { id: "b-9", name: "9호실", group: "형제", floor: "형제", leader: "이성민", members: ["이성민", "홍지우", "전하람", "백예은", "강승우", "안유나", "강성민"] },
  { id: "b-10", name: "10호실", group: "형제", floor: "형제", leader: "김준우", members: ["김준우", "배시현", "배세아", "오소율"] },
  // 자매 (6인실)
  { id: "s-1", name: "1호실", group: "자매", floor: "자매", leader: "서현우", members: ["서현우", "심윤서", "강재원", "정나윤", "손서연", "손예은", "이유나", "장윤서"] },
  { id: "s-2", name: "2호실", group: "자매", floor: "자매", leader: "노유준", members: ["노유준", "홍우진", "안주원", "오준서", "류유나", "김알렉산드라(장지원)"] },
  { id: "s-3", name: "3호실", group: "자매", floor: "자매", leader: "강민재", members: ["강민재", "신지호", "홍서아", "장시현", "유예준"] },
  { id: "s-4", name: "4호실", group: "자매", floor: "자매", leader: "남나윤", members: ["남나윤", "문민재", "허도현", "전채원", "허나윤", "손선우", "안준우"] },
  { id: "s-5", name: "5호실", group: "자매", floor: "자매", leader: "심하은", members: ["심하은", "정지훈", "손시우", "박채은", "오지안", "오수아"] },
  { id: "s-6", name: "6호실", group: "자매", floor: "자매", leader: "신지안", members: ["신지안", "김예준", "한도윤", "매기", "이채원", "김예은"] },
  { id: "s-7", name: "7호실", group: "자매", floor: "자매", leader: "김서아", members: ["김서아", "황준우", "오채원", "Sara", "이예린"] },
];
