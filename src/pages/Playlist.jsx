import PageHeader from "../components/PageHeader.jsx";

// 캠프 찬양 유튜브 플레이리스트
const PLAYLIST_URL =
  "https://youtube.com/playlist?list=PLZslkUTkp7CA&si=4cCL549DCTsvzQuL";

export default function Playlist() {
  return (
    <div>
      <PageHeader eyebrow="Playlist" title="플레이리스트" subtitle="캠프 찬양 모음" />

      <div className="px-5 py-6">
        <button
          type="button"
          onClick={() => window.open(PLAYLIST_URL, "_blank")}
          className="flex w-full items-center gap-4 rounded-2xl border border-basil-100 bg-basil-50 p-5 text-left"
        >
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ background: "#67BDDB" }}
          >
            <PlayIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block break-keep text-lg font-bold text-title">
              유튜브에서 듣기
            </span>
            <span className="mt-0.5 block break-keep text-sm text-ink-soft">
              캠프 찬양 플레이리스트를 새 탭에서 엽니다
            </span>
          </span>
          <span className="shrink-0 text-basil-600">›</span>
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}
