"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { Reveal } from "@/components/shared/reveal";

export function ReserveCta({
  eyebrow,
  title,
  description,
  bookButton,
  kakaoButton,
  href = "/reserve",
}: {
  eyebrow: string;
  title: string;
  description: string;
  bookButton: string;
  kakaoButton: string;
  href?: string;
}) {
  const { contact } = useContent();

  return (
    <Reveal delay={0.1}>
      <div className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-3xl bg-ink-900 p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="relative">
          <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-300">
            {eyebrow}
          </span>
          <h3 className="mt-4 text-[24px] font-bold tracking-tight text-white sm:text-[28px]">
            {title}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={href}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-[15px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(45,168,255,0.6)] transition-all hover:bg-brand-600 active:scale-[0.98] sm:w-auto"
            >
              {bookButton}
              <ArrowRight size={18} />
            </Link>
            <a
              href={contact.kakaoChannel}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-[15px] font-medium text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-[0.98] sm:w-auto"
            >
              <MessageCircle size={18} />
              {kakaoButton}
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
