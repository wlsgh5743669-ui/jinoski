"use client";

import { useState } from "react";
import { Clock, Users, Ticket, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  scheduleTimes,
  lessonPricing,
  fullCarePrograms,
  liftPassPricing,
} from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, revealItem, Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

function InfoCard({
  icon: Icon,
  title,
  subtitle,
  rows,
}: {
  icon: typeof Clock;
  title: string;
  subtitle?: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <motion.div
      variants={revealItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col gap-6 rounded-3xl border border-snow-300/60 bg-white p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-[18px] font-bold tracking-tight text-ink-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[13px] font-medium text-snow-500">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-snow-200 py-3 last:border-b-0"
          >
            <span className="text-[14.5px] text-snow-700">{row.label}</span>
            <span className="text-[14.5px] font-semibold tabular-nums text-ink-900">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FullCareCard({
  program,
}: {
  program: (typeof fullCarePrograms)[number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={revealItem}
      className="flex h-full flex-col gap-6 rounded-3xl bg-ink-900 p-8 text-white sm:p-10"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20 text-[20px]">
          {program.icon}
        </div>
        <div>
          <h3 className="text-[19px] font-bold tracking-tight">
            {program.name}
          </h3>
          <p className="text-[13px] font-medium text-white/50">
            {program.duration}
          </p>
        </div>
      </div>

      <p className="text-[14.5px] leading-relaxed text-brand-300">
        {program.tagline}
      </p>

      {"description" in program && program.description && (
        <p className="text-[13.5px] leading-relaxed text-white/60">
          {program.description}
        </p>
      )}

      {"rows" in program && program.rows && (
        <div className="grid grid-cols-3 gap-4">
          {program.rows.map((row) => (
            <div
              key={row.people}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white/[0.06] py-5"
            >
              <span className="text-[13px] font-medium text-white/60">
                {row.people}
              </span>
              <span className="text-[16px] font-bold tabular-nums sm:text-[18px]">
                {row.price}
              </span>
            </div>
          ))}
        </div>
      )}

      {program.priceNote && (
        <p className="text-[12.5px] text-white/45">※ {program.priceNote}</p>
      )}

      {"included" in program && program.included && (
        <ul className="flex flex-col gap-2">
          {program.included.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[13.5px] text-white/75"
            >
              <Check size={14} className="shrink-0 text-brand-400" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-auto flex items-center justify-between rounded-2xl border border-white/15 px-5 py-3.5 text-[14px] font-semibold text-white transition-colors hover:border-brand-400"
      >
        상세 일정 보기
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
              {program.schedule.map((block) => (
                <div key={block.time} className="flex gap-4">
                  <div className="w-[96px] shrink-0 text-[12.5px] font-semibold text-brand-300">
                    {block.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-white">
                      {block.title}
                    </p>
                    <ul className="mt-1.5 flex flex-col gap-0.5 text-[12.5px] text-white/55">
                      {block.items.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {"recommendedFor" in program && program.recommendedFor && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  추천 대상
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {program.recommendedFor.map((t) => (
                    <li key={t} className="text-[13.5px] text-white/70">
                      · {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-ice-gradient py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              투명하게 안내하는
              <br />
              시간표 &amp; 요금
            </>
          }
          description="시간표부터 비발디파크 패찰 비용까지, 예약 전에 미리 확인하세요."
        />

        <RevealGroup
          stagger={0.08}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <InfoCard
            icon={Clock}
            title="2시간 시간표"
            rows={scheduleTimes.twoHour.map((t) => ({
              label: t.label,
              value: t.time,
            }))}
          />
          <InfoCard
            icon={Clock}
            title="3시간 시간표"
            rows={scheduleTimes.threeHour.map((t) => ({
              label: t.label,
              value: t.time,
            }))}
          />
          <InfoCard
            icon={Clock}
            title="4시간 시간표"
            rows={scheduleTimes.fourHour.map((t) => ({
              label: t.label,
              value: t.time,
            }))}
          />
        </RevealGroup>

        <RevealGroup
          stagger={0.08}
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {lessonPricing.map((group) => (
            <InfoCard
              key={group.duration}
              icon={Users}
              title={group.duration}
              subtitle="인원별 강습료"
              rows={group.rows.map((r) => ({
                label: r.people,
                value: r.price,
              }))}
            />
          ))}
        </RevealGroup>

        <RevealGroup
          stagger={0.1}
          className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {fullCarePrograms.map((program) => (
            <FullCareCard key={program.slug} program={program} />
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 max-w-md">
            <InfoCard
              icon={Ticket}
              title="비발디파크 패찰비용"
              subtitle="강습 허가권 (강습료 별도)"
              rows={liftPassPricing.map((p) => ({
                label: p.duration,
                value: p.price,
              }))}
            />
            <p className="mt-4 text-center text-[13px] leading-relaxed text-snow-500">
              ※ 패찰이란 비발디파크에서 강습을 진행할 때 강사와 학생이
              지정된 강습 구역·리프트를 이용하기 위해 리조트에서 발급하는
              강습 전용 허가증입니다. 일반 리프트권과는 별도이며, 안전한
              강습 진행을 위해 반드시 필요합니다.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 text-center text-[13.5px] text-snow-500">
            ※ 시간제 강습은 패찰 비용이 강습료와 별도이며, One Day / Night Full
            Care는 패찰 비용이 포함되어 있습니다.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
