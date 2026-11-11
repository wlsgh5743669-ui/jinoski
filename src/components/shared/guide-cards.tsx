"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/components/shared/analytics";
import { isEarlyBirdActive } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** regular: 얼리버드가 끝나면(11/21부터, 한국 시간) 대신 보여줄 정가판 이미지 */
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

// alt = 카드에 적힌 핵심 글(가격·시간·규정)을 그대로 — 검색엔진·AI·스크린리더가 이미지 속 내용을 읽을 수 있게 (2026-11-08)
// 카드 문구를 바꾸면 alt도 같이 바꿔 주세요. 얼리버드처럼 기간이 끝나는 문구는 넣지 않아요.
export const SEASON_LINK_CARDS: GuideCard[] = [
  { src: "/images/season-link/1.jpg", alt: "지노스키 시즌 강습 링크 화면 — 링크 하나로 다음 강습 D-day, 남은 횟수, 담당 강사, 날씨·준비물을 한눈에 확인" },
  { src: "/images/season-link/2.jpg", alt: "지노스키 시즌 강습 날짜 고르기 — 달력에서 직접 날짜를 고르면 바로 확정, 강습 2일 전까지 무료 변경 3회, 전날 문자 안내" },
  { src: "/images/season-link/3.jpg", alt: "지노스키 시즌 강습 알림장 — 매회 오늘 배운 것, 성장 그래프, 다음 목표, 실력 별점을 기록" },
];

export const DAY_LESSON_CARDS: GuideCard[] = [
  { src: "/images/guide/day-1.jpg", regular: "/images/guide/day-1-regular.jpg", alt: "지노스키 하루 강습 요금표(강사 1명 기준) — 2시간 1:1 14만원·1:2 20만원·1:3 24만원, 3시간 21만·30만·36만원, 4시간 28만·40만·48만원, 7시간 풀케어 55만·70만·90만원(패찰·식사 포함). 패찰 1인 2시간 25,000원·3시간 35,000원·4시간 50,000원 별도. 리프트권·장비 정가 40% 할인, 매 수업 사진·영상 무료" },
  { src: "/images/guide/day-2.jpg", alt: "비발디파크 강습 시간표 — 2시간: 1교시 09:00~11:00, 2교시 11:00~13:00, 3교시 13:20~15:20, 4교시 15:30~17:30, 5교시(야간) 19:00~21:00. 3·4시간: 오전 09:00, 오후 13:20, 야간 19:00 시작. 원데이 풀케어 08:40~16:30, 나이트 풀케어 13:30~22:10" },
  { src: "/images/guide/day-3.jpg", alt: "지노스키 예약 순서 — 홈페이지에서 날짜·프로그램·시간·인원·종목·실력 선택, 강사 일정 확인 후 확정 연락, 예약금 30만원(잔금은 강습 당일), 비발디파크 스키월드 광장 스키하우스 입구 집합. 환불 3일 전 100%·1~2일 전 50%·당일 불가, 2일 전까지 1회 무료 변경" },
];

/** 예약하기 마지막 단계·접수 화면 「예약은 이렇게 진행돼요」 */
export const BOOKING_CARDS: GuideCard[] = [
  { src: "/images/guide/booking-1.jpg", alt: "지노스키 예약 진행 순서 — 1 예약 신청(아직 확정 전), 2 강사 일정 확인 후 확정 연락, 3 예약금 30만원 입금·잔금은 강습 당일, 4 당일 비발디파크 스키월드 광장 집합. 네이버페이·카드는 지노스키 스마트스토어에서 결제" },
  { src: "/images/guide/booking-2.jpg", alt: "지노스키 취소·변경 규정 — 레슨 3일 전까지 전액 환불, 1~2일 전 50% 환불, 당일 취소·노쇼 환불 불가. 레슨 2일 전까지 1회 무료 일정 변경. 기상 악화로 슬로프가 닫히면 무료 변경 또는 전액 환불" },
];

export const STAY_CARDS: GuideCard[] = [
  { src: "/images/guide/stay-1.jpg", alt: "지노스키 연박·가족 강습 견적 — 2박 3일, 하루 2회 수업, 가족 여러 팀도 6단계 견적 계산기로 1인 금액까지 바로 확인" },
  { src: "/images/guide/stay-2.jpg", alt: "연박 강습 수업 짜는 법 — 하루 2회면 1+3교시 또는 2+4교시, 강사 1명당 최대 3명(4명은 2+2, 5명은 3+2), 가족마다 강사 따로, 연박은 매일 같은 강사. 스키·스노보드 모두 만 4세부터" },
  { src: "/images/guide/stay-3.jpg", alt: "연박 견적에 포함되는 것 — 패찰 포함, 매 수업 사진·영상 무료, 리프트·장비 정가 40% 할인(날짜별 주중·주말 자동 계산), 헬멧 하루 5,000원, 예약금 30만원·잔금은 강습 당일" },
];

export const PRICING_CARDS: GuideCard[] = [
  { src: "/images/guide/pricing-1.jpg", regular: "/images/guide/pricing-1-regular.jpg", alt: "지노스키 시간제 강습 요금표 — 2시간 1:1 14만원·1:2 20만원·1:3 24만원, 3시간 21만·30만·36만원, 4시간 28만·40만·48만원, 7시간 풀케어 55만·70만·90만원(패찰·식사 포함). 패찰 별도. 시즌 8회 패키지(2시간×8회) 1:1 112만원·1:2 160만원·1:3 192만원" },
  { src: "/images/guide/pricing-2.jpg", alt: "비발디파크 강습 시간표 — 2시간 1교시 09:00부터 5교시(야간) 19:00~21:00까지, 3·4시간은 오전 09:00·오후 13:20·야간 19:00 시작, 원데이 풀케어 08:40~16:30, 나이트 풀케어 13:30~22:10(정설 17:30~19:00)" },
  { src: "/images/guide/pricing-3.jpg", alt: "비발디파크 리프트권·장비 렌탈 40% 할인가 — 리프트 3시간 대인 주중 39,600원·주말 49,200원, 5시간 45,000·54,600원, 7시간 49,800·59,400원. 리프트+장비 3시간 대인 주중 57,600원·주말 72,600원. 소인은 13세 이하" },
  { src: "/images/guide/pricing-4.jpg", alt: "지노스키 결제 방법 — 강사 일정 확인 후 확정 안내, 예약금 30만원 입금으로 확정, 잔금은 강습 당일. 계좌이체 또는 스마트스토어 네이버페이·카드. 환불 3일 전 100%·1~2일 전 50%·당일 불가" },
];

/** 메인 Why JinoSki 아래: 강점·다른 강습과 다른 점·자주 묻는 질문 (원본: 상담자료/지노스키_FAQ_강점/make.py, 2026-11-12) */
export const WHY_CARDS: GuideCard[] = [
  { src: "/images/guide/why-3.jpg", alt: "지노스키의 강점 — 1:1~1:3 소수정예, 무선 헤드셋 코칭, 사진·영상 기본 포함, 강사진 전원 대한스키지도자연맹 공인 자격·영업배상책임보험, 4세부터 유아 1:1, 시즌 8회 전담 강사와 알림장. 비발디파크 강습 8년+, 대표 누적 강습 2,500회+, 평균 만족도 4.8, 한·영·중 상담" },
  { src: "/images/guide/why-4.jpg", alt: "다른 강습과 뭐가 달라요 — 흔한 단체 강습과 비교: 인원 1~3명, 시즌 8회는 같은 강사, 헤드셋으로 타는 중에 교정, 사진·영상 기본, 예약 전에 패찰·리프트·렌탈까지 총액 안내, 맞춤 피드백과 알림장. 리뷰 이벤트 참여 후기 인용" },
  { src: "/images/guide/why-1.jpg", alt: "자주 묻는 질문 1 — 처음 타도 괜찮은지, 유아는 4~7세 레슨, 2시간 1:1 14만·1:2 20만·1:3 24만원, 패찰은 비발디파크 외부강습 허가권(2시간 2.5만원), 리프트권·렌탈·식사는 별도, 장비는 현장 렌탈" },
  { src: "/images/guide/why-2.jpg", alt: "자주 묻는 질문 2 — 스키월드 광장 스키하우스 입구에서 만남, 사진·영상 기본 포함, 환불 3일 전 100%·1~2일 전 50%·당일 불가, 기상 악화로 슬로프 운영이 멈추면 무료 변경·전액 환불, 주말은 1~2주 전 예약, 예약금 30만원·잔금 강습 날" },
];

export const JUNIOR_CARDS: GuideCard[] = [
  { src: "/images/guide/junior-1.jpg", alt: "대한스키지도자연맹(KSIA) 주니어 스키 10단계 등급표(만 7~17세) — 1 스노우플라우부터 5 베이직 숏턴, 6 다이나믹 롱턴, 7 다이나믹 숏턴, 8·9 카빙성 롱턴·숏턴, 10 종합활강까지 등급별 뱃지 색. 7등급을 따면 만 18세에 지도자 Level 1" },
  { src: "/images/guide/junior-2.jpg", alt: "지노스키 주니어 등급 심사 요금 — 1~6등급 1명 25만원·2명 30만원·3명 36만원, 7~10등급 1명 35만원·2명 48만원·3명 54만원. 2시간 수업+심사, 연맹 응시료·뱃지·인증서 발급료 포함, 패찰 1인 25,000원 별도" },
  { src: "/images/guide/junior-3.jpg", alt: "주니어 등급 심사 당일 진행 — 상담, 워밍업·연습, 공인 지도자 심사, 결과 등록·뱃지 전달. 합격 보장은 없고 스키만 해당" },
];

export const VIVALDI_CARDS: GuideCard[] = [
  { src: "/images/guide/vivaldi-1.jpg", alt: "지노스키 집합 장소 — 비발디파크 스키월드 광장 스키하우스 입구(강원 홍천군 서면 한치골길 262), 레슨 20~30분 전 도착, 도착하면 카톡이나 010-4047-7711로 연락. 자가용·셔틀버스 오는 법" },
  { src: "/images/guide/vivaldi-2.jpg", alt: "패찰·리프트권·장비 렌탈 안내 — 패찰(강습 허가권) 1인 2시간 25,000원·3시간 35,000원·4시간 50,000원, 레슨 뒤 더 타려면 개인 리프트권 필요, 아이 장비는 키·몸무게 알려주기, 리프트·장비 지노스키 예약 시 40% 할인" },
  { src: "/images/guide/vivaldi-3.jpg", alt: "스키 강습 준비물 — 방수 스키복, 장갑, 고글, 넥워머, 여벌 양말, 간식·물, 휴대폰 방수팩. 산 위는 영하 10도 이하인 날이 많아 여러 겹 입기, 폭설·강풍으로 슬로프가 닫히면 변경 또는 전액 환불" },
];
