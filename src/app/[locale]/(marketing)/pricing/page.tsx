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
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Pricing />
    </>
  );
}
