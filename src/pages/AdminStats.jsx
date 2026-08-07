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
  // uid 기준 / 사람 기준 토글. 기본값은 사람 기준.
  const [mode, setMode] = useState("person"); // "uid" | "person"
  // 병합 내역 접이식 펼침 상태
  const [mergeOpen, setMergeOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [evSnap, userSnap, tokenSnap, pushSnap, adminSnap, annSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "tokens")),
        // pushLogs·admins·announcements는 실패해도 나머지 지표는 보여준다
        getDocs(collection(db, "pushLogs")).catch(() => null),
        getDocs(collection(db, "admins")).catch(() => null),
        getDocs(collection(db, "announcements")).catch(() => null),
      ]);
      setData({
        events: evSnap.docs.map((d) => d.data()),
        users: userSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        tokenCount: tokenSnap.size,
        pushLogCount: pushSnap ? pushSnap.size : null,
        admins: adminSnap ? adminSnap.docs.map((d) => d.data()) : null,
        announcements: annSnap
          ? annSnap.docs.map((d) => ({ id: d.id, title: d.data().title }))
          : [],
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

  // uid 기준 집계 (기존)
  const uidStats = data ? computeStats({ ...data, events: filteredEvents }) : null;
  // 사람 기준 집계 (병합)
  const mergeResult = data ? buildIdentityMap(data.users) : null;
  const personStats =
    data && mergeResult
      ? computePersonStats({
          ...data,
          events: filteredEvents,
          uidToPersonId: mergeResult.uidToPersonId,
          persons: mergeResult.persons,
        })
      : null;

  const stats = mode === "person" ? personStats : uidStats;

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

      {/* uid/사람 기준 토글 */}
      {!loading && !error && stats && (
        <div className="flex gap-1 rounded-xl border border-basil-100 bg-basil-50 p-1">
          {[
            { key: "person", label: "사람 기준(닉네임 병합)" },
            { key: "uid", label: "uid 기준" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMode(opt.key)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-[12px] font-bold transition ${
                mode === opt.key
                  ? "bg-white text-basil-700 shadow-sm"
                  : "text-ink-faint"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* 개요 */}
          <Section title="개요">
            {/* 사람 기준일 때 병합 요약 + 미식별 설치 카드 */}
            {mode === "person" && mergeResult && personStats && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    label="병합 요약"
                    value={`${mergeResult.persons.length}명`}
                    sub={`프로필 ${mergeResult.totalProfiles}건 → 사람 ${mergeResult.persons.length}명 (중복 ${mergeResult.totalProfiles - mergeResult.persons.length}건 병합)`}
                  />
                  {personStats.unidentifiedInstalls > 0 && (
                    <StatCard
                      label="미식별 설치"
                      value={`${personStats.unidentifiedInstalls}개`}
                      sub="프로필 미등록 설치 uid"
                    />
                  )}
                </div>
                {/* 병합 내역 접이식 */}
                <div className="rounded-2xl border border-basil-100 bg-white">
                  <button
                    type="button"
                    onClick={() => setMergeOpen((v) => !v)}
                    className="flex w-full items-center justify-between p-3.5 text-left"
                  >
                    <span className="text-[11px] font-semibold text-ink-faint">
                      병합 내역 ({mergeResult.mergedGroups.length}건 다중 uid)
                    </span>
                    <span className="text-[12px] text-ink-faint">
                      {mergeOpen ? "▲ 접기" : "▼ 펼치기"}
                    </span>
                  </button>
                  {mergeOpen && (
                    <div className="border-t border-basil-100 p-3.5">
                      {mergeResult.mergedGroups.length === 0 ? (
                        <p className="text-[12px] text-ink-faint">
                          다중 uid로 병합된 사람이 없습니다.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {mergeResult.mergedGroups.map((g) => (
                            <li
                              key={g.key}
                              className="rounded-xl border border-basil-50 bg-basil-50/50 p-2.5"
                            >
                              <p className="text-[13px] font-semibold text-ink">
                                {g.nickname}
                                {g.mokjang && (
                                  <span className="ml-1 text-ink-faint">
                                    ({g.mokjang})
                                  </span>
                                )}
                                <span className="ml-2 text-[11px] font-normal text-basil-600">
                                  uid {g.uids.length}개
                                </span>
                              </p>
                              <div className="mt-1 space-y-0.5">
                                {g.uids.map((uid) => (
                                  <p
                                    key={uid}
                                    className="truncate font-mono text-[11px] text-ink-faint"
                                  >
                                    {uid}
                                  </p>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <StatCard
                label="참여자"
                value={`${stats.participants}명`}
                sub={
                  mode === "person"
                    ? "닉네임 병합 기준"
                    : "닉네임 등록 기준"
                }
              />
              <StatCard
                label="설치율"
                value={pct(stats.installs, stats.participants)}
                sub={`참여자 ${stats.participants}명 중 ${stats.installs}명 설치`}
              />
              <StatCard
                label="온보딩 완료율"
                value={pct(stats.onboardCompleted, stats.onboardVisitors)}
                sub={
                  mode === "person"
                    ? `완료 ${stats.onboardCompleted} / 방문 ${stats.onboardVisitors}${
                        personStats?.unidentifiedVisitors
                          ? ` (미식별 ${personStats.unidentifiedVisitors} 포함)`
                          : ""
                      }`
                    : `완료 ${stats.onboardCompleted} / 방문 ${stats.onboardVisitors}`
                }
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
              <StatCard
                label="관리자"
                value={stats.admins === null ? "–" : `${stats.admins.length}명`}
                sub="로그인 기록 기준"
              />
            </div>
            {stats.admins?.length > 0 && (
              <div className="rounded-2xl border border-basil-100 bg-white p-3.5">
                <p className="mb-1.5 text-[11px] font-semibold text-ink-faint">
                  관리자 로그인
                </p>
                <ul className="space-y-1">
                  {stats.admins.map((a) => (
                    <li
                      key={a.email}
                      className="flex items-center justify-between gap-2 text-[13px]"
                    >
                      <span className="min-w-0 truncate text-ink">{a.email}</span>
                      <span className="shrink-0 text-ink-faint">
                        {fmtTs(a.lastLoginAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <BarList title="플랫폼 (참여자 기준)" rows={stats.platformRows} />
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

              {/* 공지별 열람 */}
              <Section title="공지별 열람">
                {stats.annPerRows.length === 0 ? (
                  <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
                    아직 열람 기록이 없습니다.
                  </p>
                ) : (
                  <div className="rounded-2xl border border-basil-100 bg-white p-3.5">
                    <ul className="space-y-1.5">
                      {stats.annPerRows.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between gap-2 text-[13px]"
                        >
                          <span className="min-w-0 truncate text-ink">{r.title}</span>
                          <span className="shrink-0 text-ink-faint">
                            열람 {r.viewers}명 · 총 {r.total}회
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

/* === Identity merge: nickname+mokjang 기준으로 uid를 사람(person)에 묶는다 === */

// 정규화: trim, 연속 공백→하나, NFC, 영문 소문자
function normalizeStr(s) {
  if (!s) return "";
  return s.trim().replace(/\s+/g, " ").normalize("NFC").toLowerCase();
}

// users 문서 배열 → { uidToPersonId, persons, mergedGroups, totalProfiles }
function buildIdentityMap(users) {
  const withNick = users.filter((u) => u.nickname);
  const totalProfiles = withNick.length;

  // 병합 키: 정규화 nickname + mokjang. mokjang 없으면 nickname 단독.
  const groups = new Map(); // key → { nickname, mokjang, uids[] }
  withNick.forEach((u) => {
    const nn = normalizeStr(u.nickname);
    const mj = normalizeStr(u.mokjang || "");
    const key = mj ? `${nn}|${mj}` : nn;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        nickname: u.nickname.trim(),
        mokjang: (u.mokjang || "").trim(),
        uids: [],
      });
    }
    groups.get(key).uids.push(u.id);
  });

  // uid → personId 매핑
  const uidToPersonId = new Map();
  const persons = []; // { personId, nickname, mokjang, uids[] }
  let pid = 0;
  groups.forEach((g) => {
    const personId = `p${pid++}`;
    g.uids.forEach((uid) => uidToPersonId.set(uid, personId));
    persons.push({ personId, nickname: g.nickname, mokjang: g.mokjang, uids: g.uids });
  });

  // 다중 uid 그룹만 추출 (병합 내역 표시용), uid 수 내림차순
  const mergedGroups = [...groups.values()]
    .filter((g) => g.uids.length > 1)
    .sort((a, b) => b.uids.length - a.uids.length);

  return { uidToPersonId, persons, mergedGroups, totalProfiles };
}

/* === 사람 단위 집계 === */

function computePersonStats({
  events,
  users,
  tokenCount,
  pushLogCount,
  admins,
  announcements,
  uidToPersonId,
  persons,
}) {
  const byName = (name) => events.filter((e) => e.name === name);
  const participants = persons.length;

  // uid → personId 변환 헬퍼. 매핑 없는 uid는 null 반환.
  const toPerson = (uid) => uidToPersonId.get(uid) ?? null;

  // 설치: person에 속한 uid 중 하나라도 standalone app_open이 있으면 설치.
  const standaloneUids = new Set(
    byName("app_open")
      .filter((e) => e.standalone === true && e.uid)
      .map((e) => e.uid)
  );
  const installedPersons = new Set();
  // 미식별 설치: standalone이지만 uidToPersonId에 없는 uid
  const unidentifiedInstallUids = new Set();
  standaloneUids.forEach((uid) => {
    const pid = toPerson(uid);
    if (pid) {
      installedPersons.add(pid);
    } else {
      unidentifiedInstallUids.add(uid);
    }
  });
  const installs = installedPersons.size;
  const unidentifiedInstalls = unidentifiedInstallUids.size;

  // 온보딩 완료율:
  // 방문 person = app_open uid 중 person에 매핑되는 것 + 미식별 uid는 각각 1인
  const visitorUids = new Set(byName("app_open").map((e) => e.uid).filter(Boolean));
  const visitedPersons = new Set();
  let unidentifiedVisitors = 0;
  visitorUids.forEach((uid) => {
    const pid = toPerson(uid);
    if (pid) {
      visitedPersons.add(pid);
    } else {
      unidentifiedVisitors += 1;
    }
  });
  const onboardVisitors = visitedPersons.size + unidentifiedVisitors;
  // 온보딩 완료 = 닉네임 등록 person (= persons 전체, 이미 닉네임이 있는 uid만 병합했으므로)
  // 방문한 person 중 닉네임이 있는 person
  const onboardCompleted = visitedPersons.size;

  // 플랫폼: person별 마지막 관측 platform
  const personPlatform = new Map();
  events.forEach((e) => {
    if (!e.uid) return;
    const pid = toPerson(e.uid);
    if (pid) personPlatform.set(pid, e.platform ?? "other");
  });
  const platformCount = { ios: 0, android: 0, other: 0 };
  personPlatform.forEach((p) => {
    platformCount[p in platformCount ? p : "other"] += 1;
  });
  const platformRows = [
    ["iOS", platformCount.ios],
    ["Android", platformCount.android],
    ["기타", platformCount.other],
  ];

  // 푸시 권한: person 단위
  const perm = byName("push_permission");
  const askedPersons = new Set();
  const grantedPersons = new Set();
  perm.forEach((e) => {
    if (!e.uid) return;
    const pid = toPerson(e.uid);
    if (!pid) return;
    askedPersons.add(pid);
    if (e.params?.result === "granted") grantedPersons.add(pid);
  });
  const pushAsked = askedPersons.size;
  const pushGranted = grantedPersons.size;

  // 일자별: DAU는 person 단위
  const days = [...new Set(events.map((e) => e.day).filter(Boolean))].sort();
  const daily = days.map((day) => {
    const dayEvents = events.filter((e) => e.day === day);
    const dauPersons = new Set();
    dayEvents
      .filter((e) => e.name === "app_open" && e.uid)
      .forEach((e) => {
        const pid = toPerson(e.uid);
        if (pid) dauPersons.add(pid);
      });
    return {
      day,
      dau: dauPersons.size,
      sessions: distinct(dayEvents.map((e) => e.sessionId).filter(Boolean)),
      pageViews: dayEvents.filter((e) => e.name === "page_view").length,
    };
  });

  // 조 편성: person 단위 (person에 속한 uid 중 하나라도 teams가 있으면 완료)
  const personTeams = new Map(); // personId → { round1, round2, round3 }
  users.forEach((u) => {
    if (!u.nickname) return;
    const pid = toPerson(u.id);
    if (!pid) return;
    if (!personTeams.has(pid)) personTeams.set(pid, { round1: false, round2: false, round3: false });
    const t = personTeams.get(pid);
    if (u.teams?.round1) t.round1 = true;
    if (u.teams?.round2) t.round2 = true;
    if (u.teams?.round3) t.round3 = true;
  });
  const teamRounds = [1, 2, 3].map(
    (n) => [...personTeams.values()].filter((t) => t[`round${n}`]).length
  );
  const teamAny = [...personTeams.values()].filter(
    (t) => t.round1 || t.round2 || t.round3
  ).length;

  // 공지 열람: person 단위
  const annEvents = byName("announcement_view");
  const annViews = annEvents.length;
  const annViewerPersons = new Set();
  annEvents.forEach((e) => {
    if (!e.uid) return;
    const pid = toPerson(e.uid);
    if (pid) annViewerPersons.add(pid);
  });
  const annViewers = annViewerPersons.size;

  const liveRows = countBy(byName("live_link_click"), (e) => e.params?.type);
  const externalRows = countBy(byName("external_open"), (e) => e.params?.target);

  // 공지별 열람: person 단위
  const annTitle = new Map((announcements ?? []).map((a) => [a.id, a.title]));
  const annById = new Map();
  annEvents.forEach((e) => {
    const id = e.params?.id;
    if (!id) return;
    if (!annById.has(id)) annById.set(id, { total: 0, persons: new Set() });
    const rec = annById.get(id);
    rec.total += 1;
    if (e.uid) {
      const pid = toPerson(e.uid);
      if (pid) rec.persons.add(pid);
    }
  });
  const annPerRows = [...annById.entries()]
    .map(([id, r]) => ({
      id,
      title: annTitle.get(id) ?? "(삭제된 공지)",
      viewers: r.persons.size,
      total: r.total,
    }))
    .sort((a, b) => b.viewers - a.viewers || b.total - a.total);

  // 리텐션: person별 방문 distinct day 수
  const personDays = new Map();
  events.forEach((e) => {
    if (!e.uid || !e.day) return;
    const pid = toPerson(e.uid);
    if (!pid) return;
    if (!personDays.has(pid)) personDays.set(pid, new Set());
    personDays.get(pid).add(e.day);
  });
  const buckets = [0, 0, 0, 0]; // 1일 / 2일 / 3일 / 4일+
  personDays.forEach((set) => {
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
    participants,
    onboardVisitors,
    onboardCompleted,
    unidentifiedVisitors,
    installs,
    unidentifiedInstalls,
    platformRows,
    pushAsked,
    pushGranted,
    tokenCount,
    pushLogCount,
    admins: admins ?? null,
    daily,
    teamRounds,
    teamAny,
    annViews,
    annViewers,
    annPerRows,
    liveRows,
    externalRows,
    retentionRows,
  };
}

/* --- 집계 (순수 JS, uid 기준 — 기존) --- */

const distinct = (arr) => new Set(arr).size;

function countBy(items, keyFn) {
  const map = new Map();
  items.forEach((it) => {
    const k = keyFn(it) ?? "기타";
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function computeStats({ events, users, tokenCount, pushLogCount, admins, announcements }) {
  const participants = users.filter((u) => u.nickname).length;

  const byName = (name) => events.filter((e) => e.name === name);

  // 설치: app_open 중 standalone(설치 실행)인 고유 uid ∩ 현재 참여자.
  // 설치당 1회인 install_detected와 달리 앱을 열 때마다 찍히므로,
  // 이벤트를 지워도 사용자가 앱을 다시 열면 자동 회복된다. 삭제된 유저는 분자에서 자동 제외.
  const participantUids = new Set(users.filter((u) => u.nickname).map((u) => u.id));
  const installs = [
    ...new Set(
      byName("app_open")
        .filter((e) => e.standalone === true)
        .map((e) => e.uid)
        .filter(Boolean)
    ),
  ].filter((uid) => participantUids.has(uid)).length;

  // 온보딩 완료율: 앱을 연 방문자(app_open 고유 uid) 중 온보딩(닉네임 등록)까지 마친 비율.
  // users 문서는 온보딩해야 생기므로 전체 users를 분모로 쓰면 항상 100%라 의미가 없다.
  const visitorUids = new Set(byName("app_open").map((e) => e.uid).filter(Boolean));
  const onboardVisitors = visitorUids.size;
  const onboardCompleted = [...visitorUids].filter((uid) => participantUids.has(uid)).length;

  // 플랫폼: 현재 참여자 uid별 마지막 관측 platform으로 분해.
  // 삭제된 유저·유령 uid를 제외해 합계가 참여자 수를 넘지 않는다.
  const uidPlatform = new Map();
  events.forEach((e) => {
    if (e.uid && participantUids.has(e.uid)) uidPlatform.set(e.uid, e.platform ?? "other");
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

  // 공지별 열람: params.id별 열람 인원(고유 uid)·총 열람 횟수. 제목은 announcements에서 매핑.
  const annTitle = new Map((announcements ?? []).map((a) => [a.id, a.title]));
  const annById = new Map();
  annEvents.forEach((e) => {
    const id = e.params?.id;
    if (!id) return;
    if (!annById.has(id)) annById.set(id, { total: 0, uids: new Set() });
    const rec = annById.get(id);
    rec.total += 1;
    if (e.uid) rec.uids.add(e.uid);
  });
  const annPerRows = [...annById.entries()]
    .map(([id, r]) => ({
      id,
      title: annTitle.get(id) ?? "(삭제된 공지)",
      viewers: r.uids.size,
      total: r.total,
    }))
    .sort((a, b) => b.viewers - a.viewers || b.total - a.total);

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
    participants,
    onboardVisitors,
    onboardCompleted,
    installs,
    platformRows,
    pushAsked,
    pushGranted,
    tokenCount,
    pushLogCount,
    admins: admins ?? null, // 현재 상태값 — 날짜 필터 대상 아님
    daily,
    teamRounds,
    teamAny,
    annViews,
    annViewers,
    annPerRows,
    liveRows,
    externalRows,
    retentionRows,
  };
}

function pct(a, b) {
  return b > 0 ? `${Math.round((a / b) * 100)}%` : "–";
}

// Firestore Timestamp → "M. D. HH:mm" (없으면 빈 문자열)
function fmtTs(ts) {
  const d = ts?.toDate?.();
  if (!d) return "";
  return d.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
