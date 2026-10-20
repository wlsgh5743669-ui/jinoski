"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { trackEvent } from "@/components/shared/analytics";

/** 홈 화면 연박·가족 견적 안내 배너 (한국어만) */
export function QuoteBanner() {
  if (useLocale() !== "ko") return null;
  return (
    <section className="bg-white py-10 sm:py-14">
      <Container>
        <a
          href="/ko/quote/"
          onClick={() => trackEvent("quote_open", { from: "home_banner" })}
          className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl bg-ink-900 p-7 text-white transition-transform hover:scale-[1.01] sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-300">연박 · 가족 여러 팀</p>
            <p className="mt-2 text-[24px] font-bold leading-snug sm:text-[28px]">
              2박 3일, 하루 2회, 가족 두 팀?
              <br />
              견적을 바로 계산해 보세요
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[13px] text-white/80">
              <li className="rounded-full bg-white/10 px-3 py-1">날짜별 시간표 자동</li>
              <li className="rounded-full bg-white/10 px-3 py-1">리프트·장비 40% 할인</li>
              <li className="rounded-full bg-white/10 px-3 py-1">견적서 이미지 저장</li>
            </ul>
          </div>
          <span className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-brand-500 px-7 text-[16px] font-bold">
            연박 견적내기 →
          </span>
        </a>
      </Container>
    </section>
  );
}
