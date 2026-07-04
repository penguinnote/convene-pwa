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
import { useUserProfiles } from "../hooks/useUserProfiles";

export default function Comments({ announcementId, user, nickname, mokjang, photoURL, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [hint, setHint] = useState("");
  const replyInputRef = useRef(null);

  const colRef = collection(db, "announcements", announcementId, "comments");

  useEffect(() => {
    const q = query(colRef, orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [announcementId]);

  const authorUids = [...new Set(comments.map((c) => c.authorUid).filter(Boolean))];
  const profiles = useUserProfiles(authorUids);

  // 표시용 작성자 정보 해석: 본인은 실시간 값, 그 외는 users 문서, 없으면 저장된 author* 폴백.
  function resolveAuthor(c) {
    const isSelf = c.authorUid && c.authorUid === user?.uid;
    const p = isSelf ? { nickname, mokjang, photoURL } : profiles[c.authorUid];
    return {
      photo: p?.photoURL ?? c.authorPhoto ?? "",
      name: p?.nickname || c.authorName || c.author || "익명",
      mok: p?.mokjang ?? c.authorMokjang ?? "",
    };
  }

  const parents = comments.filter((c) => !c.parentId);
  const repliesMap = {};
  comments.forEach((c) => {
    if (c.parentId) {
      if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
      repliesMap[c.parentId].push(c);
    }
  });

  function checkNickname() {
    if (!nickname) {
      setHint("정보 탭에서 닉네임을 먼저 설정해주세요.");
      return false;
    }
    setHint("");
    return true;
  }

  function authorData() {
    return {
      author: nickname,
      authorUid: user.uid,
      authorName: nickname,
      authorMokjang: mokjang || "",
      authorPhoto: photoURL || "",
    };
  }

  async function submitComment() {
    if (!text.trim() || !user) return;
    if (!checkNickname()) return;
    await addDoc(colRef, {
      text: text.trim(),
      ...authorData(),
      createdAt: serverTimestamp(),
      parentId: null,
    });
    setText("");
  }

  async function submitReply() {
    if (!replyText.trim() || !user || !replyTo) return;
    if (!checkNickname()) return;
    await addDoc(colRef, {
      text: replyText.trim(),
      ...authorData(),
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
    <section className="mt-8 overflow-x-hidden border-t border-basil-100 pt-6">
      <h3 className="text-sm font-bold text-ink">
        댓글 {comments.length > 0 && <span className="font-medium text-basil-600">{comments.length}</span>}
      </h3>

      <div className="mt-4 space-y-4">
        {parents.map((c) => (
          <div key={c.id}>
            <CommentItem
              comment={c}
              author={resolveAuthor(c)}
              canDelete={canDelete(c)}
              onDelete={() => handleDelete(c.id)}
              onReply={() => startReply(c.id)}
            />

            {repliesMap[c.id]?.map((r) => (
              <div key={r.id} className="ml-10 mt-2">
                <CommentItem
                  comment={r}
                  author={resolveAuthor(r)}
                  canDelete={canDelete(r)}
                  onDelete={() => handleDelete(r.id)}
                  isReply
                />
              </div>
            ))}

            {replyTo === c.id && (
              <div className="ml-10 mt-2 box-border flex min-w-0 gap-2">
                <input
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && submitReply()}
                  placeholder="답글을 입력하세요"
                  className="min-w-0 flex-1 rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2 text-sm text-ink outline-none focus:border-basil-500"
                />
                <button
                  type="button"
                  onClick={submitReply}
                  disabled={!replyText.trim()}
                  className="flex-none rounded-xl bg-basil-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  등록
                </button>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="flex-none rounded-xl border border-basil-200 px-3 py-2 text-sm text-ink-soft"
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

      {hint && (
        <p className="mt-3 text-sm font-medium text-basil-600">{hint}</p>
      )}

      {/* 댓글 입력 */}
      <div className="mt-4 box-border flex min-w-0 gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && submitComment()}
          placeholder={user ? "댓글을 입력하세요" : "로딩 중…"}
          disabled={!user}
          className="min-w-0 flex-1 rounded-xl border border-basil-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submitComment}
          disabled={!text.trim() || !user}
          className="flex-none rounded-xl bg-basil-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
        >
          등록
        </button>
      </div>
    </section>
  );
}

function CommentItem({ comment, author, canDelete, onDelete, onReply, isReply }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const avatarSize = isReply ? 28 : 34;
  const { photo, name, mok } = author;

  return (
    <div className={`flex gap-2.5 rounded-xl ${isReply ? "bg-basil-50/60 p-3" : "bg-basil-50 p-3.5"}`}>
      {/* 아바타 */}
      <div
        className="shrink-0 overflow-hidden rounded-full bg-basil-100"
        style={{ width: avatarSize, height: avatarSize }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-basil-400">
            <svg
              width={avatarSize * 0.55}
              height={avatarSize * 0.55}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${isReply ? "text-xs" : "text-sm"} text-ink`}>
            {name}
          </span>
          {mok && (
            <span className="text-[10px] text-ink-faint">{mok}</span>
          )}
          <span className="text-[10px] text-ink-faint">
            · {formatRelative(comment.createdAt)}
          </span>
        </div>
        <p className={`mt-0.5 whitespace-pre-wrap break-keep [overflow-wrap:anywhere] ${isReply ? "text-[13px]" : "text-sm"} leading-relaxed text-ink-soft`}>
          {comment.text}
        </p>
        <div className="mt-1 flex items-center gap-3">
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
    </div>
  );
}
