"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useContent } from "@/lib/use-content";
import { calculateBookingPrice } from "@/lib/pricing";
import {
  PROGRAM_VALUES,
  EQUIPMENT_VALUES,
  LEVEL_VALUES,
  LIFT_PASS_PAYMENT_VALUES,
  AGE_GROUP_VALUES,
  getTimeSlotValues,
  getTimeSlotLabel,
  getGroupSizeOptions,
  getProgramLabel,
  getEquipmentLabel,
  getLevelInfo,
  getGroupSizeLabel,
  getLiftPassPaymentLabel,
  getAgeGroupLabel,
  isHourlyProgram,
  type ProgramValue,
  type EquipmentValue,
  type LevelValue,
  type GroupSizeValue,
  type AgeGroupValue,
} from "@/lib/booking-options";
import type { SiteContent } from "@/config/content/types";
import { DatePicker } from "./date-picker";

type WizardState = {
  date: string;
  program: ProgramValue | null;
  timeSlot: string;
  groupSize: string;
  equipment: EquipmentValue | null;
  level: LevelValue | null;
  ageGroup: AgeGroupValue | null;
  liftPassPayment: string;
  name: string;
  phone: string;
  requestNote: string;
};

const INITIAL_STATE: WizardState = {
  date: "",
  program: null,
  timeSlot: "",
  groupSize: "",
  equipment: null,
  level: null,
  ageGroup: null,
  liftPassPayment: "",
  name: "",
  phone: "",
  requestNote: "",
};

function formatPrice(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

function buildSummaryMessage(state: WizardState, content: SiteContent): string {
  const { program, groupSize, liftPassPayment } = state;
  if (!program || !groupSize || !state.equipment || !state.level || !state.ageGroup) return "";

  const labels = content.bookingWizard.summary.messageLabels;
  const price = calculateBookingPrice({ program, groupSize, liftPassPayment, content });
  const isFullCare = program === "one-day" || program === "night";

  const lines = [
    labels.greeting(state.name.trim()),
    "",
    `${labels.date}: ${state.date}`,
    `${labels.program}: ${getProgramLabel(program, content)}`,
    `${labels.timeSlot}: ${getTimeSlotLabel(program, state.timeSlot, content)}`,
    `${labels.groupSize}: ${getGroupSizeLabel(groupSize as GroupSizeValue, content)}`,
    `${labels.equipment}: ${getEquipmentLabel(state.equipment, content)}`,
    `${labels.level}: ${getLevelInfo(state.level, content).label}`,
    `${labels.ageGroup}: ${getAgeGroupLabel(state.ageGroup, content)}`,
  ];

  if (!isFullCare) {
    lines.push(`${labels.liftPass}: ${getLiftPassPaymentLabel(liftPassPayment as "pay-onsite" | "pay-together", content)}`);
  }

  lines.push(
    `${labels.price}: ${price.priceOnRequest ? labels.priceOnRequest : formatPrice(price.totalPrice)}`
  );

  if (state.requestNote.trim()) lines.push(`${labels.note}: ${state.requestNote.trim()}`);

  lines.push("", labels.closing);

  return lines.join("\n");
}

export function BookingWizard() {
  const content = useContent();
  const stepTitles = content.bookingWizard.stepTitles;
  const totalSteps = stepTitles.length;

  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [showSummary, setShowSummary] = useState(false);

  const isFullCare = state.program === "one-day" || state.program === "night";

  const price = useMemo(() => {
    if (!state.program || !state.groupSize) return null;
    return calculateBookingPrice({
      program: state.program,
      groupSize: state.groupSize,
      liftPassPayment: state.liftPassPayment,
      content,
    });
  }, [state.program, state.groupSize, state.liftPassPayment, content]);

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function selectProgram(program: ProgramValue) {
    const timeValues = getTimeSlotValues(program, content);
    const isFull = program === "one-day" || program === "night";
    setState((prev) => ({
      ...prev,
      program,
      groupSize: "",
      timeSlot: isFull ? timeValues[0] : "",
      liftPassPayment: isFull ? "included" : "",
    }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return state.date.length > 0;
      case 2:
        return state.program !== null;
      case 3:
        return state.timeSlot.length > 0;
      case 4:
        return state.groupSize.length > 0;
      case 5:
        return state.equipment !== null;
      case 6:
        return state.level !== null;
      case 7:
        return state.liftPassPayment.length > 0;
      case 8:
        return (
          state.name.trim().length > 0 &&
          state.phone.trim().length >= 9 &&
          state.ageGroup !== null
        );
      default:
        return false;
    }
  }

  function goNext() {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    if (!canProceed()) return;
    setShowSummary(true);
  }

  if (showSummary) {
    return <SummaryView state={state} content={content} />;
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-2xl flex-col px-5 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[18px] font-bold tracking-tightest text-ink-900"
        >
          JINO<span className="text-brand-500">SKI</span>
        </Link>
        <span className="text-[13px] font-medium text-snow-500">
          {step} / {totalSteps}
        </span>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-snow-100">
        <motion.div
          className="h-full rounded-full bg-brand-500"
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-10 flex-1">
        <AnimatePresence>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[24px] font-bold tracking-tight text-ink-900 sm:text-[28px]">
              {stepTitles[step - 1]}
            </h1>

            <div className="mt-8">
              {step === 1 && (
                <DatePicker
                  value={state.date}
                  onChange={(date) => update("date", date)}
                />
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PROGRAM_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectProgram(value)}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-colors",
                        state.program === value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className="text-[15px] font-bold text-ink-900">
                        {getProgramLabel(value, content)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && state.program && (
                <OptionList
                  options={getTimeSlotValues(state.program, content).map(
                    (v) => ({
                      value: v,
                      label: getTimeSlotLabel(state.program!, v, content),
                    })
                  )}
                  selected={state.timeSlot}
                  onSelect={(v) => update("timeSlot", v)}
                  disabled={isFullCare}
                  disabledNote={
                    isFullCare ? content.bookingWizard.fixedTimeDisabledNote : undefined
                  }
                />
              )}

              {step === 4 && state.program && (
                <OptionList
                  options={getGroupSizeOptions(state.program).map((code) => ({
                    value: code,
                    label: getGroupSizeLabel(code, content),
                  }))}
                  selected={state.groupSize}
                  onSelect={(v) => update("groupSize", v)}
                />
              )}

              {step === 5 && (
                <OptionList
                  options={EQUIPMENT_VALUES.map((value) => ({
                    value,
                    label: getEquipmentLabel(value, content),
                  }))}
                  selected={state.equipment ?? ""}
                  onSelect={(v) => update("equipment", v as EquipmentValue)}
                />
              )}

              {step === 6 && (
                <div className="flex flex-col gap-3">
                  {LEVEL_VALUES.map((value) => {
                    const info = getLevelInfo(value, content);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update("level", value)}
                        className={cn(
                          "rounded-2xl border p-5 text-left transition-colors",
                          state.level === value
                            ? "border-brand-500 bg-brand-50"
                            : "border-snow-300/60 bg-white hover:border-brand-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold text-ink-900">
                            {info.label}
                          </span>
                          {state.level === value && (
                            <Check size={18} className="text-brand-500" />
                          )}
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">
                          {info.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 7 && (
                <div>
                  <p className="mb-5 text-[13.5px] leading-relaxed text-snow-500">
                    {content.bookingWizard.liftPassExplainer}
                  </p>
                  {isFullCare ? (
                    <p className="rounded-2xl border border-snow-300/60 bg-white p-6 text-[14.5px] leading-relaxed text-snow-700">
                      {content.bookingWizard.liftPassIncludedNote}
                    </p>
                  ) : (
                    <OptionList
                      options={LIFT_PASS_PAYMENT_VALUES.map((value) => ({
                        value,
                        label: getLiftPassPaymentLabel(value, content),
                      }))}
                      selected={state.liftPassPayment}
                      onSelect={(v) => update("liftPassPayment", v)}
                    />
                  )}
                </div>
              )}

              {step === 8 && (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder={content.bookingWizard.form.namePlaceholder}
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  <input
                    type="tel"
                    placeholder={content.bookingWizard.form.phonePlaceholder}
                    value={state.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  <div>
                    <p className="mb-2.5 text-[13.5px] font-semibold text-ink-900">
                      {content.bookingWizard.form.ageGroupLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUP_VALUES.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => update("ageGroup", value)}
                          className={cn(
                            "rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
                            state.ageGroup === value
                              ? "border-brand-500 bg-brand-50 text-brand-600"
                              : "border-snow-300/60 bg-white text-ink-800 hover:border-brand-300"
                          )}
                        >
                          {getAgeGroupLabel(value, content)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder={content.bookingWizard.form.notePlaceholder}
                    value={state.requestNote}
                    onChange={(e) => update("requestNote", e.target.value)}
                    rows={3}
                    className="rounded-2xl border border-snow-300/60 px-5 py-4 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />

                  {price && (
                    <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-ink-900 p-6 text-white">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-white/60">
                          {content.bookingWizard.priceSummary.lessonFee}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {price.priceOnRequest
                            ? content.bookingWizard.priceSummary.priceOnRequest
                            : formatPrice(price.basePrice)}
                        </span>
                      </div>
                      {isHourlyProgram(state.program as ProgramValue) && (
                        <div className="flex items-center justify-between text-[13px] text-white/50">
                          <span>
                            {getLiftPassPaymentLabel(
                              state.liftPassPayment as "pay-onsite" | "pay-together",
                              content
                            )}
                            {state.liftPassPayment === "pay-onsite" &&
                              ` ${content.bookingWizard.priceSummary.liftPassSeparateSuffix}`}
                          </span>
                          <span>{formatPrice(price.liftPassFee)}</span>
                        </div>
                      )}
                      {!price.priceOnRequest && (
                        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-2 text-[15px] font-bold">
                          <span>
                            {state.liftPassPayment === "pay-onsite"
                              ? content.bookingWizard.priceSummary.payOnsite
                              : content.bookingWizard.priceSummary.payTogether}
                          </span>
                          <span className="tabular-nums text-brand-300">
                            {formatPrice(price.totalPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="flex h-14 items-center justify-center gap-2 rounded-full border border-snow-300 px-6 text-[14.5px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
          >
            <ArrowLeft size={16} />
            {content.bookingWizard.buttons.back}
          </button>
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed()}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {content.bookingWizard.buttons.next}
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {content.bookingWizard.buttons.submit}
          </button>
        )}
      </div>
    </div>
  );
}

function OptionList({
  options,
  selected,
  onSelect,
  disabled,
  disabledNote,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  disabledNote?: string;
}) {
  if (disabled) {
    return (
      <div className="rounded-2xl border border-snow-300/60 bg-white p-6">
        <p className="text-[15px] font-bold text-ink-900">
          {options[0]?.label}
        </p>
        {disabledNote && (
          <p className="mt-1 text-[13.5px] text-snow-500">{disabledNote}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex items-center justify-between rounded-2xl border p-5 text-left transition-colors",
            selected === option.value
              ? "border-brand-500 bg-brand-50"
              : "border-snow-300/60 bg-white hover:border-brand-300"
          )}
        >
          <span className="text-[15px] font-bold text-ink-900">
            {option.label}
          </span>
          {selected === option.value && (
            <Check size={18} className="text-brand-500" />
          )}
        </button>
      ))}
    </div>
  );
}

function SummaryView({
  state,
  content,
}: {
  state: WizardState;
  content: SiteContent;
}) {
  const [copied, setCopied] = useState(false);
  const message = useMemo(() => buildSummaryMessage(state, content), [state, content]);
  const summary = content.bookingWizard.summary;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard API unavailable — user can still select and copy the text manually
    }
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col justify-center px-5 py-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Check size={24} />
      </div>
      <h1 className="mt-6 text-[24px] font-bold tracking-tight text-ink-900 sm:text-[26px]">
        {summary.heading}
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-snow-700">
        {summary.description}
      </p>

      <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-snow-300/60 bg-white p-6 text-[14px] leading-relaxed text-ink-800">
        {message}
      </pre>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.98]"
      >
        <Copy size={18} />
        {copied ? summary.copiedLabel : summary.copyButton}
      </button>

      <a
        href={content.contact.kakaoChannel}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-snow-300 text-[15px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
      >
        <MessageCircle size={18} />
        {summary.kakaoButton}
      </a>

      <Link
        href="/"
        className="mt-5 text-center text-[14px] font-medium text-snow-500 hover:text-ink-700"
      >
        {summary.backHome}
      </Link>
    </div>
  );
}
