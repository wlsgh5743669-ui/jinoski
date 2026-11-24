import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { PayPage } from "./pay-page";

const TITLE = { ko: "강습료 결제", en: "Lesson payment", zh: "课程付款" } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  // 손님에게 보내는 결제 링크 전용 — 메뉴·검색에 안 나오게
  return { title: TITLE[l], robots: { index: false, follow: false } };
}

export default async function Pay({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  return <PayPage lang={l} />;
}
