"use client";

import { useState } from "react";
import { Clock, Users, Ticket, ChevronDown, Check, Repeat, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/use-content";
import type { ProgramCode, FullCareGroupSizeCode, SiteContent } from "@/config/content/types";
import { Container } from "@/components/shared/container";
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
  programs,
  viewScheduleLabel,
  recommendedForLabel,
}: {
  programs: SiteContent["fullCarePrograms"];
  viewScheduleLabel: string;
  recommendedForLabel: string;
}) {
  const { groupSizeFullCareLabels, ui, programLabels, bookingWizard } = useContent();
  const [activeTab, setActiveTab] = useState<"one-day" | "night">("one-day");
  const [open, setOpen] = useState(false);
  const program = programs.find((p) => p.slug === activeTab) ?? programs[0];

  return (
    <motion.div
      variants={revealItem}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl bg-ink-900 p-6 text-white sm:p-10"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20 text-[20px]">
          {program.icon}
        </div>
        <div>
          <h3 className="text-[19px] font-bold tracking-tight">
            {bookingWizard.fullCareGroupLabel}
          </h3>
          <p className="text-[13px] font-medium text-white/50">
            {program.duration}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 rounded-full bg-white/[0.06] p-1.5">
        {programs.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              setActiveTab(p.slug);
              setOpen(false);
            }}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
              activeTab === p.slug
                ? "bg-brand-500 text-white"
                : "text-white/50 hover:text-white"
            )}
          >
            {programLabels[p.slug]}
          </button>
        ))}
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
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {program.rows.map((row) => {
            const peopleCount = parseInt(row.people, 10) || 1;
            const perPersonPrice = Number(row.price.replace(/[^0-9]/g, "")) / peopleCount;
            return (
              <div
                key={row.people}
                className="flex flex-col items-center gap-1 rounded-2xl bg-white/[0.06] px-1 py-5"
              >
                <span className="text-[13px] font-medium text-white/60">
                  {groupSizeFullCareLabels[row.people as FullCareGroupSizeCode]}
                </span>
                <span className="whitespace-nowrap text-[13px] font-bold tabular-nums sm:text-[18px]">
                  {row.price}
                </span>
                {peopleCount > 1 && (
                  <span className="whitespace-nowrap text-[11px] text-white/40">
                    {ui.pricing.perPersonPriceLabel} {perPersonPrice.toLocaleString("ko-KR")}원
                  </span>
                )}
              </div>
            );
          })}
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
        {viewScheduleLabel}
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
                  {recommendedForLabel}
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

function SeasonProgramCard() {
  const { seasonProgram, contact } = useContent();

  return (
    <motion.div
      variants={revealItem}
      className="flex flex-col gap-6 rounded-3xl border border-snow-300/60 bg-white p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Repeat size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-[18px] font-bold tracking-tight text-ink-900">
            {seasonProgram.title}
          </h3>
          <p className="text-[13px] font-medium text-snow-500">
            {seasonProgram.subtitle}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {seasonProgram.passes.map((pass) => (
          <li
            key={pass}
            className="flex items-center gap-2 text-[15px] font-semibold text-ink-900"
          >
            <Check size={16} className="shrink-0 text-brand-500" />
            {pass}
          </li>
        ))}
      </ul>

      <p className="text-[13px] leading-relaxed text-snow-500">
        ※ {seasonProgram.priceNote}
      </p>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <a
          href={contact.phoneHref}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[14px] font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.98]"
        >
          <Phone size={16} />
          {seasonProgram.phoneButton}
        </a>
        <a
          href={contact.kakaoChannel}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-snow-300 text-[14px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
        >
          <MessageCircle size={16} />
          {seasonProgram.kakaoButton}
        </a>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const content = useContent();
  const { scheduleTimes, lessonPricing, fullCarePrograms, liftPassPricing, ui } =
    content;

  return (
    <section className="bg-ice-gradient pb-24 pt-16 sm:pb-32 sm:pt-20">
      <Container>
        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <InfoCard
            icon={Clock}
            title={ui.pricing.twoHourScheduleTitle}
            rows={scheduleTimes.twoHour.map((t) => ({
              label: t.label,
              value: t.time,
            }))}
          />
          <InfoCard
            icon={Clock}
            title={ui.pricing.threeHourScheduleTitle}
            rows={scheduleTimes.threeHour.map((t) => ({
              label: t.label,
              value: t.time,
            }))}
          />
          <InfoCard
            icon={Clock}
            title={ui.pricing.fourHourScheduleTitle}
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
              key={group.program}
              icon={Users}
              title={content.programLabels[group.program as ProgramCode]}
              subtitle={ui.pricing.perPersonPricingSubtitle}
              rows={group.rows.map((r) => ({
                label: r.people,
                value: r.price,
              }))}
            />
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <FullCareCard
              programs={fullCarePrograms}
              viewScheduleLabel={ui.pricing.viewScheduleButton}
              recommendedForLabel={ui.pricing.recommendedForLabel}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 max-w-md">
            <SeasonProgramCard />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 max-w-md">
            <InfoCard
              icon={Ticket}
              title={ui.pricing.liftPassCardTitle}
              subtitle={ui.pricing.liftPassCardSubtitle}
              rows={liftPassPricing.map((p) => ({
                label: p.durationLabel,
                value: p.price,
              }))}
            />
            <p className="mt-4 text-center text-[13px] leading-relaxed text-snow-500">
              ※ {content.bookingWizard.liftPassExplainer}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 text-center text-[13.5px] text-snow-500">
            ※ {ui.pricing.footerNote}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
