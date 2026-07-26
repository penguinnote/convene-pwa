import { useSearchParams } from "react-router-dom";
import { mokjangRoster } from "../../data/mokjangRoster.js";

// 데스크톱 목장: 검색 + 목장별 카드 그리드(명단 칩). 검색 패턴은 방배정과 동일.
export default function DesktopMokjang() {
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
  const filtered = mokjangRoster
    .map((g) => {
      if (!q || g.name.includes(q)) return g;
      const members = g.members.filter((m) => m.includes(q));
      return members.length ? { ...g, members } : null;
    })
    .filter(Boolean);

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Mokjang
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">목장</h1>
      </div>

      <div className="mx-auto mb-8 max-w-md">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="이름 또는 목장명 검색"
            className="w-full rounded-xl border border-basil-100 bg-basil-50 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-basil-400 focus:bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-faint">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <div key={g.name} className="rounded-2xl border border-basil-100 bg-white p-5 text-center">
              <p className="text-lg font-bold text-title">
                {g.name}
                <span className="ml-1.5 text-[13px] font-medium text-ink-faint">
                  {g.members.length}명
                </span>
              </p>
              <div className="my-3 h-px bg-basil-100" />
              <div className="flex flex-wrap justify-center gap-1.5">
                {g.members.map((m) => (
                  <span
                    key={m}
                    className="break-keep rounded-lg bg-basil-50 px-2.5 py-1 text-sm text-ink-soft"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
