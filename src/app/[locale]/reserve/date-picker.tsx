"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContent } from "@/lib/use-content";

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
        {datePicker.weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const key = toDateKey(date);
          const isPast = date < today;
          const isSelected = key === value;
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-10 items-center justify-center rounded-xl text-[14px] font-medium transition-colors",
                isPast && "cursor-not-allowed text-snow-300",
                !isPast && !isSelected && "text-ink-800 hover:bg-ice-200",
                isSelected && "bg-brand-500 text-white"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
