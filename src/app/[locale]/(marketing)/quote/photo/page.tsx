import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { QuotePhoto } from "@/components/sections/quote-photo";

// 카톡 알림 「사진 크게 보기」 → 견적서 사진을 크게 보여주는 화면 (검색 노출 안 함)
const TITLE: Record<string, string> = { ko: "견적서 사진", en: "Quote Photo", zh: "报价单图片" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: TITLE[locale] ?? TITLE.ko, robots: { index: false, follow: false } };
}

export default async function QuotePhotoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <div className="h-20 bg-ink-900 md:h-24" />
      <QuotePhoto />
    </>
  );
}
