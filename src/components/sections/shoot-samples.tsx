"use client";

import { useState } from "react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Lightbox } from "@/components/shared/lightbox";

/** Real photo/video deliverables. Renders nothing until a video or images are configured. */
export function ShootSamples() {
  const { shootSamples } = useContent();
  const [open, setOpen] = useState<string | null>(null);
  if (!shootSamples.video && shootSamples.images.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={shootSamples.eyebrow}
          align="center"
          title={shootSamples.title}
          description={shootSamples.description}
        />
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-[minmax(0,320px)_1fr] sm:items-start">
            {shootSamples.video && (
              <video
                src={shootSamples.video}
                poster={shootSamples.poster}
                controls
                playsInline
                preload="metadata"
                className="mx-auto aspect-[9/16] w-full max-w-[320px] rounded-2xl bg-black object-cover"
              />
            )}
            {shootSamples.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {shootSamples.images.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setOpen(src)}
                    className="aspect-[3/4] overflow-hidden rounded-2xl bg-snow-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
      <Lightbox src={open} onClose={() => setOpen(null)} />
    </section>
  );
}
