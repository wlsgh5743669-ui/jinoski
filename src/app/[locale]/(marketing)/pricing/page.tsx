import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Pricing } from "@/components/sections/pricing";
import { PaymentMethods } from "@/components/sections/payment-methods";
import { withUsd } from "@/lib/usd";

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
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.15em] text-brand-300">
            {content.ui.pricing.liftPassCardTitle}
          </span>
          <div className="flex flex-wrap gap-2">
            {content.liftPassPricing.map((p) => (
              <span
                key={p.program}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[13.5px] font-medium text-white/90 backdrop-blur-sm"
              >
                {p.durationLabel} <span className="text-white/40">·</span> {withUsd(p.price, locale)}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/50">
          ※ {content.bookingWizard.liftPassExplainer}
        </p>
        {locale === "ko" && (
          <a
            href="/ko/quote/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-bold text-ink-900 shadow-lg transition-transform hover:scale-[1.02]"
          >
            👨‍👩‍👧‍👦 가족 여러 팀·연박 견적 계산하기 →
          </a>
        )}
      </PageHero>
      <Pricing />
      <PaymentMethods locale={isLocale(locale) ? locale : defaultLocale} />
    </>
  );
}
