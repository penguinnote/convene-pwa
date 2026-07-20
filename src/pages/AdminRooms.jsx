import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useUsers } from "../hooks/useUsers";
import { rooms as staticRooms } from "../data/rooms.js";

let roomSeq = 0;
const newRoomId = () => `r${Date.now().toString(36)}_${roomSeq++}`;

// 붙여넣기 일괄 입력 파서.
// "[그룹]" 줄 = 현재 그룹 지정, "방이름: 이름1, 이름2, ..." 줄 = 방(첫 이름이 리더).
// 빈 줄·형식 밖 줄은 무시, 이름은 trim. id는 그룹+순번으로 유일 생성.
function parseRoomsText(text) {
  const parsed = [];
  let group = "";
  const counters = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const g = line.match(/^\[(.+)\]$/);
    if (g) {
      group = g[1].trim();
      continue;
    }
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const name = line.slice(0, idx).trim();
    if (!name) continue;
    const members = line
      .slice(idx + 1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const gkey = group || "기타";
    counters[gkey] = (counters[gkey] ?? 0) + 1;
    parsed.push({
      id: `${gkey}-${counters[gkey]}`,
      name,
      group: gkey,
      floor: gkey,
      leader: members[0] ?? "",
      members,
    });
  }
  return parsed;
}

// 관리자 방배정 편집: config/rooms 단일 문서를 로컬 상태로 편집 후 저장.
// 저장 즉시 참가자 화면(useRooms 구독)에 실시간 반영된다(배포·재설치 불필요).
export default function AdminRooms({ onBack, onLogout }) {
  const users = useUsers();
  const participants = users
    .filter((u) => u.nickname)
    .map((u) => u.nickname)
    .sort((a, b) => a.localeCompare(b, "ko"));

  const [rooms, setRooms] = useState(null); // null=로딩 중
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState(null); // 붙여넣기 파싱 미리보기
  const [newGroup, setNewGroup] = useState("");

  // 초기화: config/rooms가 있으면 그 값, 없으면 정적 rooms.js 시드.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "rooms"));
        const list = snap.exists() ? snap.data().rooms : null;
        if (alive && Array.isArray(list) && list.length) {
          setRooms(list);
          return;
        }
      } catch {
        /* 읽기 실패 → 시드 폴백 */
      }
      if (alive) setRooms(staticRooms);
    })();
    return () => {
      alive = false;
    };
  }, []);

  function patchRoom(id, patch) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRoom(room) {
    if (!window.confirm(`"${room.group} ${room.name}" 방을 삭제할까요?`)) return;
    setRooms((prev) => prev.filter((r) => r.id !== room.id));
  }

  function addRoom(group) {
    const g = group.trim();
    if (!g) return;
    setRooms((prev) => [
      ...prev,
      { id: newRoomId(), name: "", group: g, floor: g, leader: "", members: [] },
    ]);
  }

  function loadSeed() {
    if (!window.confirm("현재 편집 내용을 버리고 정적 시드(rooms.js)로 되돌릴까요?"))
      return;
    setRooms(staticRooms);
    setMsg("정적 시드를 불러왔습니다. 저장해야 참가자 화면에 반영됩니다.");
  }

  async function save() {
    const cleaned = rooms
      .map((r) => {
        const group = (r.group ?? "").trim() || "기타";
        return {
          id: r.id,
          name: (r.name ?? "").trim(),
          group,
          floor: group,
          leader: r.members[0] ?? "",
          members: r.members,
        };
      })
      .filter((r) => r.name);
    setSaving(true);
    try {
      await setDoc(
        doc(db, "config", "rooms"),
        { rooms: cleaned, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setRooms(cleaned);
      setMsg("저장했습니다. 참가자 화면에 바로 반영됩니다.");
    } catch (err) {
      console.error("rooms save failed", err);
      setMsg("저장에 실패했습니다. 다시 시도해주세요.");
    }
    setSaving(false);
  }

  function applyPreview() {
    if (!preview?.length) return;
    setRooms(preview);
    setPreview(null);
    setPasteText("");
    setShowPaste(false);
    setMsg("붙여넣기 결과를 편집 목록에 적용했습니다. 저장을 눌러야 반영됩니다.");
  }

  // 그룹별 섹션(입력 순서 유지)
  const groups = [];
  (rooms ?? []).forEach((r) => {
    const name = r.group?.trim() || "기타";
    const g = groups.find((x) => x.name === name);
    if (g) g.rooms.push(r);
    else groups.push({ name, rooms: [r] });
  });

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
        <h1 className="text-base font-bold text-ink">방배정 관리</h1>
        <button type="button" onClick={onLogout} className="text-sm text-ink-faint">
          로그아웃
        </button>
      </div>

      {rooms === null ? (
        <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
          불러오는 중…
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="col-span-2 rounded-xl bg-basil-600 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? "저장 중…" : "저장 (참가자 화면 즉시 반영)"}
            </button>
            <button
              type="button"
              onClick={() => setShowPaste((v) => !v)}
              className="rounded-xl border border-basil-200 py-2.5 text-sm font-semibold text-basil-700"
            >
              붙여넣기 입력
            </button>
            <button
              type="button"
              onClick={loadSeed}
              className="rounded-xl border border-basil-200 py-2.5 text-sm font-semibold text-ink-soft"
            >
              정적 시드 불러오기
            </button>
          </div>
          {msg && <p className="text-sm text-basil-600">{msg}</p>}

          {/* 붙여넣기 일괄 입력 */}
          {showPaste && (
            <div className="rounded-2xl border border-basil-100 bg-basil-50 p-3">
              <p className="text-xs font-semibold text-ink">붙여넣기 일괄 입력</p>
              <p className="mt-1 break-keep text-[11px] leading-relaxed text-ink-faint">
                [그룹] 줄로 그룹을 정하고, &quot;방이름: 이름1, 이름2&quot; 형식으로 한
                방씩 적습니다. 첫 이름이 리더가 됩니다.
              </p>
              <textarea
                rows={8}
                value={pasteText}
                onChange={(e) => {
                  setPasteText(e.target.value);
                  setPreview(null);
                }}
                placeholder={"[4인실]\n1호실: 목사님, 사모님\n2호실: 배예훈, 김영도\n\n[6인실]\n1호실: 한희진, 민소연"}
                className="mt-2 w-full rounded-xl border border-basil-100 bg-white px-3 py-2 text-sm"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(parseRoomsText(pasteText))}
                  className="flex-1 rounded-xl border border-basil-200 bg-white py-2 text-sm font-semibold text-basil-700"
                >
                  미리보기
                </button>
                <button
                  type="button"
                  onClick={applyPreview}
                  disabled={!preview?.length}
                  className="flex-1 rounded-xl bg-basil-600 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  적용 (기존 목록 대체)
                </button>
              </div>
              {preview && (
                <div className="mt-2 rounded-xl border border-basil-100 bg-white p-3">
                  {preview.length === 0 ? (
                    <p className="text-sm text-ink-faint">
                      형식에 맞는 줄이 없습니다.
                    </p>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-ink">
                        방 {preview.length}개 ·{" "}
                        {[...new Set(preview.map((r) => r.group))].join(" / ")}
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {preview.map((r) => (
                          <li key={r.id} className="break-keep text-[13px] text-ink-soft">
                            <span className="font-semibold text-ink">
                              [{r.group}] {r.name}
                            </span>{" "}
                            {r.members.join(", ")}
                            {r.members.length > 0 && (
                              <span className="text-ink-faint">
                                {" "}
                                · {r.members.length}명
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 구조화 편집: 그룹별 방 카드 */}
          {groups.map((g) => (
            <section key={g.name}>
              <h2 className="mb-2 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
                {g.name}
              </h2>
              <div className="space-y-3">
                {g.rooms.map((room) => (
                  <RoomEditor
                    key={room.id}
                    room={room}
                    participants={participants}
                    onPatch={(patch) => patchRoom(room.id, patch)}
                    onRemove={() => removeRoom(room)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addRoom(g.name)}
                  className="w-full rounded-xl border border-dashed border-basil-200 py-2 text-sm font-medium text-basil-600"
                >
                  + {g.name} 방 추가
                </button>
              </div>
            </section>
          ))}

          {/* 새 그룹 추가 */}
          <div className="flex gap-2">
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="새 그룹 이름 (예: 2인실)"
              className="min-w-0 flex-1 rounded-xl border border-basil-100 bg-basil-50 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                addRoom(newGroup);
                setNewGroup("");
              }}
              disabled={!newGroup.trim()}
              className="shrink-0 rounded-xl border border-basil-200 px-4 py-2 text-sm font-semibold text-basil-700 disabled:opacity-40"
            >
              그룹 추가
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// 방 카드: 이름·그룹 편집, 인원 칩(탭=리더 지정, ×=삭제),
// 인원 추가는 직접 입력 + 참여자 검색·선택 모두 지원.
function RoomEditor({ room, participants, onPatch, onRemove }) {
  const [input, setInput] = useState("");
  const q = input.trim();
  const suggestions = q
    ? participants
        .filter((n) => n.includes(q) && !room.members.includes(n))
        .slice(0, 6)
    : [];

  function addMember(name) {
    const n = name.trim();
    setInput("");
    if (!n || room.members.includes(n)) return;
    onPatch({ members: [...room.members, n] });
  }

  function removeMember(i) {
    onPatch({ members: room.members.filter((_, k) => k !== i) });
  }

  function makeLeader(i) {
    if (i === 0) return;
    const m = room.members[i];
    onPatch({ members: [m, ...room.members.filter((_, k) => k !== i)] });
  }

  return (
    <div className="rounded-2xl border border-basil-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <input
          value={room.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          placeholder="방 이름 (예: 1호실)"
          className="min-w-0 flex-1 rounded-xl border border-basil-100 bg-basil-50 px-3 py-2 text-sm font-bold text-ink"
        />
        <input
          value={room.group}
          onChange={(e) => {
            const g = e.target.value;
            onPatch({ group: g, floor: g });
          }}
          placeholder="그룹"
          className="w-20 shrink-0 rounded-xl border border-basil-100 bg-basil-50 px-2 py-2 text-center text-sm text-ink-soft"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label="방 삭제"
          className="shrink-0 rounded-lg px-2 py-2 text-sm text-ink-faint"
        >
          삭제
        </button>
      </div>

      {/* 인원 칩: 탭하면 리더로(맨 앞), ×로 삭제. 첫 번째가 리더. */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {room.members.length === 0 && (
          <p className="text-[13px] text-ink-faint">아직 인원이 없습니다.</p>
        )}
        {room.members.map((m, i) => (
          <span
            key={`${m}-${i}`}
            className={`inline-flex items-center gap-1 rounded-lg py-1 pl-2.5 pr-1.5 text-sm ${
              i === 0
                ? "bg-basil-600 font-medium text-white"
                : "bg-basil-50 text-ink-soft"
            }`}
          >
            <button
              type="button"
              onClick={() => makeLeader(i)}
              title={i === 0 ? "리더" : "리더로 지정"}
              className="break-keep"
            >
              {m}
              {i === 0 && " · 리더"}
            </button>
            <button
              type="button"
              onClick={() => removeMember(i)}
              aria-label={`${m} 삭제`}
              className={`rounded px-0.5 ${i === 0 ? "text-white/70" : "text-ink-faint"}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* 인원 추가: 직접 입력 또는 아래 참여자 후보 탭 */}
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addMember(input);
            }
          }}
          placeholder="이름 입력 또는 참여자 검색"
          className="min-w-0 flex-1 rounded-xl border border-basil-100 bg-basil-50 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => addMember(input)}
          disabled={!q}
          className="shrink-0 rounded-xl border border-basil-200 px-3 py-2 text-sm font-semibold text-basil-700 disabled:opacity-40"
        >
          추가
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {suggestions.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => addMember(n)}
              className="rounded-lg border border-basil-200 px-2.5 py-1 text-[13px] text-basil-700 transition hover:bg-basil-50"
            >
              + {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
