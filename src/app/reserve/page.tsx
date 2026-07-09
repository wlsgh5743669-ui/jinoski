import type { Metadata } from "next";
import { BookingWizard } from "./booking-wizard";

export const metadata: Metadata = {
  title: "예약하기",
  description: "JinoSki 비발디파크 프리미엄 스키·스노보드 레슨을 온라인으로 신청하세요.",
};

export default function ReservePage() {
  return <BookingWizard />;
}
