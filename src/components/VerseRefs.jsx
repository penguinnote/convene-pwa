import { shortRef } from "../data/verses.js";

// 제목 아래 축약 성경 위치 표기(회색 작은 글씨).
// 각 표기("창 43:1-15")는 nowrap으로 통째로 유지하고, 줄바꿈은 표기 사이에서만 일어난다.
export default function VerseRefs({ item, className = "" }) {
  if (!item?.passages?.length) return null;
  return (
    <p className={`text-xs font-normal text-ink-faint ${className}`}>
      {item.passages.map((p, i) => (
        <span key={p.ref} className="whitespace-nowrap">
          {shortRef(p.ref)}
          {i < item.passages.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}
