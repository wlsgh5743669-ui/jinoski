"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { approxUsd } from "@/lib/usd";

/**
 * 외국인용 「VVIP 패키지」 — 영어·중국어 화면만 (대표 11-15). VIP 레슨 바로 아래.
 * 일정 (대표 11-15 「2일 연속 풀케어는 힘들다」):
 *   하루      = 풀케어 1일(주간 또는 나이트)
 *   1박 2일   = 1일째 풀케어 + 2일째 반나절 4시간(점심 원하면 무료)
 *   2박 3일   = 1일째 풀케어 + 2일째 반나절 4시간 + 3일째 풀케어
 * 매일: 전담 강사·리프트권·장비·바이저 헬멧·프리미엄 스키복·사진·영상·비발디 단지 안 무료 드랍.
 * 영상 2편(1분 하이라이트 · AI 자세 분석), 2·3일은 첫날 vs 마지막 날 비교. 숙소는 포함 안 함.
 * 원화 가격 + 전액 미리 PayPal (대표 11-16 「강사 스케줄상 전액 미리 받는 걸로」).
 *   일정·강사 확정 뒤 대표가 PayPal 결제 요청(인보이스)을 표의 달러 금액으로 보냄(approxUsd, 1달러 1,364원 올림).
 *   현장 잔금 없음. 환불은 일반 규칙(3일 전 100% · 1~2일 전 50% · 당일 불가).
 * 근거(원화, 만원 단위로 맞춤):
 *   풀케어 날 = 풀케어 레슨료 + 1인 15만원(VIP 레슨과 같음)
 *   반나절 날 = 4시간 레슨료(33만/45만/53만) + 1인 12만원(리프트 5시간·장비 6시간 40% 할인 + 바이저 헬멧 + 스키복 4시간)
 *   영상 = 1인 15만원
 *   계산 하루 85만/130만/180만 · 1박2일 130만/199만/269만 · 2박3일 200만/299만/404만원
 *   → 표 하루 85만/130만/180만 · 1박2일 130만/200만/270만 · 2박3일 200만/300만/400만원.
 */
const PLANS = [1, 2, 3] as const;
const VVIP_KRW: Record<(typeof PLANS)[number], [number, number, number]> = {
  1: [850000, 1300000, 1800000],
  2: [1300000, 2000000, 2700000],
  3: [2000000, 3000000, 4000000],
};
const won = (n: number) => `₩${n.toLocaleString("en-US")}`;

type Day = { kind: "full" | "half"; label: string };

const TXT = {
  en: {
    eyebrow: "VVIP PACKAGE · FOR VISITORS",
    title: "VVIP Package",
    desc: "The VIP Lesson, planned across your stay — plus your own ski film to keep. Come for one day, or stay two or three days and watch yourself improve.",
    planTitle: "How your days go",
    plans: [
      { name: "One day", days: [{ kind: "full", label: "Full Care · Day or Night" }] },
      {
        name: "2 days · 1 night",
        days: [
          { kind: "full", label: "Day 1 · Full Care" },
          { kind: "half", label: "Day 2 · Half day" },
        ],
      },
      {
        name: "3 days · 2 nights",
        days: [
          { kind: "full", label: "Day 1 · Full Care" },
          { kind: "half", label: "Day 2 · Half day" },
          { kind: "full", label: "Day 3 · Full Care" },
        ],
      },
    ] as { name: string; days: Day[] }[],
    full: "Full Care day — 7-hour lesson, Day (meet 08:40) or Night (meet 13:30), meal included",
    half: "Half day — 4-hour lesson, morning or afternoon, lunch included if you'd like it",
    everyTitle: "Every day",
    every: [
      "Your own instructor for the whole lesson",
      "Lift ticket and skis or snowboard + boots for your lesson hours",
      "Visor helmet and premium ski wear",
      "Lesson photos & videos sent to your phone",
      "Free drop-off anywhere in the Vivaldi Park resort",
    ],
    filmTitle: "Your ski film",
    film: [
      ["🎬", "1-minute highlight video", "edited from your lesson footage — ready to share"],
      ["🤖", "AI posture analysis video", "body lines and angles drawn over your riding"],
      ["📈", "First day vs last day", "on 2- and 3-day packages, side by side"],
    ],
    priceTitle: "VVIP price (whole group)",
    cols: ["1 person", "2 people", "3 people"],
    rows: [
      ["1 day", ""],
      ["2 days", "1 night"],
      ["3 days", "2 nights"],
    ],
    notes: [
      "Pay the full amount in advance by PayPal — we send you a PayPal payment request once your dates and instructor are confirmed",
      "You pay the US dollar amount shown · nothing to pay on the day",
      "Full refund up to 3 days before your first lesson · 50% 1–2 days before",
      "Accommodation is not included",
      "Same price on weekdays, weekends and holidays · adults and kids",
      "Ski socks are a free gift · gloves are extra — ₩20,000 a pair from us, or bring your own",
      "We send your videos to your phone after your last lesson day",
    ],
    cta: "Plan my VVIP days",
    ask: "Tell us your dates and how many people — in chat or with the quote calculator.",
  },
  zh: {
    eyebrow: "VVIP PACKAGE · FOR VISITORS",
    title: "VVIP 套餐",
    desc: "把 VIP 课程排进你的整个行程，再送你一部专属滑雪影片。可以只来一天，也可以待两三天，亲眼看到自己的进步。",
    planTitle: "行程安排",
    plans: [
      { name: "1天", days: [{ kind: "full", label: "Full Care · 一日或夜间" }] },
      {
        name: "2天1晚",
        days: [
          { kind: "full", label: "第1天 · Full Care" },
          { kind: "half", label: "第2天 · 半天课程" },
        ],
      },
      {
        name: "3天2晚",
        days: [
          { kind: "full", label: "第1天 · Full Care" },
          { kind: "half", label: "第2天 · 半天课程" },
          { kind: "full", label: "第3天 · Full Care" },
        ],
      },
    ] as { name: string; days: Day[] }[],
    full: "Full Care 日 — 7小时课程，一日（08:40集合）或夜间（13:30集合），含一餐",
    half: "半天 — 4小时课程，上午或下午，想吃午餐也免费提供",
    everyTitle: "每天包含",
    every: ["整节课都是你的专属教练", "课程时间内的缆车票、滑雪板或单板 + 雪鞋", "护目镜头盔、高级滑雪服", "课程照片·视频发到手机", "维瓦尔第园区内免费送达服务"],
    filmTitle: "你的滑雪影片",
    film: [
      ["🎬", "1分钟精彩视频", "用课程画面剪辑，适合分享"],
      ["🤖", "AI 姿势分析视频", "在你的滑行画面上标出身体线条和角度"],
      ["📈", "第一天 vs 最后一天", "2天、3天套餐并排对比"],
    ],
    priceTitle: "VVIP 价格（整组）",
    cols: ["1人", "2人", "3人"],
    rows: [
      ["1天", ""],
      ["2天", "1晚"],
      ["3天", "2晚"],
    ],
    notes: [
      "需通过 PayPal 提前支付全额 — 确认日期和教练后，我们会发送 PayPal 付款请求",
      "按表中美元金额支付 · 当天无需再付款",
      "第一天课程3天前取消可全额退款 · 1~2天前退50%",
      "不含住宿",
      "平日·周末·节假日同价 · 成人和儿童同价",
      "滑雪袜免费赠送 · 手套另购 ₩20,000/副，也可自备",
      "最后一天课程结束后，我们把视频发到你的手机",
    ],
    cta: "规划我的 VVIP 行程",
    ask: "告诉我们日期和人数 — 在聊天中或用报价计算器。",
  },
};

const GOLD = "text-[#E7C77F]";

export function VvipPackage({ className = "bg-white pb-14 sm:pb-20" }: { className?: string }) {
  const locale = useLocale();
  if (locale !== "en" && locale !== "zh") return null;
  const T = TXT[locale];

  return (
    <section className={className}>
      <Container>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#1a1408_0%,#0a0b0d_55%)] text-white shadow-[0_28px_70px_-30px_rgba(10,11,13,0.7)] ring-2 ring-[#E7C77F]">
          <div className="px-4 pb-7 pt-7 min-[400px]:px-6 sm:px-9 sm:pt-9">
            <p className={`text-[12.5px] font-bold tracking-[0.18em] ${GOLD}`}>👑👑 {T.eyebrow}</p>
            <h2 className="mt-2 text-[30px] font-bold tracking-tight text-[#F1D693] sm:text-[38px]">{T.title}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/75 sm:text-[15.5px]">{T.desc}</p>

            <p className={`mt-6 text-[13px] font-bold ${GOLD}`}>{T.planTitle}</p>
            <ul className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              {T.plans.map((plan) => (
                <li key={plan.name} className="rounded-2xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-[#D9B56A]/35">
                  <p className="text-[15px] font-bold text-[#F1D693]">{plan.name}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {plan.days.map((d) => (
                      <li key={d.label} className="flex items-center gap-2 text-[13.5px] text-white/85">
                        <span
                          aria-hidden
                          className={d.kind === "full" ? "h-2.5 w-2.5 shrink-0 rounded-full bg-[#E7C77F]" : "h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-inset ring-[#E7C77F]"}
                        />
                        {d.label}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-1.5 text-[13px] leading-snug text-white/70">
              <p className="flex gap-2">
                <span aria-hidden className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#E7C77F]" />
                {T.full}
              </p>
              <p className="flex gap-2">
                <span aria-hidden className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-inset ring-[#E7C77F]" />
                {T.half}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D9B56A]/40 px-4 py-4">
              <p className={`text-[13px] font-bold ${GOLD}`}>{T.everyTitle}</p>
              <ul className="mt-2 grid gap-1.5 text-[14px] text-white/85 sm:grid-cols-2">
                {T.every.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={GOLD} aria-hidden>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <p className={`mt-6 text-[13px] font-bold ${GOLD}`}>{T.filmTitle}</p>
            <ul className="mt-2.5 grid gap-2.5">
              {T.film.map(([icon, name, sub]) => (
                <li key={name} className="flex items-center gap-3 rounded-2xl bg-[#D9B56A]/15 px-4 py-3 ring-1 ring-[#D9B56A]/50">
                  <span className="text-[22px]" aria-hidden>
                    {icon}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">{name}</span>
                    <span className={`text-[13px] ${GOLD}`}>{sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className={`mt-7 text-[13px] font-bold ${GOLD}`}>{T.priceTitle}</p>
            <div className="mt-2.5 overflow-hidden rounded-2xl ring-1 ring-[#D9B56A]/40">
              <div className="grid grid-cols-3 bg-white/[0.06] text-center text-[12px] font-semibold text-white/65 sm:grid-cols-[0.9fr_1fr_1fr_1fr] sm:text-[13px]">
                <span className="hidden px-1 py-2 sm:block" />
                {T.cols.map((c) => (
                  <span key={c} className="px-1 py-2">
                    {c}
                  </span>
                ))}
              </div>
              {PLANS.map((d, ri) => (
                <div key={d} className="grid grid-cols-3 items-center border-t border-white/10 text-center sm:grid-cols-[0.9fr_1fr_1fr_1fr]">
                  <span className="col-span-3 flex items-baseline gap-2 px-3 pt-3 text-left leading-tight sm:col-span-1 sm:block sm:py-3">
                    <span className="block text-[13.5px] font-semibold text-white/90 sm:text-[14.5px]">{T.rows[ri][0]}</span>
                    {T.rows[ri][1] && <span className="block text-[11.5px] text-white/55 sm:text-[12px]">{T.rows[ri][1]}</span>}
                  </span>
                  {VVIP_KRW[d].map((v, p) => (
                    <span key={p} className="px-0.5 pb-3 pt-1.5 sm:py-3">
                      <span className="block text-[12px] font-extrabold tabular-nums tracking-tighter text-[#F1D693] min-[360px]:text-[14.5px] min-[360px]:tracking-tight min-[480px]:text-[16px] sm:text-[18px]">{won(v)}</span>
                      <span className="block text-[11px] text-white/55 sm:text-[12px]">{approxUsd(v)}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white px-6 py-6 text-ink-900 sm:px-9">
            <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-snow-700">
              {T.notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <a
                href={`/${locale}/quote/`}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1a1408] px-6 py-3 text-[15px] font-bold text-[#F1D693] ring-1 ring-[#D9B56A] transition-transform hover:scale-[1.02]"
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
