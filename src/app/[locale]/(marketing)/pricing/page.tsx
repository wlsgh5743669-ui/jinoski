import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { ImageGuide } from "@/components/sections/image-guide";
import { PRICING_CARDS } from "@/components/shared/guide-cards";
import { Pricing } from "@/components/sections/pricing";
import { PaymentMethods } from "@/components/sections/payment-methods";
import { LiftDiscountCard } from "@/components/sections/lift-discount-card";
import { MessengerCard } from "@/components/shared/messenger-buttons";

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
    path: "pricing/",
    title: content.pageMeta.pricing.title,
    description: content.pageMeta.pricing.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title, description } = content.ui.pricing;

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description}>
        <a
          href={`/${locale}/quote/`}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-bold text-ink-900 shadow-lg transition-transform hover:scale-[1.02]"
        >
          {locale === "en" ? "👨‍👩‍👧‍👦 Family & multi-day quote calculator →" : locale === "zh" ? "👨‍👩‍👧‍👦 家庭·多日报价计算 →" : "👨‍👩‍👧‍👦 가족 여러 팀·연박 견적 계산하기 →"}
        </a>
      </PageHero>
      {locale === "ko" && (
        <ImageGuide
          title="요금 한눈에 보기"
          desc="강습료·시간표·리프트 할인·결제 방법을 4장으로 정리했어요. 눌러서 크게 보세요."
          cards={PRICING_CARDS}
          event="pricing_card_open"
        />
      )}
      <Pricing />
      <LiftDiscountCard />
      {locale !== "ko" && (
        <div className="-mt-6 bg-white px-5 pb-14">
          <MessengerCard locale={locale} place="pricing" />
        </div>
      )}
      <PaymentMethods locale={isLocale(locale) ? locale : defaultLocale} />
    </>
  );
}
