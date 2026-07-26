// 방배정 초기 시드 + 오프라인 폴백. 실데이터는 Firestore config/rooms(useRooms 훅)이며,
// 문서가 없거나 비었을 때만 이 배열이 쓰인다. 삭제 금지.
// group: 섹션 구분("형제"/"자매"). id: 방 번호가 섹션 간 겹치므로 고유 키. leader: 방장(members 첫 번째).
export const rooms = [
  // 형제 (4인실)
  { id: "b-mok", name: "목사님 방", group: "형제", floor: "형제", leader: "목사님", members: ["목사님", "사모님"] },
  { id: "b-1", name: "1호실", group: "형제", floor: "형제", leader: "배예훈", members: ["배예훈", "강세언", "김영도", "정서로", "임유민"] },
  { id: "b-2", name: "2호실", group: "형제", floor: "형제", leader: "이성재", members: ["이성재", "김요셉", "권영민", "장반석"] },
  { id: "b-3", name: "3호실", group: "형제", floor: "형제", leader: "장진석", members: ["장진석", "홍현표", "유성헌"] },
  { id: "b-4", name: "4호실", group: "형제", floor: "형제", leader: "박인하", members: ["박인하", "한희찬", "이수종", "차원택"] },
  { id: "b-5", name: "5호실", group: "형제", floor: "형제", leader: "강영언", members: ["강영언", "배진훈", "김주언", "이채혁"] },
  { id: "b-6", name: "6호실", group: "형제", floor: "형제", leader: "배준", members: ["배준", "신윤승", "박제경 목사님", "이정환"] },
  { id: "b-7", name: "7호실", group: "형제", floor: "형제", leader: "유진하", members: ["유진하", "정민규", "장우진", "이어진"] },
  // 형제 (6인실 중 형제 방)
  { id: "b-8", name: "8호실", group: "형제", floor: "형제", leader: "한동준", members: ["한동준", "이윤종", "김주성", "성현민", "고주영"] },
  { id: "b-9", name: "9호실", group: "형제", floor: "형제", leader: "송현석", members: ["송현석", "정세현", "황도연", "박진형", "최종찬", "이홍기", "이용희"] },
  { id: "b-10", name: "10호실", group: "형제", floor: "형제", leader: "이신혁", members: ["이신혁", "김동건", "김명인", "최주환"] },
  // 자매 (6인실)
  { id: "s-1", name: "1호실", group: "자매", floor: "자매", leader: "신민수", members: ["신민수", "홍리아", "전인애", "최하린", "김하윤", "김윤진", "윤제이", "이서윤"] },
  { id: "s-2", name: "2호실", group: "자매", floor: "자매", leader: "최인준", members: ["최인준", "이드보라", "유리안", "유조안", "정다연", "김알렉산드라(사샤)"] },
  { id: "s-3", name: "3호실", group: "자매", floor: "자매", leader: "함예은", members: ["함예은", "김선향", "엄영빈", "윤찬미", "이호정"] },
  { id: "s-4", name: "4호실", group: "자매", floor: "자매", leader: "유지은", members: ["유지은", "박예인", "이예원", "박현민", "천유진", "문예빈", "송희원"] },
  { id: "s-5", name: "5호실", group: "자매", floor: "자매", leader: "안지인", members: ["안지인", "배인혜", "김지수", "홍아린", "김주희", "김서율"] },
  { id: "s-6", name: "6호실", group: "자매", floor: "자매", leader: "김현지", members: ["김현지", "여승리", "이가예", "매기", "이한나", "이예현"] },
  { id: "s-7", name: "7호실", group: "자매", floor: "자매", leader: "고현정", members: ["고현정", "한희진", "민소연", "Hannah", "윤희숙"] },
];
