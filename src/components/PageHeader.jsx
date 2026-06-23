// 각 페이지 상단 공통 헤더 (화이트 베이스 · 바질 그린 포인트)
export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="sticky top-0 z-10 border-b border-basil-100 bg-white/90 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-basil-500">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
    </header>
  );
}
