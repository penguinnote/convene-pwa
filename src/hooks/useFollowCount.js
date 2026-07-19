import { useUsers } from "./useUsers";
import { useAuth } from "./useAuth.jsx";

// "모두가 서로 팔로우" 연출값: 본인 제외 nickname 있는 참여자 수(음수면 0).
// 팔로워/팔로잉 둘 다 이 값으로 표시한다.
export function useFollowCount() {
  const users = useUsers();
  const { user } = useAuth();
  const count = users.filter((u) => u.nickname && u.id !== user?.uid).length;
  return Math.max(0, count);
}
