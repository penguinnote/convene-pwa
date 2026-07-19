import { VERSE_SIZES } from "../hooks/useVerseFontLevel";

// 말씀 본문 글자 크기 "가−/가＋" 스테퍼. LangSegment와 같은 알약 톤.
export default function FontStepper({ level, onChange }) {
  const max = VERSE_SIZES.length - 1;
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-basil-200 bg-basil-50 p-0.5">
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={level <= 0}
        aria-label="글씨 작게"
        className="rounded-full px-2 py-1 text-[11px] font-bold text-basil-600 transition-colors disabled:text-basil-200"
      >
        가−
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={level >= max}
        aria-label="글씨 크게"
        className="rounded-full px-2 py-1 text-[11px] font-bold text-basil-600 transition-colors disabled:text-basil-200"
      >
        가＋
      </button>
    </div>
  );
}
