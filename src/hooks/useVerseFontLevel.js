import { useState } from "react";

// 말씀 본문 글자 크기 4단계. 기본(index 1)에서 아래 1단계·위 2단계.
export const VERSE_SIZES = [
  { fs: 13, lh: 1.8 }, // 한 단계 아래
  { fs: 15, lh: 1.8 }, // 현재(기본)
  { fs: 18, lh: 1.85 }, // 한 단계 위
  { fs: 21, lh: 1.9 }, // 두 단계 위
];

// 모바일·데스크톱이 같은 키를 공유해 어디서 바꿔도 유지된다.
const KEY = "convene.verseFontLevel";

export function useVerseFontLevel() {
  const [level, setLevel] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const n = Number(raw);
      if (raw !== null && Number.isInteger(n) && n >= 0 && n < VERSE_SIZES.length) {
        return n;
      }
    } catch {
      // localStorage 접근 불가(프라이빗 모드 등) — 기본값 사용
    }
    return 1;
  });

  function change(delta) {
    setLevel((l) => {
      const next = Math.min(VERSE_SIZES.length - 1, Math.max(0, l + delta));
      try {
        localStorage.setItem(KEY, String(next));
      } catch {
        // 저장 실패 무시
      }
      return next;
    });
  }

  return { level, change, size: VERSE_SIZES[level] };
}
