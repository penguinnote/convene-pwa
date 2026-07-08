const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// 전체 토큰에 data-only 푸시 발송 → 만료 토큰 정리 → 도달 로그 기록.
// 새 공지 생성(sendAnnouncement)과 수정 재발송(resendAnnouncement)이 공유한다.
async function sendToAllTokens({ title, body, id }) {
  const tokensSnap = await getFirestore().collection("tokens").get();
  const tokens = tokensSnap.docs.map((d) => d.id);
  if (tokens.length === 0) return;

  // data-only 페이로드로 전송 → FCM 자동 표시 없이 서비스워커가 단 한 번만 표시
  // (notification 필드를 같이 보내면 FCM 자동 표시 + onBackgroundMessage 중복 발생)
  // webpush Urgency:high → 삼성/안드로이드 절전 상태에서도 즉시 전달
  const res = await getMessaging().sendEachForMulticast({
    tokens,
    data: { title: String(title), body: String(body), id: String(id) },
    webpush: { headers: { Urgency: "high", TTL: "86400" } },
  });

  // 만료/무효 토큰 정리
  const dead = [];
  res.responses.forEach((r, i) => {
    if (!r.success) dead.push(tokens[i]);
  });
  await Promise.all(
    dead.map((t) => getFirestore().collection("tokens").doc(t).delete())
  );

  // 푸시 도달 로그 (분석은 Admin SDK로만 조회)
  await getFirestore().collection("pushLogs").doc(id).set({
    announcementId: id,
    sent: tokens.length,
    success: res.successCount,
    failure: res.failureCount,
    at: FieldValue.serverTimestamp(),
  });
}

// 새 공지 생성 → 항상 1회 푸시
exports.sendAnnouncement = onDocumentCreated(
  { document: "announcements/{id}", region: "asia-northeast3" },
  async (event) => {
    const data = event.data.data();
    await sendToAllTokens({ title: data.title, body: data.body, id: event.params.id });
  }
);

// 공지 수정 → resendAt가 새로 설정/갱신된 경우에만 1회 재발송.
// (고정 토글 등 resendAt를 건드리지 않는 수정은 푸시가 나가지 않는다.)
exports.resendAnnouncement = onDocumentUpdated(
  { document: "announcements/{id}", region: "asia-northeast3" },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (!after.resendAt) return; // 재발송 요청 없음
    // Timestamp 비교: 값이 그대로면 변화 없음 → return
    if (before?.resendAt?.toMillis?.() === after.resendAt.toMillis?.()) return;
    await sendToAllTokens({ title: after.title, body: after.body, id: event.params.id });
  }
);
