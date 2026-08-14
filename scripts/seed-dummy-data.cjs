// -*- coding: utf-8 -*-
// 실제 참가자 데이터를 지우고, 데모/다음 인스턴스 준비용 더미 데이터를 채운다.
//
// 사전 준비
//   1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성"
//      다운로드한 JSON을 레포 루트에 serviceAccountKey.json 으로 저장한다.
//      (.gitignore에 이미 등록돼 있어 커밋되지 않는다.)
//   2. npm install firebase-admin
//   3. node scripts/seed-dummy-data.cjs
//
// Admin SDK를 사용하므로 Firestore 보안 규칙을 우회해 tokens/events/pushLogs처럼
// 클라이언트에서 삭제가 막힌 컬렉션도 함께 지운다. (firebase-admin v12+ 모듈형 API)

const path = require("path");
const { cert, initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "rodemcamp.firebasestorage.app",
});

const db = getFirestore();
const bucket = getStorage().bucket();

const COLLECTIONS_TO_WIPE = ["users", "announcements", "tokens", "events", "pushLogs", "config"];
const STORAGE_PREFIXES = ["profiles/", "announcements/"];

async function wipeFirestore() {
  for (const name of COLLECTIONS_TO_WIPE) {
    await db.recursiveDelete(db.collection(name));
    console.log(`삭제 완료: ${name}`);
  }
}

async function wipeStorage() {
  for (const prefix of STORAGE_PREFIXES) {
    const [files] = await bucket.getFiles({ prefix });
    await Promise.all(files.map((f) => f.delete().catch(() => {})));
    console.log(`Storage 삭제 완료: ${prefix} (${files.length}개)`);
  }
}

const MOKJANG = ["1목장", "2목장", "3목장", "4목장", "5목장", "6목장"];
const NAMES = [
  "김하나", "이도윤", "박서연", "최지우", "정하은", "강민준",
  "조은서", "윤지훈", "장서아", "임준서", "한다은", "오예준",
  "서주원", "신소율", "권현우", "배아린", "백승우", "허유진",
];

async function seedUsers(n = NAMES.length) {
  const batch = db.batch();
  for (let i = 0; i < n; i++) {
    const ref = db.collection("users").doc(`dummy-${i + 1}`);
    batch.set(ref, {
      nickname: NAMES[i % NAMES.length],
      mokjang: MOKJANG[i % MOKJANG.length],
      photoURL: null,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log(`더미 참가자 ${n}명 시드 완료`);
}

const ANNOUNCEMENTS = [
  { title: "환영합니다!", body: "캠프에 오신 것을 환영합니다. 이 앱에서 일정과 공지를 확인하실 수 있어요.", pinned: true },
  { title: "버스 탑승 안내", body: "복귀 버스는 각 조별로 안내된 시간에 탑승해주세요.", pinned: false },
  { title: "저녁 식사 시간 변경", body: "오늘 저녁 식사는 30분 앞당겨 진행됩니다.", pinned: false },
  { title: "우천 시 일정 안내", body: "야외 활동은 실내 강당으로 장소가 변경됩니다.", pinned: false },
  { title: "분실물 안내", body: "검은색 우산이 본관 로비에서 발견됐습니다. 관리자에게 문의해주세요.", pinned: false },
  { title: "폐회예배 안내", body: "마지막 날 폐회예배는 오전 10시 본관 강당에서 진행됩니다.", pinned: false },
];

async function seedAnnouncements() {
  const batch = db.batch();
  ANNOUNCEMENTS.forEach((a) => {
    const ref = db.collection("announcements").doc();
    batch.set(ref, {
      title: a.title,
      body: a.body,
      blocks: [{ type: "text", text: a.body }],
      pinned: a.pinned,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  console.log(`더미 공지 ${ANNOUNCEMENTS.length}건 시드 완료`);
}

(async () => {
  await wipeFirestore();
  await wipeStorage();
  await seedUsers();
  await seedAnnouncements();
  console.log("완료. config를 지웠으니 방배정은 정적 rooms.js로 자동 폴백된다.");
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
