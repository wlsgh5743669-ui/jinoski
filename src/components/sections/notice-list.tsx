"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Megaphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NOTICES, isNoticeActive, type Notice } from "@/config/notices";
import { cn } from "@/lib/utils";

type L = "ko" | "en" | "zh";
const T = {
  ko: { on: "진행 중", off: "종료", pin: "중요", until: (d: string) => `${d.slice(5).replace("-", "/")}까지` },
  en: { on: "Ongoing", off: "Ended", pin: "Important", until: (d: string) => `until ${d.slice(5).replace("-", "/")}` },
  zh: { on: "进行中", off: "已结束", pin: "重要", until: (d: string) => `至${d.slice(5).replace("-", "/")}` },
};
const useL = (): L => {
  const l = useLocale();
  return (l === "en" || l === "zh" ? l : "ko") as L;
};

/** 날짜는 브라우저에서 계산 (정적 페이지라 빌드 날짜로 고정되지 않게) */
function useToday() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}

/** 공지사항 목록 (눌러서 펼치기) */
export function NoticeList() {
  const l = useL();
  const t = T[l];
  const now = useToday();
  const [open, setOpen] = useState<string | null>(NOTICES[0]?.id ?? null);
  return (
    <div className="flex flex-col gap-3">
      {NOTICES.map((n) => {
        const active = now ? isNoticeActive(n, now) : true;
        const isOpen = open === n.id;
        return (
          <article id={n.id} key={n.id} className={cn("scroll-mt-28 rounded-2xl bg-white ring-1 ring-snow-300/60", !active && "opacity-70")}>
            <button type="button" onClick={() => setOpen(isOpen ? null : n.id)} className="flex w-full items-start gap-3 px-5 py-4 text-left">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {n.pinned && active && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">{t.pin}</span>}
                  {n.endDate && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", active ? "bg-brand-50 text-brand-600" : "bg-snow-100 text-snow-500")}>
                      {active ? `${t.on} · ${t.until(n.endDate)}` : t.off}
                    </span>
                  )}
                  <span className="text-[12px] text-snow-500">{n.date.replaceAll("-", ".")}</span>
                </div>
                <h2 className="mt-1 text-[16px] font-bold leading-snug text-ink-900">{n.title[l]}</h2>
              </div>
              <ChevronDown size={18} className={cn("mt-1 shrink-0 text-snow-500 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="border-t border-snow-300/50 px-5 pb-5 pt-3">
                {n.body[l].split("\n").map((p, i) => (
                  <p key={i} className="mt-1.5 text-[14.5px] leading-relaxed text-snow-700">
                    {p}
                  </p>
                ))}
                {n.link && (
                  <Link href={n.link.href} className="mt-4 inline-flex h-11 items-center rounded-full bg-brand-500 px-5 text-[14px] font-bold text-white hover:bg-brand-600">
                    {n.link.label[l]} →
                  </Link>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

/** 홈: 가장 최근 「진행 중」 공지 한 줄 */
export function NoticeStrip() {
  const l = useL();
  const now = useToday();
  const n: Notice | undefined = now ? NOTICES.find((x) => isNoticeActive(x, now)) : NOTICES[0];
  if (!n) return null;
  return (
    <Link href={`/notice#${n.id}`} className="flex items-center gap-2.5 rounded-2xl bg-ink-900 px-4 py-3 text-white transition-opacity hover:opacity-90">
      <Megaphone size={17} className="shrink-0 text-brand-300" />
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{n.title[l]}</span>
      <span className="shrink-0 text-[12.5px] font-bold text-brand-300">{l === "ko" ? "공지 →" : l === "zh" ? "公告 →" : "News →"}</span>
    </Link>
  );
}
