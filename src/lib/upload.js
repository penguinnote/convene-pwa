import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// 이미지를 캔버스로 최대 가로 1280px로 리사이즈하고 JPEG 0.8로 압축한다.
// 이미지가 아니거나 처리에 실패하면 원본 파일을 그대로 반환한다.
export async function resizeImage(file, maxWidth = 1280, quality = 0.8) {
  if (!file.type?.startsWith("image/")) return file;
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const targetW = Math.min(img.width, maxWidth);
    const scale = targetW / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return file;
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

// 진행률 콜백과 함께 Storage에 업로드하고 { url, path }를 반환한다.
// 저장 경로: announcements/${타임스탬프}_${원본파일명}
export function uploadToStorage(file, onProgress) {
  const safeName = file.name.replace(/\s+/g, "_");
  const path = `announcements/${Date.now()}_${safeName}`;
  const task = uploadBytesResumable(ref(storage, path), file);
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        const pct = snap.totalBytes
          ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          : 0;
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}
