"use client";

import Image from "next/image";
import { Award, UserCheck, Mountain, Camera, Radio, ShieldCheck, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

const icons: Record<string, LucideIcon> = {
  Award,
  Radio,
  ShieldCheck,
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
          stagger={0.08}
          className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {whyJinoSki.map((item) => {
            const Icon = icons[item.icon];
            return (
              <motion.article
                key={item.number}
                variants={revealItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(10,11,13,0.04),0_12px_32px_-16px_rgba(10,11,13,0.12)] ring-1 ring-snow-300/50 transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(10,11,13,0.04),0_28px_60px_-24px_rgba(10,11,13,0.25)] sm:flex-col sm:rounded-3xl"
              >
                {/* Photo */}
                <div className="relative min-h-[150px] w-[38%] shrink-0 overflow-hidden sm:aspect-[16/10] sm:min-h-0 sm:w-full">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 40vw"
                      className="object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-brand-50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-ink-900 backdrop-blur-sm sm:left-4 sm:top-4 sm:text-[12px]">
                    {item.number}
                  </span>
                  {item.highlight && (
                    <span className="absolute bottom-4 left-4 hidden rounded-full bg-brand-500 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-lg shadow-brand-500/30 sm:inline-block">
                      {item.highlight}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="relative flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-7">
                  <div className="flex items-center gap-2.5 sm:absolute sm:-top-7 sm:right-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-500/10 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl sm:bg-white sm:shadow-[0_10px_24px_-10px_rgba(10,11,13,0.35)] sm:ring-snow-300/60">
                      {Icon && <Icon size={18} strokeWidth={1.9} className="sm:hidden" />}
                      {Icon && <Icon size={24} strokeWidth={1.75} className="hidden sm:block" />}
                    </div>
                    {item.highlight && (
                      <span className="text-[11.5px] font-semibold text-brand-600 sm:hidden">
                        {item.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[16px] font-bold tracking-tight text-ink-900 sm:pr-16 sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-snow-700 sm:text-[14.5px]">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
