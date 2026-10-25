"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { JuniorBadge } from "@/components/shared/junior-badge";
import { JUNIOR_GRADES } from "@/config/junior-grade";

/** 🎖️ 주니어 기술등급 바로가기 띠 (홈 바로가기 아래 · 레슨 페이지) */
const T = {
  ko: { title: "🎖️ 주니어 기술등급 심사", sub: "만 7~17세 · 연맹 공식 뱃지 1~10등급", cta: "자세히 보기" },
  en: { title: "🎖️ Junior Ski Badge Test", sub: "Ages 7–17 · official KSIA badge · levels 1–10", cta: "Learn more" },
  zh: { title: "🎖️ 青少年滑雪技术等级考核", sub: "7~17周岁 · KSIA官方徽章 · 1~10级", cta: "查看详情" },
} as const;

export function JuniorBanner({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = T[(locale in T ? locale : "ko") as keyof typeof T];
  const show = [JUNIOR_GRADES[0], JUNIOR_GRADES[4], JUNIOR_GRADES[9]];
  return (
    <Link
      href="/junior"
      className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-white px-4 py-3.5 ring-1 ring-amber-200 transition-colors hover:ring-amber-400 ${className}`}
    >
      <span className="flex shrink-0 -space-x-2.5">
        {show.map((g) => (
          <JuniorBadge key={g.no} grade={g} size={22} />
        ))}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink-900">{t.title}</span>
        <span className="block text-[12.5px] leading-snug text-snow-600">{t.sub}</span>
      </span>
      <span className="shrink-0 text-[13px] font-bold text-amber-700"><span className="hidden sm:inline">{t.cta} </span>→</span>
    </Link>
  );
}
