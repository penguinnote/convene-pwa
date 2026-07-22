// 히스토리 불변식: 홈을 스택 베이스로 유지한다.
// 홈 위에는 뒤로가기를 잡기 위한 센티넬이 얹혀 있고 useBackControl이 관리한다.
// 스택은 [홈, 센티넬] 또는 [홈, 센티넬, 자식] (상세는 [홈, 센티넬, 목록, 상세]).
// /rooms·/playlist는 /info의 하위: [홈, 센티넬, /info, /rooms].
// /verses/:id는 /verses의 하위: [홈, 센티넬, /verses, /verses/:id].

// 자식 화면(탭/목록)으로 이동.
// 홈에서 가면 push(홈이 베이스로 남음), 다른 자식에서 가면 replace(탭 누적 방지).
export function goChild(navigate, currentPath, to) {
  if (currentPath === to) return;
  if (currentPath === "/") navigate(to);
  else navigate(to, { replace: true });
}

// 자식 → 홈: 홈으로 pop 해서 [홈]으로 접는다.
// 직계 자식은 -1, 2단계(공지 상세·말씀 상세·/info 하위)는 -2.
const INFO_CHILDREN = ["/rooms", "/playlist", "/team", "/participants"];
export function goHome(navigate, currentPath) {
  if (currentPath === "/") return;
  if (/^\/announcements\/[^/]+$/.test(currentPath)) navigate(-2);
  else if (/^\/verses\/[^/]+$/.test(currentPath)) navigate(-2);
  else if (INFO_CHILDREN.includes(currentPath)) navigate(-2);
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

// 말씀 본문 상세로: 항상 /verses(말씀 탭)가 히스토리에 먼저 오게 해 상세→목록→홈 계층을 유지한다.
export function goToVerse(navigate, currentPath, id) {
  const detail = `/verses/${id}`;
  if (currentPath === "/verses") {
    navigate(detail);
  } else if (currentPath === "/") {
    navigate("/verses"); // 홈→말씀 탭 push
    navigate(detail); // 말씀 탭→상세 push
  } else {
    navigate("/verses", { replace: true }); // 자식을 말씀 탭으로 교체
    navigate(detail);
  }
}
