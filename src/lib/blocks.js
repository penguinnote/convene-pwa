// 공지 블록 배열에서 미리보기 정보를 뽑는 헬퍼.
// blocks가 없는 기존 공지는 첨부가 없는 것으로 간주한다(하위호환).
export function firstImageUrl(notice) {
  const blocks = notice?.blocks;
  if (!Array.isArray(blocks)) return null;
  return blocks.find((b) => b.type === "image" && b.url)?.url ?? null;
}

export function firstFile(notice) {
  const blocks = notice?.blocks;
  if (!Array.isArray(blocks)) return null;
  const b = blocks.find((x) => x.type === "file" && x.url);
  return b ? { name: b.name, url: b.url } : null;
}

export function hasImage(notice) {
  return firstImageUrl(notice) != null;
}

export function hasFile(notice) {
  return firstFile(notice) != null;
}
