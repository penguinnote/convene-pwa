import { useNavigate, useLocation } from "react-router-dom";
import { useHomeData } from "../../hooks/useHomeData";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useFollowCount } from "../../hooks/useFollowCount";
import { schedule } from "../../data/schedule.js";
import { formatRelative } from "../../lib/time";
import { truncateTitle } from "../../lib/text";
import { firstImageUrl, firstFile } from "../../lib/blocks";
import { goToAnnouncement, goChild } from "../../lib/nav";

// "HH:MM" → 분(minute)
function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// 오늘(dayIndex) 일정 미리보기: 현재 순서부터 최대 6개.
// 남은 순서(현재~끝)가 6개 미만이면 지난 순서로 앞을 채워 항상 6개를 유지한다.
function todayPreview(dayIndex, now) {
  const items = schedule[dayIndex]?.items ?? [];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let curIdx = -1;
  items.forEach((it, i) => {
    if (timeToMin(it.time) <= nowMin) curIdx = i;
  });
  const remainStart = curIdx === -1 ? 0 : curIdx;
  const startIdx =
    items.length - remainStart >= 6 ? remainStart : Math.max(0, items.length - 6);
  return items.slice(startIdx, startIdx + 6).map((it, k) => {
    const idx = startIdx + k;
    return { ...it, now: idx === curIdx, past: curIdx !== -1 && idx < curIdx };
  });
}

// 데스크톱 홈 대시보드. 데이터·로직은 useHomeData(모바일 홈과 동일)에서 가져오고 배치만 재구성.
export default function DesktopHome() {
  const {
    topCard,
    pinned,
    note,
    now,
    dayIndex,
    liveCurrent,
    liveNext,
    liveLinkLabel,
    handleLink,
    handleEnablePush,
    permission,
  } = useHomeData();
  const navigate = useNavigate();
  const location = useLocation();

  const todayItems = todayPreview(dayIndex, now);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* 메인 */}
      <div className="space-y-6">
        <LiveWideCard
          current={liveCurrent}
          next={liveNext}
          note={note}
          linkLabel={liveLinkLabel}
          onLink={() => handleLink(liveCurrent?.link)}
          onOpenSchedule={() => goChild(navigate, location.pathname, "/schedule")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 왼쪽 열: 공지 + 자료실(세로로 쌓임) */}
          <div className="space-y-4">
            <section>
              <p className="mb-3 text-sm font-semibold text-ink">공지</p>
              {topCard ? (
                <AnnouncementCard
                  notice={topCard}
                  onClick={() =>
                    goToAnnouncement(navigate, location.pathname, topCard.id)
                  }
                />
              ) : (
                <div className="rounded-3xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
                  등록된 공지가 없습니다. 새 공지가 올라오면 여기에 표시됩니다.
                </div>
              )}
            </section>

            {/* 자료실(고정 공지) — 공지 카드 바로 밑, 같은 열 폭 */}
            {pinned && (
              <section>
                <p className="mb-3 text-sm font-semibold text-ink">자료실</p>
                <AnnouncementCard
                  notice={pinned}
                  hideTime
                  onClick={() => goToAnnouncement(navigate, location.pathname, pinned.id)}
                />
              </section>
            )}
          </div>

          {/* 오른쪽 열: 오늘 일정 미리보기 — 카드가 열 높이를 채워 밑단을 자료실과 맞춘다 */}
          <section className="flex flex-col">
            <p className="mb-3 text-sm font-semibold text-ink">오늘 일정</p>
            <TodaySchedule
              items={todayItems}
              onOpen={() => goChild(navigate, location.pathname, "/schedule")}
            />
          </section>
        </div>
      </div>

      {/* 정보 레일 (lg+; 좁은 폭에선 메인 아래로 접힘) */}
      <aside className="space-y-4">
        <ProfileCard onEdit={() => navigate("/info")} />

        {permission === "default" && (
          <button
            type="button"
            onClick={handleEnablePush}
            className="w-full rounded-2xl border border-basil-100 bg-basil-50 py-3 text-sm font-semibold text-basil-700"
          >
            알림 받기
          </button>
        )}

        <InfoShortcuts navigate={navigate} path={location.pathname} />
      </aside>
    </div>
  );
}

// 라이브 와이드 카드: 왼쪽 현재 순서 | 구분선 | 오른쪽 다음 일정 + 링크 칩
function LiveWideCard({ current, next, note, linkLabel, onLink, onOpenSchedule }) {
  return (
    <div className="rounded-3xl border border-basil-100 bg-basil-50 p-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:divide-x md:divide-basil-200">
        {/* 현재 */}
        <div className="md:pr-6">
          {current ? (
            <>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basil-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-basil-600" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-600">
                  지금 진행 중
                </p>
                {current.day && (
                  <span className="text-[11px] text-ink-faint">· {current.day}</span>
                )}
              </div>
              <p className="mt-2 break-keep text-2xl font-bold text-title">
                {current.rest ? "취침" : `${current.time} ${current.title}`}
              </p>
              {!current.rest && current.place && (
                <p className="mt-0.5 break-keep text-sm text-ink-soft">{current.place}</p>
              )}
              {note && (
                <p className="mt-3 break-keep rounded-xl border border-basil-100 bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-basil-700">
                  {note}
                </p>
              )}
              {linkLabel && (
                <button
                  type="button"
                  onClick={onLink}
                  className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-basil-600 px-3.5 py-1.5 text-[12px] font-semibold text-white"
                >
                  <span className="truncate">{linkLabel}</span>
                </button>
              )}
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-600">
                다음 일정
              </p>
              <p className="mt-2 break-keep text-2xl font-bold text-title">
                {next?.time} {next?.title}
              </p>
              {next?.place && (
                <p className="mt-0.5 break-keep text-sm text-ink-soft">{next.place}</p>
              )}
            </>
          )}
        </div>

        {/* 다음 */}
        <div className="md:pl-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basil-500">
            다음 일정
          </p>
          {next ? (
            <>
              <p className="mt-2 break-keep text-lg font-bold text-title">
                {next.time} {next.title}
              </p>
              {next.place && (
                <p className="mt-0.5 break-keep text-sm text-ink-soft">{next.place}</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-faint">예정된 다음 일정이 없습니다.</p>
          )}
          <button
            type="button"
            onClick={onOpenSchedule}
            className="mt-3 text-sm font-medium text-basil-600"
          >
            전체 일정 보기 ›
          </button>
        </div>
      </div>
    </div>
  );
}

// 오늘 일정 타임라인: 지난 순서는 흐리게, 현재는 "지금" 강조.
// flex 세로 + 버튼 mt-auto로 카드 밑단(버튼 줄)을 왼쪽 열(자료실) 밑단에 맞춘다.
function TodaySchedule({ items, onOpen }) {
  return (
    <div className="flex flex-1 flex-col rounded-3xl border border-basil-100 bg-white p-5">
      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">오늘 남은 순서가 없습니다.</p>
      ) : (
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  it.now ? "bg-basil-600" : it.past ? "bg-basil-100" : "bg-basil-200"
                }`}
              />
              <div className="min-w-0">
                <p
                  className={`flex items-center gap-2 text-[13px] font-bold ${
                    it.past ? "text-ink-faint" : "text-basil-600"
                  }`}
                >
                  {it.time}
                  {it.now && (
                    <span className="rounded-full bg-basil-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      지금
                    </span>
                  )}
                </p>
                <p
                  className={`break-keep text-sm ${
                    it.now
                      ? "font-semibold text-title"
                      : it.past
                        ? "text-ink-faint"
                        : "text-ink"
                  }`}
                >
                  {it.title}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={onOpen}
        className="mt-auto self-start pt-4 text-sm font-medium text-basil-600"
      >
        전체 일정 보기 ›
      </button>
    </div>
  );
}

// 공지 카드(데스크톱): 항상 강조 톤(2px) — 최신 공지가 주인공.
function AnnouncementCard({ notice, onClick, hideTime = false }) {
  const img = firstImageUrl(notice);
  const file = firstFile(notice);
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-3xl border-2 border-basil-500 bg-basil-50 p-5 text-left shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-basil-600 px-3 py-1 text-[11px] font-semibold text-white">
          공지
        </span>
        {!hideTime && (
          <span className="shrink-0 text-[11px] text-basil-400">
            {formatRelative(notice.createdAt)}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold leading-snug text-title">
            {truncateTitle(notice.title)}
          </h2>
          {notice.body && (
            <p className="mt-2 line-clamp-2 break-keep [overflow-wrap:anywhere] text-[15px] leading-relaxed text-ink-soft">
              {notice.body}
            </p>
          )}
          {file && (
            <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-basil-100 px-2.5 py-1 text-[12px] text-basil-700">
              <span className="truncate">{file.name}</span>
            </span>
          )}
        </div>
        {img && (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-basil-100">
            <img src={img} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </button>
  );
}

// 프로필 카드(정보 레일)
function ProfileCard({ onEdit }) {
  const { nickname, mokjang, photoURL } = useAuth();
  const follow = useFollowCount();
  return (
    <div className="rounded-3xl border border-basil-100 bg-white p-5">
      <div className="flex items-center gap-3">
        {photoURL ? (
          <img
            src={photoURL}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full border border-basil-100 object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-basil-50 text-xl font-bold text-basil-600">
            {nickname ? nickname.slice(0, 1) : "?"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-title">
            {nickname || "참가자"}
          </p>
          {mokjang && <p className="truncate text-sm text-ink-soft">{mokjang}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        팔로워 <span className="font-bold text-basil-600">{follow}</span> · 팔로잉{" "}
        <span className="font-bold text-basil-600">{follow}</span>
      </p>
      <button
        type="button"
        onClick={onEdit}
        className="mt-4 w-full rounded-xl border border-basil-200 py-2 text-sm font-semibold text-basil-700"
      >
        프로필 수정
      </button>
    </div>
  );
}

// INFO 바로가기 (모바일 정보 탭과 같은 순서 유지)
const INFO_LINKS = [
  { to: "/participants", label: "참여자" },
  { to: "/rooms", label: "방배정" },
  { to: "/playlist", label: "플레이리스트" },
  { to: "/menu", label: "식단표" },
  { to: "/team", label: "레크레이션" },
];

function InfoShortcuts({ navigate, path }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-basil-100 bg-white">
      <p className="px-5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-basil-500">
        info
      </p>
      <ul className="mt-1 pb-2">
        {INFO_LINKS.map((it) => (
          <li key={it.to}>
            <button
              type="button"
              onClick={() => goChild(navigate, path, it.to)}
              className="flex w-full items-center justify-between px-5 py-3 text-left text-[15px] text-ink transition-colors hover:bg-basil-50"
            >
              <span className="font-medium">{it.label}</span>
              <span className="text-basil-400">›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
