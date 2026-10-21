import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { QuoteInbox } from "@/components/sections/quote-inbox";

// 사장님 전용: 비밀번호를 넣으면 홈페이지 견적·예약 문의를 댓글처럼 모아 보는 화면 (검색 노출 안 함)
export const metadata: Metadata = {
  title: "문의함",
  robots: { index: false, follow: false },
};

export default async function QuoteInboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ko") notFound();
  return (
    <>
      {/* 상단 메뉴(흰 글씨)가 보이도록 어두운 띠 */}
      <div className="h-20 bg-ink-900 md:h-24" />
      <QuoteInbox />
    </>
  );
}
