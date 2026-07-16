"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem, Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function Faq() {
  const { faq, faqCta, contact } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container>
        <RevealGroup
          stagger={0.04}
          className="mx-auto flex max-w-2xl flex-col gap-3"
        >
          {faq.map((item, i) => {
            const open = openIndex === i;
            return (
              <motion.div
                key={item.question}
                variants={revealItem}
                className="overflow-hidden rounded-2xl border border-snow-300/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-[15.5px] font-bold text-ink-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-snow-500 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
                {open && (
                  <p className="whitespace-pre-line px-5 pb-5 text-[14.5px] leading-relaxed text-snow-700">
                    {item.answer}
                  </p>
                )}
              </motion.div>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-3xl bg-ink-900 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
            <div className="relative">
              <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                {faqCta.eyebrow}
              </span>
              <h3 className="mt-4 text-[24px] font-bold tracking-tight text-white sm:text-[28px]">
                {faqCta.title}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
                {faqCta.description}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/reserve"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-[15px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(45,168,255,0.6)] transition-all hover:bg-brand-600 active:scale-[0.98] sm:w-auto"
                >
                  {faqCta.bookButton}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={contact.kakaoChannel}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-[15px] font-medium text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-[0.98] sm:w-auto"
                >
                  <MessageCircle size={18} />
                  {faqCta.kakaoButton}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
