"use client";

import { useState } from "react";
import { BadgeCheck, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Lightbox } from "@/components/shared/lightbox";
import { cn } from "@/lib/utils";

const TEXT = {
  ko: { unit: "명", proof: (n: number) => `자격확인서 ${n}장`, tap: "눌러서 크게 보기", more: "모두 펼쳐 보기", less: "접기" },
  en: { unit: "", proof: (n: number) => `${n} certificates`, tap: "Tap to enlarge", more: "Show all", less: "Show less" },
  zh: { unit: "名", proof: (n: number) => `资格证书 ${n} 张`, tap: "点击放大", more: "全部展开", less: "收起" },
} as const;

/**
 * 강사진 자격 — 위에는 레벨별 인원 요약(한눈에), 아래는 자격확인서 썸네일.
 * 휴대폰에서는 썸네일을 한 줄 가로 스크롤로 두고 「모두 펼쳐 보기」로 펼쳐요 (서류 벽처럼 보이지 않게).
 */
export function TeamCertificates() {
  const { teamCertificates: tc } = useContent();
  const loc = useLocale().slice(0, 2);
  const t = TEXT[loc === "en" || loc === "zh" ? loc : "ko"];
  const [open, setOpen] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  if (tc.items.length === 0) return null;

  const counts = (["ski2", "ski1", "sb1"] as const)
    .map((lv) => ({ lv, n: tc.items.filter((i) => i.level === lv).length }))
    .filter((c) => c.n > 0);

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={tc.eyebrow} align="center" title={tc.title} description={tc.description} />

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-ink-900 text-white shadow-[0_24px_50px_-28px_rgba(11,79,135,0.7)]">
          {counts.map(({ lv, n }, i) => (
            <div key={lv} className={cn("flex flex-col items-center px-2 py-6 sm:py-8", i > 0 && "border-l border-white/10")}>
              <BadgeCheck size={20} className={lv === "ski2" ? "text-amber-300" : "text-brand-300"} />
              <p className="mt-2 text-[34px] font-bold leading-none tracking-tight sm:text-[44px]">
                {n}
                {t.unit && <span className="ml-0.5 text-[16px] font-semibold text-white/70 sm:text-[18px]">{t.unit}</span>}
              </p>
              <p className="mt-2 text-center text-[12.5px] font-semibold leading-snug text-white/80 sm:text-[14px]">
                {tc.levelLabels[lv]}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl items-center justify-between">
          <p className="text-[13.5px] font-bold text-ink-900">
            {t.proof(tc.items.length)} <span className="font-medium text-snow-500">· {t.tap}</span>
          </p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 sm:hidden"
          >
            {expanded ? t.less : t.more}
            <ChevronDown size={15} className={cn("transition-transform", expanded && "rotate-180")} />
          </button>
        </div>

        <div
          className={cn(
            "mx-auto mt-3 max-w-5xl gap-2.5",
            expanded
              ? "grid grid-cols-3"
              : "-mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-auto sm:px-0",
            "sm:grid sm:grid-cols-5 sm:overflow-visible lg:grid-cols-7"
          )}
        >
          {tc.items.map((item) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setOpen(item.image)}
              className={cn(
                "group flex shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-snow-300/60 bg-white text-left",
                !expanded && "w-[27%] sm:w-auto"
              )}
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-snow-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={tc.levelLabels[item.level]}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <span className="px-1.5 py-1.5 text-center text-[11px] font-semibold leading-tight text-ink-800">
                {tc.levelLabels[item.level]}
              </span>
            </button>
          ))}
        </div>
      </Container>
      <Lightbox src={open} onClose={() => setOpen(null)} />
    </section>
  );
}
