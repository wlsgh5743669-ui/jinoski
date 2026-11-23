"use client";

import { useLocale } from "next-intl";
import { trackEvent } from "@/components/shared/analytics";
import { JuniorBanner } from "@/components/sections/junior-banner";
import { NoticeStrip } from "@/components/sections/notice-list";

/** 메인 중간 바로가기: 후기 · 강사 소개 · 만나는 곳 · 연박 견적 (대표 11-24: 가격·예약은 첫 화면 버튼에 있어서 바꿈) */
const T = {
  ko: { title: "바로 보고 싶은 게 있나요?", items: [["⭐", "후기 보기", "/reviews/"], ["🧑‍🏫", "강사 소개", "/instructor/"], ["📍", "만나는 곳", "/guide/"], ["🏔️", "연박·가족 견적", "/quote/"]] },
  en: { title: "Jump straight to", items: [["⭐", "Reviews", "/reviews/"], ["🧑‍🏫", "Instructors", "/instructor/"], ["📍", "Meeting point", "/guide/"], ["🏔️", "Multi-day quote", "/quote/"]] },
  zh: { title: "快速查看", items: [["⭐", "评价", "/reviews/"], ["🧑‍🏫", "教练团队", "/instructor/"], ["📍", "集合地点", "/guide/"], ["🏔️", "多日报价", "/quote/"]] },
} as const;

export function QuickLinks() {
  const locale = useLocale();
  const t = T[(locale in T ? locale : "ko") as keyof typeof T];
  return (
    <section className="bg-white pb-8 pt-2 sm:pb-10 sm:pt-2">
      <div className="mx-auto max-w-3xl px-4">
        {/* 주니어 공지는 아래 노란 카드와 겹쳐서 띠는 빼요 (대표 11-24) */}
        <NoticeStrip hideLink="/junior" />
        <p className="mt-5 text-center text-[14px] font-bold text-snow-600">{t.title}</p>
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
        <JuniorBanner className="mt-2.5" isNew />
      </div>
    </section>
  );
}
