import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { TEAM_ROUNDS, getZone } from "../data/teamGame.js";

const storageKey = (round) => `convene.teamgame.round${round}`;

export default function TeamGame() {
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState([]); // 진행 중 선택
  const [saved, setSaved] = useState(null); // 완료된 선택(구역 고정)

  const roundData = TEAM_ROUNDS.find((r) => r.id === round) ?? TEAM_ROUNDS[0];

  // 라운드 전환/진입 시 저장된 결과 로드 + 진행 초기화 (라운드별 독립)
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
          {saved ? (
            <Result roundData={roundData} answers={saved} onReset={reset} />
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

// 결과(배정 구역 + 선택 기록)
function Result({ roundData, answers, onReset }) {
  const zone = getZone(answers);
  return (
    <div>
      <div className="rounded-3xl border border-basil-100 bg-basil-50 p-6 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
          당신의 구역
        </p>
        <p className="mt-1 text-5xl font-bold tracking-tight text-title">{zone.code}</p>
        <p className="mt-3 break-keep text-[15px] leading-relaxed text-ink">
          {zone.col}구역으로 이동한 뒤 {zone.row}번 표지를 찾아주세요
        </p>
      </div>

      <div className="mt-5">
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
        className="mt-5 w-full rounded-2xl border border-basil-200 py-3 text-sm font-semibold text-basil-700"
      >
        다시 선택하기 (초기화)
      </button>
    </div>
  );
}
