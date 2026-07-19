import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import PageHeader from "../components/PageHeader.jsx";
import TeamTable from "../components/TeamTable.jsx";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth.jsx";
import { useUsers } from "../hooks/useUsers";
import { TEAM_ROUNDS, getZone } from "../data/teamGame.js";

export default function TeamGame() {
  const { user } = useAuth();
  const users = useUsers();
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState([]); // 진행 중 선택
  const [saving, setSaving] = useState(false);

  const roundKey = `round${round}`;
  const roundData = TEAM_ROUNDS.find((r) => r.id === round) ?? TEAM_ROUNDS[0];
  const me = user ? users.find((u) => u.id === user.uid) : null;
  const myCode = me?.teams?.[roundKey] ?? null; // 저장된 내 팀(있으면 결과 화면)

  // 라운드 전환 시 진행 초기화
  useEffect(() => {
    setAnswers([]);
  }, [round]);

  async function pick(optionIdx) {
    if (saving) return;
    const next = [...answers, optionIdx];
    if (next.length === roundData.questions.length) {
      const code = getZone(next).code;
      setSaving(true);
      try {
        if (user) {
          await setDoc(
            doc(db, "users", user.uid),
            { teams: { [roundKey]: code } },
            { merge: true }
          );
        }
        setAnswers([]); // 스냅샷이 myCode를 채우면 결과 화면으로
      } catch {
        /* 저장 실패 시 마지막 문제 유지 */
      } finally {
        setSaving(false);
      }
    } else {
      setAnswers(next);
    }
  }

  async function reset() {
    setAnswers([]);
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { teams: { [roundKey]: null } },
          { merge: true }
        );
      } catch {
        /* noop */
      }
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Recreation" title="레크레이션" subtitle="라운드별 조 편성" />

      <div className="px-5 py-5">
        {/* 라운드 세그먼트 */}
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

        <div className="mt-5">
          {myCode ? (
            <Result
              users={users}
              roundKey={roundKey}
              myCode={myCode}
              cols="grid-cols-2"
              onReset={reset}
            />
          ) : (
            <Question roundData={roundData} step={answers.length} onPick={pick} />
          )}
        </div>
      </div>
    </div>
  );
}

// 한 문제(2지선다)
function Question({ roundData, step, onPick }) {
  const total = roundData.questions.length;
  const q = roundData.questions[step];
  return (
    <div>
      <p className="text-[13px] font-bold tracking-wide text-basil-600">
        Q {step + 1}/{total}
      </p>
      <p className="mt-2 break-keep text-lg font-bold leading-snug text-title">
        {q.prompt}
      </p>
      <div className="mt-5 space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className="flex w-full items-center break-keep rounded-2xl border border-basil-100 bg-basil-50 px-5 py-5 text-left text-[15px] font-semibold leading-relaxed text-ink transition active:bg-basil-100"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// 결과: 내 팀 + 전체 16칸 팀표(실시간)
export function Result({ users, roundKey, myCode, cols, onReset }) {
  const col = myCode[0];
  const row = myCode.slice(1);
  return (
    <div>
      <div className="rounded-3xl border border-basil-100 bg-basil-50 p-6 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
          나의 팀
        </p>
        <p className="mt-1 text-5xl font-bold tracking-tight text-title">{myCode}</p>
        <p className="mt-3 break-keep text-[15px] leading-relaxed text-ink">
          {col}구역으로 이동해 {row}번 표지를 찾으세요
        </p>
      </div>

      <p className="mb-3 mt-6 text-sm font-semibold text-ink">전체 팀</p>
      <TeamTable users={users} roundKey={roundKey} myCode={myCode} cols={cols} />

      <button
        type="button"
        onClick={onReset}
        className="mt-5 w-full rounded-2xl border border-basil-200 py-3 text-sm font-semibold text-basil-700"
      >
        다시 선택하기
      </button>
    </div>
  );
}
