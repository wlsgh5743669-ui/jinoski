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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CARDS.map(({ key, href, icon: Icon }) => {
            const meta = pageMeta[key];
            return (
              <motion.div key={key} variants={revealItem} whileHover="hover">
                <Link
                  href={href}
                  className="group flex h-full flex-col justify-between gap-8 rounded-3xl border border-black/[0.06] bg-white p-8 shadow-[0_1px_0_0_rgba(10,11,13,0.04)] transition-all hover:border-brand-500/30 hover:shadow-[0_20px_40px_-16px_rgba(10,11,13,0.12)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <Icon size={22} />
                    </span>
                    <motion.span
                      variants={{ hover: { rotate: 45 } }}
                      transition={{ duration: 0.3 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow-100 text-ink-700 transition-colors group-hover:bg-brand-500 group-hover:text-white"
                    >
                      <ArrowUpRight size={16} />
                    </motion.span>
                  </div>
                  <div>
                    <h3 className="text-[19px] font-bold tracking-tight text-ink-900">
                      {meta.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-snow-700">
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
