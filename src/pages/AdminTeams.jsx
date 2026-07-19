import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUsers } from "../hooks/useUsers";
import TeamTable from "../components/TeamTable.jsx";
import { TEAM_ROUNDS, ZONE_CODES } from "../data/teamGame.js";

// 관리자 팀 편성: 라운드별 16칸 표(인원수) + 인원 탭 시 삭제/다른 팀 이동.
// 남의 users 문서를 수정하므로 firestore.rules의 users write 확장(이메일 관리자 허용)이 전제.
export default function AdminTeams({ onBack, onLogout }) {
  const users = useUsers();
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null); // 메뉴 대상 유저
  const [moving, setMoving] = useState(false); // 이동 대상 코드 선택 모드
  const roundKey = `round${round}`;

  const assigned = users.filter((u) => u.nickname && u.teams?.[roundKey]).length;

  async function setTeam(uid, code) {
    try {
      await setDoc(
        doc(db, "users", uid),
        { teams: { [roundKey]: code } },
        { merge: true }
      );
    } catch {
      /* 저장 실패 무시 */
    }
    setSelected(null);
    setMoving(false);
  }

  function closeMenu() {
    setSelected(null);
    setMoving(false);
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-basil-600"
        >
          ‹ 공지 관리
        </button>
        <h1 className="text-base font-bold text-ink">팀 편성</h1>
        <button type="button" onClick={onLogout} className="text-sm text-ink-faint">
          로그아웃
        </button>
      </div>

      {/* 라운드 선택 */}
      <div className="flex gap-2">
        {TEAM_ROUNDS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRound(r.id)}
            className={`flex-1 rounded-xl px-2 py-2 text-sm transition ${
              r.id === round ? "bg-basil-600 text-white" : "bg-basil-50 text-ink-soft"
            }`}
          >
            <span className="block font-semibold">{r.id}라운드</span>
            <span
              className={`block text-[11px] ${
                r.id === round ? "text-white/80" : "text-ink-faint"
              }`}
            >
              {r.theme}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-faint">배정 {assigned}명 · 인원을 눌러 삭제/이동</p>

      <TeamTable
        users={users}
        roundKey={roundKey}
        cols="grid-cols-2 sm:grid-cols-4"
        showCount
        onMemberClick={setSelected}
      />

      {/* 인원 메뉴 (삭제 / 다른 팀으로 이동) */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4"
          onClick={closeMenu}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="break-keep text-sm font-bold text-title">
              {selected.nickname}
              {selected.mokjang && (
                <span className="font-medium text-ink-faint"> · {selected.mokjang}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-ink-faint">
              현재: {selected.teams?.[roundKey] ?? "미배정"}
            </p>

            {!moving ? (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setTeam(selected.id, null)}
                  className="w-full rounded-xl border border-basil-200 py-2.5 text-sm font-semibold text-ink-soft"
                >
                  팀에서 삭제 (미배정)
                </button>
                <button
                  type="button"
                  onClick={() => setMoving(true)}
                  className="w-full rounded-xl bg-basil-600 py-2.5 text-sm font-semibold text-white"
                >
                  다른 팀으로 이동
                </button>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="w-full py-2 text-sm text-ink-faint"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <p className="mb-2 text-xs text-ink-faint">이동할 팀 선택</p>
                <div className="grid grid-cols-4 gap-2">
                  {ZONE_CODES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setTeam(selected.id, code)}
                      className="rounded-lg border border-basil-200 py-2 text-sm font-semibold text-basil-700 transition hover:bg-basil-50"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
