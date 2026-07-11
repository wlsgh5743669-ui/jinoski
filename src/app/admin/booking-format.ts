import type { Booking } from "@prisma/client";
import { ko } from "@/config/content/ko";
import {
  getProgramLabel,
  getEquipmentLabel,
  getLevelInfo,
  getGroupSizeLabel,
  getLiftPassPaymentLabel,
  getTimeSlotValues,
  getTimeSlotLabel,
  type ProgramValue,
  type EquipmentValue,
  type LevelValue,
  type GroupSizeValue,
  type LiftPassPaymentValue,
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
  return getEquipmentLabel(equipment as EquipmentValue, ko);
}

export function levelLabel(level: string): string {
  return getLevelInfo(level as LevelValue, ko).label;
}

export function groupSizeLabel(groupSize: string): string {
  return getGroupSizeLabel(groupSize as GroupSizeValue, ko);
}

export function liftPassPaymentLabel(value: string): string {
  return getLiftPassPaymentLabel(value as LiftPassPaymentValue, ko);
}

/** New bookings store a stable code ("0","1",..."fixed"); older bookings may have raw text saved directly — fall back to showing it as-is. */
export function timeSlotLabel(program: string, timeSlot: string): string {
  const values = getTimeSlotValues(program as ProgramValue, ko);
  if (values.includes(timeSlot)) {
    return getTimeSlotLabel(program as ProgramValue, timeSlot, ko);
  }
  return timeSlot;
}

export function bookingTotal(booking: Booking): number {
  const includeLiftPass = booking.liftPassPayment === "pay-together";
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

  const programName = getProgramLabel(booking.program as ProgramValue, ko);
  const title = `[JinoSki] ${programName} - ${booking.name}`;
  const details = [
    `프로그램: ${programName}`,
    `시간대: ${timeSlotLabel(booking.program, booking.timeSlot)}`,
    `인원: ${groupSizeLabel(booking.groupSize)}`,
    `장비: ${equipmentLabel(booking.equipment)}`,
    `레벨: ${levelLabel(booking.level)}`,
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
  const includeLiftPass = booking.liftPassPayment === "pay-together";
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
    `- 프로그램: ${getProgramLabel(booking.program as ProgramValue, ko)}`,
    `- 시간: ${timeSlotLabel(booking.program, booking.timeSlot)}`,
    `- 인원: ${groupSizeLabel(booking.groupSize)}`,
    `- 장비: ${equipmentLabel(booking.equipment)}`,
    `- ${priceLine}`,
    "",
    "비발디파크에서 뵙겠습니다. 감사합니다 :)",
  ].join("\n");
}
