import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// SW 업데이트 후 옛 청크가 사라져 동적 import가 실패하면(ChunkLoadError)
// 새 빌드를 받기 위해 한 번만 새로고침한다. sessionStorage 플래그로 무한루프 방지.
function reloadOnceForChunkError() {
  const KEY = "chunk-reload";
  function isChunkError(message) {
    return (
      /ChunkLoadError/i.test(message) ||
      /Loading chunk [\d]+ failed/i.test(message) ||
      /Failed to fetch dynamically imported module/i.test(message) ||
      /error loading dynamically imported module/i.test(message) ||
      /Importing a module script failed/i.test(message)
    );
  }
  function handle(message) {
    if (!isChunkError(String(message || ""))) return;
    if (sessionStorage.getItem(KEY)) return; // 이미 한 번 새로고침함
    sessionStorage.setItem(KEY, "1");
    location.reload();
  }
  window.addEventListener("error", (e) => handle(e?.message));
  window.addEventListener("unhandledrejection", (e) =>
    handle(e?.reason?.message ?? e?.reason)
  );
  // 정상 로드되면 플래그를 비워 다음 실패에도 다시 새로고침할 수 있게 함
  window.addEventListener("load", () => sessionStorage.removeItem(KEY));
}
reloadOnceForChunkError();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
