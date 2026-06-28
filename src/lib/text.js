// 공지 제목을 지정 길이(공백 포함)로 자르고 넘으면 끝에 …를 붙인다.
// 상세 페이지에서는 전문을 보여주므로 사용하지 않는다.
export function truncateTitle(title, max = 20) {
  if (!title) return "";
  return title.length > max ? title.slice(0, max) + "…" : title;
}
