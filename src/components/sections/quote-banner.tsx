"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { trackEvent } from "@/components/shared/analytics";

/** 홈 화면 연박·가족 견적 안내 배너 (ko/en/zh) */
const QB = {
  ko: { eyebrow: "연박 · 가족 여러 팀", t1: "2박 3일, 하루 2회, 가족 두 팀?", t2: "견적을 바로 계산해 보세요", chips: ["날짜별 시간표 자동", "리프트·장비 40% 할인", "견적서 이미지 저장"], cta: "연박 견적내기 →" },
  en: { eyebrow: "Multi-day · families · groups", t1: "3 days, 2 lessons a day, two families?", t2: "See your total price right now", chips: ["Timetable by date", "Lift & rental 40% off", "Save your quote as an image"], cta: "Get a multi-day quote →" },
  zh: { eyebrow: "多日 · 家庭 · 团体", t1: "3天、每天2节课、两个家庭？", t2: "马上算出总价", chips: ["按日期自动排课", "缆车·装备6折", "报价单可存图"], cta: "多日报价 →" },
};
export function QuoteBanner() {
  const loc = useLocale();
  const l = (loc === "en" || loc === "zh" ? loc : "ko") as keyof typeof QB;
  const T = QB[l];
  return (
    <section className="bg-white py-10 sm:py-14">
      <Container>
        <a
          href={`/${l}/quote/`}
          onClick={() => trackEvent("quote_open", { from: "home_banner" })}
          className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl bg-ink-900 p-7 text-white transition-transform hover:scale-[1.01] sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-300">{T.eyebrow}</p>
            <p className="mt-2 text-[24px] font-bold leading-snug sm:text-[28px]">
              {T.t1}
              <br />
              {T.t2}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[13px] text-white/80">
              {T.chips.map((c) => (
                <li key={c} className="rounded-full bg-white/10 px-3 py-1">{c}</li>
              ))}
            </ul>
          </div>
          <span className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-brand-500 px-7 text-[16px] font-bold">
            {T.cta}
          </span>
        </a>
      </Container>
    </section>
  );
}
