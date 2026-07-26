import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { mokjangRoster } from "../data/mokjangRoster.js";

export default function Mokjang() {
  // 검색어를 URL 쿼리에 둔다(방배정과 동일 패턴). 뒤로가기로 쿼리가 사라지면
  // 검색이 해제되고 페이지에 그대로 머문다. 검색이 없을 때의 뒤로가기는 홈으로 간다.
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
  // 목장명이 맞으면 목장 전체를, 아니면 이름이 맞는 인원만 남긴다.
  const filtered = mokjangRoster
    .map((g) => {
      if (!q || g.name.includes(q)) return g;
      const members = g.members.filter((m) => m.includes(q));
      return members.length ? { ...g, members } : null;
    })
    .filter(Boolean);

  return (
    <div>
      <PageHeader eyebrow="Mokjang" title="목장" subtitle="목장별 명단을 확인하세요" />

      <div className="px-5 py-4">
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

      <div className="space-y-4 px-5 pb-6">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-faint">
            검색 결과가 없습니다.
          </p>
        ) : (
          filtered.map((g) => (
            <div key={g.name} className="rounded-2xl border border-basil-100 bg-white p-4">
              <p className="text-base font-bold text-title">{g.name}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
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
          ))
        )}
      </div>
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
