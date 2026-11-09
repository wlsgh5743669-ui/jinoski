"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { isEarlyBirdActive } from "@/lib/pricing";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

type Key = "lessons" | "pricing" | "instructor" | "gallery" | "reviews";

/** 바로가기 타일: 사진 + 제목 + 한 줄 설명. 요금은 실제 요금 카드 이미지를 살짝 기울여 보여줘요. */
const TILES: { key: Key; href: string; image?: string; focus?: string }[] = [
  { key: "lessons", href: "/lessons", image: "/images/lesson-basic.jpg", focus: "70% center" },
  { key: "pricing", href: "/pricing" },
  { key: "instructor", href: "/instructor", image: "/images/instructor-jinho.jpg", focus: "center 20%" },
  { key: "gallery", href: "/gallery", image: "/images/snap/snap-01.jpg", focus: "55% center" },
  { key: "reviews", href: "/reviews", image: "/images/reviews/review-fullcare-man1.jpg", focus: "center 40%" },
];

/** 한국어 타일 한 줄 설명 (영어·중국어는 페이지 설명을 그대로 써요) */
const KO_DETAIL: Record<Key, string> = {
  lessons: "입문부터 상급 · 원데이 · 유아까지",
  pricing: "시간표 · 강습료 · 리프트 40% 할인",
  instructor: "대한스키지도자연맹 공인 강사진",
  gallery: "렌즈에 담긴 JinoSki의 겨울",
  reviews: "리뷰 이벤트(커피·사진 인화) 참여 후기 모음",
};

/** 영어·중국어 후기 타일: 리뷰 이벤트 참여 후기라는 표시를 같이 보여줘요 */
const REVIEWS_DETAIL: Record<string, string> = {
  en: "Student reviews · left as part of our review event (coffee or photo prints)",
  zh: "学员评价 · 参加评价活动（赠送咖啡或照片冲印）后留下",
};

const noSubscribe = () => () => {};

export function MenuCards() {
  const { pageMeta, stats } = useContent();
  const locale = useLocale();
  const earlyBird = useSyncExternalStore(noSubscribe, isEarlyBirdActive, () => true);
  const rating = stats.find((s) => s.suffix === "★");

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {TILES.map(({ key, href, image, focus }) => {
            const meta = pageMeta[key];
            const detail =
              locale === "ko"
                ? KO_DETAIL[key]
                : key === "reviews"
                  ? REVIEWS_DETAIL[locale] ?? meta.description
                  : meta.description;
            const wide = key === "reviews";
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "group relative isolate overflow-hidden rounded-[24px] bg-ink-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/50",
                  wide ? "col-span-2 aspect-[2/1] lg:col-span-1 lg:aspect-[3/4]" : "aspect-[4/5] lg:aspect-[3/4]",
                  key === "pricing" && "bg-gradient-to-br from-brand-500 to-brand-700"
                )}
              >
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 20vw, 50vw"
                    className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: focus }}
                  />
                ) : (
                  // 요금: 실제 요금 카드를 기울여서 살짝 보여주기
                  <div className="absolute -right-[24%] top-[6%] -z-10 w-[80%] rotate-[8deg] overflow-hidden rounded-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/30 transition-transform duration-500 group-hover:rotate-[4deg]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={earlyBird ? "/images/guide/pricing-1.jpg" : "/images/guide/pricing-1-regular.jpg"}
                      alt=""
                      loading="lazy"
                      width={1080}
                      height={1350}
                      className="block h-auto w-full"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "absolute inset-0 -z-10",
                    key === "pricing"
                      ? "bg-gradient-to-t from-brand-800 via-brand-700/80 via-35% to-transparent to-65%"
                      : "bg-gradient-to-t from-ink-900/90 via-ink-900/35 via-45% to-transparent to-75%"
                  )}
                />

                {key === "reviews" && rating && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12.5px] font-bold text-ink-900 backdrop-blur sm:left-4 sm:top-4">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {rating.target.toFixed(rating.decimals)}
                  </span>
                )}

                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 backdrop-blur transition-colors group-hover:bg-brand-500 group-hover:text-white sm:right-4 sm:top-4 sm:h-9 sm:w-9">
                  <ArrowUpRight size={16} />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="text-[17px] font-bold tracking-tight text-white sm:text-[19px]">{meta.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/80 sm:text-[13px]">{detail}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
