import PageHeader from "../components/PageHeader.jsx";
import { menu } from "../data/menu.js";

export default function Menu() {
  // 식단이 하나도 입력되지 않았으면(내용 미정) 일자 카드 대신 안내만 보여준다.
  const allEmpty = menu.every((day) => day.meals.length === 0);

  return (
    <div>
      <PageHeader eyebrow="Menu" title="식단표" subtitle="일자별 식사 메뉴" />

      <div className="space-y-4 px-5 py-5">
        {allEmpty ? (
          <div className="rounded-2xl border border-basil-100 bg-white px-4 py-10 text-center">
            <p className="font-bold text-title">식단표는 곧 공개됩니다</p>
            <p className="mt-1.5 text-sm text-ink-faint">
              메뉴가 확정되면 이곳에서 확인할 수 있어요.
            </p>
          </div>
        ) : (
          menu.map((day) => (
            <div key={day.day} className="rounded-2xl border border-basil-100 bg-white p-5">
              <p className="text-base font-bold text-title">{day.day}</p>

              {day.meals.length === 0 ? (
                <p className="mt-2 text-sm text-ink-faint">준비 중입니다.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {day.meals.map((meal) => (
                    <div key={meal.type}>
                      <span
                        className={`inline-block rounded-full bg-basil-50 px-3 py-1 text-[13px] font-bold ${
                          meal.type === "저녁" ? "text-title" : "text-basil-600"
                        }`}
                      >
                        {meal.type} 식사
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {meal.items.map((item) => (
                          <span
                            key={item}
                            className="break-keep rounded-lg border border-basil-100 bg-white px-[11px] py-[5px] text-sm text-ink"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
