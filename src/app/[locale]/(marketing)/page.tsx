import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyJinoSki } from "@/components/sections/why-jinoski";
import { ImageGuide } from "@/components/sections/image-guide";
import { WHY_CARDS } from "@/components/shared/guide-cards";
import { MenuCards } from "@/components/sections/menu-cards";
import { Directions } from "@/components/sections/directions";
import { Reservation } from "@/components/sections/reservation";
import { YoutubeVideos } from "@/components/sections/youtube-videos";
import { ReviewEventBanner } from "@/components/sections/review-event";
import { SeasonPopup } from "@/components/sections/season-popup";
import { Consult } from "@/components/sections/consult";
import { QuoteBanner } from "@/components/sections/quote-banner";
import { QuickLinks } from "@/components/sections/quick-links";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <SeasonPopup />
      <Hero />
      <Stats />
      <QuickLinks />
      <WhyJinoSki />
      {locale === "ko" && (
        <ImageGuide
          eyebrow="FAQ"
          title="지노스키, 이런 점이 달라요"
          desc="강점·다른 강습과 다른 점·자주 묻는 질문을 4장으로 정리했어요. 눌러서 크게 보세요."
          cards={WHY_CARDS}
          event="why_card_open"
          className="bg-white pb-6 pt-14 sm:pt-20"
        />
      )}
      <MenuCards />
      <YoutubeVideos />
      <ReviewEventBanner />
      <QuoteBanner />
      {/* 예약 순서 → (못 정했으면) 상담 → 오시는 길. 카톡·전화 버튼은 상담 칸에만 둬요 */}
      <Reservation hideContact />
      <Consult />
      <Directions />
    </>
  );
}
