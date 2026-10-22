import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { MyQuotes } from "@/components/sections/my-quotes";

// 손님용: 휴대폰 번호 + 비밀번호로 내 견적서와 지노스키 답변 확인 (검색 노출 안 함)
export const metadata: Metadata = {
  title: "내 견적 확인",
  robots: { index: false, follow: false },
};

export default async function MyQuotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ko") notFound();
  return (
    <>
      <div className="h-20 bg-ink-900 md:h-24" />
      <MyQuotes />
    </>
  );
}
