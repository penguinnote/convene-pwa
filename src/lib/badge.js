// 읽지 않은 공지 수를 IndexedDB에 저장하는 헬퍼.
// 서비스워커(src/sw.js)와 앱(src/App.jsx)이 같은 DB/스토어를 공유한다.
// 미지원 환경에서도 에러가 나지 않도록 모두 try/catch로 감싼다.
const DB_NAME = "camp-badge";
const STORE = "kv";
const KEY = "unread";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getBadgeCount() {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result ?? 0);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return 0;
  }
}

export async function setBadgeCount(count) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(count, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // IndexedDB 미지원/실패는 무시
  }
}

export async function incrementBadgeCount() {
  const next = (await getBadgeCount()) + 1;
  await setBadgeCount(next);
  return next;
}
