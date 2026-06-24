import { useEffect, useState } from "react";

// 스플래시 타이밍 (ms) — 나중에 조정하기 쉽게 상수로 분리
export const SPLASH_TIMING = {
  stage2At: 600, // 0.6s: 아이콘 축소·이동 + 로딩 막대 등장
  barFill: 700, // 0.7s: 막대 0% → 100%
  finishAt: 1300, // 1.3s(= stage2At + barFill): 스플래시 종료(페이드아웃 시작)
  fadeOut: 300, // 페이드아웃 지속 시간
};

// stage: 1(아이콘만) | 2(아이콘 축소 + 로딩 막대), leaving: 페이드아웃 여부
export default function SplashScreen({ stage, leaving }) {
  const [barFilled, setBarFilled] = useState(false);

  // 2단계 진입 직후 한 프레임 뒤에 막대를 채워 0%→100% 트랜지션이 동작하게 함
  useEffect(() => {
    if (stage >= 2) {
      const id = requestAnimationFrame(() => setBarFilled(true));
      return () => cancelAnimationFrame(id);
    }
  }, [stage]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      style={{
        opacity: leaving ? 0 : 1,
        transition: `opacity ${SPLASH_TIMING.fadeOut}ms ease`,
      }}
      aria-hidden="true"
    >
      <img
        src="/splash-logo.png"
        alt=""
        className="h-auto w-[180px]"
        style={{
          transform: stage >= 2 ? "translateY(-12px) scale(0.85)" : "none",
          transition: "transform 300ms ease",
        }}
      />

      {/* 로딩 막대 (2단계에서 등장) */}
      <div
        className="mt-6 h-1 w-36 overflow-hidden rounded-full bg-basil-100"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: barFilled ? "100%" : "0%",
            background: "linear-gradient(90deg,#7BB0C4,#3F7D99)",
            transition: `width ${SPLASH_TIMING.barFill}ms ease`,
          }}
        />
      </div>
    </div>
  );
}
