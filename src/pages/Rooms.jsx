import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { rooms } from "../data/rooms.js";

export default function Rooms() {
  const [query, setQuery] = useState("");

  const filtered = rooms.filter((room) => {
    const q = query.trim();
    if (!q) return true;
    return room.name.includes(q) || room.members.some((m) => m.includes(q));
  });

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 또는 방 번호 검색"
            className="w-full rounded-xl border border-basil-100 bg-basil-50 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-basil-400 focus:bg-white"
          />
        </div>
      </div>

      <div className="space-y-3 px-5 pb-6">
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-faint">
            검색 결과가 없습니다.
          </p>
        )}
        {filtered.map((room) => (
          <div
            key={room.name}
            className="rounded-2xl border border-basil-100 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-ink">{room.name}</p>
              <span className="rounded-full bg-basil-50 px-2.5 py-1 text-xs font-medium text-basil-600">
                {room.floor}
              </span>
            </div>
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
                  {m === room.leader && " · 리더"}
                </span>
              ))}
            </div>
          </div>
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
