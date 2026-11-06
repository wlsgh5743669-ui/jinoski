import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { LessonProgram } from "@/components/sections/lesson-program";
import { JuniorBanner } from "@/components/sections/junior-banner";
import { LevelFinder } from "@/components/sections/level-finder";
import { ImageGuide } from "@/components/sections/image-guide";
import { DAY_LESSON_CARDS } from "@/components/shared/guide-cards";

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
    path: "lessons/",
    title: content.pageMeta.lessons.title,
    description: content.pageMeta.lessons.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title, description } = content.ui.lessonProgram;

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <LessonProgram />
      <LevelFinder />
      {locale === "ko" && (
        <ImageGuide
          title="하루 강습 한눈에 보기"
          desc="요금·시간표·예약 순서를 3장으로 정리했어요. 눌러서 크게 보세요."
          cards={DAY_LESSON_CARDS}
          event="lessons_card_open"
          className="bg-white py-14 sm:py-20"
        />
      )}
      <section className="bg-white pb-14 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <JuniorBanner />
        </div>
      </section>
    </>
  );
}
