"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem } from "@/components/shared/reveal";
import { ReserveCta } from "@/components/shared/reserve-cta";
import { cn } from "@/lib/utils";

export function Faq() {
  const { faq, faqCta } = useContent();
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

        <ReserveCta
          eyebrow={faqCta.eyebrow}
          title={faqCta.title}
          description={faqCta.description}
          bookButton={faqCta.bookButton}
          kakaoButton={faqCta.kakaoButton}
        />
      </Container>
    </section>
  );
}
