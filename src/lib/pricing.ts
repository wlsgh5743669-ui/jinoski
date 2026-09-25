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

export type BookingPriceResult = {
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
}: {
  program: ProgramValue;
  groupSize: string;
  liftPassPayment: string;
  content: SiteContent;
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
        liftPassFee: 0,
        liftPassFeePerPerson: 0,
        liftPassPersonCount: 0,
        totalPrice: 0,
        priceOnRequest: true,
      };
    const basePrice = parseWon(row.price);
    return {
      basePrice,
      liftPassFee: 0,
      liftPassFeePerPerson: 0,
      liftPassPersonCount: 0,
      totalPrice: basePrice,
      priceOnRequest: false,
    };
  }

  const lessonGroup = content.lessonPricing.find((g) => g.program === program);
  const row = lessonGroup?.rows.find((r) => r.people === groupSize);
  if (!row)
    return {
      basePrice: 0,
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
  const totalPrice = includeLiftPass ? basePrice + liftPassFee : basePrice;

  return {
    basePrice,
    liftPassFee,
    liftPassFeePerPerson,
    liftPassPersonCount,
    totalPrice,
    priceOnRequest: false,
  };
}
