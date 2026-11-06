"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import type { LevelCode } from "@/config/content/types";

const LEVELS: LevelCode[] = ["beginner", "basic", "intermediate", "advanced"];
const EQUIP = ["ski", "snowboard"] as const;

const TEXT = {
  ko: {
    title: "내 레벨 찾기",
    desc: "지금 탈 수 있는 만큼을 골라보세요. 강사가 그 레벨에 맞춰 수업을 짜요.",
    equip: { ski: "스키", snowboard: "스노보드" },
    fit: "이런 분께",
    learn: "이렇게 배워요",
    book: "이 레벨로 예약",
    note: "두 레벨 사이라면 낮은 쪽을 골라주세요.",
  },
  en: {
    title: "Find your level",
    desc: "Pick what you can do today. Your instructor builds the lesson around it.",
    equip: { ski: "Ski", snowboard: "Snowboard" },
    fit: "You…",
    learn: "You'll learn",
    book: "Book this level",
    note: "Between two levels? Pick the lower one.",
  },
  zh: {
    title: "找到我的级别",
    desc: "选择你现在能做到的程度，教练会按这个级别安排课程。",
    equip: { ski: "双板", snowboard: "单板" },
    fit: "适合",
    learn: "学习内容",
    book: "按此级别预约",
    note: "介于两个级别之间时，请选择较低的级别。",
  },
} as const;

/** 레슨 페이지: 스키/보드 × 4레벨 — 「이런 분께」(셀프 체크) + 「이렇게 배워요」 + 바로 예약 */
export function LevelFinder() {
  const { levelLabels, levelSelfCheckByEquipment, levelDescriptionsByEquipment } = useContent();
  const loc = useLocale().slice(0, 2);
  const t = TEXT[loc === "en" || loc === "zh" ? loc : "ko"];
  const [equip, setEquip] = useState<(typeof EQUIP)[number]>("ski");

  return (
    <section className="bg-ice-gradient py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h2 className="text-[28px] font-bold tracking-tight text-ink-900 sm:text-[36px]">{t.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600 sm:text-[16px]">{t.desc}</p>

        <div className="mt-6 inline-flex rounded-full bg-white p-1 ring-1 ring-snow-300/70">
          {EQUIP.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEquip(e)}
              aria-pressed={equip === e}
              className={cn(
                "rounded-full px-5 py-2 text-[14px] font-bold transition-colors",
                equip === e ? "bg-ink-900 text-white" : "text-ink-600 hover:text-ink-900"
              )}
            >
              {t.equip[e]}
            </button>
          ))}
        </div>

        <ol className="relative mt-8 space-y-4 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-0.5 before:bg-brand-200">
          {LEVELS.map((lv, i) => (
            <li key={lv} className="relative flex gap-4">
              <span
                className={cn(
                  "relative z-10 mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ring-4 ring-[#EEF5FA]",
                  ["bg-brand-100 text-brand-700", "bg-brand-300 text-white", "bg-brand-500 text-white", "bg-brand-800 text-white"][i]
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl bg-white p-5 shadow-[0_10px_30px_-22px_rgba(11,79,135,0.5)] ring-1 ring-snow-300/60">
                <p className="text-[18px] font-bold text-ink-900">{levelLabels[lv].label}</p>
                <p className="mt-3 text-[12px] font-semibold text-brand-600">{t.fit}</p>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug text-ink-900">
                  “{levelSelfCheckByEquipment[equip][lv]}”
                </p>
                <p className="mt-3 text-[12px] font-semibold text-brand-600">{t.learn}</p>
                <p className="mt-0.5 text-[14px] leading-relaxed text-ink-700">{levelDescriptionsByEquipment[equip][lv]}</p>
                <Link
                  href={`/reserve?program=2h&level=${lv}&equipment=${equip}`}
                  className="mt-4 inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-4 py-2 text-[13.5px] font-bold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  {t.book} <ChevronRight size={16} />
                </Link>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-[13px] text-snow-500">{t.note}</p>
      </Container>
    </section>
  );
}
