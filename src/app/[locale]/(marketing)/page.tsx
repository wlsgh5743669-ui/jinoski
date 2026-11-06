import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyJinoSki } from "@/components/sections/why-jinoski";
import { MenuCards } from "@/components/sections/menu-cards";
import { Directions } from "@/components/sections/directions";
import { Reservation } from "@/components/sections/reservation";
import { YoutubeVideos } from "@/components/sections/youtube-videos";
import { ReviewEventBanner } from "@/components/sections/review-event";
import { SeasonPopup } from "@/components/sections/season-popup";
import { Consult } from "@/components/sections/consult";
import { QuoteBanner } from "@/components/sections/quote-banner";
import { QuickLinks } from "@/components/sections/quick-links";

export default function HomePage() {
  return (
    <>
      <SeasonPopup />
      <Hero />
      <Stats />
      <QuickLinks />
      <WhyJinoSki />
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
