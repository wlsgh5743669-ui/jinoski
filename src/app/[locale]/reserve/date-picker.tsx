"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContent } from "@/lib/use-content";
import { useLocale } from "next-intl";
import { HOLIDAYS, HOLIDAY_NAMES } from "@/config/lift-rental";

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 4월~10월(비시즌)에는 다가오는 12월(시즌 시작)을 기본으로 보여주고,
// 11월~3월(시즌 중)에는 실제 이번 달을 그대로 보여줍니다.
function getDefaultViewDate(today: Date): Date {
  const month = today.getMonth();
  const isOffSeason = month >= 3 && month <= 9;
  if (isOffSeason) {
    return new Date(today.getFullYear(), 11, 1);
  }
  return today;
}

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (dateKey: string) => void;
}) {
  const { datePicker } = useContent();
  const loc = (useLocale().slice(0, 2) as "ko" | "en" | "zh");
  const L = loc === "en" || loc === "zh" ? loc : "ko";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialMonth = value ? new Date(value) : getDefaultViewDate(today);
  const [viewYear, setViewYear] = useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  function goPrevMonth() {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  }
  function goNextMonth() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  return (
    <div className="rounded-3xl border border-snow-300/60 bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label={datePicker.prevMonthAriaLabel}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ice-200"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[16px] font-bold text-ink-900">
          {datePicker.monthLabel(viewYear, viewMonth + 1)}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label={datePicker.nextMonthAriaLabel}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ice-200"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[12px] font-semibold text-snow-500">
        {datePicker.weekdays.map((w, wi) => (
          <span key={w} className={wi === 0 ? "text-rose-500" : wi === 6 ? "text-brand-600" : undefined}>
            {w}
          </span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const key = toDateKey(date);
          const isPast = date < today;
          const isSelected = key === value;
          const hol = HOLIDAYS.includes(key);
          const red = date.getDay() === 0 || hol;
          const sat = date.getDay() === 6 && !hol;
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-11 flex-col items-center justify-center rounded-xl text-[14px] font-medium leading-none transition-colors",
                isPast && "cursor-not-allowed text-snow-300",
                !isPast && !isSelected && (red ? "text-rose-500 hover:bg-rose-50" : sat ? "text-brand-600 hover:bg-ice-200" : "text-ink-800 hover:bg-ice-200"),
                !isPast && !isSelected && hol && "bg-rose-50",
                isSelected && "bg-brand-500 text-white"
              )}
            >
              {date.getDate()}
              {hol && (
                <span className={cn("mt-0.5 text-[8.5px] font-semibold", isSelected ? "text-white" : "text-rose-500")}>
                  {HOLIDAY_NAMES[key]?.[L] ?? ""}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[12px] leading-relaxed text-snow-500">
        {L === "en" ? (
          <>
            <b className="text-rose-500">Red days (Sun · public holidays)</b> and <b className="text-brand-600">Saturdays</b> use weekend lift &amp; rental rates
          </>
        ) : L === "zh" ? (
          <>
            <b className="text-rose-500">红色日期（周日·法定节假日）</b>和<b className="text-brand-600">周六</b>按缆车·装备周末价格计算
          </>
        ) : (
          <>
            <b className="text-rose-500">빨간 날(일·공휴일)</b>과 <b className="text-brand-600">토요일</b>은 리프트·장비 주말 요금이에요
          </>
        )}
      </p>
    </div>
  );
}
