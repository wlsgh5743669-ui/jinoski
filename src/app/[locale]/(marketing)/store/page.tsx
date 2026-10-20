import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { StoreProducts } from "@/components/sections/store-products";

const TITLE = "스마트스토어 강습 상품";
const DESCRIPTION =
  "지노스키 비발디파크 스키·보드 강습 8가지 상품을 네이버 스마트스토어에서 네이버페이·카드로 바로 예약·결제하세요.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  const site = getContent("ko").siteConfig;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/ko/store/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: "/ko/store/",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
  };
}

export default async function StorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 스마트스토어는 한국 손님용 (외국인은 PayPal) — 한국어 페이지만 만들어요
  if (!isLocale(locale) || locale !== "ko") notFound();
  return (
    <>
      <PageHero
        eyebrow="JINOSKI STORE"
        title={["네이버페이로", "바로 예약하세요"]}
        description="날짜·시간을 고르고 스마트스토어에서 카드·네이버페이로 결제하면 끝. 결제 후 강사 배정 연락을 드려요."
      />
      <StoreProducts />
    </>
  );
}
