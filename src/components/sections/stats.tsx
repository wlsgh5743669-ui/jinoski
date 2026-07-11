"use client";

import { Star } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem } from "@/components/shared/reveal";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { motion } from "framer-motion";

export function Stats() {
  const { stats, statsEyebrow } = useContent();
  return (
    <section className="relative bg-white py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-1 text-brand-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            {statsEyebrow}
          </span>
        </div>

        <RevealGroup
          stagger={0.12}
          className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={revealItem}
              className="flex flex-col items-center gap-2 text-center lg:border-l lg:border-snow-300 lg:first:border-l-0"
            >
              <span className="text-[36px] font-bold tabular-nums tracking-tightest text-ink-900 sm:text-[44px]">
                <AnimatedNumber
                  target={stat.target}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-800 sm:text-[14px]">
                {stat.label}
              </span>
              <span className="text-[12.5px] text-snow-500 sm:text-[13px]">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
