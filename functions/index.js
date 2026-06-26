const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

exports.sendAnnouncement = onDocumentCreated(
  { document: "announcements/{id}", region: "asia-northeast3" },
  async (event) => {
    const data = event.data.data();
    const tokensSnap = await getFirestore().collection("tokens").get();
    const tokens = tokensSnap.docs.map((d) => d.id);
    if (tokens.length === 0) return;

    // data-only 페이로드로 전송 → FCM 자동 표시 없이 서비스워커가 단 한 번만 표시
    // (notification 필드를 같이 보내면 FCM 자동 표시 + onBackgroundMessage 중복 발생)
    // webpush Urgency:high → 삼성/안드로이드 절전 상태에서도 즉시 전달
    const res = await getMessaging().sendEachForMulticast({
      tokens,
      data: { title: String(data.title), body: String(data.body), id: event.params.id },
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
  }
);
