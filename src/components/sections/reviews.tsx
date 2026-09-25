"use client";

import { useMemo, useState } from "react";
import { Star, Quote, X, Hand } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { ReserveCta } from "@/components/shared/reserve-cta";

type Content = ReturnType<typeof useContent>;
type ReviewItem = Content["reviews"][number];
type ReviewsUi = Content["ui"]["reviews"];
type Filter = "all" | ReviewItem["category"];

const PAGE_SIZE = 12;

export function Reviews() {
  const { reviews, ui, reviewsCta } = useContent();
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filters = (["all", "full", "basic", "kids", "season"] as const).filter(
    (f) => f === "all" || reviews.some((r) => r.category === f)
  );
  const list = useMemo(
    () => (filter === "all" ? reviews : reviews.filter((r) => r.category === filter)),
    [reviews, filter]
  );

  return (
    <section className="bg-white pb-24 pt-12 sm:pb-32 sm:pt-16">
      <Container>
        <p className="text-center text-[13.5px] font-semibold text-brand-600">
          {ui.reviews.summary(reviews.length)}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                filter === f
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-snow-300 bg-white text-ink-800 hover:border-brand-300"
              )}
            >
              {ui.reviews.filters[f]}
            </button>
          ))}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-snow-500">
          <Hand size={14} /> {ui.reviews.tapHint}
        </p>

        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.slice(0, visible).map((review, i) => (
              <ReviewCard key={`${review.name}-${review.date}-${i}`} review={review} ui={ui.reviews} />
            ))}
          </div>
        </Reveal>

        {visible < list.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border border-snow-300 px-6 py-3 text-[14px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
            >
              {ui.reviews.loadMore} ({list.length - visible})
            </button>
          </div>
        )}

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

function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

function ReviewCard({ review, ui }: { review: ReviewItem; ui: ReviewsUi }) {
  const [open, setOpen] = useState(false);

  // Card without a photo: show the review text directly on a soft card.
  if (!review.photo) {
    return (
      <div className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-snow-300/60 bg-ice-200/60 p-4 sm:p-5">
        <Quote size={20} className="shrink-0 text-brand-500" />
        <Stars count={review.rating} className="mt-2 text-brand-500" />
        <p className="mt-2 flex-1 overflow-y-auto whitespace-pre-line text-[12.5px] leading-relaxed text-ink-800 sm:text-[13.5px]">
          {review.content}
        </p>
        <ReviewMeta review={review} ui={ui} />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-snow-100 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={review.photo}
        alt={review.lesson}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-all duration-500",
          open ? "scale-110 blur-md brightness-50" : "group-hover:scale-[1.03]"
        )}
      />

      {/* Closed state: label at the bottom */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3 pt-10 text-white transition-opacity duration-300 sm:p-4",
          open ? "opacity-0" : "opacity-100"
        )}
      >
        <Stars count={review.rating} className="text-amber-300" />
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/90 sm:text-[13px]">
          {review.content}
        </p>
        <p className="mt-1.5 text-[11px] font-semibold text-white/70">{review.lesson}</p>
      </div>

      {/* Open state: full review over the blurred photo */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col p-4 text-white transition-opacity duration-300 sm:p-5",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex items-center justify-between">
          <Stars count={review.rating} className="text-amber-300" />
          <X size={16} className="text-white/70" />
        </div>
        <p className="mt-2 flex-1 overflow-y-auto whitespace-pre-line text-[12.5px] leading-relaxed sm:text-[13.5px]">
          {review.content}
        </p>
        <ReviewMeta review={review} ui={ui} dark />
      </div>
    </div>
  );
}

function ReviewMeta({ review, ui, dark }: { review: ReviewItem; ui: ReviewsUi; dark?: boolean }) {
  return (
    <div className={cn("mt-3 border-t pt-2.5", dark ? "border-white/20" : "border-snow-300/60")}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-[12.5px] font-semibold", dark ? "text-white" : "text-ink-900")}>
          {review.name}
        </span>
        <span className={cn("shrink-0 text-[11px]", dark ? "text-white/60" : "text-snow-500")}>
          {review.date}
        </span>
      </div>
      <p className={cn("mt-0.5 text-[10.5px]", dark ? "text-white/60" : "text-snow-500")}>
        {review.lesson} · {ui.sourceBadge}
      </p>
    </div>
  );
}
