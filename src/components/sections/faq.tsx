"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { ReserveCta } from "@/components/shared/reserve-cta";
import { cn } from "@/lib/utils";

/** 묶음 순서 — 처음 오는 분이 궁금한 것부터 */
const ORDER = ["강습", "아이", "예약·결제", "패찰·리프트·장비", "당일 준비"];
const ALL = { ko: "전체", en: "All", zh: "全部" } as const;
const rank = (c: string) => (ORDER.includes(c) ? ORDER.indexOf(c) : ORDER.length);

type Item = { question: string; answer: string; category?: string };

export function Faq() {
  const { faq, faqCta } = useContent();
  const loc = useLocale().slice(0, 2);
  const allLabel = ALL[loc === "en" || loc === "zh" ? loc : "ko"];
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);
  // 묶음을 바꾸면 목록 맨 위로 (첫 질문이 탭 띠에 가려지지 않게)
  const pick = (c: string | null) => {
    setCat(c);
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80 });
  };

  // category 가 있는 언어(ko)만 묶어서 보여주고, 없으면 예전처럼 한 줄 목록
  const cats = [...new Set(faq.map((f) => f.category).filter((c): c is string => !!c))].sort((a, b) => rank(a) - rank(b));
  const groups: { name: string | null; items: Item[] }[] =
    cats.length === 0
      ? [{ name: null, items: faq }]
      : cats.filter((c) => !cat || c === cat).map((c) => ({ name: c, items: faq.filter((f) => f.category === c) }));

  const row = (item: Item) => {
    const open = openQ === item.question;
    return (
      <div key={item.question} className="overflow-hidden rounded-2xl border border-snow-300/60 bg-white">
        <button
          type="button"
          onClick={() => setOpenQ(open ? null : item.question)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 p-5 text-left"
        >
          <span className="text-[15.5px] font-bold text-ink-900">{item.question}</span>
          <ChevronDown size={18} className={cn("shrink-0 text-snow-500 transition-transform", open && "rotate-180")} />
        </button>
        {/* 닫혀 있어도 HTML에는 답이 들어 있게 (검색엔진·AI가 읽을 수 있게) — 화면에서만 숨김 */}
        <p hidden={!open} className="whitespace-pre-line px-5 pb-5 text-[14.5px] leading-relaxed text-snow-700">{item.answer}</p>
      </div>
    );
  };

  return (
    <section className="bg-white py-14 sm:py-24">
      <Container>
        <div ref={top} className="mx-auto max-w-2xl">
          {cats.length > 0 && (
            <div className="sticky top-[72px] z-10 -mx-5 mb-6 flex gap-2 overflow-x-auto bg-white/95 px-5 py-3 backdrop-blur [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              {[null, ...cats].map((c) => (
                <button
                  key={c ?? "all"}
                  type="button"
                  onClick={() => pick(c)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                    cat === c
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-snow-300 bg-white text-ink-700 hover:border-brand-300"
                  )}
                >
                  {c ?? allLabel}
                  <span className={cn("ml-1 text-[12px]", cat === c ? "text-white/60" : "text-snow-500")}>
                    {c ? faq.filter((f) => f.category === c).length : faq.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.name ?? "all"}>
                {g.name && <h2 className="mb-3 text-[18px] font-bold text-ink-900">{g.name}</h2>}
                <div className="flex flex-col gap-3">{g.items.map(row)}</div>
              </div>
            ))}
          </div>
        </div>

        <ReserveCta
          eyebrow={faqCta.eyebrow}
          title={faqCta.title}
          description={faqCta.description}
          bookButton={faqCta.bookButton}
          kakaoButton={faqCta.kakaoButton}
        />
      </Container>
    </section>
  );
}
