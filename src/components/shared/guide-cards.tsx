"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/components/shared/analytics";
import { isEarlyBirdActive } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** regular: 얼리버드가 끝나면(11/11부터, 한국 시간) 대신 보여줄 정가판 이미지 */
export type GuideCard = { src: string; alt: string; regular?: string };

const noSubscribe = () => () => {};

/**
 * 안내 이미지 카드 묶음 (1080×1350 세로 카드 3장 등).
 * - swipe: 옆으로 넘기기 (좁은 페이지용).
 * - responsive: 휴대폰에선 옆으로 넘기고, 넓은 화면에선 한 줄에 3장.
 * - thumbs: 작은 썸네일 한 줄 (예약하기 첫 화면처럼 자리가 좁을 때).
 * 누르면 화면 가득 크게 보고 옆으로 밀거나 ‹ › 로 넘겨요.
 */
export function GuideCards({
  cards: input,
  event,
  variant = "swipe",
  className,
}: {
  cards: GuideCard[];
  event: string;
  variant?: "swipe" | "responsive" | "thumbs";
  className?: string;
}) {
  // 빌드된 HTML은 얼리버드판, 브라우저에선 오늘 날짜(한국 시간)로 판단
  const earlyBird = useSyncExternalStore(noSubscribe, isEarlyBirdActive, () => true);
  const cards = earlyBird ? input : input.map((c) => (c.regular ? { ...c, src: c.regular } : c));
  const [open, setOpen] = useState<number | null>(null);
  // 크게 보기에서 손가락으로 옆으로 밀어 넘기기
  const [drag, setDrag] = useState(0);
  const [dir, setDir] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const show = (i: number) => {
    setDir(0);
    setOpen(i);
    trackEvent(event, { card: String(i + 1) });
  };
  // 넘긴 방향 (새 카드가 그쪽에서 미끄러져 들어와요 — 카드들이 비슷하게 생겨서 넘어간 게 보이도록)
  const move = (d: number) => {
    setDir(d);
    setOpen((i) => (i === null ? i : (i + d + cards.length) % cards.length));
  };
  // 페이지 안 가로 스크롤에서 지금 몇 번째 카드인지 (점 표시)
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = scroller.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setActive(Math.min(cards.length - 1, Math.round(el.scrollLeft / (first.offsetWidth + 12))));
  };
  const dots = (current: number, dark?: boolean) => (
    <div className="flex items-center justify-center gap-1.5">
      {cards.map((c, i) => (
        <span
          key={c.src}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === current ? (dark ? "w-6 bg-white" : "w-6 bg-brand-500") : dark ? "w-2 bg-white/40" : "w-2 bg-snow-300"
          )}
        />
      ))}
    </div>
  );

  return (
    <>
      {variant !== "thumbs" ? (
        <>
        <div
          ref={scroller}
          onScroll={onScroll}
          className={cn(
            "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]",
            variant === "responsive" && "sm:mx-0 sm:grid sm:overflow-visible sm:px-0",
            variant === "responsive" && (cards.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"),
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
        {cards.length > 1 && (
          <div className={cn("mt-3", variant === "responsive" && "sm:hidden")}>
            {dots(active)}
          </div>
        )}
        </>
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
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            setOpen(null);
          }}
          onTouchStart={(e) => {
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            swiped.current = false;
          }}
          onTouchMove={(e) => {
            if (!touch.current) return;
            const dx = e.touches[0].clientX - touch.current.x;
            const dy = e.touches[0].clientY - touch.current.y;
            if (Math.abs(dx) > Math.abs(dy)) setDrag(dx);
          }}
          onTouchEnd={() => {
            if (Math.abs(drag) > 50 && cards.length > 1) {
              move(drag < 0 ? 1 : -1);
              swiped.current = true;
            } else if (Math.abs(drag) > 10) swiped.current = true;
            touch.current = null;
            setDrag(0);
          }}
          className="fixed inset-0 z-[60] flex touch-pan-y items-center justify-center bg-black/80 p-3"
        >
          <div
            key={open}
            className={cn(dir > 0 && "animate-guide-in-right", dir < 0 && "animate-guide-in-left")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cards[open].src}
              alt={cards[open].alt}
              draggable={false}
              style={{ transform: `translateX(${drag}px)`, opacity: 1 - Math.min(Math.abs(drag) / 600, 0.4) }}
              className={cn("max-h-[80svh] w-auto max-w-full select-none rounded-xl", drag === 0 && "transition-transform duration-200")}
            />
          </div>
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
              <div className="flex min-w-[88px] flex-col items-center gap-1.5">
                {dots(open, true)}
                <span className="text-[12.5px] font-bold text-white">
                  {open + 1} / {cards.length}
                </span>
              </div>
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
  { src: "/images/guide/day-1.jpg", regular: "/images/guide/day-1-regular.jpg", alt: "하루 강습 요금 — 2·3·4시간과 7시간 풀케어, 1:1·1:2·1:3 금액, 패찰 별도, 리프트·장비 40% 할인" },
  { src: "/images/guide/day-2.jpg", alt: "수업 시간표 — 2시간 1~5교시, 3·4시간 오전·오후·야간, 원데이·나이트 풀케어" },
  { src: "/images/guide/day-3.jpg", alt: "예약은 이렇게 — 홈페이지 신청, 강사 일정 확인 후 확정, 예약금 30만원, 스키월드 광장 집합, 환불·변경 규정" },
];

/** 예약하기 마지막 단계·접수 화면 「예약은 이렇게 진행돼요」 */
export const BOOKING_CARDS: GuideCard[] = [
  { src: "/images/guide/booking-1.jpg", alt: "예약은 이렇게 진행돼요 — 예약 신청, 강사 일정 확인 후 확정 연락, 예약금 30만원 입금(잔금은 당일), 스키월드 광장 집합, 입금 계좌·네이버페이" },
  { src: "/images/guide/booking-2.jpg", alt: "취소·변경 규정 — 3일 전까지 100%, 1~2일 전 50%, 당일·노쇼 환불 불가, 2일 전까지 1회 무료 변경, 기상 악화 시 무료 변경 또는 전액 환불" },
];

export const STAY_CARDS: GuideCard[] = [
  { src: "/images/guide/stay-1.jpg", alt: "연박 강습, 견적 한 번에 — 2박 3일·하루 2회·가족 여러 팀, 6단계 견적 계산기" },
  { src: "/images/guide/stay-2.jpg", alt: "이렇게 배워요 — 하루 2회 수업 조합, 반 나누기·강사 배정, 첫날·둘째 날·마지막 날" },
  { src: "/images/guide/stay-3.jpg", alt: "견적에 다 들어가요 — 패찰 포함, 사진·영상 무료, 리프트·장비 40% 할인, 예약금 30만원" },
];

export const PRICING_CARDS: GuideCard[] = [
  { src: "/images/guide/pricing-1.jpg", regular: "/images/guide/pricing-1-regular.jpg", alt: "시간제 강습 요금 — 2·3·4시간과 7시간 풀케어, 1:1·1:2·1:3 금액, 패찰 별도, 시즌 8회 패키지" },
  { src: "/images/guide/pricing-2.jpg", alt: "수업 시간표 — 2시간 1~5교시, 3·4시간 오전·오후·야간, 원데이·나이트 풀케어" },
  { src: "/images/guide/pricing-3.jpg", alt: "리프트·장비 40% 할인 — 3·5·7시간권, 대인·소인, 주중·주말 할인가" },
  { src: "/images/guide/pricing-4.jpg", alt: "결제는 이렇게 — 확정 안내 후 예약금 30만원, 잔금은 강습 당일, 계좌이체·네이버페이, 환불·변경 규정" },
];

export const JUNIOR_CARDS: GuideCard[] = [
  { src: "/images/guide/junior-1.jpg", alt: "주니어 스키 10단계 등급 — 1등급 스노우플라우부터 10등급 종합활강까지 뱃지 색, 7등급 특전" },
  { src: "/images/guide/junior-2.jpg", alt: "등급 심사 요금 — 1~6등급 25만원부터, 7~10등급 35만원부터, 연맹 응시료·발급료 포함, 패찰 별도" },
  { src: "/images/guide/junior-3.jpg", alt: "심사 진행 — 상담, 워밍업·연습, 심사, 결과 등록·뱃지 전달, 꼭 확인할 점" },
];

export const VIVALDI_CARDS: GuideCard[] = [
  { src: "/images/guide/vivaldi-1.jpg", alt: "스키월드 광장에서 만나요 — 집합 장소, 20~30분 전 도착, 자가용·셔틀버스 오는 법" },
  { src: "/images/guide/vivaldi-2.jpg", alt: "패찰·리프트권·장비 렌탈 — 패찰 요금, 렌탈 안내, 리프트·장비 40% 할인" },
  { src: "/images/guide/vivaldi-3.jpg", alt: "준비물·날씨 — 스키복, 장갑, 고글, 넥워머, 여벌 양말, 간식, 방수팩, 날씨와 슬로프 운영" },
];
