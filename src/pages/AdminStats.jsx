import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { INSTANCE } from "../config/instance";

// 관리자 통계: 마운트 시 1회 getDocs로 가져와 클라이언트에서 집계.
// onSnapshot을 쓰지 않는다(캠프 규모 ~90명·4일이라 1회 조회로 충분, 읽기비용·부하 절감).
// events·tokens·pushLogs 읽기는 firestore.rules에서 이메일 관리자만 허용.
// 기본 기간: 캠프 일정
const CAMP_START = "2026-07-29";
const CAMP_END = "2026-08-01";

const EXPECTED = INSTANCE.expectedParticipants ?? 0;

export default function AdminStats({ onBack, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [start, setStart] = useState(CAMP_START);
  const [end, setEnd] = useState(CAMP_END);
  const [all, setAll] = useState(false);
  const [mode, setMode] = useState("person"); // "uid" | "person"
  const [mergeOpen, setMergeOpen] = useState(false);
  const [excludeAdmins, setExcludeAdmins] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [evSnap, userSnap, tokenSnap, pushSnap, adminSnap, annSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "tokens")),
        getDocs(collection(db, "pushLogs")).catch(() => null),
        getDocs(collection(db, "admins")).catch(() => null),
        getDocs(collection(db, "announcements")).catch(() => null),
      ]);
      setData({
        events: evSnap.docs.map((d) => d.data()),
        users: userSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        tokens: tokenSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        tokenCount: tokenSnap.size,
        pushLogCount: pushSnap ? pushSnap.size : null,
        // admins 문서 ID = uid (useAuth.jsx:44)
        admins: adminSnap
          ? adminSnap.docs.map((d) => ({ uid: d.id, ...d.data() }))
          : null,
        announcements: annSnap
          ? annSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
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

  // --- 기간 필터 ---
  const filteredEvents = data
    ? all
      ? data.events
      : data.events.filter((e) => e.day && e.day >= start && e.day <= end)
    : null;

  // uid별 첫 app_open day (users에 createdAt이 없으므로 대용값)
  const uidFirstDay = data
    ? buildUidFirstDay(data.events)
    : new Map();

  // 운영진 uid 집합 (admins 문서 ID = uid)
  const adminUidSet = data?.admins
    ? new Set(data.admins.map((a) => a.uid))
    : new Set();

  // 기간 내 users 필터 (전체 모드면 전부 포함)
  const { filteredUsers, excludedByDateCount } = data
    ? filterUsersByPeriod(data.users, uidFirstDay, all, start, end)
    : { filteredUsers: [], excludedByDateCount: 0 };

  // 운영진 제외
  const { users: activeUsers, excludedAdminCount } = excludeAdmins
    ? filterOutAdmins(filteredUsers, adminUidSet)
    : { users: filteredUsers, excludedAdminCount: 0 };
  const allUsersCount = data
    ? data.users.filter((u) => u.nickname).length
    : 0;

  // 운영진 uid를 이벤트·병합에도 일관 적용하기 위한 제외 셋
  const excludeUidSet = excludeAdmins ? adminUidSet : new Set();

  // uid 기준 집계
  const uidStats = data
    ? computeStats({
        events: filteredEvents,
        users: activeUsers,
        tokenCount: data.tokenCount,
        pushLogCount: data.pushLogCount,
        admins: data.admins,
        announcements: data.announcements,
        excludeUidSet,
      })
    : null;

  // 사람 기준 집계
  const mergeResult = data ? buildIdentityMap(activeUsers) : null;
  const personStats =
    data && mergeResult
      ? computePersonStats({
          events: filteredEvents,
          users: activeUsers,
          tokenCount: data.tokenCount,
          pushLogCount: data.pushLogCount,
          admins: data.admins,
          announcements: data.announcements,
          uidToPersonId: mergeResult.uidToPersonId,
          persons: mergeResult.persons,
          excludeUidSet,
        })
      : null;

  const stats = mode === "person" ? personStats : uidStats;

  // 토큰 uid 기록 비율 (#5)
  const tokenUidRatio = data
    ? (() => {
        const withUid = data.tokens.filter((t) => t.uid).length;
        return { withUid, total: data.tokens.length };
      })()
    : null;

  // 공지당 도달 요약 (#4)
  const annReachSummary =
    stats && data ? computeAnnReachSummary(stats.annPerRows, data.announcements, stats.participants) : null;

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

      {/* 기간 선택 */}
      <div className="space-y-2 rounded-2xl border border-basil-100 bg-white p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-ink-faint">기간</p>
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
        {!all && excludedByDateCount > 0 && (
          <p className="text-[11px] text-ink-faint">
            ※ 기간 외 참여자 {excludedByDateCount}명 제외 (첫 app_open 이벤트 날짜 기준 대용값*)
          </p>
        )}
      </div>

      {/* uid/사람 토글 + 운영진 제외 토글 */}
      {!loading && !error && stats && (
        <div className="space-y-2">
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
          <div className="flex items-center justify-between rounded-xl border border-basil-100 bg-white px-3.5 py-2">
            <span className="text-[12px] text-ink-soft">
              운영진 제외 {excludedAdminCount > 0 && `(${excludedAdminCount}명)`}
            </span>
            <button
              type="button"
              onClick={() => setExcludeAdmins((v) => !v)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                excludeAdmins
                  ? "bg-basil-600 text-white"
                  : "border border-basil-200 text-basil-600"
              }`}
            >
              {excludeAdmins ? "ON" : "OFF"}
            </button>
          </div>
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
                    sub={`프로필 ${mergeResult.totalProfiles}건 → 사람 ${mergeResult.persons.length}명 (중복 ${mergeResult.totalProfiles - mergeResult.persons.length}건 병합)${
                      !all ? `\n기간 내 ${stats.participants}명 / 전체 ${allUsersCount}명` : ""
                    }`}
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
                    ? `닉네임 병합 기준${EXPECTED > 0 ? ` · 앱 사용률 ${pct(stats.participants, EXPECTED)}` : ""}`
                    : `닉네임 등록 기준${EXPECTED > 0 ? ` · 앱 사용률 ${pct(stats.participants, EXPECTED)}` : ""}`
                }
              />
              <StatCard
                label="설치율"
                value={pct(stats.installs, stats.participants)}
                sub={`참여자 ${stats.participants}명 중 ${stats.installs}명 설치${
                  EXPECTED > 0
                    ? `\n등록 명단 기준 ${pct(stats.installs, EXPECTED)}`
                    : ""
                }`}
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
                sub={`허용 ${stats.pushGranted} / 요청 ${stats.pushAsked}명${
                  EXPECTED > 0
                    ? `\n등록 명단 기준 ${pct(stats.pushGranted, EXPECTED)}`
                    : ""
                }`}
              />
              <StatCard label="등록 토큰" value={`${stats.tokenCount}개`}
                sub={tokenUidRatio ? `uid 기록 ${tokenUidRatio.withUid}/${tokenUidRatio.total}건 (${pct(tokenUidRatio.withUid, tokenUidRatio.total)})` : undefined}
              />
              <StatCard
                label="푸시 발송 로그"
                value={stats.pushLogCount === null ? "–" : `${stats.pushLogCount}건`}
              />
              <StatCard
                label="관리자"
                value={stats.admins === null ? "–" : `${stats.admins.length}명`}
                sub="로그인 기록 기준"
              />
              {excludeAdmins && excludedAdminCount > 0 && (
                <StatCard
                  label="운영진 제외"
                  value={`${excludedAdminCount}명`}
                  sub={`admins 컬렉션 uid 기준${
                    adminUidSet.size > excludedAdminCount
                      ? ` (닉네임 없는 운영진 ${adminUidSet.size - excludedAdminCount}명은 이미 참여자 밖)`
                      : ""
                  }`}
                />
              )}
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

            {/* 등록 명단 기준 비율 */}
            {EXPECTED > 0 && (
              <div className="rounded-2xl border border-basil-100 bg-white p-3.5">
                <p className="mb-2 text-[11px] font-semibold text-ink-faint">
                  등록 명단 {EXPECTED}명 기준
                </p>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <div>
                    <span className="text-ink-faint">앱 사용률</span>
                    <span className="ml-1 font-semibold text-ink">{pct(stats.participants, EXPECTED)}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint">설치율</span>
                    <span className="ml-1 font-semibold text-ink">{pct(stats.installs, EXPECTED)}</span>
                  </div>
                  <div>
                    <span className="text-ink-faint">3일+ 방문</span>
                    <span className="ml-1 font-semibold text-ink">
                      {pct(
                        (stats.retentionRows[2]?.[1] ?? 0) + (stats.retentionRows[3]?.[1] ?? 0),
                        EXPECTED,
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-faint">푸시 허용</span>
                    <span className="ml-1 font-semibold text-ink">{pct(stats.pushGranted, EXPECTED)}</span>
                  </div>
                </div>
              </div>
            )}
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

              {/* 공지당 도달 (#4) */}
              <Section title="공지당 도달">
                {annReachSummary ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="공지당 평균 열람자"
                        value={`${annReachSummary.avgViewers.toFixed(1)}명`}
                        sub={`중앙값 ${annReachSummary.medianViewers}명 · 전체 ${annReachSummary.totalAnn}건`}
                      />
                      <StatCard
                        label="공지당 평균 열람률"
                        value={annReachSummary.avgReachRate}
                        sub={`평균 열람자 / 참여자 ${stats.participants}명`}
                      />
                    </div>
                    {(annReachSummary.pinnedCount > 0 || annReachSummary.normalCount > 0) && (
                      <div className="grid grid-cols-2 gap-2">
                        {annReachSummary.pinnedCount > 0 && (
                          <StatCard
                            label="📌 고정 공지 평균"
                            value={`${annReachSummary.pinnedAvg.toFixed(1)}명`}
                            sub={`${annReachSummary.pinnedCount}건 · 상단 상시 노출`}
                          />
                        )}
                        {annReachSummary.normalCount > 0 && (
                          <StatCard
                            label="일반 공지 평균"
                            value={`${annReachSummary.normalAvg.toFixed(1)}명`}
                            sub={`${annReachSummary.normalCount}건`}
                          />
                        )}
                      </div>
                    )}
                    {annReachSummary.deletedViewers > 0 && (
                      <p className="text-[11px] text-ink-faint">
                        ※ 삭제된 공지 열람 {annReachSummary.deletedViewers}건은 평균에서 제외
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-basil-100 bg-white p-5 text-sm text-ink-soft">
                    공지 열람 데이터가 없습니다.
                  </p>
                )}
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
                          <span className="min-w-0 truncate text-ink">
                            {r.pinned && "📌 "}{r.title}
                          </span>
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
                {EXPECTED > 0 && (
                  <p className="text-[11px] text-ink-faint">
                    등록 명단 기준 3일+ 방문: {pct(
                      (stats.retentionRows[2]?.[1] ?? 0) + (stats.retentionRows[3]?.[1] ?? 0),
                      EXPECTED,
                    )}
                  </p>
                )}
              </Section>
            </>
          )}

          {/* 기간 필터 각주 */}
          {!all && (
            <p className="text-[10px] text-ink-faint">
              * users 문서에 생성 시각(createdAt)이 없어, 해당 uid의 첫 app_open 이벤트 날짜를 기간 판정 대용값으로 사용합니다.
              이벤트가 전혀 없는 사용자 {excludedByDateCount}명은 기간 내 분모에서 제외됐습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* === 기간별 users 필터 (#1) === */

// 전체 이벤트에서 uid별 첫 app_open 날짜를 추출 (users에 createdAt이 없으므로 대용값)
function buildUidFirstDay(allEvents) {
  const map = new Map(); // uid → earliest day
  allEvents.forEach((e) => {
    if (e.name === "app_open" && e.uid && e.day) {
      const prev = map.get(e.uid);
      if (!prev || e.day < prev) map.set(e.uid, e.day);
    }
  });
  return map;
}

// users를 기간 필터링. 기준일 = 첫 app_open day. 없으면 제외.
function filterUsersByPeriod(users, uidFirstDay, all, start, end) {
  if (all) return { filteredUsers: users, excludedByDateCount: 0 };
  const filtered = [];
  let excluded = 0;
  users.forEach((u) => {
    if (!u.nickname) { filtered.push(u); return; } // 닉네임 없는 유저는 어차피 참여자 아님
    const day = uidFirstDay.get(u.id);
    if (!day) { excluded += 1; return; } // 이벤트 없음 → 제외
    if (day >= start && day <= end) {
      filtered.push(u);
    } else {
      excluded += 1;
    }
  });
  return { filteredUsers: filtered, excludedByDateCount: excluded };
}

/* === 운영진 제외 (#2) === */

// admins 컬렉션 uid로 users 필터. 문서 ID = uid (useAuth.jsx:44 확인).
function filterOutAdmins(users, adminUidSet) {
  if (adminUidSet.size === 0) return { users, excludedAdminCount: 0 };
  const filtered = [];
  let count = 0;
  users.forEach((u) => {
    if (adminUidSet.has(u.id) && u.nickname) {
      count += 1; // 닉네임 있는 운영진만 카운트 (없으면 어차피 참여자 아님)
    } else {
      filtered.push(u);
    }
  });
  return { users: filtered, excludedAdminCount: count };
}

/* === Identity merge: nickname+mokjang 기준으로 uid를 사람(person)에 묶는다 === */

function normalizeStr(s) {
  if (!s) return "";
  return s.trim().replace(/\s+/g, " ").normalize("NFC").toLowerCase();
}

function buildIdentityMap(users) {
  const withNick = users.filter((u) => u.nickname);
  const totalProfiles = withNick.length;

  const groups = new Map();
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

  const uidToPersonId = new Map();
  const persons = [];
  let pid = 0;
  groups.forEach((g) => {
    const personId = `p${pid++}`;
    g.uids.forEach((uid) => uidToPersonId.set(uid, personId));
    persons.push({ personId, nickname: g.nickname, mokjang: g.mokjang, uids: g.uids });
  });

  const mergedGroups = [...groups.values()]
    .filter((g) => g.uids.length > 1)
    .sort((a, b) => b.uids.length - a.uids.length);

  return { uidToPersonId, persons, mergedGroups, totalProfiles };
}

/* === 공지당 도달 요약 (#4) === */

function computeAnnReachSummary(annPerRows, announcements, participants) {
  if (!annPerRows || annPerRows.length === 0) return null;

  const annMap = new Map((announcements ?? []).map((a) => [a.id, a]));

  // 삭제된 공지 분리
  const existing = [];
  let deletedViewers = 0;
  annPerRows.forEach((r) => {
    if (r.title === "(삭제된 공지)") {
      deletedViewers += r.viewers;
    } else {
      existing.push(r);
    }
  });

  if (existing.length === 0) return { totalAnn: 0, avgViewers: 0, medianViewers: 0, avgReachRate: "–", pinnedCount: 0, pinnedAvg: 0, normalCount: 0, normalAvg: 0, deletedViewers };

  const viewers = existing.map((r) => r.viewers);
  const avgViewers = viewers.reduce((s, v) => s + v, 0) / viewers.length;
  const sorted = [...viewers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianViewers = sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
  const avgReachRate = participants > 0 ? pct(Math.round(avgViewers), participants) : "–";

  // 고정 / 일반 분리
  const pinned = [];
  const normal = [];
  existing.forEach((r) => {
    const ann = annMap.get(r.id);
    if (ann?.pinned) {
      pinned.push(r.viewers);
    } else {
      normal.push(r.viewers);
    }
  });
  const pinnedAvg = pinned.length > 0 ? pinned.reduce((s, v) => s + v, 0) / pinned.length : 0;
  const normalAvg = normal.length > 0 ? normal.reduce((s, v) => s + v, 0) / normal.length : 0;

  return {
    totalAnn: existing.length,
    avgViewers,
    medianViewers,
    avgReachRate,
    pinnedCount: pinned.length,
    pinnedAvg,
    normalCount: normal.length,
    normalAvg,
    deletedViewers,
  };
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
  excludeUidSet,
}) {
  const byName = (name) => events.filter((e) => e.name === name && !excludeUidSet.has(e.uid));
  const participants = persons.length;
  const toPerson = (uid) => uidToPersonId.get(uid) ?? null;

  // 설치
  const standaloneUids = new Set(
    byName("app_open")
      .filter((e) => e.standalone === true && e.uid)
      .map((e) => e.uid)
  );
  const installedPersons = new Set();
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

  // 온보딩 완료율
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
  const onboardCompleted = visitedPersons.size;

  // 플랫폼
  const personPlatform = new Map();
  events.forEach((e) => {
    if (!e.uid || excludeUidSet.has(e.uid)) return;
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

  // 푸시 권한
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

  // 일자별
  const days = [...new Set(events.map((e) => e.day).filter(Boolean))].sort();
  const daily = days.map((day) => {
    const dayEvents = events.filter((e) => e.day === day);
    const dauPersons = new Set();
    dayEvents
      .filter((e) => e.name === "app_open" && e.uid && !excludeUidSet.has(e.uid))
      .forEach((e) => {
        const pid = toPerson(e.uid);
        if (pid) dauPersons.add(pid);
      });
    return {
      day,
      dau: dauPersons.size,
      sessions: distinct(dayEvents.filter((e) => !excludeUidSet.has(e.uid)).map((e) => e.sessionId).filter(Boolean)),
      pageViews: dayEvents.filter((e) => e.name === "page_view" && !excludeUidSet.has(e.uid)).length,
    };
  });

  // 조 편성
  const personTeams = new Map();
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

  // 공지 열람
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

  // 공지별 열람
  const annTitleMap = new Map((announcements ?? []).map((a) => [a.id, a]));
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
    .map(([id, r]) => {
      const ann = annTitleMap.get(id);
      return {
        id,
        title: ann?.title ?? "(삭제된 공지)",
        pinned: ann?.pinned ?? false,
        viewers: r.persons.size,
        total: r.total,
      };
    })
    .sort((a, b) => b.viewers - a.viewers || b.total - a.total);

  // 리텐션
  const personDays = new Map();
  events.forEach((e) => {
    if (!e.uid || !e.day || excludeUidSet.has(e.uid)) return;
    const pid = toPerson(e.uid);
    if (!pid) return;
    if (!personDays.has(pid)) personDays.set(pid, new Set());
    personDays.get(pid).add(e.day);
  });
  const buckets = [0, 0, 0, 0];
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

function computeStats({ events, users, tokenCount, pushLogCount, admins, announcements, excludeUidSet }) {
  const participants = users.filter((u) => u.nickname).length;

  const byName = (name) => events.filter((e) => e.name === name && !excludeUidSet.has(e.uid));

  const participantUids = new Set(users.filter((u) => u.nickname).map((u) => u.id));
  const installs = [
    ...new Set(
      byName("app_open")
        .filter((e) => e.standalone === true)
        .map((e) => e.uid)
        .filter(Boolean)
    ),
  ].filter((uid) => participantUids.has(uid)).length;

  const visitorUids = new Set(byName("app_open").map((e) => e.uid).filter(Boolean));
  const onboardVisitors = visitorUids.size;
  const onboardCompleted = [...visitorUids].filter((uid) => participantUids.has(uid)).length;

  const uidPlatform = new Map();
  events.forEach((e) => {
    if (e.uid && participantUids.has(e.uid) && !excludeUidSet.has(e.uid))
      uidPlatform.set(e.uid, e.platform ?? "other");
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

  const perm = byName("push_permission");
  const pushAsked = distinct(perm.map((e) => e.uid).filter(Boolean));
  const pushGranted = distinct(
    perm.filter((e) => e.params?.result === "granted").map((e) => e.uid).filter(Boolean)
  );

  const days = [...new Set(events.map((e) => e.day).filter(Boolean))].sort();
  const daily = days.map((day) => {
    const dayEvents = events.filter((e) => e.day === day && !excludeUidSet.has(e.uid));
    return {
      day,
      dau: distinct(
        dayEvents.filter((e) => e.name === "app_open").map((e) => e.uid).filter(Boolean)
      ),
      sessions: distinct(dayEvents.map((e) => e.sessionId).filter(Boolean)),
      pageViews: dayEvents.filter((e) => e.name === "page_view").length,
    };
  });

  const teamRounds = [1, 2, 3].map(
    (n) => users.filter((u) => u.nickname && u.teams?.[`round${n}`]).length
  );
  const teamAny = users.filter(
    (u) => u.nickname && (u.teams?.round1 || u.teams?.round2 || u.teams?.round3)
  ).length;

  const annEvents = byName("announcement_view");
  const annViews = annEvents.length;
  const annViewers = distinct(annEvents.map((e) => e.uid).filter(Boolean));
  const liveRows = countBy(byName("live_link_click"), (e) => e.params?.type);
  const externalRows = countBy(byName("external_open"), (e) => e.params?.target);

  const annTitleMap = new Map((announcements ?? []).map((a) => [a.id, a]));
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
    .map(([id, r]) => {
      const ann = annTitleMap.get(id);
      return {
        id,
        title: ann?.title ?? "(삭제된 공지)",
        pinned: ann?.pinned ?? false,
        viewers: r.uids.size,
        total: r.total,
      };
    })
    .sort((a, b) => b.viewers - a.viewers || b.total - a.total);

  const uidDays = new Map();
  events.forEach((e) => {
    if (!e.uid || !e.day || excludeUidSet.has(e.uid)) return;
    if (!uidDays.has(e.uid)) uidDays.set(e.uid, new Set());
    uidDays.get(e.uid).add(e.day);
  });
  const buckets = [0, 0, 0, 0];
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

function pct(a, b) {
  return b > 0 ? `${Math.round((a / b) * 100)}%` : "–";
}

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
      {sub && <p className="mt-0.5 whitespace-pre-line break-keep text-[11px] text-ink-faint">{sub}</p>}
    </div>
  );
}

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
