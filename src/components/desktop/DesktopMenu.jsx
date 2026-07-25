import { menu } from "../../data/menu.js";

// 데스크톱 식단표: 일자별 카드(아침/점심/저녁)를 넓게. 전부 비어 있으면 "곧 공개" 안내만.
export default function DesktopMenu() {
  const allEmpty = menu.every((day) => day.meals.length === 0);

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-basil-600">
          Menu
        </p>
        <h1 className="mt-1 text-2xl font-bold text-title">식단표</h1>
      </div>

      {allEmpty ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-basil-100 bg-white px-6 py-14 text-center">
          <p className="text-lg font-bold text-title">식단표는 곧 공개됩니다</p>
          <p className="mt-2 text-sm text-ink-faint">
            메뉴가 확정되면 이곳에서 확인할 수 있어요.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {menu.map((day) => (
            <div key={day.day} className="rounded-2xl border border-basil-100 bg-white p-6">
              <p className="text-lg font-bold text-title">{day.day}</p>

              {day.meals.length === 0 ? (
                <p className="mt-3 text-sm text-ink-faint">준비 중입니다.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {day.meals.map((meal) => (
                    <div key={meal.type}>
                      <span className="rounded-full bg-basil-50 px-2.5 py-1 text-xs font-semibold text-basil-600">
                        {meal.type}
                      </span>
                      <p className="mt-1.5 break-keep text-sm leading-relaxed text-ink-soft">
                        {meal.items.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
