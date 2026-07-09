import type { Booking } from "@prisma/client";
import {
  getProgramLabel,
  EQUIPMENT_OPTIONS,
  type ProgramValue,
} from "@/lib/booking-options";

export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

export function formatWon(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function equipmentLabel(equipment: string): string {
  return EQUIPMENT_OPTIONS.find((e) => e.value === equipment)?.label ?? equipment;
}

export function bookingTotal(booking: Booking): number {
  const includeLiftPass = booking.liftPassPayment === "함께 결제";
  return (
    booking.basePrice +
    booking.photoAddOn +
    (includeLiftPass ? booking.liftPassFee : 0)
  );
}

function toGCalDateStr(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function buildGoogleCalendarUrl(booking: Booking): string {
  const start = new Date(booking.date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const programLabel = getProgramLabel(booking.program as ProgramValue);
  const title = `[JinoSki] ${programLabel} - ${booking.name}`;
  const details = [
    `프로그램: ${programLabel}`,
    `시간대: ${booking.timeSlot}`,
    `인원: ${booking.groupSize}`,
    `장비: ${equipmentLabel(booking.equipment)}`,
    `레벨: ${booking.level}`,
    `연락처: ${booking.phone}`,
  ].join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGCalDateStr(start)}/${toGCalDateStr(end)}`,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildConfirmationMessage(booking: Booking): string {
  const includeLiftPass = booking.liftPassPayment === "함께 결제";
  const priceLine = booking.priceOnRequest
    ? "금액: 별도 안내 예정"
    : `금액: ${formatWon(bookingTotal(booking))}${
        booking.liftPassFee > 0
          ? includeLiftPass
            ? ` (패찰 비용 ${formatWon(booking.liftPassFee)} 포함)`
            : ` (패찰 비용 ${formatWon(booking.liftPassFee)} 별도, 당일 결제)`
          : ""
      }`;

  return [
    "[JinoSki 예약 확정 안내]",
    "",
    `${booking.name}님, 예약이 확정되었습니다.`,
    "",
    `- 날짜: ${formatDate(booking.date)}`,
    `- 프로그램: ${getProgramLabel(booking.program as ProgramValue)}`,
    `- 시간: ${booking.timeSlot}`,
    `- 인원: ${booking.groupSize}`,
    `- 장비: ${equipmentLabel(booking.equipment)}`,
    `- ${priceLine}`,
    "",
    "비발디파크에서 뵙겠습니다. 감사합니다 :)",
  ].join("\n");
}
