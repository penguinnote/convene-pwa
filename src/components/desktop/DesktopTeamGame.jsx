import { useEffect, useState } from "react";
import { TEAM_ROUNDS, getZone } from "../../data/teamGame.js";

const storageKey = (round) => `convene.teamgame.round${round}`;

// 데스크톱 레크레이션 조 편성. 모바일 TeamGame과 동일 로직/데이터(teamGame.js) 공유,
// 데스크톱 폭 레이아웃(PageFrame 흰 프레임 안에서 렌더).
export default function DesktopTeamGame() {
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [saved, setSaved] = useState(null);

  const roundData = TEAM_ROUNDS.find((r) => r.id === round) ?? TEAM_ROUNDS[0];

  useEffect(() => {
    let stored = null;
    try {
      const raw = localStorage.getItem(storageKey(round));
      if (raw) stored = JSON.parse(raw);
    } catch {
      stored = null;
    }
    setSaved(Array.isArray(stored) && stored.length === 4 ? stored : null);
    setAnswers([]);
  }, [round]);

  function pick(optionIdx) {
    const next = [...answers, optionIdx];
    if (next.length === roundData.questions.length) {
      try {
        localStorage.setItem(storageKey(round), JSON.stringify(next));
      } catch {
        /* localStorage 불가 시 메모리에만 유지 */
      }
      setSaved(next);
      setAnswers([]);
    } else {
      setAnswers(next);
    }
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey(round));
    } catch {
      /* noop */
    }
    setSaved(null);
    setAnswers([]);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Recreation
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">레크레이션</h1>
        <p className="mt-1 text-sm text-ink-soft">라운드별 조 편성</p>
      </div>

      {/* 라운드 세그먼트 */}
      <div className="mt-6 flex gap-2">
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
        {saved ? (
          <Result roundData={roundData} answers={saved} onReset={reset} />
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
    <div>
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

function Result({ roundData, answers, onReset }) {
  const zone = getZone(answers);
  return (
    <div>
      <div className="rounded-3xl border border-basil-100 bg-basil-50 p-8 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
          당신의 구역
        </p>
        <p className="mt-1 text-6xl font-bold tracking-tight text-title">{zone.code}</p>
        <p className="mt-3 break-keep text-base leading-relaxed text-ink">
          {zone.col}구역으로 이동한 뒤 {zone.row}번 표지를 찾아주세요
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-ink">내 선택</p>
        <ol className="space-y-2">
          {roundData.questions.map((q, i) => (
            <li key={i} className="rounded-2xl border border-basil-100 bg-white p-3">
              <p className="break-keep text-[13px] text-ink-faint">{q.prompt}</p>
              <p className="mt-1 break-keep text-sm font-semibold text-ink">
                {q.options[answers[i]]}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full rounded-2xl border border-basil-200 py-3 text-sm font-semibold text-basil-700"
      >
        다시 선택하기 (초기화)
      </button>
    </div>
  );
}
