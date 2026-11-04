"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { LIFT_PRICES, LIFT_RENTAL_DISCOUNT, RENTAL_PRICES, type TicketHours } from "@/config/lift-rental";
import { approxUsd } from "@/lib/usd";
import { cn } from "@/lib/utils";

/** 요금 안내 페이지: 리프트권·장비 렌탈 정가 → 지노스키 40% 할인가 표 (ko/en/zh) */
const TXT = {
  ko: {
    eyebrow: "LIFT & RENTAL",
    title: "리프트권·장비 렌탈 40% 할인",
    desc: "지노스키 강습생은 비발디파크 매표소 정가에서 40% 할인돼요. 강습료와 함께 결제하고, 당일엔 매표소 줄 없이 받기만 하면 돼요.",
    wd: "주중",
    wk: "주말·공휴일",
    adult: "대인 (14세 이상)",
    child: "소인 (13세 이하)",
    lift: "리프트",
    both: "리프트 + 장비",
    h: (n: number) => `${n}시간`,
    rentH: (n: number) => `장비 ${n}시간`,
    notes: [
      "장비는 리프트보다 1시간 길게 빌려드려요 (3시간권 → 장비 4시간)",
      "헬멧·스키복은 할인 제외 · 스키복은 제휴 렌탈샵을 안내해 드려요",
      "강습 시간에 맞는 시간권을 추천해 드려요 (2시간 강습 → 3시간권)",
    ],
    cta: "우리 가족 리프트·장비 금액 계산하기 →",
    won: (n: number) => `${n.toLocaleString("ko-KR")}원`,
  },
  en: {
    eyebrow: "LIFT & RENTAL",
    title: "Lift tickets & ski rental — 40% off",
    desc: "JinoSki students get 40% off Vivaldi Park's ticket-office prices. Pay together with your lesson, then just pick everything up on the day — no ticket-office queue.",
    wd: "Weekday",
    wk: "Weekend / holiday",
    adult: "Adult (14+)",
    child: "Child (13 and under)",
    lift: "Lift",
    both: "Lift + rental",
    h: (n: number) => `${n}h`,
    rentH: (n: number) => `rental ${n}h`,
    notes: [
      "Rental is 1 hour longer than the lift ticket (3h ticket → 4h rental)",
      "Helmets and ski wear are not discounted · we'll recommend our partner shop for ski wear",
      "We'll recommend the right ticket for your lesson (2-hour lesson → 3-hour ticket)",
    ],
    cta: "Calculate lift & rental for your group →",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
  zh: {
    eyebrow: "LIFT & RENTAL",
    title: "缆车票·装备租赁 6折",
    desc: "JinoSki学员享维瓦尔第公园售票处原价6折。与课程费一起支付，当天无需排队，直接领取即可。",
    wd: "平日",
    wk: "周末·节假日",
    adult: "成人（14岁以上）",
    child: "儿童（13岁以下）",
    lift: "缆车",
    both: "缆车 + 装备",
    h: (n: number) => `${n}小时`,
    rentH: (n: number) => `装备${n}小时`,
    notes: [
      "装备比缆车多1小时（3小时票 → 装备4小时）",
      "头盔和滑雪服不打折 · 滑雪服可介绍合作租赁店",
      "我们会按课程时间推荐合适的缆车票（2小时课程 → 3小时票）",
    ],
    cta: "计算全家的缆车·装备费用 →",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
};

const cut = (n: number) => Math.ceil((n * (1 - LIFT_RENTAL_DISCOUNT)) / 100) * 100;

export function LiftDiscountCard() {
  const locale = useLocale();
  const l = (locale === "en" || locale === "zh" ? locale : "ko") as keyof typeof TXT;
  const T = TXT[l];
  const [who, setWho] = useState<"adult" | "child">("adult");
  const [w, setW] = useState<0 | 1>(0);
  const hours: TicketHours[] = [3, 5, 7];
  const chip = (on: boolean) =>
    cn("rounded-full px-3.5 py-1.5 text-[13px] font-bold", on ? "bg-ink-900 text-white" : "bg-snow-100 text-ink-700");
  const price = (n: number) => (
    <span className="flex flex-col items-end">
      <span className="text-[11.5px] text-snow-500 line-through">{T.won(n)}</span>
      <b className="text-[15px] text-red-500">{T.won(cut(n))}</b>
      {l !== "ko" && <span className="text-[11px] text-snow-500">{approxUsd(cut(n))}</span>}
    </span>
  );

  return (
    <section className="bg-white pb-16 pt-4 sm:pb-24">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-400/70 bg-emerald-50/40 p-6 sm:p-8">
          <p className="text-[12px] font-bold tracking-[0.18em] text-emerald-600">{T.eyebrow}</p>
          <h3 className="mt-1.5 text-[21px] font-bold tracking-tight text-ink-900 sm:text-[24px]">🎿 {T.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-snow-700">{T.desc}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <button type="button" className={chip(who === "adult")} onClick={() => setWho("adult")}>{T.adult}</button>
            <button type="button" className={chip(who === "child")} onClick={() => setWho("child")}>{T.child}</button>
            <span className="w-full" />
            <button type="button" className={chip(w === 0)} onClick={() => setW(0)}>{T.wd}</button>
            <button type="button" className={chip(w === 1)} onClick={() => setW(1)}>{T.wk}</button>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-snow-300/60">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-snow-300/60 px-4 py-2 text-[12px] font-semibold text-snow-500">
              <span />
              <span className="w-[86px] text-right">{T.lift}</span>
              <span className="w-[86px] text-right">{T.both}</span>
            </div>
            {hours.map((h) => (
              <div key={h} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-snow-300/40 px-4 py-2.5 last:border-b-0">
                <span className="flex flex-col">
                  <b className="text-[14.5px] text-ink-900">{T.h(h)}</b>
                  <span className="text-[11.5px] text-snow-500">{T.rentH(RENTAL_PRICES[h].hours)}</span>
                </span>
                <span className="w-[86px]">{price(LIFT_PRICES[h][who][w])}</span>
                <span className="w-[86px]">{price(LIFT_PRICES[h][who][w] + RENTAL_PRICES[h][who][w])}</span>
              </div>
            ))}
          </div>

          <ul className="mt-3 flex flex-col gap-1 text-[12.5px] leading-snug text-snow-700">
            {T.notes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
          <a
            href={`/${l}/quote/`}
            className="mt-4 flex h-12 items-center justify-center rounded-full bg-emerald-600 text-[14.5px] font-bold text-white transition-colors hover:bg-emerald-700"
          >
            {T.cta}
          </a>
        </div>
      </Container>
    </section>
  );
}
