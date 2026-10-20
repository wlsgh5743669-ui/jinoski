import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { TeamQuote } from "@/components/sections/team-quote";
import { QuoteFaq } from "@/components/sections/quote-faq";

const TITLE = "가족·단체·연박 견적 계산기";
const DESCRIPTION =
  "2박 3일, 하루 2번, 가족 여러 명도 한 번에. 날짜·인원만 고르면 지노스키 비발디파크 강습 시간표와 1인 금액이 바로 나와요.";

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
    alternates: { canonical: "/ko/quote/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: "/ko/quote/",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
  };
}

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ko") notFound();
  return (
    <>
      <PageHero
        eyebrow="TEAM · FAMILY QUOTE"
        title={["여러 팀·연박 견적,", "한 번에 계산해요"]}
        description="버튼만 눌러서 6단계면 끝. 날짜·인원·수업만 고르면 1인 금액이 나오고, 리프트·장비는 40% 할인가로 계산돼요."
      />
      <TeamQuote />
      <QuoteFaq />
    </>
  );
}
