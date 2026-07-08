/**
 * 공지 제목을 지정 길이(공백 포함)로 자르고 넘으면 끝에 …를 붙인다.
 * 상세 페이지에서는 전문을 보여주므로 사용하지 않는다.
 * @param {string|null|undefined} title 원본 제목
 * @param {number} [max=20] 최대 길이(문자 수)
 * @returns {string} 잘린 제목(넘치면 끝에 "…")
 */
export function truncateTitle(title, max = 20) {
  if (!title) return "";
  return title.length > max ? title.slice(0, max) + "…" : title;
}
