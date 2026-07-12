import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Gallery } from "@/components/sections/gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  return {
    title: content.pageMeta.gallery.title,
    description: content.pageMeta.gallery.description,
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title, description } = content.ui.gallery;

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Gallery />
    </>
  );
}
