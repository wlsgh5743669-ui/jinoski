import type { SiteContent } from "@/config/content/types";
import { isHourlyProgram, type ProgramValue } from "@/lib/booking-options";

function parseWon(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}

/**
 * Hourly-program group sizes are coded as instructor:student ratios
 * ("1:1", "1:2", "1:3"). The lift pass (패찰) is issued per student, so its
 * cost must scale with the student count — one pass per person, not one
 * flat fee per booking. Exported so the UI can show the "단가 × 인원" breakdown
 * instead of just the final total.
 */
export function getGroupStudentCount(groupSize: string): number {
  const ratio = groupSize.match(/^1:(\d+)$/);
  if (ratio) return Number(ratio[1]);
  const fullCare = groupSize.match(/^(\d+)p$/);
  return fullCare ? Number(fullCare[1]) : 1;
}

/**
 * 26/27 얼리버드: 2시간·3시간 강습, 원데이 풀케어 레슨료 10% 할인.
 * 예약하는 날(한국 시간) 기준 11월 10일까지 적용. 패찰 비용은 할인 대상이 아님.
 */
export const EARLY_BIRD = {
  endDate: "2026-11-10",
  rate: 0.1,
  programs: ["2h", "3h", "one-day"] as ProgramValue[],
};

export function isEarlyBirdActive(now: Date = new Date()): boolean {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return kst <= EARLY_BIRD.endDate;
}

export function isEarlyBirdEligible(program: ProgramValue | null): boolean {
  return !!program && isEarlyBirdActive() && EARLY_BIRD.programs.includes(program);
}

function earlyBirdDiscountFor(program: ProgramValue, basePrice: number, apply?: boolean): number {
  if (!apply || !isEarlyBirdEligible(program)) return 0;
  return Math.round((basePrice * EARLY_BIRD.rate) / 1000) * 1000;
}

export type BookingPriceResult = {
  earlyBirdDiscount: number;
  basePrice: number;
  liftPassFee: number;
  liftPassFeePerPerson: number;
  liftPassPersonCount: number;
  totalPrice: number;
  priceOnRequest: boolean;
};

export function calculateBookingPrice({
  program,
  groupSize,
  liftPassPayment,
  content,
  earlyBird,
}: {
  program: ProgramValue;
  groupSize: string;
  liftPassPayment: string;
  content: SiteContent;
  /** 고객이 예약 마지막 단계에서 "얼리버드 10% 할인 받기"를 눌렀을 때만 true */
  earlyBird?: boolean;
}): BookingPriceResult {
  if (program === "one-day" || program === "night") {
    const fullCare = content.fullCarePrograms.find((p) => p.slug === program);
    const row = fullCare?.rows.find((r) => r.people === groupSize);
    // If a program/groupSize combination has no matching price row (e.g. a new
    // program value is added without a corresponding pricing row), fall back
    // to "price on request" instead of silently quoting ₩0 to the customer.
    if (!row)
      return {
        basePrice: 0,
        earlyBirdDiscount: 0,
        liftPassFee: 0,
        liftPassFeePerPerson: 0,
        liftPassPersonCount: 0,
        totalPrice: 0,
        priceOnRequest: true,
      };
    const basePrice = parseWon(row.price);
    const earlyBirdDiscount = earlyBirdDiscountFor(program, basePrice, earlyBird);
    return {
      basePrice,
      earlyBirdDiscount,
      liftPassFee: 0,
      liftPassFeePerPerson: 0,
      liftPassPersonCount: 0,
      totalPrice: basePrice - earlyBirdDiscount,
      priceOnRequest: false,
    };
  }

  const lessonGroup = content.lessonPricing.find((g) => g.program === program);
  const row = lessonGroup?.rows.find((r) => r.people === groupSize);
  if (!row)
    return {
      basePrice: 0,
      earlyBirdDiscount: 0,
      liftPassFee: 0,
      liftPassFeePerPerson: 0,
      liftPassPersonCount: 0,
      totalPrice: 0,
      priceOnRequest: true,
    };
  const basePrice = parseWon(row.price);

  const liftPassEntry = content.liftPassPricing.find((p) => p.program === program);
  const liftPassFeePerPerson = liftPassEntry ? parseWon(liftPassEntry.price) : 0;
  const liftPassPersonCount = getGroupStudentCount(groupSize);
  const liftPassFee = liftPassFeePerPerson * liftPassPersonCount;

  const includeLiftPass = isHourlyProgram(program) && liftPassPayment === "pay-together";
  const earlyBirdDiscount = earlyBirdDiscountFor(program, basePrice, earlyBird);
  const lessonPrice = basePrice - earlyBirdDiscount;
  const totalPrice = includeLiftPass ? lessonPrice + liftPassFee : lessonPrice;

  return {
    basePrice,
    earlyBirdDiscount,
    liftPassFee,
    liftPassFeePerPerson,
    liftPassPersonCount,
    totalPrice,
    priceOnRequest: false,
  };
}
