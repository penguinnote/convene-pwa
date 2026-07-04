import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Info() {
  const { user, nickname, mokjang, saveProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [nick, setNick] = useState(nickname);
  const [mok, setMok] = useState(mokjang);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setNick(nickname); }, [nickname]);
  useEffect(() => { setMok(mokjang); }, [mokjang]);

  const dirty = nick.trim() !== nickname || mok.trim() !== mokjang;

  async function handleSave() {
    if (!dirty || saving) return;
    setSaving(true);
    await saveProfile({ nickname: nick, mokjang: mok });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <PageHeader eyebrow="INFO" title="정보" />

      {/* 내 정보 */}
      <section className="px-5 py-5">
        <h2 className="mb-3 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
          내 정보
        </h2>
        <div className="space-y-3 rounded-2xl border border-basil-100 bg-white p-4">
          <div>
            <label className="text-xs font-medium text-ink-faint">닉네임</label>
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              maxLength={20}
              placeholder="닉네임을 입력하세요"
              disabled={!user}
              className="mt-1 w-full rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-faint">목장</label>
            <input
              value={mok}
              onChange={(e) => setMok(e.target.value)}
              maxLength={30}
              placeholder="목장 이름을 입력하세요"
              disabled={!user}
              className="mt-1 w-full rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500 disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving || !user}
            className="w-full rounded-xl bg-basil-600 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-40"
          >
            {saved ? "저장 완료" : saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </section>

      {/* 메뉴 */}
      <section className="px-5 pb-6">
        <h2 className="mb-3 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
          메뉴
        </h2>
        <div className="overflow-hidden rounded-2xl border border-basil-100 bg-white">
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 text-basil-600">
              <BedIcon />
            </span>
            <span className="flex-1 font-bold text-title">방배정</span>
            <span className="text-basil-300">›</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function BedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v12M3 13h18v6M21 13v-2a3 3 0 0 0-3-3H9v5" />
      <circle cx="6.5" cy="10.5" r="1.5" />
    </svg>
  );
}
