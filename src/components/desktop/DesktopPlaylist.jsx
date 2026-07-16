import { logEvent } from "../../lib/track";
import { PLAYLIST_URL } from "../../pages/Playlist.jsx";

// 데스크톱 플레이리스트: 가운데 카드 + 큰 "플레이리스트 열기" 버튼(유튜브 새 탭).
export default function DesktopPlaylist() {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
        Playlist
      </p>
      <h1 className="mt-1 text-2xl font-bold text-title">플레이리스트</h1>
      <p className="mt-2 text-sm text-ink-soft">캠프 찬양 모음</p>

      <div className="mt-8 rounded-3xl border border-basil-100 bg-white p-8">
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          style={{ background: "#67BDDB" }}
        >
          <PlayIcon />
        </span>
        <p className="mt-4 text-lg font-bold text-title">유튜브에서 듣기</p>
        <button
          type="button"
          onClick={() => {
            logEvent("external_open", { target: "playlist" });
            window.open(PLAYLIST_URL, "_blank");
          }}
          className="mt-6 w-full rounded-2xl bg-basil-600 py-4 text-[15px] font-bold text-white"
        >
          플레이리스트 열기
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}
