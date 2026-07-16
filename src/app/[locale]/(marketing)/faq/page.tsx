import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Faq } from "@/components/sections/faq";

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
    path: "faq/",
    title: content.pageMeta.faq.title,
    description: content.pageMeta.faq.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title, description } = content.ui.faq;

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Faq />
    </>
  );
}
