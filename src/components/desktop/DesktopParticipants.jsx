import { useAuth } from "../../hooks/useAuth.jsx";
import { useUsers } from "../../hooks/useUsers";
import { Avatar } from "../../pages/Participants.jsx";

// 데스크톱 참여자. 모바일 Participants와 동일 데이터, 넓은 폭(PageFrame 안) 2열 그리드.
export default function DesktopParticipants() {
  const { user } = useAuth();
  const users = useUsers();

  const people = users
    .filter((u) => u.nickname)
    .sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));
  const others = people.filter((u) => u.id !== user?.uid).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Participants
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">참여자</h1>
      </div>

      <div className="mt-6 rounded-3xl border border-basil-100 bg-basil-50 p-6 text-center">
        <div className="flex justify-center gap-12">
          <div>
            <p className="text-3xl font-bold text-title">{others}</p>
            <p className="mt-0.5 text-[13px] text-ink-faint">팔로워</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-title">{others}</p>
            <p className="mt-0.5 text-[13px] text-ink-faint">팔로잉</p>
          </div>
        </div>
        <p className="mt-3 break-keep text-sm text-ink-soft">
          우리는 모두 친구이자 동역자입니다
        </p>
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
