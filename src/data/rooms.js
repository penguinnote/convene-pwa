// 방배정 초기 시드 + 오프라인 폴백. 실데이터는 Firestore config/rooms(useRooms 훅)이며,
// 문서가 없거나 비었을 때만 이 배열이 쓰인다. 삭제 금지.
// group: 섹션 구분("4인실"/"6인실"). id: 방 번호가 섹션 간 겹치므로 고유 키. leader: 방장(members 첫 번째).
export const rooms = [
  // 4인실
  { id: "4-1", name: "1호실", group: "4인실", floor: "4인실", leader: "목사님", members: ["목사님", "사모님"] },
  { id: "4-2", name: "2호실", group: "4인실", floor: "4인실", leader: "배예훈", members: ["배예훈", "김영도", "강세언", "정서로"] },
  { id: "4-3", name: "3호실", group: "4인실", floor: "4인실", leader: "김요셉", members: ["김요셉", "권영민", "윤상원"] },
  { id: "4-4", name: "4호실", group: "4인실", floor: "4인실", leader: "장진석", members: ["장진석", "이윤종", "이어진", "유성헌"] },
  { id: "4-5", name: "5호실", group: "4인실", floor: "4인실", leader: "박인하", members: ["박인하", "한희찬", "이수종", "고주영"] },
  { id: "4-6", name: "6호실", group: "4인실", floor: "4인실", leader: "배진훈", members: ["배진훈", "김주언", "이채혁", "강영언"] },
  { id: "4-7", name: "7호실", group: "4인실", floor: "4인실", leader: "한동준", members: ["한동준", "성현민", "김주성"] },
  { id: "4-8", name: "8호실", group: "4인실", floor: "4인실", leader: "유진하", members: ["유진하", "최주환", "김명인", "정민규"] },
  { id: "4-9", name: "9호실", group: "4인실", floor: "4인실", leader: "홍현표", members: ["홍현표", "전예준", "신윤승", "배준"] },
  // 6인실
  { id: "6-1", name: "1호실", group: "6인실", floor: "6인실", leader: "한희진", members: ["한희진", "민소연", "고현정", "윤희숙", "Hannah", "신민수", "박수연2"] },
  { id: "6-2", name: "2호실", group: "6인실", floor: "6인실", leader: "최인준", members: ["최인준", "홍리아", "사샤", "유리안", "유조안", "정다연"] },
  { id: "6-3", name: "3호실", group: "6인실", floor: "6인실", leader: "함예은", members: ["함예은", "윤찬미", "이호정", "김명원", "김선향", "엄영빈"] },
  { id: "6-4", name: "4호실", group: "6인실", floor: "6인실", leader: "유지은", members: ["유지은", "박예인", "이예원", "최하린", "김윤진", "전인애", "박현민"] },
  { id: "6-5", name: "5호실", group: "6인실", floor: "6인실", leader: "안지인", members: ["안지인", "김주희", "김지수", "배인혜", "홍아린", "윤제이"] },
  { id: "6-6", name: "6호실", group: "6인실", floor: "6인실", leader: "김현지", members: ["김현지", "여승리", "이한나", "이가예", "매기", "이예현", "천유진", "문예빈"] },
  { id: "6-7", name: "7호실", group: "6인실", floor: "6인실", leader: "이성재", members: ["이성재", "김동건", "이신혁", "김정빈"] },
  { id: "6-8", name: "8호실", group: "6인실", floor: "6인실", leader: "송현석", members: ["송현석", "정세현", "최종찬", "황도연", "박진형", "이홍기"] },
];
