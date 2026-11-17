"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";

/**
 * 메인 첫 화면 바로 아래 VIP 레슨 띠 — 영어·중국어 화면만 (대표 11-17 「외국인들이 잘 보이게」).
 * 누르면 같은 화면의 VIP 레슨 칸(#vip-lesson)으로 내려가요. 「1인 450,000원부터」 = 3명 1,350,000원 ÷ 3.
 */
const TXT = {
  en: {
    tag: "For visitors",
    title: "VIP Lesson",
    body: "Your own instructor, lift ticket, rental gear, helmet and premium ski wear — one booking, nothing to queue for.",
    price: "from ₩450,000 per person",
    cta: "See the VIP Lesson",
  },
  zh: {
    tag: "外国游客专属",
    title: "VIP 课程",
    body: "专属教练、缆车票、租赁装备、头盔、高级滑雪服——一次预约全搞定，不用排队。",
    price: "每人 ₩450,000 起",
    cta: "查看 VIP 课程",
  },
};

export function VipStrip() {
  const locale = useLocale();
  if (locale !== "en" && locale !== "zh") return null;
  const T = TXT[locale];

  return (
    <section className="bg-white pt-6 sm:pt-8">
      <Container>
        <a
          href="#vip-lesson"
          className="mx-auto flex max-w-3xl flex-col gap-3 rounded-[22px] bg-ink-900 px-5 py-4 text-white ring-2 ring-[#D9B56A]/70 transition-transform hover:scale-[1.01] sm:flex-row sm:items-center sm:gap-5 sm:px-6"
        >
          <span className="text-[30px] leading-none" aria-hidden>
            👑
          </span>
          <span className="flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[18px] font-bold text-[#F1D693] sm:text-[20px]">{T.title}</span>
              <span className="text-[12.5px] font-semibold text-[#E7C77F]">{T.tag}</span>
            </span>
            <span className="mt-1 block text-[13.5px] leading-snug text-white/75">{T.body}</span>
            <span className="mt-1.5 block text-[14px] font-bold tabular-nums text-[#F1D693]">{T.price}</span>
          </span>
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F1D693] px-5 py-2.5 text-[14px] font-bold text-ink-900">
            {T.cta}
          </span>
        </a>
      </Container>
    </section>
  );
}
