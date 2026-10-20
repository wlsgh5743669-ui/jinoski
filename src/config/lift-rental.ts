// 견적 계산기(/ko/quote)용 비발디파크 리프트권·장비 렌탈 정가 (1인 1일, [평일, 주말])
// 비발디파크 매표소 「리프트/렌탈 요금」 안내판과 동일 (주중 / 주말·공휴일). 요금이 바뀌면 숫자만 바꿔주세요.
// 지노스키 고객은 정가에서 DISCOUNT 만큼 할인 (헬멧·의류는 할인 제외)

export const LIFT_RENTAL_DISCOUNT = 0.4;

export type TicketHours = 3 | 5 | 7;

export const LIFT_PRICES: Record<TicketHours, { adult: [number, number]; child: [number, number] }> = {
  3: { adult: [66000, 82000], child: [60000, 74000] },
  5: { adult: [75000, 91000], child: [68000, 82000] },
  7: { adult: [83000, 99000], child: [75000, 89000] },
};

/** 리프트 시간권에 맞춘 장비 렌탈 (3시간권→4시간, 5시간권→6시간, 7시간권→8시간) */
export const RENTAL_PRICES: Record<TicketHours, { hours: number; adult: [number, number]; child: [number, number] }> = {
  3: { hours: 4, adult: [30000, 39000], child: [27000, 35000] },
  5: { hours: 6, adult: [34000, 43000], child: [31000, 39000] },
  7: { hours: 8, adult: [38000, 47000], child: [34000, 42000] },
};

/** 소인 기준: 13세 이하(초등학생, 한국 나이 · 3월 중학교 입학 예정자 포함) / 대인 14세 이상 — 소노 FAQ */
export const CHILD_LABEL = "어린이(13세 이하·초등)";

/** 안전헬멧 (할인 제외 · 현장 결제): 4시간권 3,000 / 6시간권 4,000 / 8시간권 5,000 */
export const HELMET_NOTE = "헬멧은 할인 제외 (현장 3,000~5,000원)";
