import { STAY_CARDS } from "@/components/shared/guide-cards";
import { ImageGuide } from "@/components/sections/image-guide";

/** 연박 견적 페이지: 연박 강습 안내 카드 3장 (한국어 페이지만) */
export function StayGuide() {
  return (
    <ImageGuide
      title="연박 강습은 이렇게 진행돼요"
      desc="수업 짜는 법부터 견적·결제까지 3장으로 정리했어요. 눌러서 크게 보세요."
      cards={STAY_CARDS}
      event="stay_guide_card_open"
    />
  );
}
