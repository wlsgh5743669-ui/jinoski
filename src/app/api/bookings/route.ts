import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appendBookingRow } from "@/lib/google-sheets";
import { resolveBookingLabels } from "@/lib/booking-labels";
import { getLiftPassPaymentLabel } from "@/lib/booking-options";
import { getContent, isLocale, defaultLocale } from "@/config/site";

type CreateBookingBody = {
  date: string;
  program: string;
  timeSlot: string;
  groupSize: string;
  equipment: string;
  level: string;
  ageGroup: string;
  liftPassPayment: string;
  requestNote?: string;
  locale: string;
  name: string;
  phone: string;
  basePrice: number;
  liftPassFee: number;
  totalPrice: number;
  priceOnRequest: boolean;
  message: string;
};

const REQUIRED_STRING_FIELDS: (keyof CreateBookingBody)[] = [
  "date",
  "program",
  "timeSlot",
  "groupSize",
  "equipment",
  "level",
  "ageGroup",
  "locale",
  "name",
  "phone",
  "message",
];

function isValidBody(body: unknown): body is CreateBookingBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof b[field] !== "string" || (b[field] as string).trim().length === 0) {
      return false;
    }
  }
  if (typeof b.liftPassPayment !== "string") return false;
  if (typeof b.basePrice !== "number" || typeof b.liftPassFee !== "number" || typeof b.totalPrice !== "number") {
    return false;
  }
  if (typeof b.priceOnRequest !== "boolean") return false;
  if (b.requestNote !== undefined && typeof b.requestNote !== "string") return false;

  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json({ error: "Missing or invalid booking fields" }, { status: 400 });
  }

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        date: body.date,
        program: body.program,
        timeSlot: body.timeSlot,
        groupSize: body.groupSize,
        equipment: body.equipment,
        level: body.level,
        ageGroup: body.ageGroup,
        liftPassPayment: body.liftPassPayment,
        requestNote: body.requestNote?.trim() || null,
        locale: body.locale,
        name: body.name.trim(),
        phone: body.phone.trim(),
        basePrice: body.basePrice,
        liftPassFee: body.liftPassFee,
        totalPrice: body.totalPrice,
        priceOnRequest: body.priceOnRequest,
        message: body.message,
      },
    });
  } catch (err) {
    // DB write failed (e.g. DB unreachable). Surface this as a real error
    // instead of a silent 500 — the client already treats a non-OK response
    // as "couldn't save, but the customer can still reach out via KakaoTalk"
    // (see booking-wizard.tsx's handleSubmit), so this must not throw
    // unhandled here.
    console.error("[bookings] failed to create booking", err);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }

  try {
    const labels = resolveBookingLabels(booking);
    const content = getContent(isLocale(booking.locale) ? booking.locale : defaultLocale);
    const liftPassLabel =
      booking.liftPassPayment === "included"
        ? "포함"
        : (() => {
            try {
              return getLiftPassPaymentLabel(
                booking.liftPassPayment as "pay-onsite" | "pay-together",
                content
              );
            } catch {
              return booking.liftPassPayment;
            }
          })();

    await appendBookingRow({
      id: booking.id,
      date: booking.date,
      program: labels.program,
      timeSlot: labels.timeSlot,
      groupSize: labels.groupSize,
      equipment: labels.equipment,
      level: labels.level,
      ageGroup: labels.ageGroup,
      liftPassPayment: liftPassLabel,
      name: booking.name,
      phone: booking.phone,
      price: booking.priceOnRequest ? "협의" : `${booking.totalPrice.toLocaleString("ko-KR")}원`,
      status: "신청",
      requestNote: booking.requestNote ?? "",
      createdAt: booking.createdAt.toLocaleString("ko-KR"),
    });
  } catch (err) {
    // Sheet sync is best-effort — never fail the booking because of it.
    console.error("[google-sheets] append failed", err);
  }

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
