import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Reviews } from "@/components/sections/reviews";

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
    path: "reviews/",
    title: content.pageMeta.reviews.title,
    description: content.pageMeta.reviews.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title } = content.ui.reviews;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={content.pageMeta.reviews.description}
      />
      <Reviews />
    </>
  );
}
