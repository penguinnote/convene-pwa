import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function login(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch {
      setMsg("로그인 실패");
    }
  }

  async function send(e) {
    e.preventDefault();
    await addDoc(collection(db, "announcements"), {
      title,
      body,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setBody("");
    setMsg("공지 발송 완료");
  }

  if (!user) {
    return (
      <form onSubmit={login} className="space-y-3 p-6">
        <h1 className="text-xl font-bold text-ink">관리자 로그인</h1>
        <input
          className="w-full rounded-xl border border-basil-100 bg-basil-50 px-4 py-2.5"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-xl border border-basil-100 bg-basil-50 px-4 py-2.5"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="w-full rounded-xl bg-basil-600 py-2.5 font-semibold text-white">
          로그인
        </button>
        {msg && <p className="text-sm text-ink-soft">{msg}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">공지 작성</h1>
        <button type="button" onClick={() => signOut(auth)} className="text-sm text-ink-faint">
          로그아웃
        </button>
      </div>
      <input
        className="w-full rounded-xl border border-basil-100 bg-basil-50 px-4 py-2.5"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        rows={4}
        className="w-full rounded-xl border border-basil-100 bg-basil-50 px-4 py-2.5"
        placeholder="내용"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button className="w-full rounded-xl bg-basil-600 py-2.5 font-semibold text-white">
        공지 발송 (푸시)
      </button>
      {msg && <p className="text-sm text-basil-600">{msg}</p>}
    </form>
  );
}
