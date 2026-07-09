import { lessonPricing, fullCarePrograms, liftPassPricing } from "@/config/site";
import { isHourlyProgram, type ProgramValue } from "@/lib/booking-options";

const HOURLY_PROGRAM_LABELS: Record<"2h" | "3h" | "4h", string> = {
  "2h": "2시간 레슨",
  "3h": "3시간 레슨",
  "4h": "4시간 레슨",
};

const LIFT_PASS_LABELS: Record<"2h" | "3h" | "4h", string> = {
  "2h": "2시간",
  "3h": "3시간",
  "4h": "4시간",
};

export const PHOTO_ADDON_PER_PERSON = 20000;

function parsePriceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function groupSizeToCount(groupSize: string): number {
  if (groupSize === "1인") return 1;
  if (groupSize === "2인") return 2;
  if (groupSize === "3인") return 3;
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
}: {
  program: ProgramValue;
  groupSize: string;
  wantsPhoto: boolean;
  liftPassPayment?: string;
}): PriceBreakdown {
  if (isHourlyProgram(program)) {
    const durationLabel = HOURLY_PROGRAM_LABELS[program];
    const group = lessonPricing.find((g) => g.duration === durationLabel);
    const row = group?.rows.find((r) => r.people === groupSize);
    const basePrice = row ? parsePriceToNumber(row.price) : 0;

    const liftPassLabel = LIFT_PASS_LABELS[program];
    const liftPass = liftPassPricing.find((p) => p.duration === liftPassLabel);
    const liftPassFee = liftPass ? parsePriceToNumber(liftPass.price) : 0;

    const photoAddOn = wantsPhoto
      ? PHOTO_ADDON_PER_PERSON * groupSizeToCount(groupSize)
      : 0;

    const includeLiftPassInTotal = liftPassPayment === "함께 결제";

    return {
      basePrice,
      photoAddOn,
      liftPassFee,
      priceOnRequest: false,
      totalPrice:
        basePrice + photoAddOn + (includeLiftPassInTotal ? liftPassFee : 0),
    };
  }

  const fullCareProgram = fullCarePrograms.find((p) => p.slug === program);
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
