"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Award, UserCheck, Mountain, Camera, Radio, ShieldCheck, Check, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/** 사진별로 보여줄 위치 (얼굴이 잘리지 않게) */
const IMAGE_FOCUS: Record<string, string> = {
  "/images/gallery-3.jpg": "center 60%",
  "/images/why-radio-coaching.jpg": "65% center",
  "/images/why-safety.jpg": "35% center",
};
const FALLBACK_IMAGE = "/images/why-safety.jpg";

const icons: Record<string, LucideIcon> = { Award, Radio, ShieldCheck, UserCheck, Mountain, Camera };

const HINT = { ko: "옆으로 넘겨 보세요", en: "Swipe to see more", zh: "左右滑动查看" } as const;

/**
 * 메인 「평범한 레슨과 JinoSki의 차이」 — 사진 위에 글이 올라간 세로 카드 6장.
 * 휴대폰: 옆으로 넘기기(다음 카드가 살짝 보임 + 위치 점) · 태블릿 2열 · PC 3열.
 */
export function WhyJinoSki() {
  const { whyJinoSki, ui } = useContent();
  const locale = useLocale() as keyof typeof HINT;
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scroller.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setActive(Math.min(whyJinoSki.length - 1, Math.round(el.scrollLeft / (first.offsetWidth + 12))));
  };

  return (
    <section className="bg-ice-gradient py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={ui.whyJinoSki.eyebrow}
          title={
            <>
              {ui.whyJinoSki.title[0]}
              <br />
              {ui.whyJinoSki.title[1]}
            </>
          }
          description={ui.whyJinoSki.description}
        />

        <RevealGroup stagger={0.06} className="mt-10 sm:mt-16">
          <div
            ref={scroller}
            onScroll={onScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3"
          >
            {whyJinoSki.map((item) => {
              const Icon = icons[item.icon];
              const img = item.image ?? FALLBACK_IMAGE;
              return (
                <motion.article
                  key={item.number}
                  variants={revealItem}
                  className="group relative aspect-[4/5] w-[82%] shrink-0 snap-center overflow-hidden rounded-[28px] bg-ink-900 shadow-[0_24px_48px_-28px_rgba(10,11,13,0.55)] sm:w-auto"
                >
                  <Image
                    src={img}
                    alt={item.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 82vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: IMAGE_FOCUS[img] ?? "center 30%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/45 via-45% to-transparent to-75%" />

                  {item.highlight && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 py-1.5 pl-2 pr-3 text-[12.5px] font-bold text-ink-900 shadow-sm backdrop-blur sm:left-5 sm:top-5 sm:text-[13px]">
                      {Icon && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                          <Icon size={13} strokeWidth={2.2} />
                        </span>
                      )}
                      {item.highlight}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <h3 className="text-[21px] font-bold leading-tight tracking-tight text-white sm:text-[23px]">{item.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/80 sm:text-[14.5px]">{item.description}</p>
                    {item.proof && (
                      <p className="mt-4 flex items-start gap-2 border-t border-white/15 pt-3.5 text-[13px] font-semibold text-brand-200 sm:text-[13.5px]">
                        <Check size={16} strokeWidth={2.6} className="mt-[1px] shrink-0" />
                        {item.proof}
                      </p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* 휴대폰: 몇 번째 카드인지 + 넘기기 안내 */}
          <div className="mt-5 flex items-center justify-between sm:hidden">
            <div className="flex gap-1.5" aria-hidden>
              {whyJinoSki.map((item, i) => (
                <span
                  key={item.number}
                  className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-6 bg-brand-500" : "w-1.5 bg-snow-300")}
                />
              ))}
            </div>
            <span className="text-[12.5px] font-semibold text-snow-600">
              {HINT[locale] ?? HINT.ko} ({active + 1}/{whyJinoSki.length})
            </span>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
