import { useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUsers } from "../hooks/useUsers";
import { MOKJANG_LIST } from "../data/mokjang.js";
import { formatRelative } from "../lib/time";
import { Avatar } from "./Participants.jsx";

// 관리자 참여자 관리: 전체 users 실시간 조회 + 이름/목장 수정 + 문서 삭제.
// 남의 users 문서를 쓰기·삭제하므로 firestore.rules의 users 규칙(이메일 관리자 허용)이 전제.
export default function AdminPeople({ onBack, onLogout }) {
  const users = useUsers();
  const [q, setQ] = useState("");
  const [namelessOnly, setNamelessOnly] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNick, setEditNick] = useState("");
  const [editMok, setEditMok] = useState("");

  const query = q.trim();
  const filtered = users
    .filter((u) => {
      if (namelessOnly) return !u.nickname;
      if (!query) return true;
      return (
        (u.nickname && u.nickname.includes(query)) ||
        (u.mokjang && u.mokjang.includes(query))
      );
    })
    .sort((a, b) => {
      // 이름 있는 문서 먼저(가나다순), 이름 없는 문서는 맨 아래
      if (!a.nickname && !b.nickname) return 0;
      if (!a.nickname) return 1;
      if (!b.nickname) return -1;
      return a.nickname.localeCompare(b.nickname, "ko");
    });

  const filtering = query || namelessOnly;

  function startEdit(u) {
    setEditId(u.id);
    setEditNick(u.nickname ?? "");
    setEditMok(u.mokjang ?? "");
  }

  async function saveEdit(uid) {
    try {
      await setDoc(
        doc(db, "users", uid),
        { nickname: editNick.trim(), mokjang: editMok },
        { merge: true }
      );
    } catch {
      window.alert("저장에 실패했습니다. 권한(규칙 배포)을 확인하세요.");
    }
    setEditId(null);
  }

  async function remove(u) {
    const label = u.nickname || "이름 없는";
    if (!window.confirm(`${label} 참여자를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    try {
      await deleteDoc(doc(db, "users", u.id));
      if (editId === u.id) setEditId(null);
    } catch {
      window.alert("삭제에 실패했습니다. 권한(규칙 배포)을 확인하세요.");
    }
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
        <h1 className="text-base font-bold text-ink">참여자 관리</h1>
        <button type="button" onClick={onLogout} className="text-sm text-ink-faint">
          로그아웃
        </button>
      </div>

      {/* 검색 + 필터 + 총원 */}
      <div className="space-y-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 또는 목장 검색"
          className="w-full rounded-xl border border-basil-100 bg-basil-50 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-basil-400 focus:bg-white"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={namelessOnly}
              onChange={(e) => setNamelessOnly(e.target.checked)}
              className="h-4 w-4 accent-basil-600"
            />
            이름 없는 문서만 보기
          </label>
          <span className="text-xs text-ink-faint">
            {filtering ? `${filtered.length} / ${users.length}` : `총 ${users.length}`}명
          </span>
        </div>
      </div>

      {/* 목록 */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
            해당하는 참여자가 없습니다.
          </p>
        ) : (
          filtered.map((u) =>
            editId === u.id ? (
              <div
                key={u.id}
                className="space-y-2 rounded-2xl border border-basil-200 bg-basil-50 p-3"
              >
                <input
                  value={editNick}
                  onChange={(e) => setEditNick(e.target.value)}
                  maxLength={20}
                  placeholder="이름"
                  className="w-full rounded-lg border border-basil-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-basil-500"
                />
                <select
                  value={editMok}
                  onChange={(e) => setEditMok(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-basil-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-basil-500"
                >
                  <option value="">(목장 없음)</option>
                  {MOKJANG_LIST.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(u.id)}
                    className="flex-1 rounded-lg bg-basil-600 py-2 text-sm font-semibold text-white"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="flex-1 rounded-lg border border-basil-200 py-2 text-sm font-semibold text-ink-soft"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={u.id}
                className="flex items-center gap-3 rounded-2xl border border-basil-100 bg-white p-3"
              >
                <Avatar nickname={u.nickname} photoURL={u.photoURL} />
                <div className="min-w-0 flex-1">
                  <p className="truncate break-keep font-bold text-title">
                    {u.nickname || (
                      <span className="font-medium text-ink-faint">(이름 없음)</span>
                    )}
                  </p>
                  <p className="truncate text-[13px] text-ink-soft">
                    {u.mokjang || "—"}
                    {u.installedAt && (
                      <span className="text-ink-faint">
                        {" "}
                        · 설치 {formatRelative(u.installedAt)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEdit(u)}
                    className="rounded-lg border border-basil-200 px-2.5 py-1.5 text-xs font-medium text-basil-700"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(u)}
                    className="rounded-lg border border-basil-100 px-2.5 py-1.5 text-xs font-medium text-ink-faint"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
