import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { TeamQuote } from "@/components/sections/team-quote";
import { QuoteFaq } from "@/components/sections/quote-faq";

const TEXT = {
  ko: {
    title: "가족·단체·연박 견적 계산기",
    description:
      "2박 3일, 하루 2번, 가족 여러 명도 한 번에. 날짜·인원만 고르면 지노스키 비발디파크 강습 시간표와 1인 금액이 바로 나와요.",
    hero: ["여러 팀·연박 견적,", "한 번에 계산해요"],
    heroDesc: "버튼만 눌러서 6단계면 끝. 날짜·인원·수업만 고르면 1인 금액이 나오고, 리프트·장비는 40% 할인가로 계산돼요.",
  },
  en: {
    title: "Family, Group & Multi-day Ski Lesson Quote",
    description:
      "3-day trips, two lessons a day, big families — all at once. Pick dates and people to instantly see a JinoSki Vivaldi Park lesson timetable and price per person.",
    hero: ["Groups & multi-day trips,", "priced in one go"],
    heroDesc: "Just 6 taps. Choose dates, people and lessons to see the price per person — lift tickets and rentals are calculated at 40% off.",
  },
  zh: {
    title: "家庭·团体·连住滑雪课程报价计算器",
    description: "三天两夜、一天两次、全家多人一次搞定。选好日期和人数，马上看到JinoSki维瓦尔第公园课程时间表和每人价格。",
    hero: ["多队·连住报价，", "一次算清楚"],
    heroDesc: "点按钮6步完成。选择日期·人数·课程即可看到每人价格，缆车票·装备按6折计算。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale as keyof typeof TEXT] ?? TEXT.ko;
  const site = getContent(locale).siteConfig;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/quote/`,
      languages: { ko: "/ko/quote/", en: "/en/quote/", "zh-CN": "/zh/quote/", "x-default": "/ko/quote/" },
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: `/${locale}/quote/`,
      title: t.title,
      description: t.description,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [site.ogImage] },
  };
}

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || !(locale in TEXT)) notFound();
  const loc = locale as keyof typeof TEXT;
  const t = TEXT[loc];
  return (
    <>
      <PageHero eyebrow="TEAM · FAMILY QUOTE" title={[...t.hero]} description={t.heroDesc} />
      <TeamQuote />
      <QuoteFaq locale={loc} />
    </>
  );
}
