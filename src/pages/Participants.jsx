import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useUsers } from "../hooks/useUsers";

export default function Participants() {
  const { user } = useAuth();
  const users = useUsers();

  const people = users
    .filter((u) => u.nickname)
    .sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));
  const others = people.filter((u) => u.id !== user?.uid).length; // 본인 제외

  return (
    <div>
      <PageHeader eyebrow="Participants" title="참여자" />

      <div className="px-5 py-5">
        {/* 팔로우 숫자 연출 */}
        <div className="rounded-3xl border border-basil-100 bg-basil-50 p-5 text-center">
          <div className="flex justify-center gap-10">
            <div>
              <p className="text-2xl font-bold text-title">{others}</p>
              <p className="mt-0.5 text-[13px] text-ink-faint">팔로워</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-title">{others}</p>
              <p className="mt-0.5 text-[13px] text-ink-faint">팔로잉</p>
            </div>
          </div>
          <p className="mt-3 break-keep text-sm text-ink-soft">
            우리는 모두 친구이자 동역자입니다
          </p>
        </div>

        {/* 전체 참여자 */}
        <ul className="mt-5 space-y-2">
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
