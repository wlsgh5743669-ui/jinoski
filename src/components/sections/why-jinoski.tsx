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
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyJinoSki.map((item) => {
            const Icon = icons[item.icon];
            return (
              <motion.div
                key={item.number}
                variants={revealItem}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col gap-6 rounded-3xl border border-snow-300/60 bg-white/70 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_24px_60px_-24px_rgba(10,11,13,0.15)]"
              >
                <span className="text-[13px] font-semibold tracking-[0.15em] text-snow-500">
                  {item.number}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  {Icon && <Icon size={26} strokeWidth={1.75} />}
                </div>
                <div>
                  <h3 className="text-[19px] font-bold tracking-tight text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-snow-700">
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
