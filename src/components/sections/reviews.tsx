"use client";

import { useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { ReserveCta } from "@/components/shared/reserve-cta";

export function Reviews() {
  const { reviews, ui, reviewsCta } = useContent();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="bg-white pb-24 pt-16 sm:pb-32 sm:pt-20">
      <Container>
        <div className="flex items-center justify-end gap-8">
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              aria-label={ui.reviews.prevAriaLabel}
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-snow-300 text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-500"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              aria-label={ui.reviews.nextAriaLabel}
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
            {reviews.map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} review={review} ui={ui.reviews} />
            ))}
          </div>
        </Reveal>

        <ReserveCta
          eyebrow={reviewsCta.eyebrow}
          title={reviewsCta.title}
          description={reviewsCta.description}
          bookButton={reviewsCta.bookButton}
          kakaoButton={reviewsCta.kakaoButton}
        />
      </Container>
    </section>
  );
}

type ReviewItem = ReturnType<typeof useContent>["reviews"][number];
type ReviewsUi = ReturnType<typeof useContent>["ui"]["reviews"];

function ReviewCard({ review, ui }: { review: ReviewItem; ui: ReviewsUi }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 140;

  return (
    <div className="flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-snow-300/60 bg-ice-200/60 sm:w-[360px]">
      {review.photo && (
        <a
          href={review.photo}
          target="_blank"
          rel="noreferrer"
          className="block aspect-[4/5] w-full overflow-hidden bg-snow-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.photo}
            alt={`${review.lesson} 후기 사진`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col gap-4 p-7">
        {!review.photo && <Quote size={26} className="text-brand-500" />}
        <div className="flex items-center gap-1 text-brand-500">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <p
          className={
            "whitespace-pre-line text-[14.5px] leading-relaxed text-ink-800 " +
            (expanded ? "" : "line-clamp-6")
          }
        >
          {review.content}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="self-start text-[13px] font-semibold text-brand-600 hover:underline"
          >
            {expanded ? ui.readLess : ui.readMore}
          </button>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-snow-300/60 pt-4">
          <div>
            <p className="text-[14px] font-semibold text-ink-900">{review.name}</p>
            <p className="mt-0.5 text-[11.5px] text-snow-500">
              {ui.sourceBadge}
              {review.date && ` · ${review.date}`}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-brand-600">
            {review.lesson}
          </span>
        </div>
      </div>
    </div>
  );
}
