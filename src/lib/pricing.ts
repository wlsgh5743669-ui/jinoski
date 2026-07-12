import type { SiteContent } from "@/config/content/types";
import { isHourlyProgram, type ProgramValue } from "@/lib/booking-options";

function parseWon(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}

export type BookingPriceResult = {
  basePrice: number;
  liftPassFee: number;
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
  if (program === "night") {
    return { basePrice: 0, liftPassFee: 0, totalPrice: 0, priceOnRequest: true };
  }

  if (program === "one-day") {
    const oneDay = content.fullCarePrograms.find(
      (p): p is Extract<typeof p, { slug: "one-day" }> => p.slug === "one-day"
    );
    const row = oneDay?.rows.find((r) => r.people === groupSize);
    const basePrice = row ? parseWon(row.price) : 0;
    return { basePrice, liftPassFee: 0, totalPrice: basePrice, priceOnRequest: false };
  }

  const lessonGroup = content.lessonPricing.find((g) => g.program === program);
  const row = lessonGroup?.rows.find((r) => r.people === groupSize);
  const basePrice = row ? parseWon(row.price) : 0;

  const liftPassEntry = content.liftPassPricing.find((p) => p.program === program);
  const liftPassFee = liftPassEntry ? parseWon(liftPassEntry.price) : 0;

  const includeLiftPass = isHourlyProgram(program) && liftPassPayment === "pay-together";
  const totalPrice = includeLiftPass ? basePrice + liftPassFee : basePrice;

  return { basePrice, liftPassFee, totalPrice, priceOnRequest: false };
}
