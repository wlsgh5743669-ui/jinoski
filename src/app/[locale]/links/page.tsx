import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { LinkPage } from "./link-page";

const META = {
  ko: { title: "링크 모음", description: "지노스키 강습 예약·카톡 상담·스마트스토어·강사 소개·요금을 한곳에서" },
  en: { title: "Links", description: "Book a lesson, chat with us, see prices and instructors — all in one place" },
  zh: { title: "链接", description: "预约课程、咨询、价格和教练介绍，一页搞定" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  // 인스타 프로필 링크 전용 — 홈페이지 메뉴에도, 검색 결과에도 안 나오게
  return {
    ...pageMetadata({
      locale: l,
      path: "links/",
      title: META[l].title,
      description: META[l].description,
      image: { url: "/images/og-image-2627.jpg", alt: META[l].title },
    }),
    robots: { index: false, follow: true },
  };
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  return <LinkPage lang={l} />;
}
