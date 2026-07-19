import PageHeader from "../components/PageHeader.jsx";
import { useUsers } from "../hooks/useUsers";

export default function Participants() {
  const users = useUsers();

  const people = users
    .filter((u) => u.nickname)
    .sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));

  return (
    <div>
      <PageHeader eyebrow="Participants" title="참여자" />

      <div className="px-5 py-5">
        <p className="mb-3 text-sm font-semibold text-ink">총 {people.length}명</p>

        {/* 전체 참여자 */}
        <ul className="space-y-2">
          {people.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-basil-100 bg-white p-3"
            >
              <Avatar nickname={p.nickname} photoURL={p.photoURL} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-title">{p.nickname}</p>
                {p.mokjang && (
                  <p className="truncate text-sm text-ink-soft">{p.mokjang}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Avatar({ nickname, photoURL }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full border border-basil-100 object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-basil-50 text-base font-bold text-basil-600">
      {nickname ? nickname.slice(0, 1) : "?"}
    </span>
  );
}
