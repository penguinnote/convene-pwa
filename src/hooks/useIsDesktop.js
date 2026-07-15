import { useEffect, useState } from "react";

// md(≥768px) 이상 = 데스크톱 셸(태블릿 세로 포함). 그 미만(폰)은 기존 모바일 UI 그대로.
const QUERY = "(min-width: 768px)";

/**
 * 넓은 화면(태블릿·노트북) 여부를 matchMedia로 판별한다.
 * 폰(<768px)에서는 항상 false라 모바일 레이아웃이 픽셀 그대로 유지된다.
 * @returns {boolean}
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    onChange(); // 마운트 시점 동기화
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
