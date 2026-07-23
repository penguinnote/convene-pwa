import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useRooms } from "../hooks/useRooms";

// 섹션 고정 순서: 형제 → 자매. 그 외 그룹은 뒤(안정 정렬이라 등장 순서 유지).
const SECTION_ORDER = ["형제", "자매"];
const sectionOrder = (g) => {
  const i = SECTION_ORDER.indexOf(g);
  return i === -1 ? SECTION_ORDER.length : i;
};

export default function Rooms() {
  const rooms = useRooms(); // config/rooms 실시간, 없으면 정적 폴백
  // 검색어를 URL 쿼리에 둔다. 뒤로가기로 쿼리가 사라지면 검색이 해제되고
  // 방배정 페이지에 그대로 머문다. 검색이 없을 때의 뒤로가기는 홈으로 간다.
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  function onSearchChange(value) {
    const had = query.trim().length > 0;
    const has = value.trim().length > 0;
    if (has && !had) {
      setParams({ q: value }); // 첫 활성화: history 엔트리 push
    } else if (has) {
      setParams({ q: value }, { replace: true }); // 갱신: 엔트리 쌓지 않음
    } else {
      setParams({}, { replace: true }); // 해제
    }
  }

  const q = query.trim();
  const filtered = rooms.filter((room) => {
    if (!q) return true;
    return room.name.includes(q) || room.members.some((m) => m.includes(q));
  });

  // group("4인실"/"6인실")별로 묶는다. 방 번호(name)가 섹션 간 겹치므로 반드시 id를 키로.
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
      <PageHeader eyebrow="Rooms" title="방배정" subtitle="내 방과 조원을 확인하세요" />

      <div className="px-5 py-4">
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

      <div className="space-y-6 px-5 pb-6">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-faint">
            검색 결과가 없습니다.
          </p>
        ) : (
          sectionKeys.map((key) => (
            <section key={key}>
              <h2 className="mb-2.5 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
                {key}
              </h2>
              <div className="space-y-3">
                {sections[key].map((room) => (
                  <div
                    key={room.id}
                    className="rounded-2xl border border-basil-100 bg-white p-4"
                  >
                    <p className="text-lg font-bold text-ink">{room.name}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
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
                ))}
              </div>
            </section>
          ))
        )}
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
