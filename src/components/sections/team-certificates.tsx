"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Lightbox } from "@/components/shared/lightbox";

export function TeamCertificates() {
  const { teamCertificates: tc } = useContent();
  const [open, setOpen] = useState<string | null>(null);
  if (tc.items.length === 0) return null;

  const counts = (["ski2", "ski1", "sb1"] as const)
    .map((lv) => ({ lv, n: tc.items.filter((i) => i.level === lv).length }))
    .filter((c) => c.n > 0);

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={tc.eyebrow} align="center" title={tc.title} description={tc.description} />

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {counts.map(({ lv, n }) => (
            <span
              key={lv}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-600"
            >
              <BadgeCheck size={15} /> {tc.levelLabels[lv]} · {n}
            </span>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {tc.items.map((item) => (
              <button
                key={item.image}
                type="button"
                onClick={() => setOpen(item.image)}
                className="group flex flex-col overflow-hidden rounded-xl border border-snow-300/60 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-snow-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={tc.levelLabels[item.level]}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <span className="px-2 py-1.5 text-center text-[11.5px] font-semibold text-ink-800">
                  {tc.levelLabels[item.level]}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </Container>
      <Lightbox src={open} onClose={() => setOpen(null)} />
    </section>
  );
}
