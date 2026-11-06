"use client";

import { useState } from "react";
import { trackEvent } from "@/components/shared/analytics";
import { cn } from "@/lib/utils";

export type GuideCard = { src: string; alt: string };

/**
 * 안내 이미지 카드 묶음 (1080×1350 세로 카드 3장 등).
 * - swipe: 옆으로 넘기기 (좁은 페이지용).
 * - responsive: 휴대폰에선 옆으로 넘기고, 넓은 화면에선 한 줄에 3장.
 * - thumbs: 작은 썸네일 한 줄 (예약하기 첫 화면처럼 자리가 좁을 때).
 * 누르면 화면 가득 크게 보고 ‹ › 로 넘겨요.
 */
export function GuideCards({
  cards,
  event,
  variant = "swipe",
  className,
}: {
  cards: GuideCard[];
  event: string;
  variant?: "swipe" | "responsive" | "thumbs";
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const show = (i: number) => {
    setOpen(i);
    trackEvent(event, { card: String(i + 1) });
  };
  const move = (d: number) => setOpen((i) => (i === null ? i : (i + d + cards.length) % cards.length));

  return (
    <>
      {variant !== "thumbs" ? (
        <div
          className={cn(
            "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]",
            variant === "responsive" && "sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0",
            className
          )}
        >
          {cards.map((c, i) => (
            <button
              key={c.src}
              type="button"
              onClick={() => show(i)}
              className={cn("w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl bg-white ring-1 ring-snow-300/60", variant === "responsive" && "sm:w-auto")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} loading="lazy" width={1080} height={1350} className="block h-auto w-full" />
            </button>
          ))}
        </div>
      ) : (
        <div className={cn("grid grid-cols-3 gap-2", className)}>
          {cards.map((c, i) => (
            <button key={c.src} type="button" onClick={() => show(i)} className="overflow-hidden rounded-xl bg-white ring-1 ring-snow-300/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} loading="lazy" width={1080} height={1350} className="block h-auto w-full" />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div role="dialog" aria-modal="true" onClick={() => setOpen(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cards[open].src} alt={cards[open].alt} className="max-h-[88svh] w-auto max-w-full rounded-xl" />
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[13px] font-bold text-ink-900">닫기 ✕</span>
          {cards.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label="이전"
                onClick={(e) => {
                  e.stopPropagation();
                  move(-1);
                }}
                className="h-11 w-11 rounded-full bg-white/90 text-[20px] font-bold text-ink-900"
              >
                ‹
              </button>
              <span className="text-[13px] font-bold text-white">
                {open + 1} / {cards.length}
              </span>
              <button
                type="button"
                aria-label="다음"
                onClick={(e) => {
                  e.stopPropagation();
                  move(1);
                }}
                className="h-11 w-11 rounded-full bg-white/90 text-[20px] font-bold text-ink-900"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const SEASON_LINK_CARDS: GuideCard[] = [
  { src: "/images/season-link/1.jpg", alt: "링크 하나로 시즌 전체를 한눈에 — 다음 강습 D-day, 남은 횟수, 담당 강사, 날씨·준비물" },
  { src: "/images/season-link/2.jpg", alt: "강습 날짜는 직접 골라요 — 달력에서 날짜 고르기, 바로 확정, 2일 전까지 무료 변경 3회, 전날 문자 안내" },
  { src: "/images/season-link/3.jpg", alt: "매회 알림장으로 성장 확인 — 오늘 배운 것, 성장 그래프, 다음 목표, 실력 별점" },
];

export const DAY_LESSON_CARDS: GuideCard[] = [
  { src: "/images/guide/day-1.jpg", alt: "하루 강습 요금 — 2·3·4시간과 7시간 풀케어, 1:1·1:2·1:3 금액, 패찰 별도, 리프트·장비 40% 할인" },
  { src: "/images/guide/day-2.jpg", alt: "수업 시간표 — 2시간 1~5교시, 3·4시간 오전·오후·야간, 원데이·나이트 풀케어" },
  { src: "/images/guide/day-3.jpg", alt: "예약은 이렇게 — 홈페이지 신청, 강사 일정 확인 후 확정, 예약금 20%, 스키월드 광장 집합, 환불·변경 규정" },
];

export const STAY_CARDS: GuideCard[] = [
  { src: "/images/guide/stay-1.jpg", alt: "연박 강습, 견적 한 번에 — 2박 3일·하루 2회·가족 여러 팀, 6단계 견적 계산기" },
  { src: "/images/guide/stay-2.jpg", alt: "이렇게 배워요 — 하루 2회 수업 조합, 반 나누기·강사 배정, 첫날·둘째 날·마지막 날" },
  { src: "/images/guide/stay-3.jpg", alt: "견적에 다 들어가요 — 패찰 포함, 사진·영상 무료, 리프트·장비 40% 할인, 예약금 20%" },
];
