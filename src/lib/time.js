/**
 * Firestore Timestamp(또는 Date)를 받아 영어 상대시간 문자열로 변환.
 * serverTimestamp 대기 중이라 createdAt이 null이면 "just now".
 * @param {{toDate?: () => Date}|Date|null|undefined} createdAt Firestore Timestamp 또는 Date
 * @returns {string} "just now" | "N min ago" | "N hours ago" | "N days ago"
 */
export function formatRelative(createdAt) {
  if (!createdAt) return "just now";

  const date = typeof createdAt.toDate === "function" ? createdAt.toDate() : createdAt;
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);

  if (sec < 60) return "just now";

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;

  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}
