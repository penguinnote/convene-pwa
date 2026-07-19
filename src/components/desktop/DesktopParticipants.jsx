import { useUsers } from "../../hooks/useUsers";
import { Avatar } from "../../pages/Participants.jsx";

// 데스크톱 참여자. 모바일 Participants와 동일 데이터, 넓은 폭(PageFrame 안) 2열 그리드.
export default function DesktopParticipants() {
  const users = useUsers();

  const people = users
    .filter((u) => u.nickname)
    .sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Participants
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">참여자</h1>
        <p className="mt-1 text-sm text-ink-soft">총 {people.length}명</p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2">
        {people.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-2xl border border-basil-100 bg-white p-3"
          >
            <Avatar nickname={p.nickname} photoURL={p.photoURL} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-title">{p.nickname}</p>
              {p.mokjang && <p className="truncate text-sm text-ink-soft">{p.mokjang}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
