import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { getSnapContent } from "@/config/content/snap";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { SnapShoot } from "@/components/sections/snap-shoot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const content = getContent(resolvedLocale);
  const snap = getSnapContent(resolvedLocale);
  return pageMetadata({
    locale: resolvedLocale,
    path: "snap/",
    title: snap.meta.title,
    description: snap.meta.description,
    image: { url: "/images/snap/snap-01.jpg", alt: content.siteConfig.title },
  });
}

export default async function SnapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const snap = getSnapContent(isLocale(locale) ? locale : defaultLocale);
  return (
    <>
      <PageHero eyebrow={snap.hero.eyebrow} title={snap.hero.title} description={snap.hero.description} />
      <SnapShoot />
    </>
  );
}
