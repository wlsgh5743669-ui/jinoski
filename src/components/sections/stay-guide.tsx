import { Container } from "@/components/shared/container";
import { GuideCards, STAY_CARDS } from "@/components/shared/guide-cards";

/** 연박 견적 페이지: 연박 강습 안내 카드 3장 (한국어 페이지만) */
export function StayGuide() {
  return (
    <section className="bg-white pt-14 sm:pt-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-500">GUIDE</p>
          <h2 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900 sm:text-[32px]">연박 강습은 이렇게 진행돼요</h2>
          <p className="mt-2 text-[14.5px] text-snow-600">수업 짜는 법부터 견적·결제까지 3장으로 정리했어요. 눌러서 크게 보세요.</p>
          <GuideCards cards={STAY_CARDS} event="stay_guide_card_open" variant="responsive" className="mt-6" />
        </div>
      </Container>
    </section>
  );
}
