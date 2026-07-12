import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Reviews } from "@/components/sections/reviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  return {
    title: content.pageMeta.reviews.title,
    description: content.pageMeta.reviews.description,
  };
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
