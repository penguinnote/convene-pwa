import { useEffect, useRef, useState } from "react";
import { isStandalone } from "../lib/track";
import { logEvent } from "../lib/track";

// localStorage 키
const KEY_DISMISSED = "installHint:dismissed";
const KEY_SNOOZE = "installHint:snoozeUntil";

// 스누즈 기간: 24시간
const SNOOZE_MS = 24 * 60 * 60 * 1000;

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function isSnoozed() {
  const until = localStorage.getItem(KEY_SNOOZE);
  if (!until) return false;
  return Date.now() < Number(until);
}

function isDismissed() {
  return localStorage.getItem(KEY_DISMISSED) === "1";
}

/**
 * 브라우저(비설치) 사용자에게 홈 화면 추가를 안내하는 바텀 시트.
 * 표시 조건:
 *  - standalone이 아닌 브라우저 실행
 *  - localStorage 영구 닫기·스누즈 아님
 *  - 스플래시 종료 후 (splashDone)
 *  - 프로필 등록 완료 (hasProfile) — 온보딩 중 노출 방지
 *  - 모바일만 (isDesktop=false)
 */
export default function InstallHint({ splashDone, hasProfile, isDesktop }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const deferredPromptRef = useRef(null);
  const shownRef = useRef(false);

  // Android: beforeinstallprompt 이벤트 캡처
  useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault();
      deferredPromptRef.current = e;
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  // 표시 조건 판단
  useEffect(() => {
    if (!splashDone || !hasProfile || isDesktop) return;
    if (isStandalone()) return;
    if (isDismissed() || isSnoozed()) return;

    // 조건 충족 시 약간의 딜레이 후 표시 (온보딩 완료 직후 바로 뜨지 않게)
    const timer = setTimeout(() => {
      setVisible(true);
      if (!shownRef.current) {
        shownRef.current = true;
        logEvent("install_hint_shown", { platform: detectPlatform() });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [splashDone, hasProfile, isDesktop]);

  function close(animated = true) {
    if (animated) {
      setLeaving(true);
      setTimeout(() => setVisible(false), 300);
    } else {
      setVisible(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(KEY_DISMISSED, "1");
    logEvent("install_hint_action", { action: "dismiss" });
    close();
  }

  function handleSnooze() {
    localStorage.setItem(KEY_SNOOZE, String(Date.now() + SNOOZE_MS));
    logEvent("install_hint_action", { action: "snooze" });
    close();
  }

  async function handleAndroidInstall() {
    logEvent("install_hint_action", { action: "install_prompt" });
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    prompt.prompt();
    try {
      const result = await prompt.userChoice;
      logEvent("install_hint_prompt_result", { outcome: result.outcome });
      if (result.outcome === "accepted") {
        localStorage.setItem(KEY_DISMISSED, "1");
        close();
      }
    } catch {
      // 프롬프트 실패 무시
    }
    deferredPromptRef.current = null;
  }

  if (!visible) return null;

  const platform = detectPlatform();

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => {
          logEvent("install_hint_action", { action: "close" });
          close();
        }}
      />

      {/* 바텀 시트 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[9999] mx-auto max-w-md transform transition-transform duration-300 ${
          leaving ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-xl">
          {/* 드래그 핸들 */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-basil-200" />

          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={() => {
              logEvent("install_hint_action", { action: "close" });
              close();
            }}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint hover:bg-basil-50"
            aria-label="닫기"
          >
            ✕
          </button>

          {/* 아이콘 + 제목 */}
          <div className="mb-4 text-center">
            <p className="text-3xl">📲</p>
            <h2 className="mt-2 font-['Gowun_Batang'] text-lg font-bold text-title">
              홈 화면에 추가하세요
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              앱처럼 빠르게 열고, 알림도 받을 수 있어요
            </p>
          </div>

          {/* 플랫폼별 안내 */}
          {platform === "ios" ? (
            <div className="mb-5 space-y-3">
              <Step number={1} text={<>하단 <ShareIcon /> <strong>공유</strong> 버튼을 누르세요</>} />
              <Step number={2} text={<><strong>"홈 화면에 추가"</strong>를 선택하세요</>} />
              <Step number={3} text={<>우측 상단 <strong>"추가"</strong>를 누르면 완료!</>} />
            </div>
          ) : platform === "android" ? (
            <div className="mb-5 space-y-3">
              {deferredPromptRef.current ? (
                <>
                  <p className="text-center text-sm text-ink-soft">
                    아래 버튼을 누르면 바로 설치할 수 있어요
                  </p>
                  <button
                    type="button"
                    onClick={handleAndroidInstall}
                    className="w-full rounded-2xl bg-basil-600 py-3.5 text-sm font-bold text-white shadow-md active:bg-basil-700"
                  >
                    앱 설치하기
                  </button>
                </>
              ) : (
                <>
                  <Step number={1} text={<>브라우저 우측 상단 <strong>⋮ 메뉴</strong>를 누르세요</>} />
                  <Step number={2} text={<><strong>"홈 화면에 추가"</strong> 또는 <strong>"앱 설치"</strong>를 선택하세요</>} />
                  <Step number={3} text={<><strong>"설치"</strong>를 누르면 완료!</>} />
                </>
              )}
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-center text-sm text-ink-soft">
                브라우저 메뉴에서 "홈 화면에 추가"를 선택하세요
              </p>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSnooze}
              className="flex-1 rounded-2xl border border-basil-200 py-3 text-sm font-semibold text-basil-600 active:bg-basil-50"
            >
              나중에
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-1 rounded-2xl border border-basil-100 py-3 text-sm text-ink-faint active:bg-basil-50"
            >
              다시 보지 않기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* --- 보조 컴포넌트 --- */

function Step({ number, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-basil-50 text-xs font-bold text-basil-700">
        {number}
      </span>
      <p className="text-sm leading-relaxed text-ink">{text}</p>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      className="mx-0.5 inline-block h-4 w-4 align-text-bottom text-basil-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
