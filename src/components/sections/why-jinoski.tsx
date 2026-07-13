"use client";

import { Award, UserCheck, Mountain, Camera, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

const icons: Record<string, LucideIcon> = {
  Award,
  UserCheck,
  Mountain,
  Camera,
};

export function WhyJinoSki() {
  const { whyJinoSki, ui } = useContent();
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

        <RevealGroup
          stagger={0.1}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 lg:grid-cols-4"
        >
          {whyJinoSki.map((item) => {
            const Icon = icons[item.icon];
            return (
              <motion.div
                key={item.number}
                variants={revealItem}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col gap-3 rounded-2xl border border-snow-300/60 bg-white/70 p-4 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_24px_60px_-24px_rgba(10,11,13,0.15)] sm:gap-6 sm:rounded-3xl sm:p-8"
              >
                <span className="text-[11px] font-semibold tracking-[0.15em] text-snow-500 sm:text-[13px]">
                  {item.number}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                  {Icon && <Icon size={20} strokeWidth={1.75} className="sm:hidden" />}
                  {Icon && <Icon size={26} strokeWidth={1.75} className="hidden sm:block" />}
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold tracking-tight text-ink-900 sm:text-[19px]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-snow-700 sm:mt-2.5 sm:text-[14.5px]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
