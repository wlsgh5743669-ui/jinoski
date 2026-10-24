import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Pricing } from "@/components/sections/pricing";
import { PaymentMethods } from "@/components/sections/payment-methods";

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
      <Pricing />
      <PaymentMethods locale={isLocale(locale) ? locale : defaultLocale} />
    </>
  );
}
