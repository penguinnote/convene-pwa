import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 계층적 부모 경로 맵. 동적 경로(/announcements/:id)는 getParent에서 별도 처리.
const PARENT = {
  "/schedule": "/",
  "/verses": "/",
  "/rooms": "/",
  "/announcements": "/",
  "/admin": "/",
};

function getParent(pathname) {
  if (/^\/announcements\/[^/]+$/.test(pathname)) return "/announcements";
  return PARENT[pathname] ?? null;
}

// 페이지가 등록하는 뒤로가기 인터셉터. true를 반환하면 계층 이동을 생략한다.
// (예: 방배정 검색 해제가 홈 이동보다 우선되도록)
const interceptors = new Set();
export function registerBackInterceptor(fn) {
  interceptors.add(fn);
  return () => interceptors.delete(fn);
}

// 현재 history 엔트리를 복제해 더미(sentinel)를 쌓는다.
// 같은 state를 재사용하므로 React Router가 위치 변화로 오인하지 않는다.
function armTrap() {
  window.history.pushState(window.history.state, "");
}

// 안드로이드 하드웨어/브라우저 뒤로가기를 계층적으로 제어한다.
// iOS 홈화면 PWA에는 시스템 뒤로가기가 없어 listener만 달리고 부작용은 없다.
export function useBackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // 각 화면 진입마다 더미 엔트리를 쌓아 다음 뒤로가기를 항상 가로챈다.
  useEffect(() => {
    armTrap();
  }, [location.key]);

  useEffect(() => {
    function onPop() {
      // 1) 페이지 인터셉터 우선 처리 (방배정 검색 해제 등)
      for (const fn of interceptors) {
        if (fn()) {
          armTrap(); // 현재 화면에 머물도록 재무장
          return;
        }
      }
      // 2) 계층 이동: 항상 지정된 부모로
      const parent = getParent(window.location.pathname);
      if (parent) {
        navigate(parent, { replace: true });
        // navigate로 location.key가 바뀌면 위의 effect가 다시 armTrap 한다.
      } else {
        // 홈 등 부모 없음 → 외부로 나가지 않도록 트랩 유지
        armTrap();
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [navigate]);
}
