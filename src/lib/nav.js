// 히스토리 불변식: 홈을 스택 베이스로 유지한다.
// 홈 위에는 뒤로가기를 잡기 위한 센티넬이 얹혀 있고 useBackControl이 관리한다.
// 스택은 [홈, 센티넬] 또는 [홈, 센티넬, 자식] (상세는 [홈, 센티넬, 목록, 상세]).
// /rooms는 /info의 하위: [홈, 센티넬, /info, /rooms].

// 자식 화면(탭/목록)으로 이동.
// 홈에서 가면 push(홈이 베이스로 남음), 다른 자식에서 가면 replace(탭 누적 방지).
export function goChild(navigate, currentPath, to) {
  if (currentPath === to) return;
  if (currentPath === "/") navigate(to);
  else navigate(to, { replace: true });
}

// 자식 → 홈: 홈으로 pop 해서 [홈]으로 접는다.
// 직계 자식은 -1, 공지 상세·/rooms는 2단계라 -2.
export function goHome(navigate, currentPath) {
  if (currentPath === "/") return;
  if (/^\/announcements\/[^/]+$/.test(currentPath)) navigate(-2);
  else if (currentPath === "/rooms") navigate(-2);
  else navigate(-1);
}

// 공지 상세로: 항상 목록이 히스토리에 먼저 오게 해 상세→목록→홈 계층을 유지한다.
export function goToAnnouncement(navigate, currentPath, id) {
  const detail = `/announcements/${id}`;
  if (currentPath === "/announcements") {
    navigate(detail);
  } else if (currentPath === "/") {
    navigate("/announcements"); // 홈→목록 push
    navigate(detail); // 목록→상세 push
  } else {
    navigate("/announcements", { replace: true }); // 자식을 목록으로 교체
    navigate(detail);
  }
}
