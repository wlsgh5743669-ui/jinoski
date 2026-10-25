"use client";

import { trackEvent } from "@/components/shared/analytics";
import { getPrivacy } from "@/config/content/privacy";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Copy, MessageCircle, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useStepHistory } from "@/lib/use-step-history";
import { useContent } from "@/lib/use-content";
import {
  calculateBookingPrice,
  EARLY_BIRD,
  getGroupStudentCount,
  isEarlyBirdActive,
  isEarlyBirdEligible,
} from "@/lib/pricing";
import { buildGuidanceLines } from "@/lib/guidance-message";
import {
  PROGRAM_VALUES,
  EQUIPMENT_VALUES,
  LEVEL_VALUES,
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
  type ProgramValue,
  type EquipmentValue,
  type LevelValue,
  type GroupSizeValue,
  type AgeGroupValue,
} from "@/lib/booking-options";
import type { SiteContent } from "@/config/content/types";
import { DatePicker } from "./date-picker";
import { isJuniorProgram, JUNIOR_GRADES, JUNIOR_PASS_PROGRAM, JUNIOR_PRICES } from "@/config/junior-grade";
import { getContent } from "@/config/site";
import { approxUsd, withUsd } from "@/lib/usd";
import { HOLIDAYS, HOLIDAY_NAMES, LIFT_PRICES, LIFT_RENTAL_DISCOUNT, RENTAL_PRICES, isWeekendRate, type TicketHours } from "@/config/lift-rental";

/** 영어·중국어 예약: 문자·카톡 대신 이메일로 접수하고 이메일로 확정 안내 */
const FOREIGN_TEXT = {
  en: {
    emailPlaceholder: "Email (we'll send your confirmation here)",
    phonePlaceholder: "Phone with country code (optional)",
    messengerPlaceholder: "WhatsApp / LINE / WeChat ID (optional)",
    emailField: "email",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    heading: "Booking request received",
    description: (email: string) =>
      `Thank you! We'll check the instructor schedule and reply to ${email} within 24 hours with your confirmation and payment details. Your spot is held once payment is confirmed.`,
    failedHeading: "Your request was not sent yet",
    failedDescription:
      "Something went wrong while sending your request. Please copy the summary below and email it to us. We'll reply within 24 hours.",
    emailUs: "Questions? Email us",
    copyButton: "Copy booking summary",
    copied: "Copied",
  },
  zh: {
    emailPlaceholder: "电子邮箱（确认信息将发送至此）",
    phonePlaceholder: "手机号码（含国家区号，选填）",
    messengerPlaceholder: "WeChat / WhatsApp / LINE ID（选填）",
    emailField: "电子邮箱",
    emailLabel: "邮箱",
    messengerLabel: "联系方式",
    heading: "预约申请已收到",
    description: (email: string) =>
      `谢谢！我们会确认教练日程，并在24小时内发送确认信息和付款方式至 ${email}。付款确认后即为预约成功。`,
    failedHeading: "预约申请尚未发送",
    failedDescription: "发送时出现问题。请复制下方预约内容并发送邮件给我们，我们会在24小时内回复。",
    emailUs: "如有疑问，请发邮件",
    copyButton: "复制预约内容",
    copied: "已复制",
  },
} as const;
type ForeignLocale = keyof typeof FOREIGN_TEXT;
const isForeignLocale = (l: string): l is ForeignLocale => l === "en" || l === "zh";
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

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
  earlyBird: boolean;
  email: string;
  messenger: string;
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
  // 얼리버드 기간이면 처음부터 할인 적용 (손님이 버튼을 안 눌러도 할인가로 보이게)
  earlyBird: isEarlyBirdActive(),
  email: "",
  messenger: "",
};

function formatPrice(value: number, content: SiteContent): string {
  const loc = content.siteConfig.locale;
  if (loc.startsWith("en")) return `${value.toLocaleString("en-US")} KRW (${approxUsd(value)})`;
  if (loc.startsWith("zh")) return `${value.toLocaleString("en-US")}韩元 (${approxUsd(value)})`;
  return `${value.toLocaleString("ko-KR")}원`;
}

type BreakdownLine = { label: string; detail: string; amount: string };

/**
 * Human-readable "how the total is calculated" lines, e.g.
 *   레슨료 · 원데이 풀케어 (7시간) · 2명 = 700,000원
 *   패찰비용 · 1인 25,000원 × 2명 = 50,000원
 * Used both on the booking screen and in the KakaoTalk message so the customer
 * (and the owner) see exactly what the number is made of.
 */
function buildPriceBreakdown(state: WizardState, content: SiteContent) {
  const { program, groupSize, liftPassPayment } = state;
  if (!program || !groupSize) return null;
  const labels = content.bookingWizard.summary.messageLabels;
  const price = calculateBookingPrice({
    program,
    groupSize,
    liftPassPayment,
    content,
    earlyBird: state.earlyBird,
  });
  const isFullCare = program === "one-day" || program === "night";
  const people = getGroupStudentCount(groupSize);
  const lines: BreakdownLine[] = [];

  const programName = getProgramLabel(program, content);
  const lessonDetail = isFullCare
    ? `${programName} · ${labels.people(people)}`
    : `${programName} · ${groupSize} (${labels.people(people)})`;
  lines.push({
    label: content.bookingWizard.priceSummary.lessonFee,
    detail: lessonDetail,
    amount: price.priceOnRequest ? labels.priceOnRequest : formatPrice(price.basePrice, content),
  });

  if (price.earlyBirdDiscount > 0) {
    lines.push({
      label: content.bookingWizard.priceSummary.earlyBird,
      detail: content.bookingWizard.priceSummary.earlyBirdDetail,
      amount: `-${formatPrice(price.earlyBirdDiscount, content)}`,
    });
  }

  if (isFullCare) {
    lines.push({ label: "", detail: labels.liftPassIncluded, amount: "" });
  } else if (!price.priceOnRequest && price.liftPassPersonCount > 0) {
    lines.push({
      label: labels.liftPassAmount,
      detail: `${labels.perPerson} ${formatPrice(price.liftPassFeePerPerson, content)} × ${labels.people(price.liftPassPersonCount)}${
        liftPassPayment === "pay-onsite" ? ` (${labels.liftPassOnsite})` : ""
      }`,
      amount: formatPrice(price.liftPassFee, content),
    });
  }

  return {
    price,
    lines,
    total: price.priceOnRequest ? labels.priceOnRequest : formatPrice(price.totalPrice, content),
  };
}

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

/**
 * Pings the owner's own KakaoTalk ("나에게 보내기") through the notify worker
 * (see notify-worker/) the moment a customer submits, so the customer's phone
 * number arrives even if they never paste the message into the channel chat.
 * Disabled (no-op) until NEXT_PUBLIC_KAKAO_NOTIFY_URL is configured.
 */
async function notifyOwnerKakao(state: WizardState, content: SiteContent, locale: string): Promise<boolean> {
  trackEvent("booking_submit", { program: state.program ?? "", group: String(state.groupSize ?? ""), locale });
  if (!KAKAO_NOTIFY_URL || !state.program || !state.groupSize) return false;
  const foreign = isForeignLocale(locale);
  // 사장님이 읽는 알림은 항상 한국어 표기로
  const ko = foreign ? getContent("ko") : content;
  const breakdown = buildPriceBreakdown(state, ko);
  const contact = foreign
    ? [state.email.trim(), state.phone.trim()].filter(Boolean).join(" / ")
    : state.phone.trim();
  const note = foreign
    ? [`${locale === "zh" ? "중국어" : "영어"} 예약·이메일 회신`, state.messenger.trim(), state.requestNote.trim()]
        .filter(Boolean)
        .join(" / ")
    : state.requestNote.trim();
  const res = await fetch(KAKAO_NOTIFY_URL, {
    method: "POST",
    keepalive: true,
    // text/plain avoids a CORS preflight; the worker parses it as JSON.
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      name: state.name.trim(),
      phone: contact,
      date: state.date,
      program: getProgramLabel(state.program, ko),
      timeSlot: getTimeSlotLabel(state.program, state.timeSlot, ko),
      groupSize: getGroupSizeLabel(state.groupSize as GroupSizeValue, ko),
      equipment: state.equipment ? getEquipmentLabel(state.equipment, ko) : "",
      level: state.level ? getLevelInfo(state.level, ko).label : "",
      total: breakdown?.total ?? "",
      note,
    }),
  });
  return res.ok;
}

function getPriceRows(program: ProgramValue, content: SiteContent) {
  if (isJuniorProgram(program)) {
    return (["1:1", "1:2", "1:3"] as const).map((people) => ({ people, price: formatPrice(JUNIOR_PRICES[program][people], content) }));
  }
  if (program === "one-day" || program === "night") {
    return content.fullCarePrograms.find((p) => p.slug === program)?.rows ?? [];
  }
  return content.lessonPricing.find((g) => g.program === program)?.rows ?? [];
}

function getLiftPassPrice(program: ProgramValue, content: SiteContent) {
  const p0 = isJuniorProgram(program) ? JUNIOR_PASS_PROGRAM : program;
  return content.liftPassPricing.find((p) => p.program === p0)?.price;
}

/** "1명 기준 210,000원부터 · + 패찰 1인 35,000원" shown under each program card. */
function programPriceHint(program: ProgramValue, content: SiteContent) {
  const g = content.bookingWizard.guide;
  const locale = content.siteConfig.locale.slice(0, 2);
  const first = getPriceRows(program, content)[0]?.price;
  if (!first) return "";
  const eb =
    isEarlyBirdActive() && EARLY_BIRD.programs.includes(program)
      ? ` · ${content.bookingWizard.priceSummary.earlyBird} 10%`
      : "";
  if (program === "one-day" || program === "night") return `${withUsd(g.priceFrom(first), locale)} · ${g.liftPassIncluded}${eb}`;
  const pass = getLiftPassPrice(program, content);
  return (pass ? `${withUsd(g.priceFrom(first), locale)} · ${g.liftPassPlus(pass)}` : withUsd(g.priceFrom(first), locale)) + eb;
}

function buildSmsHref(phone: string, body: string): string {
  const number = phone.replace(/[^0-9]/g, "");
  const isIOS =
    typeof navigator !== "undefined" && /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${number}${isIOS ? "&" : "?"}body=${encodeURIComponent(body)}`;
}

function buildSummaryMessage(state: WizardState, content: SiteContent): string {
  const { program, groupSize, liftPassPayment } = state;
  if (!program || !groupSize || !state.equipment || !state.level || !state.ageGroup) return "";

  const labels = content.bookingWizard.summary.messageLabels;
  const isFullCare = program === "one-day" || program === "night";
  const breakdown = buildPriceBreakdown(state, content)!;

  const lines = [
    labels.greeting(state.name.trim()),
    "",
    `${labels.booker}: ${state.name.trim()}`,
    ...(state.email.trim() || state.messenger.trim()
      ? [
          state.email.trim() ? `Email: ${state.email.trim()}` : "",
          state.phone.trim() ? `${labels.phone}: ${state.phone.trim()}` : "",
          state.messenger.trim() ? `WhatsApp/LINE/WeChat: ${state.messenger.trim()}` : "",
        ].filter(Boolean)
      : [`${labels.phone}: ${state.phone.trim()}`]),
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

  lines.push("", labels.priceBreakdown);
  for (const line of breakdown.lines) {
    lines.push(
      line.label
        ? `· ${line.label}: ${line.detail}${line.amount ? ` = ${line.amount}` : ""}`
        : `· ${line.detail}`
    );
  }
  lines.push(`→ ${labels.price}: ${breakdown.total}`);

  if (state.requestNote.trim()) lines.push("", `${labels.note}: ${state.requestNote.trim()}`);

  lines.push("", ...buildGuidanceLines(content));
  lines.push("", labels.closing);
  lines.push(
    `${labels.businessPhone}: ${
      content.siteConfig.locale.startsWith("ko")
        ? content.contact.phone
        : "+82-" + content.contact.phone.replace(/^0/, "")
    }`
  );

  return lines.join("\n");
}

export function BookingWizard() {
  const content = useContent();
  const locale = useLocale();
  const stepTitles = content.bookingWizard.stepTitles;
  /** 화면(page)마다 보여줄 단계들 — 8단계를 5화면으로 줄였어요 */
  const PAGES = [[1], [2], [3, 4], [5, 6], [7, 8]];
  /** 화면 제목으로 쓸 단계 (나머지 단계는 작은 제목) */
  const PAGE_HEAD = [1, 2, 3, 5, 7];
  const totalSteps = PAGES.length;

  const [step, setStep] = useState(1);
  // 휴대폰 뒤로가기 → 이전 단계로 (홈으로 나가지 않게)
  useStepHistory(step, setStep, "reserveStep");
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notifyOk, setNotifyOk] = useState(true);
  const foreign = isForeignLocale(locale);
  const ft = foreign ? FOREIGN_TEXT[locale as ForeignLocale] : null;

  const isFullCare = state.program === "one-day" || state.program === "night";

  const [showFullCareChoice, setShowFullCareChoice] = useState(isFullCare);
  // 주니어 기술등급 심사: 카드 하나 → 누르면 1~6등급 / 7~10등급 선택
  const [showJuniorChoice, setShowJuniorChoice] = useState(isJuniorProgram(state.program));
  const JR = {
    ko: { how: "2시간 진행 · 실력 확인 → 심사 종목 연습 → 공인 지도자 심사", inc: ["연맹 응시료 포함 (1인 20,000원)", "심사 장면 사진·영상", "합격하면 공식 등급 뱃지 + 인증서"], extra: "패찰 1인 25,000원 별도 · 리프트·장비 40% 할인 · 한 번에 한 등급 심사 · 합격 보장 아님", grade: "등급", more: "주니어 기술등급 자세히 보기", tip: "어느 등급인지 모르겠으면 낮은 등급부터 추천드려요. 예약 후 상담 때 정해도 돼요.", title: "🎖️ 주니어 기술등급 심사", desc: "만 7~17세 · 스키 · 대한스키지도자연맹 공식 뱃지 · 눌러서 등급 선택", pick: "도전할 등급을 골라주세요", a: "처음 ~ 중급 슬로프 실력 (스노우플라우 ~ 다이나믹 롱턴)", b: "상급 슬로프 실력 (다이나믹 숏턴 ~ 종합활강) · Level 3 심사위원" },
    en: { how: "2 hours · level check → practice test elements → test by a certified instructor", inc: ["KSIA test fee included (₩20,000 per child)", "Photos & video of the test", "Official badge + certificate when passed"], extra: "Lesson permit ₩25,000 per person extra · lift & rental 40% off · one level per test · pass not guaranteed", grade: "Level", more: "More about junior badges", tip: "Not sure which level? We recommend starting lower — we can decide together after booking.", title: "🎖️ Junior Ski Badge Test", desc: "Ages 7–17 · ski · official KSIA badge · tap to choose a level", pick: "Choose the level to try", a: "Beginner to red slopes (snowplow – dynamic long turn)", b: "Black slopes (dynamic short turn – all-round run) · Level 3 examiner" },
    zh: { how: "2小时 · 确认水平 → 练习考核项目 → 认证指导者考核", inc: ["含联盟考试费（每人₩20,000）", "考核照片·视频", "通过后颁发官方等级徽章 + 证书"], extra: "教学许可证（挂牌）每人₩25,000另计 · 缆车·装备6折 · 每次考核一个等级 · 不保证通过", grade: "级", more: "了解青少年技术等级", tip: "不确定等级时建议从较低等级开始，预约后咨询时再决定也可以。", title: "🎖️ 青少年滑雪技术等级考核", desc: "7~17周岁 · 双板 · KSIA官方徽章 · 点击选择等级", pick: "请选择要挑战的等级", a: "初级~中高级雪道水平（犁式~动态长转）", b: "高级雪道水平（动态短转~综合滑降）· Level 3 考官" },
  }[locale === "en" || locale === "zh" ? locale : "ko"];

  const price = useMemo(() => {
    if (!state.program || !state.groupSize) return null;
    return calculateBookingPrice({
      program: state.program,
      groupSize: state.groupSize,
      liftPassPayment: state.liftPassPayment,
      content,
      earlyBird: state.earlyBird,
    });
  }, [state.program, state.groupSize, state.liftPassPayment, state.earlyBird, content]);

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
      liftPassPayment: isFull ? "included" : "pay-together",
      // 주니어 등급 심사는 스키만
      ...(isJuniorProgram(program) ? { equipment: "ski" as const } : {}),
    }));
  }

  // Pre-fill from a program card's link (e.g. /reserve?program=one-day&level=beginner)
  // so a customer who already picked a program on /lessons doesn't have to repeat
  // that choice in step 2/5/6.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const programParam = params.get("program");
    const levelParam = params.get("level");
    const ageGroupParam = params.get("ageGroup");

    // Deliberately deferred to after mount: the static export has no access to
    // the URL at build time, so applying this during render would make the
    // client's first paint diverge from the pre-rendered HTML (hydration
    // mismatch). Reading it here keeps the initial paint stable and updates
    // right after, same as the localStorage read in season-popup.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => {
      const next = { ...prev };

      if (
        programParam &&
        (PROGRAM_VALUES as readonly string[]).includes(programParam)
      ) {
        const program = programParam as ProgramValue;
        const isFull = program === "one-day" || program === "night";
        const timeValues = getTimeSlotValues(program, content);
        next.program = program;
        next.timeSlot = isFull ? timeValues[0] : "";
        next.liftPassPayment = isFull ? "included" : "pay-together";
        if (isJuniorProgram(program)) {
          next.equipment = "ski";
          setShowJuniorChoice(true);
        }
        if (isFull) setShowFullCareChoice(true);
      }

      if (
        levelParam &&
        (LEVEL_VALUES as readonly string[]).includes(levelParam)
      ) {
        next.level = levelParam as LevelValue;
      }

      if (
        ageGroupParam &&
        (AGE_GROUP_VALUES as readonly string[]).includes(ageGroupParam)
      ) {
        next.ageGroup = ageGroupParam as AgeGroupValue;
      }

      return next;
    });
    // Runs once on mount only — this reflects the link the customer clicked to
    // get here, not something that should re-apply as they fill out the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 지금 화면에 이 단계가 있나요? */
  const on = (k: number) => (PAGES[step - 1] ?? []).includes(k);
  function canProceed(): boolean {
    return (PAGES[step - 1] ?? []).every((k) => stepOk(k));
  }
  function stepOk(k: number): boolean {
    switch (k) {
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
          (foreign ? isValidEmail(state.email) : state.phone.trim().length >= 9) &&
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

  async function handleSubmit() {
    if (!canProceed()) return;

    if (price && state.program && state.groupSize && state.equipment && state.level && state.ageGroup) {
      setSubmitting(true);
      try {
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: state.date,
            program: state.program,
            timeSlot: state.timeSlot,
            groupSize: state.groupSize,
            equipment: state.equipment,
            level: state.level,
            ageGroup: state.ageGroup,
            liftPassPayment: state.liftPassPayment || "included",
            requestNote: state.requestNote,
            locale,
            name: state.name,
            phone: state.phone,
            basePrice: price.basePrice,
            liftPassFee: price.liftPassFee,
            totalPrice: price.totalPrice,
            priceOnRequest: price.priceOnRequest,
            message: buildSummaryMessage(state, content),
          }),
        });
      } catch {
        // Booking save failed (e.g. no backend on the static GitHub Pages
        // deploy) — the customer can still send the summary via SMS/KakaoTalk.
      }
      try {
        setNotifyOk(await notifyOwnerKakao(state, content, locale));
      } catch {
        // 한국어 예약은 문자·카톡으로도 보낼 수 있지만, 외국어 예약은 이 알림이 유일한 접수 경로
        setNotifyOk(false);
      } finally {
        setSubmitting(false);
      }
    }

    setShowSummary(true);
  }

  if (showSummary) {
    if (ft) return <ForeignSummaryView state={state} content={content} ft={ft} sent={notifyOk} />;
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

      {!foreign && on(1) && <PayChoice storeUrl="/ko/store/" />}
      {foreign && on(1) && (
        <div className="mt-6 flex flex-col gap-1.5 rounded-2xl border-2 border-[#003087]/30 bg-[#E8F0FE] px-4 py-3.5">
          <span className="text-[14.5px] font-bold text-[#003087]">💳 {locale === "zh" ? "海外客人：用 PayPal 付款" : "Overseas guests: pay with PayPal"}</span>
          <span className="text-[12.5px] leading-snug text-snow-700">
            {locale === "zh"
              ? "先提交预约申请 → 我们确认教练和时间后，用 PayPal 支付20%订金即可确认（余款上课当天支付）。也可以先看看多日报价。"
              : "Send your booking request → once we confirm your instructor and time, pay a 20% deposit by PayPal to lock it in (balance on the lesson day). Planning several days? Try the multi-day quote."}
          </span>
          <a href={`/${locale}/quote/`} className="text-[12.5px] font-bold text-[#003087] underline underline-offset-2">
            {locale === "zh" ? "多日·家庭报价计算 →" : "Multi-day & family quote →"}
          </a>
        </div>
      )}

      <div className={cn("flex-1", !foreign && on(1) ? "mt-8" : "mt-10")}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[24px] font-bold tracking-tight text-ink-900 sm:text-[28px]">
              {stepTitles[PAGE_HEAD[step - 1] - 1]}
            </h1>

            <div className="mt-8">
              {on(1) && (
                <DatePicker
                  value={state.date}
                  onChange={(date) => update("date", date)}
                />
              )}

              {on(2) && !showFullCareChoice && !showJuniorChoice && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PROGRAM_VALUES.filter(
                    (value) => value !== "one-day" && value !== "night" && !isJuniorProgram(value)
                  ).map((value) => (
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
                      <p className="mt-1.5 text-[13px] font-medium text-brand-600">
                        {programPriceHint(value, content)}
                      </p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowFullCareChoice(true)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-colors",
                      isFullCare
                        ? "border-brand-500 bg-brand-50"
                        : "border-snow-300/60 bg-white hover:border-brand-300"
                    )}
                  >
                    <span className="text-[15px] font-bold text-ink-900">
                      {content.bookingWizard.fullCareGroupLabel}
                    </span>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">
                      {content.bookingWizard.fullCareInfo.groupDescription}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-brand-600">
                      {programPriceHint("one-day", content)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJuniorChoice(true)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-colors",
                      isJuniorProgram(state.program)
                        ? "border-brand-500 bg-brand-50"
                        : "border-snow-300/60 bg-white hover:border-brand-300"
                    )}
                  >
                    <span className="text-[15px] font-bold text-ink-900">{JR.title}</span>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">{JR.desc}</p>
                    <p className="mt-1 text-[13px] font-medium text-brand-600">{programPriceHint("junior-a", content)}</p>
                  </button>
                </div>
              )}

              {on(2) && showJuniorChoice && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJuniorChoice(false)}
                    className="flex items-center gap-1.5 self-start text-[13.5px] font-semibold text-snow-500 transition-colors hover:text-ink-900"
                  >
                    <ArrowLeft size={14} />
                    {content.bookingWizard.buttons.back}
                  </button>
                  <div className="rounded-2xl bg-ice-200 px-4 py-3.5 text-[13px] leading-relaxed text-snow-700">
                    <p className="font-bold text-ink-900">⏱ {JR.how}</p>
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {JR.inc.map((x) => (
                        <li key={x}>✓ {x}</li>
                      ))}
                    </ul>
                    <p className="mt-1.5 text-[12px] text-snow-500">{JR.extra}</p>
                    <Link href="/junior" className="mt-1.5 inline-block text-[12.5px] font-semibold text-brand-600 underline">
                      {JR.more} →
                    </Link>
                  </div>
                  <p className="mt-1 text-[15px] font-bold text-ink-900">{JR.pick}</p>
                  {(["junior-a", "junior-b"] as const).map((value) => (
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
                      <span className="text-[15px] font-bold text-ink-900">{getProgramLabel(value, content)}</span>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">{value === "junior-a" ? JR.a : JR.b}</p>
                      <ul className="mt-2.5 flex flex-col gap-1">
                        {JUNIOR_GRADES.filter((g) => (value === "junior-a" ? g.no <= 6 : g.no >= 7)).map((g) => (
                          <li key={g.no} className="flex items-center gap-2 text-[12.5px] text-ink-800">
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                              style={{ background: g.color, boxShadow: `inset 0 0 0 2px ${g.ring}`, color: g.no === 7 ? "#fff" : "#111827" }}
                            >
                              {g.no}
                            </span>
                            <span>
                              {locale === "en" ? `${JR.grade} ${g.no} · ${g.en}` : locale === "zh" ? `${g.no}${JR.grade} · ${g.zh}` : `${g.no}${JR.grade} · ${g.ko}`}
                              <span className="text-snow-400"> · {g.badge[locale === "en" || locale === "zh" ? locale : "ko"]}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2.5 text-[13px] font-medium text-brand-600">{programPriceHint(value, content)}</p>
                    </button>
                  ))}
                  <p className="text-[12.5px] leading-relaxed text-snow-500">💡 {JR.tip}</p>
                </div>
              )}

              {on(2) && showFullCareChoice && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFullCareChoice(false)}
                    className="flex items-center gap-1.5 self-start text-[13.5px] font-semibold text-snow-500 transition-colors hover:text-ink-900"
                  >
                    <ArrowLeft size={14} />
                    {content.bookingWizard.buttons.back}
                  </button>
                  {(["one-day", "night"] as const).map((value) => (
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
                      <p className="mt-1.5 text-[13px] leading-relaxed text-snow-500">
                        {value === "one-day"
                          ? content.bookingWizard.fullCareInfo.oneDay
                          : content.bookingWizard.fullCareInfo.night}
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-brand-600">
                        {programPriceHint(value, content)}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {on(3) && state.program && (
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

              {on(3) && isFullCare && (
                <FullCareSchedule program={state.program!} content={content} />
              )}

              {on(4) && PAGE_HEAD[step - 1] !== 4 && <h2 className="mb-4 mt-10 text-[18px] font-bold text-ink-900">{stepTitles[3]}</h2>}
              {on(4) && state.program && (
                <OptionList
                  options={getGroupSizeOptions(state.program).map((code) => {
                    const g = content.bookingWizard.guide;
                    const program = state.program as ProgramValue;
                    const rowPrice = getPriceRows(program, content).find((r) => r.people === code)?.price;
                    const pass = getLiftPassPrice(program, content);
                    const full = program === "one-day" || program === "night";
                    const description = rowPrice
                      ? full
                        ? `${g.lessonFee(rowPrice)} · ${g.liftPassIncluded}`
                        : `${g.lessonFee(rowPrice)}${pass ? ` · ${g.liftPassPlus(pass)}` : ""}`
                      : undefined;
                    return {
                      value: code,
                      label: g.groupSizeOption(getGroupStudentCount(code)),
                      description,
                    };
                  })}
                  selected={state.groupSize}
                  onSelect={(v) => update("groupSize", v)}
                />
              )}
              {on(4) && state.program && <LiftRentalNote program={state.program} date={state.date} locale={locale} />}

              {on(5) && (
                <OptionList
                  options={EQUIPMENT_VALUES.map((value) => ({
                    value,
                    label: getEquipmentLabel(value, content),
                  }))}
                  selected={state.equipment ?? ""}
                  onSelect={(v) => update("equipment", v as EquipmentValue)}
                />
              )}
              {on(5) && (
                <p className="mt-4 text-[13px] leading-relaxed text-snow-500">
                  {content.bookingWizard.guide.extrasNotice}
                </p>
              )}

              {on(6) && PAGE_HEAD[step - 1] !== 6 && <h2 className="mb-4 mt-10 text-[18px] font-bold text-ink-900">{stepTitles[5]}</h2>}
              {on(6) && (
                <div className="flex flex-col gap-3">
                  {LEVEL_VALUES.map((value) => {
                    const info = getLevelInfo(value, content, state.equipment);
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
                        {state.equipment && (
                          <p className="mt-1.5 text-[13.5px] font-semibold text-brand-600">
                            {content.bookingWizard.guide.selfCheckPrefix}:{" "}
                            {content.levelSelfCheckByEquipment[state.equipment][value]}
                          </p>
                        )}
                        <p className="mt-1 text-[13px] leading-relaxed text-snow-500">
                          {info.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {on(7) && PAGE_HEAD[step - 1] !== 7 && <h2 className="mb-4 text-[18px] font-bold text-ink-900">{stepTitles[6]}</h2>}
              {on(7) && (
                <div className="mb-10">
                  <p className="mb-5 text-[13.5px] leading-relaxed text-snow-500">
                    {content.bookingWizard.liftPassExplainer}
                  </p>
                  {!isFullCare && price && (() => {
                    const passInfo = content.liftPassPricing.find(
                      (p) => p.program === state.program
                    );
                    if (!passInfo) return null;
                    const labels = content.bookingWizard.summary.messageLabels;
                    return (
                      <div className="mb-5 rounded-2xl border border-brand-500/30 bg-brand-50/60 p-5">
                        <p className="text-[13px] font-semibold text-snow-600">
                          {content.ui.pricing.liftPassCardTitle} ({passInfo.durationLabel})
                        </p>
                        <p className="mt-1 text-[18px] font-bold text-brand-600">
                          {labels.perPerson} {formatPrice(price.liftPassFeePerPerson, content)}
                        </p>
                        <p className="mt-2 text-[14px] font-semibold tabular-nums text-ink-900">
                          {formatPrice(price.liftPassFeePerPerson, content)} × {labels.people(price.liftPassPersonCount)} ={" "}
                          {formatPrice(price.liftPassFee, content)}
                        </p>
                      </div>
                    );
                  })()}
                  <p className="rounded-2xl border border-snow-300/60 bg-white p-6 text-[14.5px] leading-relaxed text-snow-700">
                    {isFullCare
                      ? content.bookingWizard.liftPassIncludedNote
                      : content.bookingWizard.liftPassPayTogetherNote}
                  </p>
                </div>
              )}

              {on(8) && PAGE_HEAD[step - 1] !== 8 && <h2 className="mb-4 text-[18px] font-bold text-ink-900">{stepTitles[7]}</h2>}
              {on(8) && (
                <div className="flex flex-col gap-4">
                  {state.program && (
                    <div className="rounded-2xl border border-snow-300/60 bg-snow-100/70 p-5 text-[13.5px] leading-relaxed text-snow-700">
                      <p className="mb-1.5 text-[12.5px] font-semibold text-snow-500">
                        {content.bookingWizard.guide.reviewTitle}
                      </p>
                      <p>
                        {state.date} · {getProgramLabel(state.program, content)}
                      </p>
                      <p>{getTimeSlotLabel(state.program, state.timeSlot, content)}</p>
                      <p>
                        {content.bookingWizard.guide.groupSizeOption(getGroupStudentCount(state.groupSize))}
                        {state.equipment && ` · ${getEquipmentLabel(state.equipment, content)}`}
                        {state.level && ` · ${getLevelInfo(state.level, content).label}`}
                      </p>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder={content.bookingWizard.form.namePlaceholder}
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  {ft && (
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder={ft.emailPlaceholder}
                      value={state.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                    />
                  )}
                  <input
                    type="tel"
                    placeholder={ft ? ft.phonePlaceholder : content.bookingWizard.form.phonePlaceholder}
                    value={state.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />
                  {ft && (
                    <input
                      type="text"
                      placeholder={ft.messengerPlaceholder}
                      value={state.messenger}
                      onChange={(e) => update("messenger", e.target.value)}
                      className="h-14 rounded-2xl border border-snow-300/60 px-5 text-[15px] outline-none transition-colors focus:border-brand-500"
                    />
                  )}
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
                  {state.ageGroup === "family" && (
                    <p className="-mt-1 text-[13px] font-medium text-brand-600">
                      {content.bookingWizard.guide.familyHint}
                    </p>
                  )}
                  <textarea
                    placeholder={content.bookingWizard.form.notePlaceholder}
                    value={state.requestNote}
                    onChange={(e) => update("requestNote", e.target.value)}
                    rows={3}
                    className="rounded-2xl border border-snow-300/60 px-5 py-4 text-[15px] outline-none transition-colors focus:border-brand-500"
                  />

                  {price && isEarlyBirdEligible(state.program) && (() => {
                    const ps = content.bookingWizard.priceSummary;
                    const on = state.earlyBird;
                    return (
                      <button
                        type="button"
                        onClick={() => update("earlyBird", !on)}
                        aria-pressed={on}
                        className={`mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all active:scale-[0.99] ${
                          on
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-dashed border-red-400 bg-white text-ink-900 hover:bg-red-50"
                        }`}
                      >
                        <span className="flex flex-col">
                          <span className="text-[15px] font-bold">
                            {on ? `✓ ${ps.earlyBirdApplied}` : `🎁 ${ps.earlyBirdButton}`}
                          </span>
                          <span className="text-[12.5px] text-snow-500">{ps.earlyBirdDetail}</span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-bold ${
                            on ? "bg-red-500 text-white" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {on ? `-${formatPrice(price.earlyBirdDiscount, content)}` : "10%"}
                        </span>
                      </button>
                    );
                  })()}

                  {price && (() => {
                    const breakdown = buildPriceBreakdown(state, content);
                    if (!breakdown) return null;
                    return (
                      <div className="mt-2 flex flex-col gap-2.5 rounded-2xl bg-ink-900 p-6 text-white">
                        <p className="text-[12.5px] font-semibold text-white/45">
                          {content.bookingWizard.summary.messageLabels.priceBreakdown}
                        </p>
                        {breakdown.lines.map((line, i) => (
                          <div key={i} className="flex items-start justify-between gap-3 text-[14px]">
                            <span className="text-white/70">
                              {line.label && <span className="font-semibold text-white/90">{line.label} </span>}
                              <span className="text-[13px] text-white/55">{line.detail}</span>
                            </span>
                            {line.amount && (
                              <span className="shrink-0 font-semibold tabular-nums">{line.amount}</span>
                            )}
                          </div>
                        ))}
                        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-2.5 text-[15px] font-bold">
                          <span>
                            {state.liftPassPayment === "pay-onsite"
                              ? content.bookingWizard.priceSummary.payOnsite
                              : content.bookingWizard.priceSummary.payTogether}
                          </span>
                          <span className="tabular-nums text-brand-300">{breakdown.total}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-white/45">
                          {content.bookingWizard.guide.extrasNotice}
                        </p>
                      </div>
                    );
                  })()}
                  <BookingNotice content={content} />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {on(8) && !canProceed() && (() => {
        const g = content.bookingWizard.guide;
        const missing = [
          !state.name.trim() && g.fieldNames.name,
          (ft ? !isValidEmail(state.email) && ft.emailField : state.phone.trim().length < 9 && g.fieldNames.phone),
          !state.ageGroup && g.fieldNames.ageGroup,
        ].filter(Boolean) as string[];
        return missing.length ? (
          <p className="mt-6 text-center text-[13px] font-medium text-rose-500">
            {g.missingFields(missing.join(", "))}
          </p>
        ) : null;
      })()}

      <div className={cn("flex items-center gap-3", on(8) && !canProceed() ? "mt-3" : "mt-10")}>
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
            disabled={!canProceed() || submitting}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {content.bookingWizard.buttons.submit}
          </button>
        )}
      </div>
      {step === totalSteps && <PrivacyNotice />}
    </div>
  );
}

function PrivacyNotice() {
  const p = getPrivacy(useLocale());
  return (
    <p className="mt-3 text-center text-[12px] leading-relaxed text-snow-500">
      {p.formNotice}{" "}
      <Link href="/privacy" className="font-semibold underline underline-offset-2">
        {p.footerLink}
      </Link>
    </p>
  );
}

function OptionList({
  options,
  selected,
  onSelect,
  disabled,
  disabledNote,
}: {
  options: { value: string; label: string; description?: string }[];
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
          <span>
            <span className="block text-[15px] font-bold text-ink-900">
              {option.label}
            </span>
            {option.description && (
              <span className="mt-1 block text-[13px] leading-relaxed text-snow-500">
                {option.description}
              </span>
            )}
          </span>
          {selected === option.value && (
            <Check size={18} className="text-brand-500" />
          )}
        </button>
      ))}
    </div>
  );
}

/** 한국어 예약 첫 화면: 카드·네이버페이는 스마트스토어로 바로, 나머지는 이 예약 문의로 */
function PayChoice({ storeUrl }: { storeUrl: string }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2.5">
      <a
        href={storeUrl}
        onClick={() => trackEvent("pay_smartstore_click", { from: "reserve_top" })}
        className="flex flex-col rounded-2xl border-2 border-[#03C75A] bg-[#03C75A]/[0.06] px-4 py-3.5 transition-colors hover:bg-[#03C75A]/[0.12]"
      >
        <span className="text-[14.5px] font-bold text-ink-900">💳 카드·네이버페이</span>
        <span className="mt-1 text-[12.5px] font-semibold leading-snug text-[#03A94F]">👉 날짜 정했고 바로 결제할 분</span>
        <span className="mt-0.5 text-[12px] leading-snug text-snow-600">스토어 상품 보고 결제 →</span>
      </a>
      <div className="flex flex-col rounded-2xl border-2 border-brand-500 bg-brand-50 px-4 py-3.5">
        <span className="text-[14.5px] font-bold text-brand-600">📝 예약·상담 문의</span>
        <span className="mt-1 text-[12.5px] font-semibold leading-snug text-brand-600">👉 혼자·하루 강습</span>
        <span className="mt-0.5 text-[12px] leading-snug text-snow-600">아래에서 신청 · 확정 후 예약금 20%</span>
      </div>
      <a
        href="/ko/quote/"
        onClick={() => trackEvent("quote_open", { from: "reserve_top" })}
        className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-ink-900 bg-white px-4 py-3.5 transition-colors hover:bg-snow-100"
      >
        <span className="flex flex-col">
          <span className="text-[14.5px] font-bold text-ink-900">🏔️ 연박·가족 여러 팀 견적내기</span>
          <span className="mt-1 text-[12.5px] font-semibold leading-snug text-ink-900">👉 가족·여러 날·여러 팀이면 여기</span>
          <span className="mt-0.5 text-[12px] leading-snug text-snow-600">2박 3일 · 하루 2회 · 리프트·장비 40% 할인까지 한 번에</span>
        </span>
        <span className="shrink-0 text-[18px] font-bold text-ink-900">→</span>
      </a>
    </div>
  );
}

function BookingNotice({ content }: { content: SiteContent }) {
  const g = content.bookingWizard.guide;
  return (
    <div className="rounded-2xl border border-brand-500/20 bg-brand-50/50 p-5">
      <p className="text-[14px] font-bold text-ink-900">{g.bookingNoticeTitle}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {g.bookingNoticeLines.map((line) => (
          <li key={line} className="whitespace-pre-line text-[13px] leading-relaxed text-snow-700">
            {line}
          </li>
        ))}
      </ul>
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

      <div className="mt-4">
        <BookingNotice content={content} />
      </div>

      <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-50/50 p-6">
        <p className="text-[15px] font-bold text-ink-900">
          {content.preLessonGuidance.title}
        </p>
        <p className="mt-1 text-[13px] text-snow-600">
          {content.preLessonGuidance.description}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {content.preLessonGuidance.items.map((item) => (
            <li key={item.title} className="flex items-start gap-2.5">
              <span className="text-[16px] leading-none">{item.icon}</span>
              <div>
                <p className="text-[13.5px] font-semibold text-ink-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-snow-700">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.98]"
      >
        <Copy size={18} />
        {copied ? summary.copiedLabel : summary.copyButton}
      </button>

      <button
        type="button"
        onClick={() => {
          window.location.href = buildSmsHref(content.contact.phone, message);
        }}
        className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-snow-300 text-[15px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
      >
        <MessageSquare size={18} />
        {summary.smsButton}
      </button>

      <a
        href={content.contact.kakaoChannel}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          // Copy the full booking message (incl. name + phone) before opening the
          // channel, so the customer can't send a message without their contact.
          void handleCopy();
        }}
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


function ForeignSummaryView({
  state,
  content,
  ft,
  sent,
}: {
  state: WizardState;
  content: SiteContent;
  ft: (typeof FOREIGN_TEXT)[ForeignLocale];
  sent: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const message = useMemo(() => buildSummaryMessage(state, content), [state, content]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — the summary text stays selectable
    }
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col justify-center px-5 py-10">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          sent ? "bg-brand-50 text-brand-600" : "bg-rose-50 text-rose-500"
        )}
      >
        {sent ? <Check size={24} /> : <MessageSquare size={24} />}
      </div>
      <h1 className="mt-6 text-[24px] font-bold tracking-tight text-ink-900 sm:text-[26px]">
        {sent ? ft.heading : ft.failedHeading}
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-snow-700">
        {sent ? ft.description(state.email.trim()) : ft.failedDescription}
      </p>

      <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-snow-300/60 bg-white p-6 text-[14px] leading-relaxed text-ink-800">
        {message}
      </pre>

      <div className="mt-4">
        <BookingNotice content={content} />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all active:scale-[0.98]",
          sent
            ? "border border-snow-300 text-ink-900 hover:border-brand-500"
            : "bg-brand-500 text-white hover:bg-brand-600"
        )}
      >
        <Copy size={18} />
        {copied ? ft.copied : ft.copyButton}
      </button>

      <div className="mt-4 rounded-2xl bg-snow-100/70 p-4 text-center text-[13.5px] text-snow-700">
        {ft.emailUs}
        <p className="mt-1 select-all font-semibold text-ink-900">{content.contact.email}</p>
      </div>

      <Link
        href="/"
        className="mt-5 text-center text-[14px] font-medium text-snow-500 hover:text-ink-700"
      >
        {content.bookingWizard.summary.backHome}
      </Link>
    </div>
  );
}

function FullCareSchedule({
  program,
  content,
}: {
  program: string;
  content: SiteContent;
}) {
  const fc = content.fullCarePrograms.find((p) => p.slug === program);
  if (!fc) return null;
  const info = content.bookingWizard.fullCareInfo;
  return (
    <div className="mt-5 rounded-2xl border border-snow-100 bg-white p-4 sm:p-5">
      <p className="text-sm font-bold text-snow-700">{info.scheduleTitle}</p>
      <ol className="mt-4 space-y-0">
        {fc.schedule.map((s, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {i < fc.schedule.length - 1 && (
              <span className="absolute left-[5px] top-4 h-full w-px bg-snow-100" />
            )}
            <span className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-brand-600 bg-white" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-brand-600">{s.time}</p>
              <p className="text-sm font-semibold text-snow-700">{s.title}</p>
              {s.items.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {s.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full bg-snow-100 px-2 py-0.5 text-[12px] text-snow-500"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] leading-relaxed text-snow-500">{info.scheduleNote}</p>
    </div>
  );
}

/** 강습 길이에 맞는 리프트권 (2시간→3시간권, 3·4시간→5시간권, 풀케어→7시간권) */
function ticketForProgram(program: string): TicketHours {
  if (program === "2h") return 3;
  if (program === "one-day" || program === "night") return 7;
  return 5;
}

/** 리프트·장비 40% 할인 안내 — 고른 날짜가 주말·공휴일이면 주말 요금으로 */
function LiftRentalNote({ program, date, locale }: { program: string; date: string; locale: string }) {
  const L = locale.startsWith("en") ? "en" : locale.startsWith("zh") ? "zh" : "ko";
  const t = ticketForProgram(program);
  const wk = isWeekendRate(date);
  const w = wk ? 1 : 0;
  const cut = (n: number) => Math.round((n * (1 - LIFT_RENTAL_DISCOUNT)) / 100) * 100;
  const lift = LIFT_PRICES[t];
  const rent = RENTAL_PRICES[t];
  const fmt = (n: number) =>
    L === "ko" ? `${n.toLocaleString("ko-KR")}원` : `₩${n.toLocaleString("en-US")} (${approxUsd(n)})`;
  const fmt0 = (n: number) => (L === "ko" ? `${n.toLocaleString("ko-KR")}원` : `₩${n.toLocaleString("en-US")}`);
  let dayTag = "";
  if (date) {
    const [y, m, d] = date.split("-").map(Number);
    const wd = new Date(y, m - 1, d).getDay();
    const hol = HOLIDAYS.includes(date) ? HOLIDAY_NAMES[date]?.[L] : "";
    const wdName = { ko: "일월화수목금토", en: "", zh: "日一二三四五六" }[L];
    dayTag =
      L === "en"
        ? `${m}/${d} (${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][wd]}${hol ? ` · ${hol}` : ""})`
        : `${m}/${d}(${wdName[wd]}${hol ? `·${hol}` : ""})`;
  }
  const T = {
    ko: {
      title: "🎿 리프트권·장비 렌탈 정가 40% 할인",
      sub: "강습료와 함께 지노스키에 결제 · 현장에서는 받기만 하면 돼요",
      rate: wk ? "주말·공휴일 요금" : "주중 요금",
      basis: `리프트 ${t}시간권 · 장비 ${rent.hours}시간 기준 · 1인`,
      adult: "대인 (14세 이상)",
      child: "소인 (13세 이하)",
      liftOnly: "리프트만",
      both: "리프트+장비",
      foot: "헬멧·의류는 할인 제외 · 필요 없으면 요청사항에 「리프트 필요 없음」이라고 적어주세요",
    },
    en: {
      title: "🎿 Lift ticket & rental 40% off",
      sub: "Paid to JinoSki together with the lesson — just pick up on site",
      rate: wk ? "Weekend/holiday rate" : "Weekday rate",
      basis: `${t}h lift ticket · ${rent.hours}h equipment · per person`,
      adult: "Adult (14+)",
      child: "Child (13 and under)",
      liftOnly: "Lift only",
      both: "Lift + equipment",
      foot: "Helmets & clothing not discounted · If you don't need it, just say so in the request note",
    },
    zh: {
      title: "🎿 缆车票·装备租赁 原价6折（减40%）",
      sub: "与课程费一起付给JinoSki · 到现场直接领取",
      rate: wk ? "周末·节假日价格" : "平日价格",
      basis: `${t}小时缆车票 · ${rent.hours}小时装备 · 每人`,
      adult: "成人（14岁以上）",
      child: "儿童（13岁以下）",
      liftOnly: "仅缆车",
      both: "缆车+装备",
      foot: "头盔·滑雪服不参与折扣 · 不需要的话请在备注中说明",
    },
  }[L];
  const rows: [string, "adult" | "child"][] = [
    [T.adult, "adult"],
    [T.child, "child"],
  ];
  return (
    <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3.5 ring-1 ring-amber-200">
      <p className="text-[15px] font-bold text-ink-900">{T.title}</p>
      <p className="mt-0.5 text-[12.5px] text-snow-600">{T.sub}</p>
      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-ink-700">
        <span className={cn("rounded-full px-2 py-0.5 text-[11.5px] font-bold text-white", wk ? "bg-rose-500" : "bg-sky-500")}>
          {dayTag ? `${dayTag} ` : ""}
          {T.rate}
        </span>
        <span>{T.basis}</span>
      </p>
      <table className="mt-2 w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11.5px] text-snow-500">
            <th className="py-1 font-semibold" />
            <th className="py-1 font-semibold">{T.liftOnly}</th>
            <th className="py-1 font-semibold">{T.both}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, k]) => (
            <tr key={k} className="border-t border-amber-200/70 align-top">
              <td className="py-1.5 pr-2 font-semibold text-ink-800">{label}</td>
              <td className="py-1.5 pr-2">
                <span className="text-[11px] text-snow-400 line-through">{fmt0(lift[k][w])}</span>
                <br />
                <b className="text-rose-600">{fmt(cut(lift[k][w]))}</b>
              </td>
              <td className="py-1.5">
                <span className="text-[11px] text-snow-400 line-through">{fmt0(lift[k][w] + rent[k][w])}</span>
                <br />
                <b className="text-rose-600">{fmt(cut(lift[k][w]) + cut(rent[k][w]))}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-snow-500">{T.foot}</p>
    </div>
  );
}
