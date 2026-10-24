"use client";

import { useLocale } from "next-intl";
import { trackEvent } from "@/components/shared/analytics";

/** 메인 중간 바로가기: 가격 · 후기 · 연박 견적 · 예약 (스크롤이 길어서 바로 갈 수 있게) */
const T = {
  ko: { title: "바로 보고 싶은 게 있나요?", items: [["💰", "가격 보기", "/pricing/"], ["⭐", "후기 보기", "/reviews/"], ["🏔️", "연박·가족 견적", "/quote/"], ["📅", "예약하기", "/reserve/"]] },
  en: { title: "Jump straight to", items: [["💰", "Prices", "/pricing/"], ["⭐", "Reviews", "/reviews/"], ["🏔️", "Multi-day quote", "/quote/"], ["📅", "Book now", "/reserve/"]] },
  zh: { title: "快速查看", items: [["💰", "价格", "/pricing/"], ["⭐", "评价", "/reviews/"], ["🏔️", "多日报价", "/quote/"], ["📅", "立即预约", "/reserve/"]] },
} as const;

export function QuickLinks() {
  const locale = useLocale();
  const t = T[(locale in T ? locale : "ko") as keyof typeof T];
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-center text-[14px] font-bold text-snow-600">{t.title}</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {t.items.map(([icon, label, href]) => (
            <a
              key={href}
              href={`/${locale}${href}`}
              onClick={() => trackEvent("quick_link_click", { to: href })}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-ice-200/80 text-[15px] font-bold text-ink-900 ring-1 ring-snow-300/60 transition-colors hover:bg-brand-50"
            >
              <span className="text-[18px]">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
