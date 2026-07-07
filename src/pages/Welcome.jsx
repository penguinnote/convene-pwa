import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { logEvent } from "../lib/track";
import { INSTANCE } from "../config/instance.js";

const MOKJANG_LIST = [
  "기쁨", "다소니", "마음", "밸리", "빛길", "사랑",
  "새벽", "새싹", "에끌", "토브", "프레쉬", "하품",
];

export default function Welcome() {
  const { user, saveProfile } = useAuth();
  const [nick, setNick] = useState("");
  const [mok, setMok] = useState("");
  const [saving, setSaving] = useState(false);

  const valid = nick.trim().length > 0 && mok.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid || !user || saving) return;
    setSaving(true);
    await saveProfile({ nickname: nick, mokjang: mok });
    logEvent("onboarding_complete", { mokjang: mok });
    setSaving(false);
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 수채화 헤더 */}
      <header
        className="relative overflow-hidden px-6 pb-10 pt-[max(3.5rem,calc(env(safe-area-inset-top)+2rem))]"
        style={{
          background: [
            "radial-gradient(130px 95px at 16% 20%, rgba(255,250,220,.95), transparent 70%)",
            "radial-gradient(160px 130px at 84% 10%, rgba(150,222,236,.92), transparent 70%)",
            "radial-gradient(170px 140px at 68% 74%, rgba(120,206,228,.8), transparent 72%)",
            "radial-gradient(150px 120px at 18% 90%, rgba(178,234,212,.85), transparent 70%)",
            "radial-gradient(210px 170px at 45% 45%, rgba(220,245,245,.7), transparent 75%)",
            "linear-gradient(165deg,#d3f0f3,#e0f2ec 52%,#f6f1e3)",
          ].join(", "),
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-basil-600">
          {INSTANCE.org}
        </p>
        <h1
          className="mt-4 tracking-tight text-title"
          style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 7vw, 2rem)" }}
        >
          환영합니다
        </h1>
        <p className="mt-1.5 text-[22px] font-bold italic text-title">
          Welcome
        </p>
      </header>

      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8"
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-ink">이름</label>
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              maxLength={20}
              placeholder="캠프에서 사용할 이름"
              autoFocus
              className="mt-2 w-full rounded-xl border border-basil-200 bg-basil-50/50 px-4 py-3 text-[15px] text-ink outline-none focus:border-basil-500"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-ink">목장</label>
            <select
              value={mok}
              onChange={(e) => setMok(e.target.value)}
              className={`mt-2 w-full appearance-none rounded-xl border border-basil-200 bg-basil-50/50 px-4 py-3 text-[15px] outline-none focus:border-basil-500 ${
                mok ? "text-ink" : "text-ink-faint"
              }`}
            >
              <option value="" disabled>목장을 선택하세요</option>
              {MOKJANG_LIST.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!valid || saving}
          className="mt-8 w-full rounded-2xl bg-basil-600 py-4 text-[15px] font-bold text-white shadow-sm transition-opacity disabled:opacity-40"
        >
          {saving ? "저장 중…" : "시작하기"}
        </button>
      </form>
    </div>
  );
}
