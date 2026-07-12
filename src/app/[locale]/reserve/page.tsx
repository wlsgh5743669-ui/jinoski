import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { BookingWizard } from "./booking-wizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  return {
    title: content.reservePage.title,
    description: content.reservePage.description,
  };
}

export default function ReservePage() {
  return <BookingWizard />;
}
