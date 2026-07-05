import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const MOKJANG_LIST = [
  "기쁨", "다소니", "마음", "밸리", "빛길", "사랑",
  "새벽", "새싹", "에끌", "토브", "프레쉬", "하품",
];

export default function Info() {
  const { user, nickname, mokjang, photoURL, saveProfile, uploadPhoto, removePhoto } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState(nickname);
  const [mok, setMok] = useState(mokjang);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  // 크롭 상태
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  useEffect(() => { setNick(nickname); }, [nickname]);
  useEffect(() => { setMok(mokjang); }, [mokjang]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    await saveProfile({ nickname: nick, mokjang: mok });
    setSaving(false);
    setEditing(false);
  }

  function handleCancel() {
    setNick(nickname);
    setMok(mokjang);
    setEditing(false);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((_, area) => {
    setCroppedArea(area);
  }, []);

  async function handleCropDone() {
    if (!cropSrc || !croppedArea) return;
    setUploading(true);
    setCropSrc(null);
    try {
      const blob = await getCroppedBlob(cropSrc, croppedArea);
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      await uploadPhoto(file);
    } catch {
      // 크롭/업로드 실패 무시
    }
    setUploading(false);
  }

  async function handleRemovePhoto() {
    setShowPhotoMenu(false);
    setUploading(true);
    try {
      await removePhoto();
    } catch {
      // 삭제 실패 무시
    }
    setUploading(false);
  }

  return (
    <div>
      <PageHeader eyebrow="INFO" title="정보" />

      {/* 크롭 모달 */}
      {cropSrc && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          style={{
            paddingTop: "max(0px, env(safe-area-inset-top))",
            paddingBottom: "max(0px, env(safe-area-inset-bottom))",
          }}
        >
          <div className="relative flex-1">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="shrink-0 bg-black px-6 pb-4 pt-3">
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mb-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-basil-400"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCropSrc(null)}
                className="flex-1 rounded-xl border border-white/30 py-3 text-sm font-medium text-white"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCropDone}
                className="flex-1 rounded-xl bg-basil-600 py-3 text-sm font-bold text-white"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 프로필 카드 */}
      <section className="px-5 py-5">
        <div className="relative rounded-2xl border border-basil-100 bg-white p-5">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="absolute right-4 top-4 text-xs font-medium text-basil-600"
            >
              수정
            </button>
          )}

          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="overflow-hidden rounded-full border-2 border-basil-200 bg-basil-50"
                style={{ width: 84, height: 84 }}
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-basil-300">
                    <DefaultAvatarIcon />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoMenu(true)}
                disabled={uploading}
                className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-basil-600 text-white shadow-sm disabled:opacity-50"
              >
                {uploading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <CameraIcon />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {showPhotoMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPhotoMenu(false)}
                  />
                  <div className="absolute -bottom-2 left-1/2 z-50 w-44 -translate-x-1/2 translate-y-full overflow-hidden rounded-xl border border-basil-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => { setShowPhotoMenu(false); fileRef.current?.click(); }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-ink"
                    >
                      사진 변경
                    </button>
                    {photoURL && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="w-full border-t border-basil-100 px-4 py-3 text-left text-sm font-medium text-red-500"
                      >
                        기본 이미지로 변경
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {editing ? (
              <div className="mt-4 w-full space-y-3">
                <div>
                  <label className="text-xs font-medium text-ink-faint">이름</label>
                  <input
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    maxLength={20}
                    className="mt-1 w-full rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-faint">목장</label>
                  <select
                    value={mok}
                    onChange={(e) => setMok(e.target.value)}
                    className="mt-1 w-full appearance-none rounded-xl border border-basil-200 bg-basil-50/50 px-3 py-2.5 text-sm text-ink outline-none focus:border-basil-500"
                  >
                    <option value="" disabled>선택</option>
                    {MOKJANG_LIST.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl border border-basil-200 py-2.5 text-sm font-medium text-ink-soft"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!nick.trim() || saving}
                    className="flex-1 rounded-xl bg-basil-600 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                  >
                    {saving ? "저장 중…" : "저장"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 text-lg font-bold text-title">{nickname || "이름 없음"}</p>
                {mokjang && (
                  <span className="mt-1.5 rounded-full bg-basil-50 px-3 py-1 text-xs font-semibold text-basil-600">
                    {mokjang}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 메뉴 */}
      <section className="px-5 pb-6">
        <h2 className="mb-3 px-1 text-[13px] font-bold uppercase tracking-wider text-basil-600">
          메뉴
        </h2>
        <div className="overflow-hidden rounded-2xl border border-basil-100 bg-white">
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="flex w-full items-center gap-3 border-b border-basil-100 px-4 py-4 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 text-basil-600">
              <BedIcon />
            </span>
            <span className="flex-1 font-bold text-title">방배정</span>
            <span className="text-basil-300">›</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="flex w-full items-center gap-3 border-b border-basil-100 px-4 py-4 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 text-basil-600">
              <MealIcon />
            </span>
            <span className="flex-1 font-bold text-title">식단표</span>
            <span className="text-basil-300">›</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/playlist")}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-basil-50 text-basil-600">
              <MusicIcon />
            </span>
            <span className="flex-1 font-bold text-title">플레이리스트</span>
            <span className="text-basil-300">›</span>
          </button>
        </div>
      </section>
    </div>
  );
}

async function getCroppedBlob(src, cropArea) {
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.crossOrigin = "anonymous";
    image.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, 512, 512
  );
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

/* --- 아이콘 --- */
const sw = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function DefaultAvatarIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" {...sw}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...sw} strokeWidth={2.2}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...sw}>
      <path d="M3 7v12M3 13h18v6M21 13v-2a3 3 0 0 0-3-3H9v5" />
      <circle cx="6.5" cy="10.5" r="1.5" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...sw}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...sw}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
