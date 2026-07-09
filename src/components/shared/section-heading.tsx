"use client";

import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              "text-[13px] font-semibold uppercase tracking-[0.2em]",
              light ? "text-brand-300" : "text-brand-600"
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "text-[32px] font-bold leading-[1.15] tracking-tightest sm:text-[40px] lg:text-[52px]",
            light ? "text-white" : "text-ink-900"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "max-w-xl text-[16px] leading-relaxed sm:text-[17px]",
              light ? "text-white/70" : "text-snow-700"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
