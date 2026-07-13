"use client";

import { ArrowUpRight, GraduationCap, Tag, UserRound, Images, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { RevealGroup, revealItem } from "@/components/shared/reveal";

const CARDS = [
  { key: "lessons", href: "/lessons", icon: GraduationCap },
  { key: "pricing", href: "/pricing", icon: Tag },
  { key: "instructor", href: "/instructor", icon: UserRound },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "reviews", href: "/reviews", icon: Star },
] as const;

export function MenuCards() {
  const { pageMeta } = useContent();

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container>
        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
        >
          {CARDS.map(({ key, href, icon: Icon }, i) => {
            const meta = pageMeta[key];
            const isLastOdd = i === CARDS.length - 1 && CARDS.length % 2 === 1;
            return (
              <motion.div
                key={key}
                variants={revealItem}
                whileHover="hover"
                className={isLastOdd ? "col-span-2 sm:col-span-1" : undefined}
              >
                <Link
                  href={href}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_0_0_rgba(10,11,13,0.04)] transition-all hover:border-brand-500/30 hover:shadow-[0_20px_40px_-16px_rgba(10,11,13,0.12)] sm:gap-8 sm:rounded-3xl sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon size={18} className="sm:hidden" />
                      <Icon size={22} className="hidden sm:block" />
                    </span>
                    <motion.span
                      variants={{ hover: { rotate: 45 } }}
                      transition={{ duration: 0.3 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-snow-100 text-ink-700 transition-colors group-hover:bg-brand-500 group-hover:text-white sm:h-9 sm:w-9"
                    >
                      <ArrowUpRight size={14} className="sm:hidden" />
                      <ArrowUpRight size={16} className="hidden sm:block" />
                    </motion.span>
                  </div>
                  <div>
                    <h3 className="text-[14.5px] font-bold tracking-tight text-ink-900 sm:text-[19px]">
                      {meta.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-snow-700 sm:mt-2 sm:text-[14px]">
                      {meta.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
