import { useSearchParams } from "react-router-dom";
import { useRooms } from "../../hooks/useRooms";

// 섹션 고정 순서: 형제 → 자매. 그 외 그룹은 뒤(안정 정렬이라 등장 순서 유지).
const SECTION_ORDER = ["형제", "자매"];
const sectionOrder = (g) => {
  const i = SECTION_ORDER.indexOf(g);
  return i === -1 ? SECTION_ORDER.length : i;
};

// 데스크톱 방배정: 검색 + 방 유형(group)별 섹션 카드 그리드. 이름만 표시, 방장은 강조 칩.
export default function DesktopRooms() {
  const rooms = useRooms(); // config/rooms 실시간, 없으면 정적 폴백
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  function onSearchChange(value) {
    const had = query.trim().length > 0;
    const has = value.trim().length > 0;
    if (has && !had) {
      setParams({ q: value });
    } else if (has) {
      setParams({ q: value }, { replace: true });
    } else {
      setParams({}, { replace: true });
    }
  }

  const q = query.trim();
  const filtered = rooms.filter((room) => {
    if (!q) return true;
    return room.name.includes(q) || room.members.some((m) => m.includes(q));
  });

  // 방 유형(group)별로 묶는다. group이 없으면 floor, 그것도 없으면 "기타".
  const sections = {};
  filtered.forEach((room) => {
    const key = room.group ?? room.floor ?? "기타";
    (sections[key] ??= []).push(room);
  });
  const sectionKeys = Object.keys(sections).sort(
    (a, b) => sectionOrder(a) - sectionOrder(b)
  );

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Rooms
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">방배정</h1>
      </div>

      <div className="mx-auto mb-8 max-w-md">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="이름 또는 방 번호 검색"
            className="w-full rounded-xl border border-basil-100 bg-basil-50 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-basil-400 focus:bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-faint">검색 결과가 없습니다.</p>
      ) : (
        sectionKeys.map((key) => (
          <section key={key} className="mb-8 last:mb-0">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-basil-600">
              {key}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections[key].map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function RoomCard({ room }) {
  return (
    <div className="rounded-2xl border border-basil-100 bg-white p-5 text-center">
      <p className="text-lg font-bold text-title">{room.name}</p>
      <div className="my-3 h-px bg-basil-100" />
      <div className="flex flex-wrap justify-center gap-1.5">
        {room.members.map((m) => (
          <span
            key={m}
            className={`rounded-lg px-2.5 py-1 text-sm ${
              m === room.leader
                ? "bg-basil-600 font-medium text-white"
                : "bg-basil-50 text-ink-soft"
            }`}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
