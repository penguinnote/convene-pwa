import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 홈 위에 얹는 센티넬 엔트리 표식. React Router가 관리해 히스토리 정합성을 유지한다.
const SENTINEL_STATE = { __homeSentinel: true };
const EXIT_WINDOW_MS = 2000;

// 안드로이드 하드웨어/브라우저 뒤로가기를 계층적으로 제어한다.
// 홈을 스택 베이스로 유지하고, 홈 위 센티넬로 홈에서의 뒤로가기를 잡는다.
// - 자식 화면 뒤로가기 → 홈 (자연 pop, 센티넬 유지)
// - 홈 뒤로가기 → "한 번 더 누르면 종료" 안내 후 2초 내 재입력 시에만 종료
// iOS 홈화면 PWA에는 시스템 뒤로가기가 없어 listener만 달리고 부작용은 없다.
export function useBackControl({ onExitHint } = {}) {
  const location = useLocation();
  const navigate = useNavigate();

  const prevPathRef = useRef(location.pathname);
  const exitArmedRef = useRef(false);
  const timerRef = useRef(null);
  const initedRef = useRef(false);
  const onExitHintRef = useRef(onExitHint);
  onExitHintRef.current = onExitHint;

  // 홈을 베이스로 두고 그 위에 센티넬 1회 push → 홈에서의 뒤로가기를 잡는다.
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;
    if (window.location.pathname === "/") {
      navigate("/", { state: SENTINEL_STATE });
    }
  }, [navigate]);

  // 직전 경로 추적 (popstate 시점에는 아직 갱신 전 값이 남아 있다).
  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.key, location.pathname]);

  useEffect(() => {
    function onPop() {
      const now = window.location.pathname;
      const prev = prevPathRef.current;
      if (now !== "/") return; // 자식 화면: 자연스러운 뒤로가기 → 상위로
      if (prev !== "/") return; // 자식 → 홈 복귀: 센티넬 위로 돌아옴, 유지

      // 홈에서 뒤로가기 (센티넬이 pop됨)
      if (exitArmedRef.current) {
        exitArmedRef.current = false;
        clearTimeout(timerRef.current);
        window.history.back(); // 실제 종료
      } else {
        exitArmedRef.current = true;
        onExitHintRef.current?.();
        navigate("/", { state: SENTINEL_STATE }); // 센티넬 재-push, 홈 유지
        timerRef.current = setTimeout(() => {
          exitArmedRef.current = false;
        }, EXIT_WINDOW_MS);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearTimeout(timerRef.current);
    };
  }, [navigate]);
}
