import type { SiteContent } from "@/config/content/types";
import { isHourlyProgram, type ProgramValue } from "@/lib/booking-options";

export const PHOTO_ADDON_PER_PERSON = 20000;

function parsePriceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function groupSizeToCount(groupSize: string): number {
  if (groupSize === "1p") return 1;
  if (groupSize === "2p") return 2;
  if (groupSize === "3p") return 3;
  const match = groupSize.match(/^1:(\d)$/);
  return match ? Number(match[1]) : 1;
}

export type PriceBreakdown = {
  basePrice: number;
  photoAddOn: number;
  liftPassFee: number;
  priceOnRequest: boolean;
  totalPrice: number;
};

export function calculateBookingPrice({
  program,
  groupSize,
  wantsPhoto,
  liftPassPayment,
  content,
}: {
  program: ProgramValue;
  groupSize: string;
  wantsPhoto: boolean;
  liftPassPayment?: string;
  content: SiteContent;
}): PriceBreakdown {
  if (isHourlyProgram(program)) {
    const group = content.lessonPricing.find((g) => g.program === program);
    const row = group?.rows.find((r) => r.people === groupSize);
    const basePrice = row ? parsePriceToNumber(row.price) : 0;

    const liftPass = content.liftPassPricing.find(
      (p) => p.program === program
    );
    const liftPassFee = liftPass ? parsePriceToNumber(liftPass.price) : 0;

    const photoAddOn = wantsPhoto
      ? PHOTO_ADDON_PER_PERSON * groupSizeToCount(groupSize)
      : 0;

    const includeLiftPassInTotal = liftPassPayment === "pay-together";

    return {
      basePrice,
      photoAddOn,
      liftPassFee,
      priceOnRequest: false,
      totalPrice:
        basePrice + photoAddOn + (includeLiftPassInTotal ? liftPassFee : 0),
    };
  }

  const fullCareProgram = content.fullCarePrograms.find(
    (p) => p.slug === program
  );
  const rows =
    fullCareProgram && "rows" in fullCareProgram
      ? fullCareProgram.rows
      : undefined;
  const row = rows?.find((r) => r.people === groupSize);

  if (!row) {
    return {
      basePrice: 0,
      photoAddOn: 0,
      liftPassFee: 0,
      priceOnRequest: true,
      totalPrice: 0,
    };
  }

  return {
    basePrice: parsePriceToNumber(row.price),
    photoAddOn: 0,
    liftPassFee: 0,
    priceOnRequest: false,
    totalPrice: parsePriceToNumber(row.price),
  };
}
