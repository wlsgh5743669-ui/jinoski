"use server";

import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/pricing";
import { bookingSchema } from "@/lib/booking-schema";
import { getContent, isLocale, defaultLocale } from "@/config/site";

export type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string };

export async function createBooking(
  input: unknown,
  locale?: string
): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input, please check again." };
  }

  const data = parsed.data;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const price = calculateBookingPrice({
    program: data.program,
    groupSize: data.groupSize,
    wantsPhoto: data.wantsPhoto,
    liftPassPayment: data.liftPassPayment,
    content,
  });

  const booking = await prisma.booking.create({
    data: {
      date: new Date(data.date),
      program: data.program,
      timeSlot: data.timeSlot,
      groupSize: data.groupSize,
      equipment: data.equipment,
      level: data.level,
      wantsPhoto: data.wantsPhoto,
      liftPassPayment: data.liftPassPayment,
      name: data.name,
      phone: data.phone,
      kakaoId: data.kakaoId || null,
      requestNote: data.requestNote || null,
      basePrice: price.basePrice,
      photoAddOn: price.photoAddOn,
      liftPassFee: price.liftPassFee,
      priceOnRequest: price.priceOnRequest,
    },
  });

  return { success: true, bookingId: booking.id };
}
