import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { SeasonView } from "@/components/sections/season-card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  return pageMetadata({
    locale: l,
    path: "reserve/season/",
    title: "시즌 강습 (2시간 × 8회) 상담",
    description: "한 시즌 같은 강사와 꾸준히 배우는 지노스키 시즌 강습 8회 패키지. 날짜는 상담 후 협의.",
    image: { url: "/images/og-image-2627.jpg", alt: "지노스키 시즌 강습" },
  });
}

export default function SeasonPage() {
  return <SeasonView />;
}
