// 공지 블록 배열에서 미리보기 정보를 뽑는 헬퍼.
// blocks가 없는 기존 공지는 첨부가 없는 것으로 간주한다(하위호환).

/**
 * 공지 콘텐츠 블록 하나.
 * @typedef {Object} NoticeBlock
 * @property {"text"|"image"|"file"|"link"} type 블록 종류
 * @property {string} [url] image/file/link의 URL
 * @property {string} [name] file 블록의 표시 이름
 * @property {string} [value] text 블록의 내용
 * @property {string} [label] link 블록의 표시 이름
 * @property {string} [path] Storage 경로(image/file)
 */

/**
 * 공지 문서(최소 blocks 필드만 참조).
 * @typedef {Object} Notice
 * @property {NoticeBlock[]} [blocks] 순서 있는 콘텐츠 블록 배열
 */

/**
 * 첫 이미지 블록의 URL을 반환.
 * @param {Notice|null|undefined} notice 공지 문서
 * @returns {string|null} 이미지 URL, 없으면 null
 */
export function firstImageUrl(notice) {
  const blocks = notice?.blocks;
  if (!Array.isArray(blocks)) return null;
  return blocks.find((b) => b.type === "image" && b.url)?.url ?? null;
}

/**
 * 첫 파일 블록의 이름과 URL을 반환.
 * @param {Notice|null|undefined} notice 공지 문서
 * @returns {{name: string, url: string}|null} 파일 정보, 없으면 null
 */
export function firstFile(notice) {
  const blocks = notice?.blocks;
  if (!Array.isArray(blocks)) return null;
  const b = blocks.find((x) => x.type === "file" && x.url);
  return b ? { name: b.name, url: b.url } : null;
}

/**
 * 공지에 이미지 첨부가 있는지 여부.
 * @param {Notice|null|undefined} notice 공지 문서
 * @returns {boolean}
 */
export function hasImage(notice) {
  return firstImageUrl(notice) != null;
}

/**
 * 공지에 파일 첨부가 있는지 여부.
 * @param {Notice|null|undefined} notice 공지 문서
 * @returns {boolean}
 */
export function hasFile(notice) {
  return firstFile(notice) != null;
}
