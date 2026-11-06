import { Container } from "@/components/shared/container";
import { GuideCards, type GuideCard } from "@/components/shared/guide-cards";

/** 페이지 안내 카드 묶음 섹션 (한국어 페이지용 이미지). 아래 글은 검색·번역용으로 그대로 둬요. */
export function ImageGuide({
  eyebrow = "GUIDE",
  title,
  desc,
  cards,
  event,
  className = "bg-white pt-14 sm:pt-20",
}: {
  eyebrow?: string;
  title: string;
  desc: string;
  cards: GuideCard[];
  event: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <Container>
        <div className={cards.length === 4 ? "mx-auto max-w-5xl" : "mx-auto max-w-3xl"}>
          <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</p>
          <h2 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900 sm:text-[32px]">{title}</h2>
          <p className="mt-2 text-[14.5px] text-snow-600">{desc}</p>
          <GuideCards cards={cards} event={event} variant="responsive" className="mt-6" />
        </div>
      </Container>
    </section>
  );
}
