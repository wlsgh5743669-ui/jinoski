"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { contact } from "@/config/site";
import { calculateBookingPrice } from "@/lib/pricing";
import {
  PROGRAM_OPTIONS,
  EQUIPMENT_OPTIONS,
  LEVEL_OPTIONS,
  LIFT_PASS_PAYMENT_OPTIONS,
  getTimeSlotOptions,
  getGroupSizeOptions,
  isHourlyProgram,
  type ProgramValue,
  type EquipmentValue,
  type LevelValue,
} from "@/lib/booking-options";
import { createBooking } from "./actions";
import { DatePicker } from "./date-picker";

type WizardState = {
  date: string;
  program: ProgramValue | null;
  timeSlot: string;
  groupSize: string;
  equipment: EquipmentValue | null;
  level: LevelValue | null;
  wantsPhoto: boolean;
  liftPassPayment: string;
  name: string;
  phone: string;
  kakaoId: string;
  requestNote: string;
};

const INITIAL_STATE: WizardState = {
  date: "",
  program: null,
  timeSlot: "",
  groupSize: "",
  equipment: null,
  level: null,
  wantsPhoto: false,
  liftPassPayment: "",
  name: "",
  phone: "",
  kakaoId: "",
  requestNote: "",
};

const STEP_TITLES = [
  "날짜를 선택해주세요",
  "레슨 프로그램을 선택해주세요",
  "시간대를 선택해주세요",
  "인원을 선택해주세요",
  "스키 또는 스노보드를 선택해주세요",
  "현재 실력을 알려주세요",
  "패찰 비용은 언제 결제하시겠어요?",
  "예약자 정보를 입력해주세요",
];

const TOTAL_STEPS = STEP_TITLES.length;

function formatPrice(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { name: string; program: ProgramValue } | null
  >(null);

  const isFullCare = state.program === "one-day" || state.program === "night";

  const price = useMemo(() => {
    if (!state.program || !state.groupSize) return null;
    return calculateBookingPrice({
      program: state.program,
      groupSize: state.groupSize,
      wantsPhoto: state.wantsPhoto,
      liftPassPayment: state.liftPassPayment,
    });
  }, [state.program, state.groupSize, state.wantsPhoto, state.liftPassPayment]);

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function selectProgram(program: ProgramValue) {
    const timeOptions = getTimeSlotOptions(program);
    const isFull = program === "one-day" || program === "night";
    setState((prev) => ({
      ...prev,
      program,
      groupSize: "",
      timeSlot: isFull ? timeOptions[0] : "",
      wantsPhoto: isFull ? true : prev.wantsPhoto,
      liftPassPayment: isFull ? "포함" : "",
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
        return state.name.trim().length > 0 && state.phone.trim().length >= 9;
      default:
        return false;
    }
  }

  function goNext() {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    if (!canProceed() || !state.program || !state.equipment || !state.level) {
      return;
    }
    setError(null);

    startTransition(async () => {
      const response = await createBooking({
        date: state.date,
        program: state.program,
        timeSlot: state.timeSlot,
        groupSize: state.groupSize,
        equipment: state.equipment,
        level: state.level,
        wantsPhoto: state.wantsPhoto,
        liftPassPayment: state.liftPassPayment,
        name: state.name.trim(),
        phone: state.phone.trim(),
        kakaoId: state.kakaoId.trim(),
        requestNote: state.requestNote.trim(),
      });

      if (!response.success) {
        setError(response.error);
        return;
      }

      setResult({ name: state.name.trim(), program: state.program! });
    });
  }

  if (result) {
    return <CompletionView name={result.name} />;
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
          {step} / {TOTAL_STEPS}
        </span>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-snow-100">
        <motion.div
          className="h-full rounded-full bg-brand-500"
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
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
              {STEP_TITLES[step - 1]}
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
                  {PROGRAM_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectProgram(option.value)}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-colors",
                        state.program === option.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className="text-[15px] font-bold text-ink-900">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && state.program && (
                <OptionList
                  options={getTimeSlotOptions(state.program)}
                  selected={state.timeSlot}
                  onSelect={(v) => update("timeSlot", v)}
                  disabled={isFullCare}
                  disabledNote={
                    isFullCare
                      ? "이 프로그램은 정해진 시간에 시작합니다."
                      : undefined
                  }
                />
              )}

              {step === 4 && state.program && (
                <OptionList
                  options={[...getGroupSizeOptions(state.program)]}
                  selected={state.groupSize}
                  onSelect={(v) => update("groupSize", v)}
                />
              )}

              {step === 5 && (
                <OptionList
                  options={EQUIPMENT_OPTIONS.map((e) => e.label)}
                  selected={
                    EQUIPMENT_OPTIONS.find((e) => e.value === state.equipment)
                      ?.label ?? ""
                  }
                  onSelect={(label) => {
                    const found = EQUIPMENT_OPTIONS.find(
                      (e) => e.label === label
                    );
                    if (found) update("equipment", found.value);
                  }}
                />
              )}

              {step === 6 && (
                <div className="flex flex-col gap-3">
                  {LEVEL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update("level", option.value)}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-colors",
                        state.level === option.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-bold text-ink-900">
                          {option.value}
                        </span>
                        {state.level === option.value && (
                          <Check size={18} className="text-brand-500" />
                        )}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 7 && (
                <div>
                  <p className="mb-5 text-[13.5px] leading-relaxed text-snow-500">
                    패찰이란 비발디파크에서 강습을 진행할 때 지정된 강습
                    구역·리프트를 이용하기 위해 리조트에서 발급하는 강습
                    전용 허가증이에요. 일반 리프트권과는 별도의 비용입니다.
                  </p>
                  {isFullCare ? (
                    <p className="rounded-2xl border border-snow-300/60 bg-white p-6 text-[14.5px] leading-relaxed text-snow-700">
                      이 프로그램은 패찰(강습 허가권) 비용이 이미 포함되어
                      있어 별도로 결제하실 필요가 없습니다.
                    </p>
                  ) : (
                    <OptionList
                      options={[...LIFT_PASS_PAYMENT_OPTIONS]}
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
                    placeholder="이름"
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  <input
                    type="tel"
                    placeholder="연락처 (010-0000-0000)"
                    value={state.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="카카오톡 ID (선택)"
                    value={state.kakaoId}
                    onChange={(e) => update("kakaoId", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  <textarea
                    placeholder="요청사항 (선택)"
                    value={state.requestNote}
                    onChange={(e) => update("requestNote", e.target.value)}
                    rows={3}
                    className="rounded-2xl border border-snow-300/60 px-5 py-4 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />

                  {price && (
                    <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-ink-900 p-6 text-white">
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-white/60">레슨료</span>
                        <span className="font-semibold tabular-nums">
                          {price.priceOnRequest
                            ? "별도 문의"
                            : formatPrice(price.basePrice)}
                        </span>
                      </div>
                      {isHourlyProgram(state.program as ProgramValue) && (
                        <div className="flex items-center justify-between text-[13px] text-white/50">
                          <span>
                            패찰(강습 허가권) 비용 · {state.liftPassPayment}
                            {state.liftPassPayment === "당일 결제" && " (별도)"}
                          </span>
                          <span>{formatPrice(price.liftPassFee)}</span>
                        </div>
                      )}
                      {!price.priceOnRequest && (
                        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-2 text-[15px] font-bold">
                          <span>
                            {state.liftPassPayment === "당일 결제"
                              ? "지금 결제할 금액"
                              : "합계"}
                          </span>
                          <span className="tabular-nums text-brand-300">
                            {formatPrice(price.totalPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <p className="text-[13.5px] text-red-500">{error}</p>
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
            이전
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed()}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || isPending}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "처리 중..." : "예약 신청하기"}
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
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  disabledNote?: string;
}) {
  if (disabled) {
    return (
      <div className="rounded-2xl border border-snow-300/60 bg-white p-6">
        <p className="text-[15px] font-bold text-ink-900">{options[0]}</p>
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
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "flex items-center justify-between rounded-2xl border p-5 text-left transition-colors",
            selected === option
              ? "border-brand-500 bg-brand-50"
              : "border-snow-300/60 bg-white hover:border-brand-300"
          )}
        >
          <span className="text-[15px] font-bold text-ink-900">{option}</span>
          {selected === option && (
            <Check size={18} className="text-brand-500" />
          )}
        </button>
      ))}
    </div>
  );
}

function CompletionView({ name }: { name: string }) {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Check size={28} />
      </div>
      <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">
        예약 신청이 접수되었습니다
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-snow-700">
        {name}님, 신청해주셔서 감사합니다. 담당자가 확인 후 카카오톡이나
        전화로 예약 확정 안내를 드립니다.
      </p>

      <a
        href={contact.kakaoChannel}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-[15px] font-semibold text-white transition-all hover:bg-brand-600"
      >
        <MessageCircle size={18} />
        카카오톡으로 바로 상담하기
      </a>

      <Link
        href="/"
        className="mt-4 text-[14px] font-medium text-snow-500 hover:text-ink-700"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
