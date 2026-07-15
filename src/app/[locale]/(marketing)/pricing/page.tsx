import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Pricing } from "@/components/sections/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  return {
    title: content.pageMeta.pricing.title,
    description: content.pageMeta.pricing.description,
  };
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
                {p.durationLabel} <span className="text-white/40">·</span> {p.price}
              </span>
            ))}
          </div>
        </div>
      </PageHero>
      <Pricing />
    </>
  );
}
