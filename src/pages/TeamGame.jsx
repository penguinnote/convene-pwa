import { useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import PageHeader from "../components/PageHeader.jsx";
import TeamTable from "../components/TeamTable.jsx";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth.jsx";
import { useUsers } from "../hooks/useUsers";
import { useActiveRound } from "../hooks/useActiveRound";
import { TEAM_ROUNDS, getZone } from "../data/teamGame.js";

export default function TeamGame() {
  const { user } = useAuth();
  const users = useUsers();
  const activeRound = useActiveRound(); // null(로딩) | 0(닫힘) | 1/2/3
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState([]); // 진행 중 선택
  const [started, setStarted] = useState(false); // "시작하기" 눌렀는지
  const [saving, setSaving] = useState(false);
  const userSwitched = useRef(false);

  const roundKey = `round${round}`;
  const roundData = TEAM_ROUNDS.find((r) => r.id === round) ?? TEAM_ROUNDS[0];
  const me = user ? users.find((u) => u.id === user.uid) : null;
  const myCode = me?.teams?.[roundKey] ?? null;

  // 열린 라운드를 기본 탭으로(사용자가 직접 바꾸기 전 1회)
  useEffect(() => {
    if (!userSwitched.current && activeRound >= 1 && activeRound <= 3) {
      setRound(activeRound);
    }
  }, [activeRound]);

  // 라운드 전환 시 진행/시작 초기화
  useEffect(() => {
    setAnswers([]);
    setStarted(false);
  }, [round]);

  function selectRound(i) {
    if (i === round) return;
    userSwitched.current = true;
    setRound(i);
  }

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
        setStarted(false);
      } catch {
        /* 저장 실패 시 마지막 문제 유지 */
      } finally {
        setSaving(false);
      }
    } else {
      setAnswers(next);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Recreation" title="레크레이션" subtitle="라운드별 조 편성" />

      <div className="px-5 py-5">
        <div className="flex gap-2">
          {TEAM_ROUNDS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectRound(r.id)}
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
            />
          ) : activeRound === null ? (
            <p className="py-12 text-center text-sm text-ink-faint">불러오는 중…</p>
          ) : activeRound !== round ? (
            <LockPanel />
          ) : !started ? (
            <StartPanel roundData={roundData} onStart={() => setStarted(true)} />
          ) : (
            <Question roundData={roundData} step={answers.length} onPick={pick} />
          )}
        </div>
      </div>
    </div>
  );
}

// 시작 페이지: 관리자가 연 라운드에서 "시작하기"를 눌러야 설문 시작
export function StartPanel({ roundData, onStart }) {
  return (
    <div className="rounded-3xl border border-basil-100 bg-basil-50 p-6 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-basil-600">
        {roundData.id}라운드 · {roundData.theme}
      </p>
      <p className="mt-3 break-keep text-[15px] leading-relaxed text-ink">
        취향 질문 4개에 답하면 나의 팀이 배정됩니다.
        <br />
        배정 후에는 바꿀 수 없어요.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-5 w-full rounded-2xl bg-basil-600 py-4 text-[15px] font-bold text-white"
      >
        시작하기
      </button>
    </div>
  );
}

// 잠금: 진행자가 아직 열지 않음(config 변경 시 실시간으로 풀림)
export function LockPanel() {
  return (
    <div className="rounded-3xl border border-basil-100 bg-white p-8 text-center">
      <p className="break-keep text-[15px] leading-relaxed text-ink-soft">
        아직 진행자가 열지 않았어요.
        <br />
        안내를 기다려주세요.
      </p>
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

// 결과: 내 팀 + 전체 16칸 팀표(실시간). 배정은 확정(재선택 없음).
export function Result({ users, roundKey, myCode, cols }) {
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
    </div>
  );
}
