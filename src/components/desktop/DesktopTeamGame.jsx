import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useUsers } from "../../hooks/useUsers";
import { TEAM_ROUNDS, getZone } from "../../data/teamGame.js";
import { Result } from "../../pages/TeamGame.jsx";

// 데스크톱 레크레이션 조 편성. 모바일 TeamGame과 동일 로직/데이터·Firestore 저장 공유,
// 데스크톱 폭(PageFrame 안) + 4열 팀표.
export default function DesktopTeamGame() {
  const { user } = useAuth();
  const users = useUsers();
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [saving, setSaving] = useState(false);

  const roundKey = `round${round}`;
  const roundData = TEAM_ROUNDS.find((r) => r.id === round) ?? TEAM_ROUNDS[0];
  const me = user ? users.find((u) => u.id === user.uid) : null;
  const myCode = me?.teams?.[roundKey] ?? null;

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
        setAnswers([]);
      } catch {
        /* 저장 실패 시 유지 */
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
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Recreation
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">레크레이션</h1>
        <p className="mt-1 text-sm text-ink-soft">라운드별 조 편성</p>
      </div>

      <div className="mx-auto mt-6 flex max-w-md gap-2">
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

      <div className="mt-6">
        {myCode ? (
          <Result
            users={users}
            roundKey={roundKey}
            myCode={myCode}
            cols="grid-cols-4"
            onReset={reset}
          />
        ) : (
          <Question roundData={roundData} step={answers.length} onPick={pick} />
        )}
      </div>
    </div>
  );
}

function Question({ roundData, step, onPick }) {
  const total = roundData.questions.length;
  const q = roundData.questions[step];
  return (
    <div className="mx-auto max-w-md">
      <p className="text-center text-[13px] font-bold tracking-wide text-basil-600">
        Q {step + 1}/{total}
      </p>
      <p className="mt-2 break-keep text-center text-xl font-bold leading-snug text-title">
        {q.prompt}
      </p>
      <div className="mt-6 space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className="flex w-full items-center justify-center break-keep rounded-2xl border border-basil-100 bg-basil-50 px-6 py-5 text-center text-[15px] font-semibold leading-relaxed text-ink transition hover:bg-basil-100"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
