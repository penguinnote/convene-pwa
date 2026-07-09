import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 홈 위에 얹는 센티넬 엔트리 표식. React Router가 관리해 히스토리 정합성을 유지한다.
const SENTINEL_STATE = { __homeSentinel: true };

// 홈에서의 뒤로가기가 앱을 종료·재시작하지 않도록, 홈 위에 항상 센티넬을 유지한다.
// - 홈("/")에 있고 현재 엔트리가 센티넬이 아니면 센티넬을 다시 얹는다.
//   → 홈에서 뒤로가면 센티넬만 pop되고 다시 쌓여 홈에 그대로 머문다(홈 밑으로 못 빠져나감).
// - 자식 화면(pathname !== "/")에서는 아무것도 하지 않아 뒤로가기가 상위(홈)로 자연스럽게 돌아간다.
// iOS 홈화면 PWA의 스와이프 뒤로가기에도 동일하게 적용된다.
export function useBackControl() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/" && !location.state?.__homeSentinel) {
      navigate("/", { state: SENTINEL_STATE });
    }
  }, [location.pathname, location.state, navigate]);
}
