import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatRelative } from "../lib/time";

export default function Comments({ announcementId, user, nickname, saveNickname, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [nickInput, setNickInput] = useState("");
  const [showNickPrompt, setShowNickPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const inputRef = useRef(null);
  const replyInputRef = useRef(null);

  const colRef = collection(db, "announcements", announcementId, "comments");

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [announcementId]);

  const parents = comments.filter((c) => !c.parentId);
  const repliesMap = {};
  comments.forEach((c) => {
    if (c.parentId) {
      if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
      repliesMap[c.parentId].push(c);
    }
  });

  function ensureNickname(action) {
    if (!nickname) {
      setPendingAction(() => action);
      setShowNickPrompt(true);
      return false;
    }
    return true;
  }

  async function handleNickSubmit(e) {
    e.preventDefault();
    if (!nickInput.trim()) return;
    await saveNickname(nickInput);
    setShowNickPrompt(false);
    setNickInput("");
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  async function submitComment() {
    if (!text.trim() || !user) return;
    if (!ensureNickname(submitComment)) return;
    await addDoc(colRef, {
      text: text.trim(),
      author: nickname,
      authorUid: user.uid,
      createdAt: serverTimestamp(),
      parentId: null,
    });
    setText("");
  }

  async function submitReply() {
    if (!replyText.trim() || !user || !replyTo) return;
    if (!ensureNickname(submitReply)) return;
    await addDoc(colRef, {
      text: replyText.trim(),
      author: nickname,
      authorUid: user.uid,
      createdAt: serverTimestamp(),
      parentId: replyTo,
    });
    setReplyText("");
    setReplyTo(null);
  }

  async function handleDelete(commentId) {
    await deleteDoc(doc(db, "announcements", announcementId, "comments", commentId));
  }

  function startReply(commentId) {
    setReplyTo(commentId);
    setReplyText("");
    setTimeout(() => replyInputRef.current?.focus(), 50);
  }

  function canDelete(c) {
    if (!user) return false;
    return c.authorUid === user.uid || isAdmin;
  }

  return (
    <section className="mt-8 border-t border-basil-100 pt-6">
      <h3 className="text-sm font-bold text-ink">
        댓글 {comments.length > 0 && <span className="font-medium text-basil-600">{comments.length}</span>}
      </h3>

      {/* 닉네임 입력 모달 */}
      {showNickPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <form
            onSubmit={handleNickSubmit}
            className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl"
          >
            <p className="text-sm font-bold text-ink">닉네임을 입력해주세요</p>
            <p className="mt-1 text-xs text-ink-faint">댓글에 표시되는 이름입니다.</p>
            <input
              autoFocus
              value={nickInput}
              onChange={(e) => setNickInput(e.target.value)}
              maxLength={20}
              placeholder="닉네임"
              className="mt-3 w-full rounded-xl border border-basil-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => { setShowNickPrompt(false); setPendingAction(null); }}
                className="flex-1 rounded-xl border border-basil-200 py-2.5 text-sm font-medium text-ink-soft"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!nickInput.trim()}
                className="flex-1 rounded-xl bg-basil-600 py-2.5 text-sm font-bold text-white disabled:opacity-40"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="mt-4 space-y-4">
        {parents.map((c) => (
          <div key={c.id}>
            <CommentItem
              comment={c}
              canDelete={canDelete(c)}
              onDelete={() => handleDelete(c.id)}
              onReply={() => startReply(c.id)}
            />

            {/* 답글 */}
            {repliesMap[c.id]?.map((r) => (
              <div key={r.id} className="ml-8 mt-2">
                <CommentItem
                  comment={r}
                  canDelete={canDelete(r)}
                  onDelete={() => handleDelete(r.id)}
                  isReply
                />
              </div>
            ))}

            {/* 답글 입력 */}
            {replyTo === c.id && (
              <div className="ml-8 mt-2 flex gap-2">
                <input
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && submitReply()}
                  placeholder="답글을 입력하세요"
                  className="flex-1 rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2 text-sm text-ink outline-none focus:border-basil-500"
                />
                <button
                  type="button"
                  onClick={submitReply}
                  disabled={!replyText.trim()}
                  className="shrink-0 rounded-xl bg-basil-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  등록
                </button>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="shrink-0 rounded-xl border border-basil-200 px-3 py-2 text-sm text-ink-soft"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {parents.length === 0 && (
        <p className="mt-3 text-sm text-ink-faint">아직 댓글이 없습니다.</p>
      )}

      {/* 닉네임 변경 */}
      {nickname && (
        <button
          type="button"
          onClick={() => { setNickInput(nickname); setShowNickPrompt(true); setPendingAction(null); }}
          className="mt-4 text-xs text-ink-faint underline underline-offset-2"
        >
          닉네임 변경 ({nickname})
        </button>
      )}

      {/* 댓글 입력 */}
      <div className="mt-4 flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && submitComment()}
          placeholder={user ? "댓글을 입력하세요" : "로딩 중…"}
          disabled={!user}
          className="flex-1 rounded-xl border border-basil-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submitComment}
          disabled={!text.trim() || !user}
          className="shrink-0 rounded-xl bg-basil-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          등록
        </button>
      </div>
    </section>
  );
}

function CommentItem({ comment, canDelete, onDelete, onReply, isReply }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`rounded-xl ${isReply ? "bg-basil-50/60 p-3" : "bg-basil-50 p-3.5"}`}>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${isReply ? "text-xs" : "text-sm"} text-ink`}>
          {comment.author || "익명"}
        </span>
        <span className="text-[11px] text-ink-faint">
          {formatRelative(comment.createdAt)}
        </span>
      </div>
      <p className={`mt-1 whitespace-pre-wrap break-keep [overflow-wrap:anywhere] ${isReply ? "text-[13px]" : "text-sm"} leading-relaxed text-ink-soft`}>
        {comment.text}
      </p>
      <div className="mt-1.5 flex items-center gap-3">
        {onReply && (
          <button
            type="button"
            onClick={onReply}
            className="text-xs font-medium text-basil-600"
          >
            답글
          </button>
        )}
        {canDelete && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-ink-faint"
          >
            삭제
          </button>
        )}
        {canDelete && confirmDelete && (
          <>
            <button
              type="button"
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              className="text-xs font-medium text-red-500"
            >
              삭제 확인
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-ink-faint"
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}
