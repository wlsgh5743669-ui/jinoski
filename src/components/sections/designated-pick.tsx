"use client";

// 🎯 견적 계산기: 지정 강사 고르기 (대표 11-22 「지정강사 구매하려는데 절차가 없네」)
// 강사 소개 칸 「이 강사로 예약하기」 → /quote/?ins=<강사 id> 로 들어오면 미리 골라져 있어요.
// 추가금은 한 팀이 시즌에 1번 (상급 5만 · 중급 3만 · 일반 1만) — 견적 합계에 포함(첫 수업 날 한 줄), 사장님 알림·운영앱 금액표에 같이 가요.
// 이 칸은 언어별 글을 직접 써서 번역층(data-notr)을 건너뛰어요.
import { X } from "lucide-react";
import { CARD_PEOPLE, DESIGNATED_FEE, FEE_TIERS, INSTRUCTOR_CARDS, type FeeTier } from "@/config/content/instructor-cards";
import type { QLocale } from "@/lib/quote-i18n";
import { cn } from "@/lib/utils";

const T = {
  ko: {
    title: "🎯 강사 지정",
    opt: "(선택)",
    desc: "지정하지 않으면 추가금 없이 수업에 맞는 강사가 배정돼요.",
    none: "지정 안 함",
    tier: { high: "상급", mid: "중급", base: "일반" } as Record<FeeTier, string>,
    picked: (n: string) => `${n} 강사 지정`,
    once: "한 팀이 시즌에 1번만 내요 · 이번 시즌에 이미 내셨으면 빼 드려요",
    total: "예상 합계 (지정강사 포함)",
    banner: (n: string, w: string) => `${n} 강사 지정 · +${w} (시즌 1번)`,
    remove: "지정 빼기",
    see: "강사 소개 보기",
    won: (n: number) => (n % 10000 === 0 ? `${n / 10000}만원` : `${n.toLocaleString("ko-KR")}원`),
  },
  en: {
    title: "🎯 Request an instructor",
    opt: "(optional)",
    desc: "If you don't pick one, we assign the right instructor at no extra cost.",
    none: "No request",
    tier: { high: "Senior", mid: "Experienced", base: "Standard" } as Record<FeeTier, string>,
    picked: (n: string) => `${n} requested`,
    once: "Paid once per group per season · already paid this season? We'll take it off",
    total: "Estimated total (incl. request)",
    banner: (n: string, w: string) => `${n} requested · +${w} (once a season)`,
    remove: "Remove",
    see: "Meet the instructors",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
  zh: {
    title: "🎯 指定教练",
    opt: "（可选）",
    desc: "不指定的话，我们会免费安排适合的教练。",
    none: "不指定",
    tier: { high: "高级", mid: "中级", base: "普通" } as Record<FeeTier, string>,
    picked: (n: string) => `已指定 ${n}`,
    once: "每组每季只付一次 · 本季已付过可扣除",
    total: "预计合计（含指定费）",
    banner: (n: string, w: string) => `已指定 ${n} · +${w}（每季一次）`,
    remove: "取消指定",
    see: "查看教练介绍",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
} as const;

/** 지정 강사 정보 (한국어 이름 · 등급 · 추가금) — 사장님 알림·견적 글에 써요 */
export function designatedOf(id: string) {
  const p = INSTRUCTOR_CARDS.people.find((x) => x.id === id);
  if (!p) return null;
  const fee = DESIGNATED_FEE[p.fee];
  const tier = T.ko.tier[p.fee];
  return { id: p.id, name: p.name, tier, fee, text: `지정강사 ${p.name} (${tier}) +${T.ko.won(fee)} · 한 팀 시즌 1번` };
}

/** 화면 언어에 맞는 강사 이름 (영어·중국어 페이지는 영어 이름) */
export function designatedName(id: string, lang: QLocale) {
  return CARD_PEOPLE[lang].find((x) => x.id === id)?.name ?? "";
}
const nameOf = designatedName;

/** 계산기 맨 위 띠: 어느 단계에서든 지정한 강사가 보이게 */
export function DesignatedBanner({ id, lang, onClear }: { id: string; lang: QLocale; onClear: () => void }) {
  const p = INSTRUCTOR_CARDS.people.find((x) => x.id === id);
  if (!p) return null;
  const t = T[lang];
  return (
    <div data-notr className="mt-3 flex items-center gap-2.5 rounded-2xl bg-ink-900 py-2 pl-2 pr-2.5 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover object-top" />
      <p className="min-w-0 flex-1 text-[13.5px] font-bold leading-snug">{t.banner(nameOf(id, lang), t.won(DESIGNATED_FEE[p.fee]))}</p>
      <button type="button" onClick={onClear} aria-label={t.remove} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
        <X size={15} />
      </button>
    </div>
  );
}

/** 견적서 단계: 강사 고르기 + 합계 (grand 는 이미 지정료가 들어간 금액) */
export function DesignatedPick({ id, lang, grand, onPick }: { id: string; lang: QLocale; grand: number; onPick: (id: string) => void }) {
  const t = T[lang];
  const people = CARD_PEOPLE[lang];
  const cur = people.find((x) => x.id === id);
  const fee = cur ? DESIGNATED_FEE[cur.fee] : 0;
  return (
    <div data-notr id="designated-pick" className="mt-4 scroll-mt-24 rounded-2xl border-2 border-snow-300/80 bg-white p-4">
      <p className="text-[15px] font-bold text-ink-900">
        {t.title} <span className="text-[13px] font-normal text-snow-500">{t.opt}</span>
      </p>
      <p className="mt-0.5 text-[12.5px] text-snow-500">{t.desc}</p>

      <button
        type="button"
        onClick={() => onPick("")}
        aria-pressed={!cur}
        className={cn(
          "mt-3 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold",
          !cur ? "border-ink-900 bg-ink-900 text-white" : "border-snow-300/70 bg-white text-ink-700"
        )}
      >
        {t.none}
      </button>

      {FEE_TIERS.map((tier) => (
        <div key={tier} className="mt-3">
          <p className="text-[12.5px] font-bold text-snow-600">
            {t.tier[tier]} · +{t.won(DESIGNATED_FEE[tier])}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {people
              .filter((p) => p.fee === tier)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPick(p.id)}
                  aria-pressed={id === p.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-[13px] font-semibold",
                    id === p.id
                      ? "border-brand-500 bg-brand-500 text-white"
                      : tier === "high"
                        ? "border-[#ecd9a8] bg-[#fdf7e8] text-ink-900"
                        : "border-snow-300/70 bg-white text-ink-700"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-7 w-7 rounded-full object-cover object-top" />
                  {p.name}
                </button>
              ))}
          </div>
        </div>
      ))}

      {cur && (
        <div className="mt-4 rounded-xl bg-ice-200/70 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[14px] font-bold text-ink-900">{t.picked(cur.name)}</span>
            <span className="whitespace-nowrap text-[15px] font-bold text-brand-700">+{t.won(fee)}</span>
          </div>
          <p className="mt-1 text-[12px] text-snow-600">{t.once}</p>
          {grand > 0 && (
            <div className="mt-2.5 flex items-end justify-between gap-3 border-t border-snow-300/60 pt-2.5">
              <span className="text-[13px] font-semibold text-snow-600">{t.total}</span>
              <span className="whitespace-nowrap text-[20px] font-bold tabular-nums text-ink-900">{lang === "ko" ? `${grand.toLocaleString("ko-KR")}원` : `₩${grand.toLocaleString("en-US")}`}</span>
            </div>
          )}
        </div>
      )}
      <a href={`/${lang}/instructor/`} className="mt-3 inline-block text-[12.5px] font-semibold text-brand-600 underline underline-offset-2">
        {t.see}
      </a>
    </div>
  );
}
