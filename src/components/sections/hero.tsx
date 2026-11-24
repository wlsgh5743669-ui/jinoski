"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { INSTRUCTOR_CARDS } from "@/config/content/instructor-cards";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToMobileQuery(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** 서버(정적 HTML)에서는 아직 모름 → 영상 주소를 안 넣어서, 휴대폰이 컴퓨터용 큰 영상을 받다 끊는 일이 없게 (11-25 점검) */
function getIsMobileServerSnapshot(): boolean | null {
  return null;
}

export function Hero() {
  const { heroContent } = useContent();
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const isMobile = useSyncExternalStore<boolean | null>(
    subscribeToMobileQuery,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot
  );

  // 스크롤 시 배경이 자연스럽게 확대 + 페이드되는 패럴랙스 효과
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink-900"
    >
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 h-full w-full"
      >
        <video
          key={isMobile === null ? "pending" : isMobile ? "mobile" : "desktop"}
          className="h-full w-full object-cover"
          src={isMobile === null ? undefined : isMobile ? heroContent.videoSrcMobile : heroContent.videoSrc}
          poster={heroContent.posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-hero-scrim" />
      </motion.div>

      <Container className="relative z-10 pb-10 pt-32 sm:pb-24 sm:pt-40 lg:pb-28">
        <motion.div style={{ y }} className="max-w-3xl">
          {heroContent.trustLine && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 flex items-center gap-1.5 text-[14px] font-semibold text-amber-300 sm:mb-6 sm:text-[15px]"
            >
              <Star size={15} fill="currentColor" strokeWidth={0} aria-hidden />
              {heroContent.trustLine}
            </motion.p>
          )}
          <h1
            className={`font-bold leading-[1.12] tracking-tightest text-white ${
              heroContent.trustLine ? "text-[38px] sm:text-[56px] lg:text-[72px]" : "text-[42px] sm:text-[58px] lg:text-[76px]"
            }`}
          >
            {/* 윗줄도 h1 안에: 한국어는 「비발디파크 스키강습 · 스노보드 강습」 (대표 11-17 구글 1등 목표) */}
            {heroContent.eyebrow && <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-6 block font-semibold uppercase leading-normal text-brand-300 ${locale === "ko" ? "text-[14px] tracking-[0.04em] sm:text-[15px]" : "text-[13px] tracking-[0.25em]"}`}
            >
              {heroContent.eyebrow}
            </motion.span>}
            {heroContent.headline.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-md text-balance text-[16px] leading-relaxed sm:text-[18px] ${heroContent.trustLine ? "mt-4 text-white/90 sm:mt-6" : "mt-7 text-white/75"}`}
          >
            {heroContent.description}
          </motion.p>

          {heroContent.teamLabel && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 sm:mt-7"
            >
              {/* 대표 11-23: 첫 화면에 강사 얼굴 — 누르면 강사진 페이지 */}
              <Link
                href="/instructor"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/30 py-1.5 pl-1.5 pr-4 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/40"
              >
                <span className="flex -space-x-2.5">
                  {INSTRUCTOR_CARDS.people.slice(0, 6).map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.id}
                      src={p.image}
                      alt=""
                      width={34}
                      height={34}
                      className={`h-[34px] w-[34px] rounded-full object-cover object-top ring-2 ring-ink-900 sm:h-10 sm:w-10 ${i >= 5 ? "max-[359px]:hidden" : ""}`}
                    />
                  ))}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="whitespace-nowrap text-[13.5px] font-semibold text-white sm:text-[14.5px]">
                    {heroContent.teamLabel.replace("{n}", String(INSTRUCTOR_CARDS.people.length))}
                  </span>
                  <span className="flex items-center text-[12px] text-brand-300 sm:text-[13px]">
                    {heroContent.teamLink}
                    <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-10 sm:gap-3"
          >
            <Link
              href={heroContent.primaryCta.href}
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 text-[14px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(45,168,255,0.6)] transition-all hover:bg-brand-600 hover:shadow-[0_12px_36px_-8px_rgba(45,168,255,0.75)] active:scale-[0.98] sm:h-14 sm:px-8 sm:text-[15px]"
            >
              {heroContent.primaryCta.label}
            </Link>
            <Link
              href={heroContent.secondaryCta.href}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 text-[14px] font-medium text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15 active:scale-[0.98] sm:h-14 sm:px-8 sm:text-[15px]"
            >
              {heroContent.secondaryCta.label}
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-white/60"
        >
          <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
