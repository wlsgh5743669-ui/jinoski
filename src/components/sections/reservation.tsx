"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem, Reveal } from "@/components/shared/reveal";

export function Reservation({ hideContact = false }: { hideContact?: boolean }) {
  const { reservationSteps, contact, ui } = useContent();
  return (
    <section id="reservation" className="relative overflow-hidden bg-ink-900 py-16 sm:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />

      <Container className="relative">
        <SectionHeading
          eyebrow={ui.reservation.eyebrow}
          light
          align="center"
          title={ui.reservation.title}
          description={ui.reservation.description}
        />

        <RevealGroup
          stagger={0.1}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:mt-16 sm:gap-6 lg:grid-cols-4"
        >
          {reservationSteps.map((s, i) => (
            <motion.div key={s.step} variants={revealItem} className="relative">
              <div className="flex h-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm sm:gap-4 sm:rounded-3xl sm:p-7">
                <span className="text-[13px] font-semibold tracking-[0.15em] text-brand-400">
                  {s.step}
                </span>
                <h3 className="text-[16px] font-bold leading-snug text-white sm:text-[19px]">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/60 sm:text-[14px]">
                  {s.description}
                </p>
              </div>
              {i < reservationSteps.length - 1 && (
                <div className="mx-auto mt-4 hidden h-px w-8 bg-white/15 lg:block" />
              )}
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-5 text-center sm:mt-16">
            <Link
              href="/reserve"
              className="inline-flex h-16 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-[16px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(45,168,255,0.6)] transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              {ui.reservation.bookOnlineButton}
              <ArrowRight size={18} />
            </Link>

            {!hideContact && (
            <>
            <p className="text-[15px] text-white/60">
              {ui.reservation.orContactText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-[15px] font-medium text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                {ui.reservation.kakaoButton}
              </a>
              <a
                href={contact.phoneHref}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-[15px] font-medium text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-[0.98]"
              >
                <Phone size={18} />
                {contact.phone}
              </a>
            </div>
            </>
            )}

            <a
              href={contact.smartStore}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <ShoppingBag size={14} />
              {ui.reservation.smartStoreLinkText}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
