"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToMobileQuery(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getIsMobileServerSnapshot() {
  return false;
}

export function Hero() {
  const { heroContent } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const isMobile = useSyncExternalStore(
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
          key={isMobile ? "mobile" : "desktop"}
          className="h-full w-full object-cover"
          src={isMobile ? heroContent.videoSrcMobile : heroContent.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-hero-scrim" />
      </motion.div>

      <Container className="relative z-10 pb-20 pt-40 sm:pb-24 lg:pb-28">
        <motion.div style={{ y }} className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-block text-[13px] font-semibold uppercase tracking-[0.25em] text-brand-300"
          >
            {heroContent.eyebrow}
          </motion.span>

          <h1 className="text-[42px] font-bold leading-[1.12] tracking-tightest text-white sm:text-[58px] lg:text-[76px]">
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
            className="mt-7 max-w-md text-balance text-[16px] leading-relaxed text-white/75 sm:text-[18px]"
          >
            {heroContent.description}
          </motion.p>

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
        className="absolute inset-x-0 bottom-6 z-10 flex justify-center"
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
