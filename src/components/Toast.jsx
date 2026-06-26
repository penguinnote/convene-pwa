import { useEffect, useRef, useState } from "react";

const AUTO_DISMISS_MS = 4000;
const SWIPE_THRESHOLD = 40; // 이만큼 위로 끌면 닫힘
const TAP_SLOP = 8; // 이 이하로 움직이고 떼면 탭(상세 이동)으로 간주
const SLIDE_MS = 250;

// 화면 상단 인앱 토스트. 슬라이드 인 → 4초 후 슬라이드 아웃.
// 탭하면 상세 이동, 위로 스와이프하면 닫힘.
export default function Toast({ title, onClick, onClose }) {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const drag = useRef({ active: false, startY: 0, dy: 0, moved: false });
  const closedRef = useRef(false);
  const timerRef = useRef(null);

  function startTimer() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(close, AUTO_DISMISS_MS);
  }

  function close() {
    if (closedRef.current) return;
    closedRef.current = true;
    clearTimeout(timerRef.current);
    setDragging(false);
    setDragY(0);
    setLeaving(true);
    setTimeout(() => onClose?.(), SLIDE_MS);
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    startTimer();
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPointerDown(e) {
    if (closedRef.current) return;
    clearTimeout(timerRef.current); // 드래그 중 자동 닫힘 정지
    drag.current = { active: true, startY: e.clientY, dy: 0, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag.current.active) return;
    const dy = e.clientY - drag.current.startY;
    drag.current.dy = dy;
    if (Math.abs(dy) > TAP_SLOP) drag.current.moved = true;
    // 위로는 손가락을 따라가고, 아래로는 저항을 줘 거의 안 움직이게
    setDragY(dy < 0 ? dy : dy * 0.2);
  }

  function onPointerUp(e) {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    const { dy, moved } = drag.current;
    if (dy <= -SWIPE_THRESHOLD) {
      close(); // 충분히 위로 끌면 닫기
    } else if (!moved) {
      onClick?.(); // 거의 안 움직였으면 탭 → 상세 이동
    } else {
      setDragY(0); // 임계값 미달 → 원위치 후 타이머 재시작
      startTimer();
    }
  }

  const offscreen = !entered || leaving;
  const transform = offscreen
    ? "translateY(calc(-100% - 24px))"
    : `translateY(${dragY}px)`;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] mx-auto flex max-w-md justify-center px-4"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      <div
        role="button"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="pointer-events-auto flex w-full cursor-pointer select-none items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-lg"
        style={{
          borderColor: "#cfe0e8",
          touchAction: "none",
          transform,
          opacity: leaving ? 0 : 1,
          transition: dragging
            ? "none"
            : `transform ${SLIDE_MS}ms ease, opacity ${SLIDE_MS}ms ease`,
          boxShadow: "0 8px 24px rgba(33, 52, 60, 0.12)",
        }}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: "#67BDDB" }}
        >
          <BellIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold" style={{ color: "#3f7d99" }}>
            새 공지
          </p>
          <p
            className="truncate font-bold leading-snug"
            style={{ color: "#2f5e72" }}
          >
            {title}
          </p>
        </div>
        <button
          type="button"
          aria-label="닫기"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          className="shrink-0 p-1 text-ink-faint"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
