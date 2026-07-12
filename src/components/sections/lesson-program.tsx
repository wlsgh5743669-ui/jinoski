"use client";

import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

export function LessonProgram() {
  const { lessonPrograms } = useContent();
  return (
    <section className="bg-white pb-24 pt-16 sm:pb-32 sm:pt-20">
      <Container>
        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {lessonPrograms.map((program) => (
            <motion.div
              key={program.slug}
              variants={revealItem}
              whileHover="hover"
            >
              <Link
                href="/reserve"
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-ink-900"
              >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <motion.div
                  variants={{ hover: { scale: 1.08 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />

                <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
                  {program.level}
                </span>

                <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[21px] font-bold tracking-tight text-white">
                      {program.title}
                    </h3>
                    <motion.span
                      variants={{ hover: { rotate: 45 } }}
                      transition={{ duration: 0.3 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
                    >
                      <ArrowUpRight size={17} />
                    </motion.span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-white/70">
                    {program.description}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-white/50">
                    <Clock size={13} />
                    {program.duration}
                  </div>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
