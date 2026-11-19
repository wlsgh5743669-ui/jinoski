"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { CARD_PEOPLE, CARD_UI, DESIGNATED_FEE, FEE_TIERS, type CardLang, type FeeTier } from "@/config/content/instructor-cards";
import { cn } from "@/lib/utils";

/** 요금 안내 페이지: 지정강사 추가금 (대표 11-19 · 상급 5만·중급 3만·일반 1만, 한 팀이 시즌에 1번 내면 그 시즌 내내 같은 강사 계속 지정, 추가금은 강사에게 전부) */
const TXT = {
  ko: {
    eyebrow: "DESIGNATED INSTRUCTOR",
    title: "원하는 강사를 지정할 수 있어요",
    desc: "지노스키 강사는 모두 공인 자격을 가졌어요. 지정하지 않으면 추가금 없이 수업에 맞는 강사가 배정돼요. 특정 강사에게 배우고 싶으시면 아래 금액이 붙어요.",
    per: "한 팀 · 시즌 1번",
    notes: [
      "한 팀이 시즌에 1번만 내요. 한 번 내시면 이번 시즌 동안 같은 강사를 추가금 없이 계속 지정할 수 있어요.",
      "인원이 몇 명이든, 2시간이든 7시간이든 금액은 같아요.",
      "추가금은 지정한 강사에게 전부 가요.",
      "예약 전에 그 강사의 일정을 먼저 확인해 드려요.",
    ],
    cta: "강사 소개 보고 고르기 →",
  },
  en: {
    eyebrow: "REQUEST AN INSTRUCTOR",
    title: "Choose your own instructor",
    desc: "Every JinoSki instructor is officially certified. If you don't request anyone, we match an instructor to your lesson at no extra cost. To learn from a specific instructor, the fee below applies.",
    per: "per group / season",
    notes: [
      "Paid once per group per season. After that, you can request the same instructor all season at no extra cost.",
      "Same fee however many people and however long the lesson.",
      "The whole fee goes to the instructor you choose.",
      "We'll check that instructor's schedule before you book.",
    ],
    cta: "Meet the instructors →",
  },
  zh: {
    eyebrow: "指定教练",
    title: "可以指定想要的教练",
    desc: "JinoSki 所有教练都持有官方资格。不指定时，我们会按课程安排合适的教练，不收额外费用。如果想跟某位教练学，需支付以下指定费。",
    per: "每组每季一次",
    notes: [
      "每组每个雪季只付一次。付过之后，本季再指定同一位教练不再加钱。",
      "不论人数多少、课程2小时或7小时，金额都一样。",
      "指定费全部归您选择的教练。",
      "预约前会先确认该教练的时间。",
    ],
    cta: "查看教练介绍 →",
  },
};

const TIER_STYLE: Record<FeeTier, string> = {
  high: "border-[#e8c66a] bg-[#fffaf0]",
  mid: "border-brand-200 bg-brand-50/50",
  base: "border-snow-300/70 bg-white",
};
const TIER_TEXT: Record<FeeTier, string> = {
  high: "text-[#8a6200]",
  mid: "text-brand-700",
  base: "text-snow-700",
};

export function DesignatedInstructorCard() {
  const locale = useLocale();
  const l: CardLang = locale === "en" || locale === "zh" ? locale : "ko";
  const T = TXT[l];
  const ui = CARD_UI[l];
  const people = CARD_PEOPLE[l];

  return (
    <section id="designated" className="scroll-mt-24 bg-white pb-16 pt-4 sm:pb-24">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-ink-900/10 bg-snow-50 p-6 sm:p-8">
          <p className="text-[12px] font-bold tracking-[0.18em] text-brand-600">{T.eyebrow}</p>
          <h3 className="mt-1.5 text-[21px] font-bold tracking-tight text-ink-900 sm:text-[24px]">🎯 {T.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-snow-700">{T.desc}</p>

          <div className="mt-4 flex flex-col gap-2.5">
            {FEE_TIERS.map((tier) => {
              const group = people.filter((p) => p.fee === tier);
              return (
                <div key={tier} className={cn("rounded-2xl border p-4", TIER_STYLE[tier])}>
                  <div className="flex items-baseline justify-between gap-3">
                    <b className={cn("text-[16px]", TIER_TEXT[tier])}>{ui.feeTier[tier]}</b>
                    <span className="text-right">
                      <b className="text-[18px] text-ink-900">+{ui.won(DESIGNATED_FEE[tier])}</b>
                      <span className="ml-1 text-[12px] text-snow-500">{T.per}</span>
                    </span>
                  </div>
                  <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-2">
                    {group.map((p) => (
                      <li key={p.id} className="flex items-center gap-1.5">
                        <span
                          className="h-8 w-8 shrink-0 rounded-full bg-snow-200 bg-cover"
                          style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: "center 20%" }}
                          aria-hidden
                        />
                        <span className="text-[13.5px] font-semibold text-ink-900">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <ul className="mt-3 flex flex-col gap-1 text-[12.5px] leading-snug text-snow-700">
            {T.notes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
          <a
            href={`/${l}/instructor/`}
            className="mt-4 flex h-12 items-center justify-center rounded-full bg-ink-900 text-[14.5px] font-bold text-white transition-colors hover:bg-ink-700"
          >
            {T.cta}
          </a>
        </div>
      </Container>
    </section>
  );
}
