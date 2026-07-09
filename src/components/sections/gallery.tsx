"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { galleryItems } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

export function Gallery() {
  return (
    <section id="gallery" className="bg-ice-gradient py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              기록되는 순간,
              <br />
              JINO VISUALS
            </>
          }
          description="스키, 스노보드 그리고 바닷속까지 — 렌즈에 담긴 JinoSki의 장면들."
        />

        <RevealGroup
          stagger={0.06}
          className="mt-16 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4"
        >
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.src}
              variants={revealItem}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full overflow-hidden rounded-2xl break-inside-avoid ${
                item.tall ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
                priority={i < 2}
              />
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
