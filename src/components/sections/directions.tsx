"use client";

import { MapPin } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup, revealItem } from "@/components/shared/reveal";
import { motion } from "framer-motion";

export function Directions() {
  const { contact, mapLinks, ui } = useContent();
  const mapButtons = [
    { label: ui.directions.naverMapLabel, href: mapLinks.naver },
    { label: ui.directions.kakaoMapLabel, href: mapLinks.kakao },
    { label: ui.directions.googleMapLabel, href: mapLinks.google },
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={ui.directions.eyebrow}
          align="center"
          title={ui.directions.title}
          description={ui.directions.description}
        />

        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-snow-300/60 bg-ice-gradient p-8 text-center sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <MapPin size={22} strokeWidth={1.75} />
            </div>
            <p className="mt-2 text-balance text-[18px] font-bold text-ink-900 sm:text-[20px]">
              {contact.location}
            </p>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          {mapButtons.map((btn) => (
            <motion.a
              key={btn.label}
              variants={revealItem}
              href={btn.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 flex-1 items-center justify-center rounded-full border border-snow-300 text-[15px] font-semibold text-ink-900 transition-all hover:border-brand-500 hover:text-brand-600 active:scale-[0.98]"
            >
              {btn.label}
            </motion.a>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
