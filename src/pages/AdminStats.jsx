import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// 관리자 통계: 마운트 시 1회 getDocs로 가져와 클라이언트에서 집계.
// onSnapshot을 쓰지 않는다(캠프 규모 ~90명·4일이라 1회 조회로 충분, 읽기비용·부하 절감).
// events·tokens·pushLogs 읽기는 firestore.rules에서 이메일 관리자만 허용.
// 기본 기간: 캠프 일정
const CAMP_START = "2026-07-29";
const CAMP_END = "2026-08-01";

export default function AdminStats({ onBack, onLogout }) {
  const [data, setData] = useState(null); // { events, users, tokenCount, pushLogCount }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 이벤트 지표 기간 필터(day "YYYY-MM-DD" KST 기준). all=true면 전체.
  const [start, setStart] = useState(CAMP_START);
  const [end, setEnd] = useState(CAMP_END);
  const [all, setAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [evSnap, userSnap, tokenSnap, pushSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "tokens")),
        // pushLogs는 규칙 미배포 등으로 실패해도 나머지 지표는 보여준다
        getDocs(collection(db, "pushLogs")).catch(() => null),
      ]);
      setData({
        events: evSnap.docs.map((d) => d.data()),
        users: userSnap.docs.map((d) => d.data()),
        tokenCount: tokenSnap.size,
        pushLogCount: pushSnap ? pushSnap.size : null,
      });
    } catch (err) {
      console.error("stats load failed", err);
      setError("불러오지 못했습니다. 보안 규칙 배포 여부를 확인해주세요.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 이벤트 기반 지표만 기간 필터. users/tokens는 현재 상태값이라 필터하지 않는다.
  const filteredEvents = data
    ? all
      ? data.events
      : data.events.filter((e) => e.day && e.day >= start && e.day <= end)
    : null;
  const stats = data ? computeStats({ ...data, events: filteredEvents }) : null;

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
        <h1 className="text-base font-bold text-ink">통계</h1>
        <button type="button" onClick={onLogout} className="text-sm text-ink-faint">
          로그아웃
        </button>
      </div>

      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="w-full rounded-xl border border-basil-200 py-2.5 text-sm font-semibold text-basil-700 disabled:opacity-50"
      >
        {loading ? "불러오는 중…" : "새로고침"}
      </button>

      {error && <p className="text-sm text-basil-600">{error}</p>}

      {/* 기간 선택 (이벤트 지표만 적용) */}
      <div className="space-y-2 rounded-2xl border border-basil-100 bg-white p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-ink-faint">
            기간
          </p>
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            className={`rounded-full px-3 py-1 text-[12px] font-bold transition ${
              all
                ? "bg-basil-600 text-white"
                : "border border-basil-200 text-basil-600"
            }`}
          >
            전체
          </button>
        </div>
        <div
          className={`flex items-center gap-2 ${
            all ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-basil-100 bg-basil-50 px-3 py-2 text-sm text-ink"
          />
          <span className="shrink-0 text-ink-faint">~</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-basil-100 bg-basil-50 px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      {!loading && !error && stats && (
        <>
          {/* 개요 */}
          <Section title="개요">
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="참여자" value={`${stats.participants}명`} sub="닉네임 등록 기준" />
              <StatCard
                label="설치"
                value={`${stats.installs}명`}
                sub={`설치율 ${pct(stats.installs, stats.participants)}`}
              />
              <StatCard
                label="온보딩 완료율"
                value={pct(stats.participants, stats.totalUsers)}
                sub={`${stats.participants} / ${stats.totalUsers}`}
              />
              <StatCard
                label="푸시 권한 허용률"
                value={pct(stats.pushGranted, stats.pushAsked)}
                sub={`허용 ${stats.pushGranted} / 요청 ${stats.pushAsked}명`}
              />
              <StatCard label="등록 토큰" value={`${stats.tokenCount}개`} />
              <StatCard
                label="푸시 발송 로그"
                value={stats.pushLogCount === null ? "–" : `${stats.pushLogCount}건`}
              />
            </div>
            <BarList title="플랫폼 (고유 사용자)" rows={stats.platformRows} />
          </Section>

          {stats.events.length === 0 ? (
            <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
              {all
                ? "아직 이벤트 데이터가 없습니다."
                : "선택한 기간에 이벤트 데이터가 없습니다."}
            </p>
          ) : (
            <>
              {/* 일자별 */}
              <Section title="일자별">
                <div className="overflow-hidden rounded-2xl border border-basil-100 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-basil-100 bg-basil-50 text-left text-[12px] text-basil-600">
                        <th className="px-3 py-2 font-semibold">날짜</th>
                        <th className="px-3 py-2 text-right font-semibold">DAU</th>
                        <th className="px-3 py-2 text-right font-semibold">세션</th>
                        <th className="px-3 py-2 text-right font-semibold">화면 조회</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.daily.map((d) => (
                        <tr key={d.day} className="border-b border-basil-100 last:border-0">
                          <td className="px-3 py-2 text-ink">{d.day}</td>
                          <td className="px-3 py-2 text-right font-semibold text-ink">
                            {d.dau}
                          </td>
                          <td className="px-3 py-2 text-right text-ink-soft">
                            {d.sessions}
                          </td>
                          <td className="px-3 py-2 text-right text-ink-soft">
                            {d.pageViews}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* 핵심 행동 */}
              <Section title="핵심 행동">
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    label="조 편성 완료"
                    value={`${stats.teamAny}명`}
                    sub={`R1 ${stats.teamRounds[0]} · R2 ${stats.teamRounds[1]} · R3 ${stats.teamRounds[2]}`}
                  />
                  <StatCard
                    label="공지 열람"
                    value={`${stats.annViews}건`}
                    sub={`${stats.annViewers}명이 열람`}
                  />
                </div>
                <BarList title="라이브 링크 클릭" rows={stats.liveRows} />
                <BarList title="외부 링크 이동" rows={stats.externalRows} />
              </Section>

              {/* 리텐션 */}
              <Section title="리텐션">
                <BarList
                  rows={stats.retentionRows}
                  emptyText="아직 방문 데이터가 없습니다."
                />
              </Section>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* --- 집계 (순수 JS) --- */

const distinct = (arr) => new Set(arr).size;

function countBy(items, keyFn) {
  const map = new Map();
  items.forEach((it) => {
    const k = keyFn(it) ?? "기타";
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function computeStats({ events, users, tokenCount, pushLogCount }) {
  const totalUsers = users.length;
  const participants = users.filter((u) => u.nickname).length;

  const byName = (name) => events.filter((e) => e.name === name);

  // 설치: install_detected의 고유 uid
  const installs = distinct(byName("install_detected").map((e) => e.uid).filter(Boolean));

  // 플랫폼: uid별 마지막 관측 platform으로 고유 사용자 분해
  const uidPlatform = new Map();
  events.forEach((e) => {
    if (e.uid) uidPlatform.set(e.uid, e.platform ?? "other");
  });
  const platformCount = { ios: 0, android: 0, other: 0 };
  uidPlatform.forEach((p) => {
    platformCount[p in platformCount ? p : "other"] += 1;
  });
  const platformRows = [
    ["iOS", platformCount.ios],
    ["Android", platformCount.android],
    ["기타", platformCount.other],
  ];

  // 푸시 권한: push_permission 이벤트 기준 고유 uid
  const perm = byName("push_permission");
  const pushAsked = distinct(perm.map((e) => e.uid).filter(Boolean));
  const pushGranted = distinct(
    perm.filter((e) => e.params?.result === "granted").map((e) => e.uid).filter(Boolean)
  );

  // 일자별: DAU(app_open 고유 uid) · 세션(고유 sessionId) · 화면 조회(page_view 수)
  const days = [...new Set(events.map((e) => e.day).filter(Boolean))].sort();
  const daily = days.map((day) => {
    const dayEvents = events.filter((e) => e.day === day);
    return {
      day,
      dau: distinct(
        dayEvents.filter((e) => e.name === "app_open").map((e) => e.uid).filter(Boolean)
      ),
      sessions: distinct(dayEvents.map((e) => e.sessionId).filter(Boolean)),
      pageViews: dayEvents.filter((e) => e.name === "page_view").length,
    };
  });

  // 조 편성: users.teams 기준
  const teamRounds = [1, 2, 3].map(
    (n) => users.filter((u) => u.nickname && u.teams?.[`round${n}`]).length
  );
  const teamAny = users.filter(
    (u) => u.nickname && (u.teams?.round1 || u.teams?.round2 || u.teams?.round3)
  ).length;

  // 공지 열람 / 라이브 링크 / 외부 링크
  const annEvents = byName("announcement_view");
  const annViews = annEvents.length;
  const annViewers = distinct(annEvents.map((e) => e.uid).filter(Boolean));
  const liveRows = countBy(byName("live_link_click"), (e) => e.params?.type);
  const externalRows = countBy(byName("external_open"), (e) => e.params?.target);

  // 리텐션: uid별 방문 distinct day 수 → 1/2/3/4일+ 분포
  const uidDays = new Map();
  events.forEach((e) => {
    if (!e.uid || !e.day) return;
    if (!uidDays.has(e.uid)) uidDays.set(e.uid, new Set());
    uidDays.get(e.uid).add(e.day);
  });
  const buckets = [0, 0, 0, 0]; // 1일 / 2일 / 3일 / 4일+
  uidDays.forEach((set) => {
    buckets[Math.min(set.size, 4) - 1] += 1;
  });
  const retentionRows = [
    ["1일 방문", buckets[0]],
    ["2일 방문", buckets[1]],
    ["3일 방문", buckets[2]],
    ["4일+ 방문", buckets[3]],
  ];

  return {
    events,
    totalUsers,
    participants,
    installs,
    platformRows,
    pushAsked,
    pushGranted,
    tokenCount,
    pushLogCount,
    daily,
    teamRounds,
    teamAny,
    annViews,
    annViewers,
    liveRows,
    externalRows,
    retentionRows,
  };
}

function pct(a, b) {
  return b > 0 ? `${Math.round((a / b) * 100)}%` : "–";
}

/* --- 표시 컴포넌트 --- */

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-basil-100 bg-white p-3.5">
      <p className="text-[11px] font-semibold text-ink-faint">{label}</p>
      <p className="mt-1 text-xl font-bold text-title">{value}</p>
      {sub && <p className="mt-0.5 break-keep text-[11px] text-ink-faint">{sub}</p>}
    </div>
  );
}

// 라벨·수·막대 목록. rows: [label, count][]
function BarList({ title, rows, emptyText = "데이터가 없습니다." }) {
  const max = Math.max(...rows.map(([, c]) => c), 1);
  const total = rows.reduce((s, [, c]) => s + c, 0);
  return (
    <div className="rounded-2xl border border-basil-100 bg-white p-3.5">
      {title && <p className="mb-2 text-[11px] font-semibold text-ink-faint">{title}</p>}
      {total === 0 ? (
        <p className="text-sm text-ink-faint">{emptyText}</p>
      ) : (
        <div className="space-y-1.5">
          {rows.map(([label, count]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 break-keep text-[13px] text-ink">
                {label}
              </span>
              <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-basil-50">
                <div
                  className="h-full rounded-full bg-basil-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-ink">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
