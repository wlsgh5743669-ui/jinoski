"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

export function Gallery() {
  const { galleryItems } = useContent();
  return (
    <section className="bg-ice-gradient pb-24 pt-16 sm:pb-32 sm:pt-20">
      <Container>
        <RevealGroup
          stagger={0.06}
          className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4"
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
