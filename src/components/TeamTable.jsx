import { ZONE_CODES } from "../data/teamGame.js";

// users에서 각 구역(A1~D4)에 배정된 인원을 뽑아 16칸으로 그린다.
// roundKey: "round1"|"round2"|"round3". myCode: 강조할 내 팀(선택). cols: grid 열 클래스.
// onMemberClick: 있으면 인원을 버튼으로(관리자 메뉴용).
export default function TeamTable({
  users,
  roundKey,
  myCode = null,
  cols,
  onMemberClick,
  showCount = false,
}) {
  const cells = ZONE_CODES.map((code) => ({
    code,
    members: users.filter((u) => u.nickname && u.teams?.[roundKey] === code),
  }));

  return (
    <div className={`grid gap-3 ${cols ?? "grid-cols-2"}`}>
      {cells.map((cell) => {
        const mine = myCode && cell.code === myCode;
        return (
          <div
            key={cell.code}
            className={`relative min-h-[8rem] rounded-2xl border px-3 pb-5 pt-8 ${
              mine ? "border-basil-500 bg-basil-50" : "border-basil-100 bg-white"
            }`}
          >
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[13px] font-bold ${
                mine ? "bg-basil-600 text-white" : "bg-basil-100 text-basil-700"
              }`}
            >
              {cell.code}
              {showCount ? ` · ${cell.members.length}` : ""}
            </span>

            {cell.members.length === 0 ? (
              <p className="py-2 text-center text-base text-basil-200">·</p>
            ) : (
              <ul className="space-y-1.5">
                {cell.members.map((m) =>
                  onMemberClick ? (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => onMemberClick(m)}
                        className="w-full break-keep rounded-lg px-1.5 py-1 text-center text-[15px] leading-snug text-ink transition hover:bg-basil-100"
                      >
                        <span className="font-semibold">{m.nickname}</span>
                        {m.mokjang && (
                          <span className="text-[13px] text-ink-faint">
                            {" "}
                            · {m.mokjang}
                          </span>
                        )}
                      </button>
                    </li>
                  ) : (
                    <li
                      key={m.id}
                      className="break-keep px-1.5 py-0.5 text-center text-[15px] leading-snug text-ink"
                    >
                      <span className="font-semibold">{m.nickname}</span>
                      {m.mokjang && (
                        <span className="text-[13px] text-ink-faint"> · {m.mokjang}</span>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
