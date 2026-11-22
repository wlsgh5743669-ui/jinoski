"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { approxUsd } from "@/lib/usd";
import { LIFT_PRICES, RENTAL_PRICES } from "@/config/lift-rental";

/**
 * 외국인용 「VIP 레슨 (VIP Lesson)」 — 영어·중국어 화면만 (대표 11-14). 기존 풀케어 소개·가격은 그대로 둬요.
 * VIP 레슨 = 원데이·나이트 풀케어 7시간 + 1인 150,000원(리프트권 7시간·장비 8시간·바이저 헬멧·스키복 + 스키 양말 증정).
 * 장갑은 포함 안 함 — 필요하면 1켤레 20,000원 추가(대표 11-15).
 * 근거: 리프트·장비 40% 할인가(config/lift-rental.ts) + 바이저 헬멧 15,000 + 스키복 7시간 35,000 → 어른 주말 137,600원,
 *       양말 증정분까지 더해 1인 15만원 한 가지 (주중·주말·어른·어린이 같음).
 */
export const VIP_ADD_PER_PERSON = 150000;
const FULL_CARE = [550000, 700000, 900000]; // 1:1 · 1:2 · 1:3 풀케어 레슨료(그룹 전체, 패찰 포함)
export const VIP_TOTALS = FULL_CARE.map((fee, i) => fee + VIP_ADD_PER_PERSON * (i + 1)); // 700,000 · 1,000,000 · 1,350,000
/**
 * 「합리적」 비교 (대표 11-17 「외국인들이 잘 보이게, 합리적이라는 느낌으로」):
 * 따로 사면 = 비발디 매표소 주말 정가(어른) 리프트 7시간 + 장비 8시간 + 스키복 7시간(외국인 렌탈가 35,000).
 * 바이저 헬멧·스키 양말은 비교에 넣지 않고 「포함」으로만 표시(따로 파는 값이 정해져 있지 않아서).
 */
const SKIWEAR_7H = 35000;
const SEPARATE = LIFT_PRICES[7].adult[1] + RENTAL_PRICES[7].adult[1] + SKIWEAR_7H; // 99,000 + 47,000 + 35,000 = 181,000
const SAVE_PER_PERSON = SEPARATE - VIP_ADD_PER_PERSON; // 31,000

const TXT = {
  en: {
    eyebrow: "VIP COURSE · FOR VISITORS",
    title: "VIP Lesson",
    desc: "Just bring yourself. A full 7-hour day with your own instructor — and your lift ticket, rental gear, helmet and premium ski wear are ready when you arrive. No ticket office, no rental queue.",
    lessonTitle: "The lesson",
    lesson: [
      "7 hours with your own instructor (1–3 people)",
      "Wireless headset coaching on the slope",
      "Lesson photos & videos sent to your phone",
      "A meal and the Vivaldi Park lesson permit",
    ],
    gearTitle: "Tickets & gear — all ready for you",
    gear: [
      ["🎫", "Lift ticket", "7 hours"],
      ["🎿", "Skis or snowboard + boots", "8 hours"],
      ["🪖", "Visor helmet", "goggles built in — no goggles needed"],
      ["🧥", "Premium ski jacket & pants", "for the day"],
      ["🧦", "Ski socks", "free gift — yours to keep"],
    ],
    valueTitle: "Good value — compare for yourself",
    valueRows: [
      ["Lift ticket · 7 hours", LIFT_PRICES[7].adult[1]],
      ["Skis or snowboard + boots · 8 hours", RENTAL_PRICES[7].adult[1]],
      ["Ski jacket & pants · for the day", SKIWEAR_7H],
    ] as [string, number][],
    valueSeparate: "Bought separately",
    valueVip: "In the VIP Lesson",
    valueIncl: "+ visor helmet and ski socks included",
    valueNote: "Per adult, weekend & holiday prices — lift ticket and gear at the Vivaldi Park ticket office, ski wear at our rental price. And no ticket-office or rental queue for you.",
    perPerson: "per person",
    save: (n: number) => `₩${n.toLocaleString("en-US")} less than buying separately*`,
    saveNote: "*Lesson plus lift ticket, gear and ski wear bought separately on a weekend",
    priceTitle: "VIP Lesson price (whole group)",
    ex: ["1 person", "2 people", "3 people"],
    same: "Same price on weekdays, weekends and holidays · adults and kids",
    times: "Choose One Day (meet 08:40) or Night (meet 13:30)",
    notes: [
      "Paid in full by PayPal once we confirm your instructor — nothing to pay on the day",
      "Gloves are extra — ₩20,000 a pair from us, or bring your own",
      "Tell us everyone's height and shoe size after booking",
      "4 or more people? Ask us for a group price",
    ],
    cta: "Book a VIP Lesson",
    ask: "VIP is already selected on the next screen — just pick One Day or Night. We confirm your instructor within 24 hours, then send a PayPal request for the full amount.",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
  zh: {
    eyebrow: "VIP COURSE · FOR VISITORS",
    title: "VIP 课程",
    desc: "人来就行。专属教练陪你滑满7小时——缆车票、装备、头盔和高级滑雪服在你到达时都已备好。不用排队买票，不用排队租装备。",
    lessonTitle: "课程",
    lesson: ["专属教练7小时（1~3人）", "无线耳机边滑边指导", "课程照片·视频发到手机", "一餐 + 维瓦尔第公园外部教学许可"],
    gearTitle: "缆车票和装备——全部为你备好",
    gear: [
      ["🎫", "缆车票", "7小时"],
      ["🎿", "滑雪板或单板 + 雪鞋", "8小时"],
      ["🪖", "护目镜头盔", "自带护目镜·不用另备雪镜"],
      ["🧥", "高级滑雪服（上衣+裤子）", "当天使用"],
      ["🧦", "滑雪袜", "免费赠送·可带走"],
    ],
    valueTitle: "划不划算，自己比一比",
    valueRows: [
      ["缆车票 · 7小时", LIFT_PRICES[7].adult[1]],
      ["滑雪板或单板 + 雪鞋 · 8小时", RENTAL_PRICES[7].adult[1]],
      ["滑雪服（上衣+裤子）· 当天", SKIWEAR_7H],
    ] as [string, number][],
    valueSeparate: "分开买",
    valueVip: "VIP 课程里",
    valueIncl: "+ 护目镜头盔、滑雪袜也包含",
    valueNote: "每位成人、周末·节假日价格 — 缆车票和装备按维瓦尔第公园售票处价格，滑雪服按我们的租赁价。而且不用排队买票、租装备。",
    perPerson: "每人",
    save: (n: number) => `比分开买便宜 ₩${n.toLocaleString("en-US")}*`,
    saveNote: "*与周末分开购买课程、缆车票、装备和滑雪服相比",
    priceTitle: "VIP 课程价格（整组）",
    ex: ["1人", "2人", "3人"],
    same: "平日·周末·节假日同价 · 成人和儿童同价",
    times: "可选一日（08:40集合）或夜间（13:30集合）",
    notes: ["确认教练后通过 PayPal 支付全款 — 上课当天无需再付", "手套另购 ₩20,000/副，也可自备", "预约后请告诉我们每个人的身高和鞋码", "4人以上请咨询团体价格"],
    cta: "预约 VIP 课程",
    ask: "下一页已自动选好 VIP，只需选择一日或夜间。我们会在24小时内确认教练，然后发送 PayPal 全款付款请求。",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
};

const GOLD = "text-[#E7C77F]";

export function AllInFullCare({ className = "bg-white py-14 sm:py-20" }: { className?: string }) {
  const locale = useLocale();
  if (locale !== "en" && locale !== "zh") return null;
  const T = TXT[locale];
  const last = T.gear.length - 1;

  return (
    <section id="vip-lesson" className={`scroll-mt-24 ${className}`}>
      <Container>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-ink-900 text-white shadow-[0_24px_60px_-30px_rgba(10,11,13,0.55)] ring-2 ring-[#D9B56A]/70">
          <div className="px-4 pb-7 pt-7 min-[400px]:px-6 sm:px-9 sm:pt-9">
            <p className={`text-[12.5px] font-bold tracking-[0.18em] ${GOLD}`}>👑 {T.eyebrow}</p>
            <h2 className="mt-2 text-[30px] font-bold tracking-tight sm:text-[38px]">{T.title}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/75 sm:text-[15.5px]">{T.desc}</p>

            <div className="mt-6 rounded-2xl border border-[#D9B56A]/40 px-4 py-4">
              <p className={`text-[13px] font-bold ${GOLD}`}>{T.lessonTitle}</p>
              <ul className="mt-2 grid gap-1.5 text-[14px] text-white/85 sm:grid-cols-2">
                {T.lesson.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={GOLD} aria-hidden>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <p className={`mt-6 text-[13px] font-bold ${GOLD}`}>{T.gearTitle}</p>
            <ul className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
              {T.gear.map(([icon, name, sub], i) => (
                <li
                  key={name}
                  className={
                    i === last
                      ? "flex items-center gap-3 rounded-2xl bg-[#D9B56A]/15 px-4 py-3 ring-1 ring-[#D9B56A]/50 sm:col-span-2"
                      : "flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3"
                  }
                >
                  <span className="text-[22px]" aria-hidden>
                    {icon}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">{name}</span>
                    <span className={i === last ? `text-[13px] font-semibold ${GOLD}` : "text-[13px] text-white/60"}>{sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className={`mt-7 text-[13px] font-bold ${GOLD}`}>{T.valueTitle}</p>
            <div className="mt-2.5 grid gap-3 rounded-2xl bg-white px-4 py-4 text-ink-900 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-5">
              <div>
                <ul className="flex flex-col gap-1 text-[13.5px]">
                  {T.valueRows.map(([name, v]) => (
                    <li key={name} className="flex justify-between gap-3">
                      <span className="text-snow-700">{name}</span>
                      <span className="tabular-nums">{T.won(v)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex justify-between gap-3 border-t border-dashed border-snow-300 pt-2 text-[14px] font-semibold">
                  <span>{T.valueSeparate}</span>
                  <span className="tabular-nums text-snow-700 line-through decoration-2">{T.won(SEPARATE)}</span>
                </p>
              </div>
              <div className="rounded-xl bg-ink-900 px-4 py-3 text-center text-white sm:min-w-[170px]">
                <p className="text-[12.5px] font-semibold text-white/70">{T.valueVip}</p>
                <p className="text-[24px] font-extrabold tabular-nums tracking-tight text-[#F1D693]">{T.won(VIP_ADD_PER_PERSON)}</p>
                <p className="text-[12px] leading-snug text-[#E7C77F]">{T.valueIncl}</p>
              </div>
              <p className="text-[12px] leading-snug text-snow-700 sm:col-span-2">{T.valueNote}</p>
            </div>

            <p className={`mt-7 text-[13px] font-bold ${GOLD}`}>{T.priceTitle}</p>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:gap-2">
              {VIP_TOTALS.map((total, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.07] px-1 py-3.5 text-center ring-1 ring-[#D9B56A]/40 sm:px-3">
                  <p className="text-[13px] font-semibold text-white/70">{T.ex[i]}</p>
                  <p className="mt-1 text-[12.5px] font-extrabold tabular-nums tracking-tighter text-[#F1D693] min-[360px]:text-[14px] min-[400px]:text-[16px] sm:text-[21px] sm:tracking-tight">
                    {T.won(total)}
                  </p>
                  <p className="text-[12px] text-white/60">{approxUsd(total)}</p>
                  {i > 0 && (
                    <p className="mx-auto mt-2 w-fit rounded-full bg-[#D9B56A]/20 px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums text-[#F1D693] min-[360px]:px-2 min-[360px]:text-[11.5px] sm:text-[12.5px]">
                      {T.won(total / (i + 1))} {T.perPerson}
                    </p>
                  )}
                  <p className="mt-1.5 text-[10.5px] leading-tight text-white/55 min-[360px]:text-[11px] sm:text-[12px]">{T.save(SAVE_PER_PERSON * (i + 1))}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-white/50">{T.saveNote}</p>
            <p className="mt-3 text-[13.5px] font-semibold text-white/80">{T.same}</p>
            <p className="mt-1 text-[13px] text-white/60">{T.times}</p>
          </div>

          <div className="bg-white px-6 py-6 text-ink-900 sm:px-9">
            <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-snow-700">
              {T.notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={`/${locale}/reserve/?program=one-day&vip=1`}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
              >
                {T.cta}
              </a>
              <p className="text-[13px] leading-snug text-snow-700">{T.ask}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
