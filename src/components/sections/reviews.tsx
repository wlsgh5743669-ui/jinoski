"use client";

import { useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export function Reviews() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="bg-white py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Review"
            title={
              <>
                학생들이 남긴
                <br />
                진짜 후기
              </>
            }
          />
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              aria-label="이전 후기"
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-snow-300 text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-500"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              aria-label="다음 후기"
              onClick={() => scroll(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-snow-300 text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-500"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div
            ref={scrollerRef}
            className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review) => (
              <div
                key={review.name}
                className="flex w-[300px] shrink-0 snap-start flex-col gap-5 rounded-3xl border border-snow-300/60 bg-ice-200/60 p-8 sm:w-[360px]"
              >
                <Quote size={28} className="text-brand-500" />
                <p className="min-h-[110px] text-[15px] leading-relaxed text-ink-800">
                  {review.content}
                </p>
                <div className="flex items-center gap-1 text-brand-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-snow-300/60 pt-4">
                  <span className="text-[14.5px] font-semibold text-ink-900">
                    {review.name}
                  </span>
                  <span className="text-[12.5px] font-medium text-snow-500">
                    {review.lesson}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
