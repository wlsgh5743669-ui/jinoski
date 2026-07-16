import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { BookingWizard } from "./booking-wizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const content = getContent(resolvedLocale);
  return pageMetadata({
    locale: resolvedLocale,
    path: "reserve/",
    title: content.reservePage.title,
    description: content.reservePage.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default function ReservePage() {
  return <BookingWizard />;
}
