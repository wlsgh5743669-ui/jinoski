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
import { calculateBookingPrice, getGroupStudentCount } from "@/lib/pricing";
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
import { SeasonCard } from "@/components/sections/season-card";
import { GuideCards, DAY_LESSON_CARDS, BOOKING_CARDS } from "@/components/shared/guide-cards";
import { ConsentBox, marketingTag } from "@/components/shared/consent-box";
import { attributionText } from "@/components/shared/attribution";
import { MessengerButtons } from "@/components/shared/messenger-buttons";
import { JuniorBadge } from "@/components/shared/junior-badge";
import { isJuniorProgram, JUNIOR_GRADES, JUNIOR_PASS_PROGRAM, JUNIOR_PRICES } from "@/config/junior-grade";
import { getContent } from "@/config/site";
import { approxUsd, withUsd } from "@/lib/usd";
import { VIP_ADD_PER_PERSON, VIP_TOTALS } from "@/components/sections/all-in-full-care";
import { HOLIDAYS, HOLIDAY_NAMES, LIFT_PRICES, LIFT_RENTAL_DISCOUNT, RENTAL_PRICES, isWeekendRate, type TicketHours } from "@/config/lift-rental";

/** 영어·중국어 예약: 문자·카톡 대신 이메일로 접수하고 이메일로 확정 안내 */
const FOREIGN_TEXT = {
  en: {
    emailPlaceholder: "Email (or leave a messenger below)",
    msgTitle: "How should we contact you?",
    msgHint: "Email or messenger — either one is fine",
    msgId: { WhatsApp: "WhatsApp number with country code (e.g. +65 9123 4567)", WeChat: "WeChat ID", LINE: "LINE ID", KakaoTalk: "KakaoTalk ID" },
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
    emailPlaceholder: "电子邮箱（或在下方留聊天软件）",
    msgTitle: "我们怎么联系您？",
    msgHint: "邮箱或聊天软件，留一个即可",
    msgId: { WhatsApp: "WhatsApp号码（含国家区号，如 +86 138 0000 0000）", WeChat: "微信号", LINE: "LINE ID", KakaoTalk: "KakaoTalk ID" },
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

/**
 * 외국인 VIP 레슨 (대표 11-22 「이게 우리 주력 상품이야」) — 소개 카드(all-in-full-care.tsx)의 버튼이 ?vip=1 로 보내요.
 * 예전엔 요청란에 「VIP」라고 직접 적어야 했고 결제 순서 설명도 VVIP보다 약했어요.
 * 값: 풀케어 레슨료 + 1인 150,000원 (리프트권 7시간·장비 8시간·바이저 헬멧·스키복 + 스키 양말 증정, 장갑 별도 20,000원).
 */
const VIP_TXT = {
  ko: {
    badge: "VIP 레슨",
    label: "VIP 추가",
    detail: (n: number) => `리프트 7시간·장비 8시간·헬멧·스키복·양말 · 1인 150,000원 × ${n}명`,
    hint: "1인 150,000원 추가로 리프트·장비·헬멧·스키복까지",
    incShort: "리프트·장비·헬멧·스키복 포함",
    payNote: "강사 확정 후 전액 결제 · 강습 당일엔 따로 낼 돈이 없어요.",
    after: "강사가 확정되면 전액 결제 안내를 보내 드려요. 장비·스키복 준비를 위해 키와 신발 사이즈도 여쭤볼게요.",
  },
  en: {
    badge: "VIP Lesson",
    label: "VIP add-on",
    detail: (n: number) => `lift 7h · gear 8h · helmet · ski wear · socks · ₩150,000 × ${n}`,
    hint: "+ ₩150,000 per person for lift, gear, helmet & ski wear",
    incShort: "lift, gear, helmet & ski wear included",
    payNote: "Paid in full by PayPal after we confirm your instructor — nothing to pay on the day.",
    after: "Once your instructor is confirmed we'll send a PayPal request for the full amount, and ask everyone's height and shoe size so your gear and ski wear are ready.",
  },
  zh: {
    badge: "VIP 课程",
    label: "VIP 加购",
    detail: (n: number) => `缆车7小时·装备8小时·头盔·滑雪服·袜子 · ₩150,000 × ${n}人`,
    hint: "每人加 ₩150,000，含缆车票·装备·头盔·滑雪服",
    incShort: "含缆车票·装备·头盔·滑雪服",
    payNote: "确认教练后通过 PayPal 支付全款 — 上课当天无需再付。",
    after: "确认教练后，我们会发送 PayPal 全款付款请求，并询问每个人的身高和鞋码，提前准备装备和滑雪服。",
  },
};
const vipLine = (content: SiteContent) => {
  const l = content.siteConfig.locale.slice(0, 2);
  return VIP_TXT[(l === "en" || l === "zh" ? l : "ko") as keyof typeof VIP_TXT];
};
const vipAddOf = (state: WizardState) =>
  state.vip && (state.program === "one-day" || state.program === "night") && state.groupSize
    ? VIP_ADD_PER_PERSON * getGroupStudentCount(state.groupSize)
    : 0;
const formatWon = (n: number) => n.toLocaleString("en-US");

const VIP_PANEL = {
  en: {
    title: "You're booking a VIP Lesson",
    sub: "7 hours with your own instructor — lift ticket, gear, helmet and ski wear ready when you arrive.",
    inc: ["Lift ticket · 7 hours", "Skis or snowboard + boots · 8 hours", "Visor helmet (goggles built in)", "Premium ski jacket & pants", "Ski socks — yours to keep"],
    gloves: "Gloves not included — ₩20,000 a pair, or bring your own",
    priceTitle: "Price for your whole group",
    ex: ["1 person", "2 people", "3 people"],
    payTitle: "How payment works",
    pay: [
      "Send this request (about 2 minutes) — nothing to pay yet.",
      "Within 24 hours we confirm your instructor and time, and send a PayPal payment request for the full amount.",
      "Pay by PayPal (cards accepted) and your booking is confirmed. Nothing more to pay on the day.",
    ],
    sizes: "After booking we'll ask everyone's height and shoe size.",
    off: "Book a regular lesson instead",
  },
  zh: {
    title: "您正在预约 VIP 课程",
    sub: "专属教练7小时 — 缆车票、装备、头盔和滑雪服在您到达前都已备好。",
    inc: ["缆车票 · 7小时", "双板或单板 + 雪鞋 · 8小时", "护目镜一体头盔（无需雪镜）", "高级滑雪服上衣+裤子", "滑雪袜 — 赠送"],
    gloves: "不含手套 — ₩20,000/副，也可自备",
    priceTitle: "整组价格",
    ex: ["1人", "2人", "3人"],
    payTitle: "付款流程",
    pay: [
      "提交预约申请（约2分钟）— 现在无需付款。",
      "24小时内确认教练和时间，并发送 PayPal 全款付款请求。",
      "通过 PayPal 付款（可用信用卡）即预约成功，上课当天无需再付款。",
    ],
    sizes: "预约后我们会询问每个人的身高和鞋码。",
    off: "改为预约普通课程",
  },
};

/** VIP로 들어온 손님에게: 첫 화면엔 포함 항목·값·결제 순서를 다 보여 주고, 다음 화면부턴 작은 띠만 */
function VipPanel({ locale, full, onOff }: { locale: string; full: boolean; onOff: () => void }) {
  const T = VIP_PANEL[locale === "zh" ? "zh" : "en"];
  if (!full) {
    return (
      <p className="mt-4 flex items-center gap-2 self-start rounded-full bg-[#1a1408] px-3.5 py-1.5 text-[12.5px] font-bold text-[#F1D693] ring-1 ring-[#E7C77F]">
        👑 {T.title}
      </p>
    );
  }
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#1a1408_0%,#0a0b0d_60%)] text-white ring-2 ring-[#E7C77F]">
      <div className="px-4 pb-4 pt-4 sm:px-5">
        <p className="text-[17px] font-bold tracking-tight text-[#F1D693]">👑 {T.title}</p>
        <p className="mt-1 text-[13px] leading-snug text-white/75">{T.sub}</p>
        <ul className="mt-3 grid gap-x-3 gap-y-1 text-[13px] text-white/90 sm:grid-cols-2">
          {T.inc.map((x) => (
            <li key={x} className="flex gap-1.5">
              <Check size={14} className="mt-[3px] shrink-0 text-[#E7C77F]" />
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-[12px] text-white/55">{T.gloves}</p>

        <p className="mt-4 text-[12.5px] font-bold text-[#E7C77F]">{T.priceTitle}</p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {VIP_TOTALS.map((total, i) => (
            <div key={i} className="rounded-xl bg-white/[0.07] px-1 py-2 text-center ring-1 ring-[#D9B56A]/40">
              <p className="text-[12px] text-white/65">{T.ex[i]}</p>
              <p className="text-[13.5px] font-extrabold tabular-nums tracking-tight text-[#F1D693] min-[400px]:text-[15px]">₩{formatWon(total)}</p>
              <p className="text-[11px] text-white/55">{approxUsd(total)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white px-4 py-4 text-ink-900 sm:px-5">
        <p className="text-[13.5px] font-bold">💳 {T.payTitle}</p>
        <ol className="mt-2 flex flex-col gap-2">
          {T.pay.map((x, i) => (
            <li key={x} className="flex gap-2.5 text-[13px] leading-snug text-snow-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a1408] text-[11px] font-bold text-[#F1D693]">{i + 1}</span>
              {x}
            </li>
          ))}
        </ol>
        <p className="mt-2.5 text-[12.5px] text-snow-600">📏 {T.sizes}</p>
        <button type="button" onClick={onOff} className="mt-3 text-[12.5px] font-semibold text-snow-500 underline underline-offset-2 hover:text-ink-900">
          {T.off}
        </button>
      </div>
    </div>
  );
}
type ForeignLocale = keyof typeof FOREIGN_TEXT;
const isForeignLocale = (l: string): l is ForeignLocale => l === "en" || l === "zh";
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
/** 외국 손님 연락처: 이메일 또는 (메신저 종류 + 아이디) 중 하나면 OK */
const foreignContactOk = (s: { email: string; msgApp: string; messenger: string }) =>
  isValidEmail(s.email) || (!!s.msgApp && s.messenger.trim().length >= 3);
const msgLine = (s: { msgApp: string; messenger: string }) =>
  s.messenger.trim() ? `${s.msgApp || "Messenger"}: ${s.messenger.trim()}` : "";

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
  /** 주니어 기술등급 심사: 도전할 등급 (1~10) */
  juniorGrade: number | null;
  /** 리프트권·장비 같이 결제 (정가 30% 할인) */
  liftOpt: "none" | "lift" | "both";
  /** 개인정보 동의(필수) · 시즌 안내 수신(선택) */
  consent: boolean;
  marketing: boolean;
  liftAdults: number;
  liftKids: number;
  email: string;
  messenger: string;
  msgApp: "" | "WhatsApp" | "WeChat" | "LINE" | "KakaoTalk";
  /** 외국인 VIP 레슨 (풀케어 + 1인 150,000원 리프트·장비·헬멧·스키복) — ?vip=1 로 들어오면 켜져요 */
  vip: boolean;
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
  juniorGrade: null,
  liftOpt: "none",
  consent: false,
  marketing: false,
  liftAdults: 0,
  liftKids: 0,
  email: "",
  messenger: "",
  msgApp: "",
  vip: false,
};

function formatPrice(value: number, content: SiteContent): string {
  const loc = content.siteConfig.locale;
  if (loc.startsWith("en")) return `${value.toLocaleString("en-US")} KRW (${approxUsd(value)})`;
  if (loc.startsWith("zh")) return `${value.toLocaleString("en-US")}韩元 (${approxUsd(value)})`;
  return `${value.toLocaleString("ko-KR")}원`;
}

type BreakdownLine = { label: string; detail: string; amount: string };

const LIFT_TXT = {
  ko: { lift: "리프트권", rent: "장비 렌탈", h: (n: number) => `${n}시간`, adult: "대인", child: "소인", off: "정가 30% 할인", wk: "주말·공휴일 요금", wd: "주중 요금" },
  en: { lift: "Lift ticket", rent: "Rental", h: (n: number) => `${n}h`, adult: "Adult", child: "Child", off: "30% off list price", wk: "weekend/holiday rate", wd: "weekday rate" },
  zh: { lift: "缆车票", rent: "装备租赁", h: (n: number) => `${n}小时`, adult: "成人", child: "儿童", off: "原价7折", wk: "周末·节假日价格", wd: "平日价格" },
};
const liftLoc = (content: SiteContent) => {
  const l = content.siteConfig.locale.slice(0, 2);
  return LIFT_TXT[(l === "en" || l === "zh" ? l : "ko") as keyof typeof LIFT_TXT];
};
const cut40 = (n: number) => Math.round((n * (1 - LIFT_RENTAL_DISCOUNT)) / 100) * 100;

/** 리프트권·장비 추가 금액 (추천 시간권 · 선택 날짜 주중/주말) */
function liftExtra(state: WizardState) {
  if (!state.program || state.vip || state.liftOpt === "none" || state.liftAdults + state.liftKids === 0) return null;
  const t = ticketForProgram(state.program);
  const w = isWeekendRate(state.date) ? 1 : 0;
  const lift = LIFT_PRICES[t];
  const rent = RENTAL_PRICES[t];
  const a = state.liftAdults;
  const k = state.liftKids;
  const liftA = cut40(lift.adult[w]);
  const liftK = cut40(lift.child[w]);
  const rentA = cut40(rent.adult[w]);
  const rentK = cut40(rent.child[w]);
  const liftTotal = liftA * a + liftK * k;
  const rentTotal = state.liftOpt === "both" ? rentA * a + rentK * k : 0;
  return { t, rentHours: rent.hours, weekend: w === 1, a, k, liftA, liftK, rentA, rentK, liftTotal, rentTotal, total: liftTotal + rentTotal };
}

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

  // 리프트권·장비 (선택했을 때만)
  const ex = liftExtra(state);
  if (ex) {
    const L = liftLoc(content);
    const who = (pa: number, pk: number) =>
      [ex.a ? `${L.adult} ${formatPrice(pa, content)} × ${ex.a}` : "", ex.k ? `${L.child} ${formatPrice(pk, content)} × ${ex.k}` : ""].filter(Boolean).join(" + ");
    lines.push({
      label: `${L.lift} ${L.h(ex.t)}`,
      detail: `${L.off} · ${ex.weekend ? L.wk : L.wd} · ${who(ex.liftA, ex.liftK)}`,
      amount: formatPrice(ex.liftTotal, content),
    });
    if (ex.rentTotal) {
      lines.push({
        label: `${L.rent} ${L.h(ex.rentHours)}`,
        detail: `${L.off} · ${who(ex.rentA, ex.rentK)}`,
        amount: formatPrice(ex.rentTotal, content),
      });
    }
  }
  const vipAdd = vipAddOf(state);
  if (vipAdd) {
    const VL = vipLine(content);
    lines.push({ label: VL.label, detail: VL.detail(people), amount: formatPrice(vipAdd, content) });
  }
  const grand = price.totalPrice + (ex?.total ?? 0) + vipAdd;

  return {
    price,
    lines,
    total: price.priceOnRequest ? labels.priceOnRequest : formatPrice(grand, content),
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
    ? [state.email.trim(), state.phone.trim(), msgLine(state)].filter(Boolean).join(" / ")
    : state.phone.trim();
  const note = (
    foreign
      ? [
          state.vip ? "👑 VIP(리프트 7h·장비 8h·바이저 헬멧·스키복·양말 준비 · 키·신발 사이즈 물어보기 · PayPal 전액 요청)" : "",
          `${locale === "zh" ? "중국어" : "영어"} 예약·${isValidEmail(state.email) ? "이메일" : state.msgApp || "메신저"} 회신`,
          msgLine(state),
          state.requestNote.trim(),
        ]
      : [state.requestNote.trim()]
  )
    .concat(marketingTag(state.marketing), attributionText())
    .filter(Boolean)
    .join(" / ");
  const res = await fetch(KAKAO_NOTIFY_URL, {
    method: "POST",
    keepalive: true,
    // text/plain avoids a CORS preflight; the worker parses it as JSON.
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      name: state.name.trim(),
      phone: contact,
      date: state.date,
      program: `${state.vip ? "👑 VIP 레슨 · " : ""}${getProgramLabel(state.program, ko)}`,
      timeSlot: getTimeSlotLabel(state.program, state.timeSlot, ko),
      groupSize: getGroupSizeLabel(state.groupSize as GroupSizeValue, ko),
      equipment: state.equipment ? getEquipmentLabel(state.equipment, ko) : "",
      level: levelText(state, ko),
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
  if (program === "one-day" || program === "night") return `${withUsd(g.priceFrom(first), locale)} · ${g.liftPassIncluded}`;
  const pass = getLiftPassPrice(program, content);
  return pass ? `${withUsd(g.priceFrom(first), locale)} · ${g.liftPassPlus(pass)}` : withUsd(g.priceFrom(first), locale);
}

function buildSmsHref(phone: string, body: string): string {
  const number = phone.replace(/[^0-9]/g, "");
  const isIOS =
    typeof navigator !== "undefined" && /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${number}${isIOS ? "&" : "?"}body=${encodeURIComponent(body)}`;
}

/** 주니어 등급 → 기존 실력 값 (다른 화면·알림 호환용) */
function levelForGrade(n: number): LevelValue {
  return n <= 2 ? "beginner" : n <= 4 ? "basic" : n <= 6 ? "intermediate" : "advanced";
}

/** 실력 표시: 주니어 심사면 「주니어 N등급 도전」 */
function levelText(state: WizardState, content: SiteContent): string {
  if (isJuniorProgram(state.program) && state.juniorGrade) {
    const g = JUNIOR_GRADES[state.juniorGrade - 1];
    const loc = content.siteConfig.locale.slice(0, 2);
    if (loc === "en") return `Junior badge Level ${g.no} (${g.en})`;
    if (loc === "zh") return `青少年${g.no}级考核（${g.zh}）`;
    return `주니어 ${g.no}등급 도전 (${g.ko})`;
  }
  return state.level ? getLevelInfo(state.level, content).label : "";
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
          msgLine(state),
        ].filter(Boolean)
      : [`${labels.phone}: ${state.phone.trim()}`]),
    `${labels.date}: ${state.date}`,
    `${labels.program}: ${state.vip ? `${vipLine(content).badge} · ` : ""}${getProgramLabel(program, content)}`,
    `${labels.timeSlot}: ${getTimeSlotLabel(program, state.timeSlot, content)}`,
    `${labels.groupSize}: ${getGroupSizeLabel(groupSize as GroupSizeValue, content)}`,
    `${labels.equipment}: ${getEquipmentLabel(state.equipment, content)}`,
    `${labels.level}: ${levelText(state, content)}`,
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

  // 한국어는 예상 금액(요청사항)까지만 — 준비물·만나는 곳·환불은 예약 안내 카드(사진)로 보여 줘요 (대표 11-23)
  if (content.siteConfig.locale.startsWith("ko")) return lines.join("\n");

  lines.push("", ...buildGuidanceLines(content));
  lines.push("", labels.closing);
  lines.push(`${labels.businessPhone}: ${"+82-" + content.contact.phone.replace(/^0/, "")}`);

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
    ko: { slope: { easy: "초급~초중급 슬로프", mid: "중상급 슬로프", hard: "상급 슬로프" }, how: "2시간 진행 · 실력 확인 → 심사 종목 연습 → 공인 지도자 심사", inc: ["연맹 응시료 + 발급료 포함", "심사 장면 사진·영상", "합격하면 공식 등급 뱃지 + 인증서"], extra: "패찰 1인 25,000원 별도 · 리프트·장비 30% 할인 · 한 번에 한 등급 심사 · 합격 보장 아님", grade: "등급", more: "주니어 기술등급 자세히 보기", tip: "어느 등급인지 모르겠으면 낮은 등급부터 추천드려요. 예약 후 상담 때 정해도 돼요.", title: "🎖️ 주니어 기술등급 심사", desc: "만 7~17세 · 스키 · 대한스키지도자연맹 공식 뱃지 · 눌러서 등급 선택", pick: "도전할 등급을 골라주세요", a: "처음 ~ 중급 슬로프 실력 (스노우플라우 ~ 다이나믹 롱턴)", b: "상급 슬로프 실력 (다이나믹 숏턴 ~ 종합활강) · Level 3 심사위원" },
    en: { slope: { easy: "green–blue slopes", mid: "red slopes", hard: "black slopes" }, how: "2 hours · level check → practice test elements → test by a certified instructor", inc: ["KSIA test fee + issuing fee included", "Photos & video of the test", "Official badge + certificate when passed"], extra: "Lesson permit ₩25,000 per person extra · lift & rental 30% off · one level per test · pass not guaranteed", grade: "Level", more: "More about junior badges", tip: "Not sure which level? We recommend starting lower — we can decide together after booking.", title: "🎖️ Junior Ski Badge Test", desc: "Ages 7–17 · ski · official KSIA badge · tap to choose a level", pick: "Choose the level to try", a: "Beginner to red slopes (snowplow – dynamic long turn)", b: "Black slopes (dynamic short turn – all-round run) · Level 3 examiner" },
    zh: { slope: { easy: "初级~初中级雪道", mid: "中高级雪道", hard: "高级雪道" }, how: "2小时 · 确认水平 → 练习考核项目 → 认证指导者考核", inc: ["含联盟考试费及发证费", "考核照片·视频", "通过后颁发官方等级徽章 + 证书"], extra: "教学许可证（挂牌）每人₩25,000另计 · 缆车·装备7折 · 每次考核一个等级 · 不保证通过", grade: "级", more: "了解青少年技术等级", tip: "不确定等级时建议从较低等级开始，预约后咨询时再决定也可以。", title: "🎖️ 青少年滑雪技术等级考核", desc: "7~17周岁 · 双板 · KSIA官方徽章 · 点击选择等级", pick: "请选择要挑战的等级", a: "初级~中高级雪道水平（犁式~动态长转）", b: "高级雪道水平（动态短转~综合滑降）· Level 3 考官" },
  }[locale === "en" || locale === "zh" ? locale : "ko"];

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
      vip: prev.vip && isFull,
      groupSize: "",
      timeSlot: isFull ? timeValues[0] : "",
      liftPassPayment: isFull ? "included" : "pay-together",
      // 주니어 등급 심사는 스키만
      juniorGrade: null,
      ...(isJuniorProgram(program)
        ? { equipment: "ski" as const, level: null, ageGroup: prev.ageGroup === "elementary" || prev.ageGroup === "teen" ? prev.ageGroup : null }
        : {}),
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
    const equipmentParam = params.get("equipment");
    // 외국인 VIP 레슨 소개 카드에서 왔어요 — 요청란에 「VIP」라고 적지 않아도 되게 (대표 11-22)
    const vipParam = params.get("vip") === "1" && isForeignLocale(locale);

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

      if (vipParam) {
        if (next.program !== "one-day" && next.program !== "night") {
          next.program = "one-day";
          next.timeSlot = getTimeSlotValues("one-day", content)[0];
          next.liftPassPayment = "included";
        }
        next.vip = true;
        next.liftOpt = "none";
        setShowFullCareChoice(true);
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

      if (
        equipmentParam &&
        !next.equipment &&
        (EQUIPMENT_VALUES as readonly string[]).includes(equipmentParam)
      ) {
        next.equipment = equipmentParam as EquipmentValue;
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
        return isJuniorProgram(state.program) ? state.juniorGrade !== null : state.level !== null;
      case 7:
        return state.liftPassPayment.length > 0;
      case 8:
        return (
          state.name.trim().length > 0 &&
          (foreign ? foreignContactOk(state) : state.phone.trim().length >= 9) &&
          state.ageGroup !== null &&
          state.consent
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
            totalPrice: price.totalPrice + vipAddOf(state),
            vip: state.vip,
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
    <div className="mx-auto flex min-h-[100svh] max-w-2xl flex-col px-5 py-6 sm:px-6 sm:py-10">
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
      {foreign && state.vip && <VipPanel locale={locale} full={on(1)} onOff={() => update("vip", false)} />}
      {foreign && on(1) && !state.vip && (
        <a
          href={`/${locale}/quote/`}
          onClick={() => trackEvent("quote_open", { from: "reserve_top_foreign" })}
          className="mt-6 flex items-center justify-between gap-3 rounded-2xl border-2 border-ink-900 bg-white px-4 py-3.5 transition-colors hover:bg-snow-100"
        >
          <span className="flex flex-col">
            <span className="text-[15px] font-bold text-ink-900">🏔️ {locale === "zh" ? "多日·家庭报价计算" : "Multi-day & family quote"}</span>
            <span className="mt-1 text-[12.5px] font-semibold leading-snug text-ink-900">
              👉 {locale === "zh" ? "住几晚·每天上课·多个家庭一起？点这里" : "Staying a few nights, lessons every day or several families? Start here"}
            </span>
            <span className="mt-0.5 text-[12px] leading-snug text-snow-600">
              {locale === "zh" ? "例：3天2夜 · 每天2次 · 缆车·装备7折 · 一次算好总价" : "e.g. 3 days · 2 lessons a day · lift & rental 30% off · see the total at once"}
            </span>
          </span>
          <span className="shrink-0 text-[18px] font-bold text-ink-900">→</span>
        </a>
      )}
      {foreign && on(1) && !state.vip && (
        <div className="mt-2.5 flex flex-col gap-1.5 rounded-2xl border-2 border-[#003087]/30 bg-[#E8F0FE] px-4 py-3.5">
          <span className="text-[14.5px] font-bold text-[#003087]">💳 {locale === "zh" ? "海外客人：用 PayPal 付款" : "Overseas guests: pay with PayPal"}</span>
          <span className="text-[12.5px] leading-snug text-snow-700">
            {locale === "zh"
              ? "先提交预约申请 → 我们确认教练和时间后，用 PayPal 支付全款即可确认（上课当天无需再付）。也可以先看看多日报价。"
              : "Send your booking request → once we confirm your instructor and time, pay the full amount by PayPal to lock it in (nothing more to pay on the day). Planning several days? Try the multi-day quote."}
          </span>
          <a href={`/${locale}/quote/`} className="text-[12.5px] font-bold text-[#003087] underline underline-offset-2">
            {locale === "zh" ? "多日·家庭报价计算 →" : "Multi-day & family quote →"}
          </a>
          {/* VVIP는 전액 미리 결제 (대표 11-16) — 한눈에 보이는 금색 카드·바로 가기 (대표 11-17) */}
          <a
            href={`/${locale}/lessons/#vvip-package`}
            className="mt-2 block rounded-xl bg-[linear-gradient(160deg,#1a1408_0%,#0a0b0d_60%)] px-3.5 py-3 text-white ring-2 ring-[#E7C77F] transition-transform hover:scale-[1.01]"
          >
            <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
              <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-[#F1D693]">👑 {locale === "zh" ? "VVIP 套餐" : "VVIP Package"}</span>
              <span className="shrink-0 rounded-full bg-[#E7C77F] px-2.5 py-0.5 text-[11.5px] font-bold text-[#1a1408]">
                {locale === "zh" ? "提前付全额" : "Paid in full in advance"}
              </span>
            </span>
            <span className="mt-1.5 block text-[12.5px] leading-snug text-white/80">
              {locale === "zh"
                ? "当天无需再付款。确认日期和教练后，我们会发送 PayPal 付款请求。"
                : "Nothing to pay on the day. We send a PayPal payment request once your dates and instructor are confirmed."}
            </span>
            <span className="mt-2 inline-block text-[12.5px] font-bold text-[#E7C77F] underline underline-offset-2">
              {locale === "zh" ? "查看 VVIP 套餐 →" : "See the VVIP Package →"}
            </span>
          </a>
        </div>
      )}

      <div className={cn("flex-1", !foreign && on(1) ? "mt-6 sm:mt-8" : "mt-6 sm:mt-10")}>
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

            <div className="mt-5 sm:mt-8">
              {on(1) && (
                <DatePicker
                  value={state.date}
                  onChange={(date) => update("date", date)}
                />
              )}

              {on(2) && !showFullCareChoice && !showJuniorChoice && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {PROGRAM_VALUES.filter(
                    (value) => value !== "one-day" && value !== "night" && !isJuniorProgram(value)
                  ).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectProgram(value)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
                        state.program === value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className="text-[15px] font-bold text-ink-900">
                        {getProgramLabel(value, content)}
                      </span>
                      <p className="mt-1 text-[13px] font-medium text-brand-600">
                        {programPriceHint(value, content)}
                      </p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowFullCareChoice(true)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
                      isFullCare
                        ? "border-brand-500 bg-brand-50"
                        : "border-snow-300/60 bg-white hover:border-brand-300"
                    )}
                  >
                    <span className="text-[15px] font-bold text-ink-900">
                      {content.bookingWizard.fullCareGroupLabel}
                    </span>
                    <p className="mt-1 text-[13px] leading-snug text-snow-500 sm:leading-relaxed">
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
                      "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
                      isJuniorProgram(state.program)
                        ? "border-brand-500 bg-brand-50"
                        : "border-snow-300/60 bg-white hover:border-brand-300"
                    )}
                  >
                    <span className="text-[15px] font-bold text-ink-900">{JR.title}</span>
                    <p className="mt-1 text-[13px] leading-snug text-snow-500 sm:leading-relaxed">{JR.desc}</p>
                    <p className="mt-1 text-[13px] font-medium text-brand-600">{programPriceHint("junior-a", content)}</p>
                  </button>
                </div>
              )}

              {on(2) && showJuniorChoice && (
                <div className="flex flex-col gap-2 sm:gap-3">
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
                        "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
                        state.program === value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className="text-[15px] font-bold text-ink-900">{getProgramLabel(value, content)}</span>
                      <p className="mt-1 text-[13px] leading-snug text-snow-500 sm:leading-relaxed">{value === "junior-a" ? JR.a : JR.b}</p>
                      <ul className="mt-2.5 flex flex-col gap-1">
                        {JUNIOR_GRADES.filter((g) => (value === "junior-a" ? g.no <= 6 : g.no >= 7)).map((g) => (
                          <li key={g.no} className="flex items-center gap-2 text-[12.5px] text-ink-800">
                            <JuniorBadge grade={g} size={24} />
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
                <div className="flex flex-col gap-2 sm:gap-3">
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
                        "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
                        state.program === value
                          ? "border-brand-500 bg-brand-50"
                          : "border-snow-300/60 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className="text-[15px] font-bold text-ink-900">
                        {getProgramLabel(value, content)}
                      </span>
                      <p className="mt-1 text-[13px] leading-snug text-snow-500 sm:leading-relaxed">
                        {value === "one-day"
                          ? content.bookingWizard.fullCareInfo.oneDay
                          : content.bookingWizard.fullCareInfo.night}
                      </p>
                      {state.vip ? (
                        <p className="mt-1 text-[13px] font-semibold text-[#8A6A1F]">
                          👑 VIP {withUsd(content.bookingWizard.guide.priceFrom(formatWon(VIP_TOTALS[0])), locale)} · {vipLine(content).hint}
                        </p>
                      ) : (
                        <p className="mt-1 text-[13px] font-medium text-brand-600">
                          {programPriceHint(value, content)}
                        </p>
                      )}
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

              {on(4) && PAGE_HEAD[step - 1] !== 4 && <h2 className="mb-3 mt-7 text-[18px] sm:mb-4 sm:mt-10 font-bold text-ink-900">{stepTitles[3]}</h2>}
              {on(4) && state.program && (
                <OptionList
                  options={getGroupSizeOptions(state.program).map((code) => {
                    const g = content.bookingWizard.guide;
                    const program = state.program as ProgramValue;
                    const rowPrice = getPriceRows(program, content).find((r) => r.people === code)?.price;
                    const pass = getLiftPassPrice(program, content);
                    const full = program === "one-day" || program === "night";
                    const people = getGroupStudentCount(code);
                    const vipTotal = state.vip && full ? VIP_TOTALS[people - 1] : undefined;
                    const description = vipTotal
                      ? `👑 VIP ${formatPrice(vipTotal, content)} · ${vipLine(content).incShort}`
                      : rowPrice
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
              {on(4) && state.program && !state.vip && <LiftRentalNote program={state.program} date={state.date} locale={locale} />}

              {on(5) && (
                <OptionList
                  options={EQUIPMENT_VALUES.filter((v) => !isJuniorProgram(state.program) || v === "ski").map((value) => ({
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

              {on(6) && PAGE_HEAD[step - 1] !== 6 && (
                <h2 className="mb-3 mt-7 text-[18px] sm:mb-4 sm:mt-10 font-bold text-ink-900">
                  {isJuniorProgram(state.program) ? JR.pick : stepTitles[5]}
                </h2>
              )}
              {on(6) && isJuniorProgram(state.program) && (
                <div className="flex flex-col gap-2.5">
                  {JUNIOR_GRADES.filter((g) => (state.program === "junior-a" ? g.no <= 6 : g.no >= 7)).map((g) => {
                    const sel = state.juniorGrade === g.no;
                    const L = locale === "en" || locale === "zh" ? locale : "ko";
                    return (
                      <button
                        key={g.no}
                        type="button"
                        onClick={() => setState((prev) => ({ ...prev, juniorGrade: g.no, level: levelForGrade(g.no) }))}
                        className={cn(
                          "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                          sel ? "border-brand-500 bg-brand-50" : "border-snow-300/60 bg-white hover:border-brand-300"
                        )}
                      >
                        <JuniorBadge grade={g} size={40} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-bold text-ink-900">
                            {L === "en" ? `Level ${g.no} · ${g.en}` : L === "zh" ? `${g.no}级 · ${g.zh}` : `${g.no}등급 · ${g.ko}`}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-snow-500">
                            {g.badge[L]} {L === "en" ? "badge" : L === "zh" ? "徽章" : "뱃지"} · {JR.slope[g.slope]}
                          </span>
                        </span>
                        {sel && <Check size={18} className="shrink-0 text-brand-500" />}
                      </button>
                    );
                  })}
                  <p className="text-[12.5px] leading-relaxed text-snow-500">💡 {JR.tip}</p>
                </div>
              )}
              {on(6) && !isJuniorProgram(state.program) && (
                <div className="flex flex-col gap-2 sm:gap-3">
                  {LEVEL_VALUES.map((value) => {
                    const info = getLevelInfo(value, content, state.equipment);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update("level", value)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
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
                          <p className="mt-1 text-[13.5px] font-semibold leading-snug text-brand-600">
                            {content.bookingWizard.guide.selfCheckPrefix}:{" "}
                            {content.levelSelfCheckByEquipment[state.equipment][value]}
                          </p>
                        )}
                        <p className="mt-0.5 text-[13px] leading-snug text-snow-500 sm:leading-relaxed">
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
                        {state.level && ` · ${levelText(state, content)}`}
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
                    <div className="rounded-2xl border border-snow-300/60 bg-snow-100/50 px-4 py-3.5">
                      <p className="text-[14px] font-bold text-ink-900">💬 {ft.msgTitle}</p>
                      <p className="mt-0.5 text-[12.5px] text-snow-700">{ft.msgHint}</p>
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                        {(["WhatsApp", "WeChat", "LINE", "KakaoTalk"] as const).map((app) => {
                          const on = state.msgApp === app;
                          const col = { WhatsApp: "#25D366", WeChat: "#07C160", LINE: "#06C755", KakaoTalk: "#FEE500" }[app];
                          return (
                            <button
                              key={app}
                              type="button"
                              onClick={() => update("msgApp", on ? "" : app)}
                              className={cn(
                                "flex h-11 items-center justify-center gap-1.5 rounded-xl border text-[14px] font-bold transition-colors",
                                on ? "border-ink-900 bg-white text-ink-900 ring-1 ring-ink-900" : "border-snow-300/70 bg-white text-ink-700"
                              )}
                            >
                              <span className="h-2.5 w-2.5 rounded-full" style={{ background: col }} />
                              {app}
                            </button>
                          );
                        })}
                      </div>
                      {state.msgApp && (
                        <input
                          type={state.msgApp === "WhatsApp" ? "tel" : "text"}
                          placeholder={ft.msgId[state.msgApp]}
                          value={state.messenger}
                          onChange={(e) => update("messenger", e.target.value)}
                          className="mt-2 h-12 w-full rounded-xl border border-snow-300/60 bg-white px-4 text-[15px] outline-none transition-colors focus:border-brand-500"
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <p className="mb-2.5 text-[13.5px] font-semibold text-ink-900">
                      {content.bookingWizard.form.ageGroupLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUP_VALUES.filter((v) => !isJuniorProgram(state.program) || v === "elementary" || v === "teen").map((value) => (
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

                  {price && state.program && !state.vip && (() => {
                    const L = liftLoc(content);
                    const lc = content.siteConfig.locale.slice(0, 2);
                    const T = {
                      ko: { title: "🎿 리프트권·장비도 같이 할까요?", sub: "정가 30% 할인 · 강습료와 함께 결제 · 현장에서는 받기만 하면 돼요", none: "필요 없음", lift: "리프트권만", both: "리프트권 + 장비", rec: "추천", gear: "장비" },
                      en: { title: "🎿 Add lift ticket & rental?", sub: "30% off list price · paid with the lesson · just pick up on site", none: "No thanks", lift: "Lift only", both: "Lift + equipment", rec: "Recommended", gear: "equipment" },
                      zh: { title: "🎿 需要缆车票·装备吗？", sub: "原价7折 · 与课程费一起支付 · 现场直接领取", none: "不需要", lift: "只要缆车票", both: "缆车票 + 装备", rec: "推荐", gear: "装备" },
                    }[lc === "en" || lc === "zh" ? lc : "ko"];
                    const t = ticketForProgram(state.program);
                    const w = isWeekendRate(state.date) ? 1 : 0;
                    const people = getGroupStudentCount(state.groupSize || "1:1");
                    const kidFirst = state.ageGroup === "kids" || state.ageGroup === "elementary";
                    const choose = (opt: WizardState["liftOpt"]) =>
                      setState((prev) => ({
                        ...prev,
                        liftOpt: opt,
                        ...(opt !== "none" && prev.liftAdults + prev.liftKids === 0
                          ? kidFirst
                            ? { liftKids: people, liftAdults: 0 }
                            : { liftAdults: people, liftKids: 0 }
                          : {}),
                      }));
                    const step = (key: "liftAdults" | "liftKids", d: number) =>
                      setState((prev) => ({ ...prev, [key]: Math.max(0, Math.min(10, prev[key] + d)) }));
                    const per = (adult: boolean) =>
                      cut40(LIFT_PRICES[t][adult ? "adult" : "child"][w]) +
                      (state.liftOpt === "both" ? cut40(RENTAL_PRICES[t][adult ? "adult" : "child"][w]) : 0);
                    return (
                      <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                        <p className="text-[15px] font-bold text-ink-900">{T.title}</p>
                        <p className="mt-0.5 text-[12.5px] text-snow-600">{T.sub}</p>
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {(["none", "lift", "both"] as const).map((o) => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => choose(o)}
                              className={cn(
                                "rounded-xl border px-2 py-2.5 text-[13px] font-bold leading-tight",
                                state.liftOpt === o ? "border-brand-500 bg-white text-brand-600 ring-1 ring-brand-500" : "border-snow-300/70 bg-white text-ink-700"
                              )}
                            >
                              {T[o]}
                            </button>
                          ))}
                        </div>
                        {state.liftOpt !== "none" && (
                          <>
                            <p className="mt-3 text-[12.5px] font-semibold text-ink-700">
                              {T.rec}: {L.lift} {L.h(t)}
                              {state.liftOpt === "both" ? ` + ${T.gear} ${L.h(RENTAL_PRICES[t].hours)}` : ""} · {w ? L.wk : L.wd}
                            </p>
                            <div className="mt-2 flex flex-col gap-2">
                              {([["liftAdults", true], ["liftKids", false]] as const).map(([key, adult]) => (
                                <div key={key} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                                  <div>
                                    <p className="text-[14px] font-bold text-ink-900">{adult ? `${L.adult} (14+)` : `${L.child} (≤13)`}</p>
                                    <p className="text-[12px] text-rose-600">{formatPrice(per(adult), content)}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button type="button" aria-label="-" onClick={() => step(key, -1)} className="h-8 w-8 rounded-full bg-snow-100 text-[18px] font-bold text-ink-700">−</button>
                                    <span className="w-5 text-center text-[15px] font-bold">{state[key]}</span>
                                    <button type="button" aria-label="+" onClick={() => step(key, 1)} className="h-8 w-8 rounded-full bg-snow-100 text-[18px] font-bold text-ink-700">+</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
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
                          {state.vip ? vipLine(content).payNote : content.bookingWizard.guide.extrasNotice}
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
          (ft ? !foreignContactOk(state) && ft.msgHint : state.phone.trim().length < 9 && g.fieldNames.phone),
          !state.ageGroup && g.fieldNames.ageGroup,
        ].filter(Boolean) as string[];
        return missing.length ? (
          <p className="mt-6 text-center text-[13px] font-medium text-rose-500">
            {g.missingFields(missing.join(", "))}
          </p>
        ) : null;
      })()}

      {on(8) && (
        <div className="mt-8">
          <ConsentBox
            locale={locale}
            agree={state.consent}
            onAgree={(v) => update("consent", v)}
            marketing={state.marketing}
            onMarketing={(v) => update("marketing", v)}
          />
        </div>
      )}

      <div className={cn("flex items-center gap-3", on(8) && !canProceed() ? "mt-3" : "mt-6 sm:mt-10")}>
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
    <div className="flex flex-col gap-2 sm:gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors sm:p-5",
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
              <span className="mt-0.5 block text-[13px] leading-snug text-snow-500 sm:leading-relaxed">
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
        <span className="mt-0.5 text-[12px] leading-snug text-snow-600">아래에서 신청 · 확정 후 전액 결제</span>
      </div>
      <a
        href="/ko/quote/"
        onClick={() => trackEvent("quote_open", { from: "reserve_top" })}
        className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-ink-900 bg-white px-4 py-3.5 transition-colors hover:bg-snow-100"
      >
        <span className="flex flex-col">
          <span className="text-[14.5px] font-bold text-ink-900">🏔️ 연박·가족 여러 팀 견적내기</span>
          <span className="mt-1 text-[12.5px] font-semibold leading-snug text-ink-900">👉 가족·여러 날·여러 팀이면 여기</span>
          <span className="mt-0.5 text-[12px] leading-snug text-snow-600">2박 3일 · 하루 2회 · 리프트·장비 30% 할인까지 한 번에</span>
        </span>
        <span className="shrink-0 text-[18px] font-bold text-ink-900">→</span>
      </a>
      <SeasonCard />
      <div className="col-span-2 mt-1 rounded-2xl bg-white px-3.5 pb-3.5 pt-3 ring-1 ring-snow-300/60">
        <p className="text-[13.5px] font-bold text-ink-900">
          📷 하루 강습 한눈에 보기 <span className="text-[12px] font-semibold text-snow-500">· 요금 · 시간표 · 예약 순서 (눌러서 크게)</span>
        </p>
        <GuideCards cards={DAY_LESSON_CARDS} event="day_guide_card_open" variant="thumbs" className="mt-2.5" />
      </div>
    </div>
  );
}

function BookingNotice({ content }: { content: SiteContent }) {
  const g = content.bookingWizard.guide;
  const lines = (
    <ul className="mt-2 flex flex-col gap-1.5">
      {g.bookingNoticeLines.map((line) => (
        <li key={line} className="whitespace-pre-line text-[13px] leading-relaxed text-snow-700">
          {line}
        </li>
      ))}
    </ul>
  );
  // 한국어: 진행 순서·취소 규정을 카드 이미지 2장으로 보여주고, 같은 내용의 글은 접어 둬요
  if (content.siteConfig.locale.startsWith("ko")) {
    return (
      <div className="overflow-hidden rounded-2xl border border-brand-500/20 bg-brand-50/50 p-5">
        <p className="text-[14px] font-bold text-ink-900">
          {g.bookingNoticeTitle} <span className="text-[12px] font-semibold text-snow-500">· 눌러서 크게 보기</span>
        </p>
        <GuideCards cards={BOOKING_CARDS} event="booking_notice_card_open" className="mt-3" />
        <details className="mt-3">
          <summary className="cursor-pointer text-[13px] font-semibold text-brand-600">글로 자세히 보기</summary>
          {lines}
        </details>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-brand-500/20 bg-brand-50/50 p-5">
      <p className="text-[14px] font-bold text-ink-900">{g.bookingNoticeTitle}</p>
      {lines}
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
        <ul className="mt-4 flex flex-col gap-2 sm:gap-3">
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
        {sent ? ft.description(state.email.trim() || msgLine(state)) : ft.failedDescription}
      </p>
      {state.vip && (
        <div className="mt-4 rounded-2xl bg-[linear-gradient(160deg,#1a1408_0%,#0a0b0d_60%)] px-4 py-3.5 text-[13px] leading-relaxed text-white/85 ring-2 ring-[#E7C77F]">
          <p className="font-bold text-[#F1D693]">👑 {vipLine(content).badge}</p>
          <p className="mt-1">{vipLine(content).after}</p>
        </div>
      )}

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

      <div className="mt-4">
        <p className="mb-2 text-center text-[13.5px] font-semibold text-ink-800">
          {content.siteConfig.locale.startsWith("zh") ? "有问题？直接发消息给我们" : "Questions? Message us directly"}
        </p>
        <MessengerButtons locale={content.siteConfig.locale.slice(0, 2)} place="booking_done" />
      </div>

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
  if (program === "2h" || isJuniorProgram(program)) return 3;
  if (program === "one-day" || program === "night") return 7;
  return 5;
}

/** 리프트·장비 30% 할인 안내 — 고른 날짜가 주말·공휴일이면 주말 요금으로 */
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
      title: "🎿 리프트권·장비 렌탈 정가 30% 할인",
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
      title: "🎿 Lift ticket & rental 30% off",
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
      title: "🎿 缆车票·装备租赁 原价7折（减30%）",
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
