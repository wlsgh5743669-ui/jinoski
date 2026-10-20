"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ImageDown,
  Link2,
  MessageCircle,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { renderQuoteImage } from "@/lib/quote-image";
import { Container } from "@/components/shared/container";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { EARLY_BIRD, isEarlyBirdActive } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { LIFT_PRICES, LIFT_RENTAL_DISCOUNT, RENTAL_PRICES, type TicketHours } from "@/config/lift-rental";

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

type Len = "2h" | "3h" | "4h";
const LEN_LABEL: Record<Len, string> = { "2h": "2시간", "3h": "3시간", "4h": "4시간" };
/** 하루 1번일 때 고를 수 있는 시간대 / 2번이면 오전+오후 */
const TIMES: Record<Len, { label: string; time: string }[]> = {
  "2h": [
    { label: "1교시", time: "09:00~11:00" },
    { label: "2교시", time: "11:00~13:00" },
    { label: "3교시", time: "13:20~15:20" },
    { label: "4교시", time: "15:30~17:30" },
    { label: "야간", time: "19:00~21:00" },
  ],
  "3h": [
    { label: "오전", time: "09:00~12:00" },
    { label: "오후", time: "13:20~16:20" },
    { label: "야간", time: "19:00~22:00" },
  ],
  "4h": [
    { label: "오전", time: "09:00~13:00" },
    { label: "오후", time: "13:20~17:20" },
    { label: "야간", time: "19:00~23:00" },
  ],
};
/** 하루 2번 추천 조합 — 2시간은 1+3교시 / 2+4교시, 3·4시간은 오전+오후 */
const TWICE: Record<Len, { label: string; idx: [number, number] }[]> = {
  "2h": [
    { label: "1+3교시", idx: [0, 2] },
    { label: "2+4교시", idx: [1, 3] },
  ],
  "3h": [{ label: "오전+오후", idx: [0, 1] }],
  "4h": [{ label: "오전+오후", idx: [0, 1] }],
};

const HELMET_PRICE = { basic: 5000, visor: 15000 };
const MAX_PEOPLE = 15;
const MAX_DAYS = 10;
const STEPS = ["언제 오세요?", "몇 명이 배우세요?", "수업은 어떻게 할까요?", "반은 어떻게 나눌까요?", "리프트·장비도 필요하세요?", "견적서"];

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const num = (s: string | undefined) => Number((s ?? "").replace(/[^0-9]/g, "")) || 0;
const roundUp100 = (n: number) => Math.ceil(n / 100) * 100;

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
function addDays(date: string, d: number) {
  const t = new Date(`${date}T00:00:00`);
  t.setDate(t.getDate() + d);
  return `${t.getMonth() + 1}/${t.getDate()}(${WEEK[t.getDay()]})`;
}
function isWeekend(start: string, offset: number) {
  if (!start) return true; // 날짜 모르면 주말 요금으로 넉넉하게
  const t = new Date(`${start}T00:00:00`);
  t.setDate(t.getDate() + offset);
  return t.getDay() === 0 || t.getDay() === 6;
}

/** n명을 g개 반으로 고르게 (6명 3반 → 2+2+2) */
function even(n: number, g: number): number[] {
  const base = Math.floor(n / g);
  return Array.from({ length: g }, (_, i) => base + (i < n % g ? 1 : 0));
}
/** 강사 1명당 1~3명으로 나누는 모든 방법 */
function allSplits(n: number): number[][] {
  const out: number[][] = [];
  const walk = (left: number, max: number, acc: number[]) => {
    if (left === 0) return void out.push(acc);
    for (let k = Math.min(3, max, left); k >= 1; k--) walk(left - k, k, [...acc, k]);
  };
  walk(n, 3, []);
  return out.sort((a, b) => a.length - b.length);
}

export function TeamQuote() {
  const content = useContent();
  const { contact } = content;

  const prices = useMemo(() => {
    const table: Record<Len, number[]> = { "2h": [], "3h": [], "4h": [] };
    for (const g of content.lessonPricing) if (g.program in table) table[g.program as Len] = g.rows.map((r) => num(r.price));
    const pass: Record<Len, number> = { "2h": 0, "3h": 0, "4h": 0 };
    for (const p of content.liftPassPricing) if (p.program in pass) pass[p.program as Len] = num(p.price);
    return { table, pass };
  }, [content]);

  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [len, setLen] = useState<Len>("2h");
  const [perDay, setPerDay] = useState<1 | 2 | 0>(0);
  const [timeIdx, setTimeIdx] = useState(0);
  const [twiceIdx, setTwiceIdx] = useState(0);
  const [edge, setEdge] = useState(false);
  // 날짜별로 다르게 (예: 1일차 3교시만, 2일차 1+3교시, 3일차 1교시) — 수업 시간·일수가 바뀌면 다시 기본값
  const [custom, setCustom] = useState<{ key: string; days: number[][] } | null>(null);
  const [split, setSplit] = useState<number[]>([]);
  const [showAllSplits, setShowAllSplits] = useState(false);
  // 리프트·장비 (40% 할인) — 어른/어린이 각각 몇 명
  const [lr, setLr] = useState({ a: 0, k: 0 }); // 리프트+장비
  const [lo, setLo] = useState({ a: 0, k: 0 }); // 리프트만
  const [helmet, setHelmet] = useState({ basic: 0, visor: 0 });
  const [ticket, setTicket] = useState<TicketHours | 0>(0); // 0 = 자동 추천

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [copied, setCopied] = useState<"" | "text" | "link">("");
  const [imgState, setImgState] = useState<"" | "making" | "done">("");
  const [showTotal, setShowTotal] = useState(false);
  const [totalTab, setTotalTab] = useState(0); // 0 = 전체, 1 = 1일차 …

  const people = adults + kids;

  // 링크로 받은 견적 → 바로 견적서 화면 (?sd=2026-12-26&d=3&a=2&k=4&l=2h&n=2&g=3-3&lr=0-2&lo=0-0&h=2-0&tk=7)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.get("a") && !q.get("k")) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    const pair = (v: string | null) => (v ?? "0-0").split("-").map((x) => Math.max(0, Math.min(MAX_PEOPLE, Number(x) || 0)));
    const a = Math.min(MAX_PEOPLE, Number(q.get("a")) || 0);
    const k = Math.min(MAX_PEOPLE - a, Number(q.get("k")) || 0);
    setAdults(a);
    setKids(k);
    const sd = q.get("sd");
    if (sd && /^\d{4}-\d{2}-\d{2}$/.test(sd)) setStartDate(sd);
    const d = Number(q.get("d"));
    if (d >= 1 && d <= MAX_DAYS) setDays(d);
    const l = q.get("l") as Len;
    if (l in TIMES) setLen(l);
    const n = Number(q.get("n"));
    if (n === 1 || n === 2) setPerDay(n);
    setTimeIdx(Math.max(0, Number(q.get("ti")) || 0));
    setTwiceIdx(Math.max(0, Number(q.get("tw")) || 0));
    setEdge(q.get("e") === "1");
    const dp = q.get("dp");
    if (dp && d >= 1) {
      const parsed = dp.split("-").map((x) => (x === "x" ? [] : x.split(".").map(Number).filter((n) => n >= 0 && n < 5)));
      if (parsed.length === d) setCustom({ key: `${l in TIMES ? l : "2h"}|${d}`, days: parsed });
    }
    const g = (q.get("g") ?? "").split("-").map(Number);
    setSplit(g.every((x) => x >= 1 && x <= 3) && g.reduce((s, x) => s + x, 0) === a + k ? g : even(a + k, Math.ceil((a + k) / 3)));
    const [lra, lrk] = pair(q.get("lr"));
    const [loa, lok] = pair(q.get("lo"));
    setLr({ a: lra, k: lrk });
    setLo({ a: loa, k: lok });
    const [hb, hv] = pair(q.get("h"));
    setHelmet({ basic: hb, visor: hv });
    const tk = Number(q.get("tk"));
    if ([3, 5, 7].includes(tk)) setTicket(tk as TicketHours);
    setStep(6);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ── 계산 ─────────────────────────────
  const times = TIMES[len];
  const twice = TWICE[len][Math.min(twiceIdx, TWICE[len].length - 1)];
  const slotsOfDay = perDay === 2 ? twice.idx.map((i) => times[i]) : perDay === 1 ? [times[Math.min(timeIdx, times.length - 1)]] : [];
  const patternIdx = perDay === 2 ? [...twice.idx] : perDay === 1 ? [Math.min(timeIdx, times.length - 1)] : [];
  const customOn = !!custom && custom.key === `${len}|${days}`;
  const schedule = Array.from({ length: days }, (_, i) => {
    let idx = patternIdx;
    let tag = "";
    if (customOn) idx = [...custom!.days[i]].sort((a, b) => a - b);
    else if (edge && days >= 2 && perDay === 2) {
      if (i === 0) [idx, tag] = [patternIdx.slice(-1), "도착일"];
      else if (i === days - 1) [idx, tag] = [patternIdx.slice(0, 1), "출발일"];
    }
    return { day: i + 1, tag, idx, slots: idx.map((j) => times[j]).filter(Boolean) };
  });
  function toggleDaySlot(day: number, j: number) {
    const base = schedule.map((d) => d.idx);
    const next = base.map((list, i) => (i === day ? (list.includes(j) ? list.filter((x) => x !== j) : [...list, j]) : list));
    setCustom({ key: `${len}|${days}`, days: next });
  }
  const maxPerDay = Math.max(0, ...schedule.map((d) => d.slots.length));
  const dayText = customOn ? "날짜별 일정" : `하루 ${perDay}번`;
  const sessions = schedule.reduce((a, d) => a + d.slots.length, 0);
  const eb = isEarlyBirdActive() && EARLY_BIRD.programs.includes(len);
  const tk: TicketHours = ticket || (maxPerDay >= 2 ? 7 : len === "2h" ? 3 : 5);

  const groupCost = (size: number) => {
    const lesson = prices.table[len][size - 1] ?? 0;
    const discount = eb ? Math.round((lesson * EARLY_BIRD.rate) / 1000) * 1000 : 0;
    return lesson - discount + prices.pass[len] * size;
  };
  const splitCheapest = people ? even(people, Math.ceil(people / 3)) : [];
  const splitSmall = people ? even(people, Math.ceil(people / 2)) : [];
  const splitPrivate = people ? Array(people).fill(1) : [];
  const usedSplit = split.length && split.reduce((a, b) => a + b, 0) === people ? split : splitCheapest;

  const groups = usedSplit.map((size, i) => ({
    no: i + 1,
    size,
    perSession: groupCost(size),
    lessonPP: Math.round((groupCost(size) * sessions) / size / 100) * 100,
  }));
  const lessonTotal = groups.reduce((a, g) => a + g.lessonPP * g.size, 0);
  // 얼리버드 10%는 강습료에만 (패찰·리프트·장비·헬멧 제외)
  const ebSaved = eb
    ? usedSplit.reduce((a, size) => a + Math.round(((prices.table[len][size - 1] ?? 0) * EARLY_BIRD.rate) / 1000) * 1000, 0) * sessions
    : 0;
  const lessonAvgPP = people ? Math.round(lessonTotal / people / 100) * 100 : 0;
  const perHead1 = people && sessions ? Math.round(lessonTotal / people / sessions / 1000) * 1000 : 0;

  /** 1인 리프트(·장비): 날짜마다 평일/주말 정가 → 40% 할인 (날짜별로 따로 계산해서 1일·2일·3일 금액도 보여줘요) */
  const extraPP = (child: boolean, withRental: boolean) => {
    const who = child ? "child" : "adult";
    const perDayList = Array.from({ length: days }, (_, d) => {
      const w = isWeekend(startDate, d) ? 1 : 0;
      const regular = LIFT_PRICES[tk][who][w] + (withRental ? RENTAL_PRICES[tk][who][w] : 0);
      return { regular, sale: roundUp100(regular * (1 - LIFT_RENTAL_DISCOUNT)) };
    });
    return {
      perDayList,
      regular: perDayList.reduce((a, x) => a + x.regular, 0),
      sale: perDayList.reduce((a, x) => a + x.sale, 0),
    };
  };
  const extras = [
    { key: "lr-a", label: "어른 · 리프트+장비", count: lr.a, ...extraPP(false, true) },
    { key: "lr-k", label: "어린이 · 리프트+장비", count: lr.k, ...extraPP(true, true) },
    { key: "lo-a", label: "어른 · 리프트만", count: lo.a, ...extraPP(false, false) },
    { key: "lo-k", label: "어린이 · 리프트만", count: lo.k, ...extraPP(true, false) },
  ].filter((x) => x.count > 0);
  const helmets = [
    { key: "basic", label: "기본 헬멧", count: helmet.basic, pp: HELMET_PRICE.basic * days },
    { key: "visor", label: "바이저 헬멧", count: helmet.visor, pp: HELMET_PRICE.visor * days },
  ].filter((x) => x.count > 0);
  const extrasTotal = extras.reduce((a, x) => a + x.sale * x.count, 0);
  const helmetTotal = helmets.reduce((a, x) => a + x.pp * x.count, 0);
  // 날짜별 합계 (토탈 보기: 전체 / 1일차 / 2일차 …)
  const dayTotals = schedule.map((d, i) => {
    const lesson = usedSplit.reduce((a, size) => a + groupCost(size), 0) * d.slots.length;
    const extra = extras.reduce((a, x) => a + x.perDayList[i].sale * x.count, 0);
    const helm = helmet.basic * HELMET_PRICE.basic + helmet.visor * HELMET_PRICE.visor;
    return { day: d.day, lesson, extra, helm, total: lesson + extra + helm };
  });
  const lessonExact = dayTotals.reduce((a, d) => a + d.lesson, 0);
  const grand = lessonExact + extrasTotal + helmetTotal;
  const lessonOnly = { a: adults - lr.a - lo.a, k: kids - lr.k - lo.k };
  const evenGroups = new Set(usedSplit).size === 1;

  /** 사람 유형별 1인 금액 (강습료 + 리프트·장비) */
  const perType = [
    { label: "어른 · 강습만", count: lessonOnly.a, add: 0 },
    { label: "어린이 · 강습만", count: lessonOnly.k, add: 0 },
    ...extras.map((x) => ({ label: x.label.replace(" · ", " · 강습+"), count: x.count, add: x.sale })),
  ].filter((x) => x.count > 0);

  const trip = days === 1 ? "당일" : `${days - 1}박 ${days}일`;
  const period = startDate ? `${addDays(startDate, 0)}${days > 1 ? ` ~ ${addDays(startDate, days - 1)}` : ""}` : "날짜 미정";
  const timeText = slotsOfDay.map((s) => s.time).join(" · ");

  // ── 단계 이동 ─────────────────────────
  const canNext = (s: number) =>
    s === 1 ? true : s === 2 ? people > 0 : s === 3 ? perDay > 0 && sessions > 0 : s === 4 ? usedSplit.length > 0 : true;
  function go(n: number) {
    if (n > step && !canNext(step)) return;
    setStep(Math.max(1, Math.min(6, n)));
    if (n === 6) trackEvent("quote_result_view", { people, days });
    if (typeof window !== "undefined") window.scrollTo({ top: document.getElementById("quote-top")!.offsetTop - 80, behavior: "smooth" });
  }
  function setPeople(a: number, k: number) {
    setAdults(a);
    setKids(k);
    setSplit(a + k ? even(a + k, Math.ceil((a + k) / 3)) : []);
    // 줄어든 인원에 맞춰 옵션 인원도 줄이기
    setLr((x) => ({ a: Math.min(x.a, a), k: Math.min(x.k, k) }));
    setLo((x) => ({ a: Math.min(x.a, a), k: Math.min(x.k, k) }));
    setHelmet((h) => ({ basic: Math.min(h.basic, a + k), visor: Math.min(h.visor, a + k - Math.min(h.basic, a + k)) }));
  }

  // ── 공유·문의 ─────────────────────────
  const summary = [
    `[지노스키 견적] ${trip} · ${LEN_LABEL[len]} · ${dayText}`,
    `기간: ${period}`,
    `인원: 어른 ${adults}명 · 어린이 ${kids}명 (반 ${usedSplit.join("+")}, 강사 ${usedSplit.length}명)`,
    `시간: ${perDay === 2 ? `${twice.label} ` : perDay === 1 ? `${slotsOfDay[0]?.label} ` : ""}${timeText}${customOn ? " (날짜별로 조정)" : edge && perDay === 2 && days > 1 ? " (도착·출발일 1번)" : ""} · 수업 ${sessions}회`,
    ...(days > 1
      ? [
          "■ 일정",
          ...schedule.map(
            (d) =>
              `  ${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}: ${
                d.slots.map((x) => `${x.label}(${x.time})`).join(" · ") || "수업 없음"
              }`
          ),
        ]
      : []),
    "",
    `■ 강습료 1인 ${evenGroups ? won(lessonAvgPP) : `약 ${won(lessonAvgPP)}`} (1회 약 ${won(perHead1)} × ${sessions}회, 패찰 포함)`,
    ...(extras.length ? ["■ 리프트·장비 (40% 할인)", ...extras.map((x) => `  ${x.label} ${x.count}명 · 1인 +${won(x.sale)}`)] : []),
    ...(helmets.length ? ["■ 헬멧", ...helmets.map((x) => `  ${x.label} ${x.count}명 · 1인 +${won(x.pp)}`)] : []),
    "",
    "■ 1인 금액",
    ...perType.map((x) => `  ${x.label} ${x.count}명 → 1인 ${won(lessonAvgPP + x.add)}`),
    ...(helmets.length ? ["  (헬멧 대여하는 분은 위 금액 + 헬멧)"] : []),
    "",
    ...(days > 1
      ? ["■ 날짜별 합계", ...dayTotals.map((d) => `  ${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}: ${won(d.total)}`)]
      : []),
    `예상 합계: ${won(grand)}${ebSaved ? ` (얼리버드 강습료 10% 할인 -${won(ebSaved)} 반영)` : ""}`,
    "※ 스키복·보드복은 제휴 렌탈샵 안내 · 강사 일정 확인 후 확정",
  ].join("\n");

  function shareUrl() {
    const q = new URLSearchParams({
      d: String(days),
      a: String(adults),
      k: String(kids),
      l: len,
      n: String(perDay),
      ti: String(timeIdx),
      tw: String(twiceIdx),
      g: usedSplit.join("-"),
      lr: `${lr.a}-${lr.k}`,
      lo: `${lo.a}-${lo.k}`,
      h: `${helmet.basic}-${helmet.visor}`,
    });
    if (ticket) q.set("tk", String(ticket));
    if (edge) q.set("e", "1");
    if (customOn) q.set("dp", schedule.map((d) => (d.idx.length ? d.idx.join(".") : "x")).join("-"));
    if (startDate) q.set("sd", startDate);
    return `${window.location.origin}/ko/quote/?${q.toString()}`;
  }
  async function copy(kind: "text" | "link") {
    try {
      await navigator.clipboard.writeText(kind === "text" ? summary : shareUrl());
      setCopied(kind);
      setTimeout(() => setCopied(""), 2000);
      trackEvent("quote_copy", { kind });
    } catch {
      // clipboard unavailable
    }
  }
  async function saveImage() {
    setImgState("making");
    trackEvent("quote_image", { people, days });
    try {
      const blob = await renderQuoteImage({
        title: `${trip} · ${period} · ${LEN_LABEL[len]} ${dayText} · 수업 ${sessions}회`,
        total: `1인 1회 약 ${won(perHead1)}`,
        totalSub: `어른 ${adults} · 어린이 ${kids} · 반 ${usedSplit.join("+")} · 합계 ${won(grand)}${ebSaved ? " · 얼리버드 강습료 10% 반영" : ""}`,
        schedule: schedule.map((d) => ({
          left: `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}${d.tag ? ` ${d.tag}` : ""}`,
          right: d.slots.map((x) => x.time).join("  ·  ") || "-",
        })),
        teams: [
          {
            name: "1인 금액",
            amount: "",
            lines: [
              ...perType.map((x) => `${x.label} ${x.count}명 → 1인 ${won(lessonAvgPP + x.add)}`),
              ...helmets.map((x) => `+ ${x.label} ${x.count}명 · 1인 ${won(x.pp)}`),
            ],
          },
          {
            name: "포함 내역",
            amount: "",
            lines: [
              `강습료 1인 ${won(lessonAvgPP)} (패찰 포함 · 강사 ${usedSplit.length}명)`,
              ...extras.map((x) => `${x.label} 40% 할인 · 1인 ${won(x.sale)} (정가 ${won(x.regular)})`),
            ],
          },
        ],
        notes: [
          ebSaved
            ? `얼리버드 10%는 강습료에만 적용 (-${won(ebSaved)}) · 리프트·장비 40% 할인 · 헬멧 할인 제외`
            : "매 수업 사진·영상 무료 · 리프트·장비 40% 할인 · 헬멧 할인 제외",
          "스키복·보드복은 제휴 렌탈샵을 안내해 드려요",
          "예상 견적이에요. 강사 일정 확인 후 확정 금액을 안내드려요.",
        ],
        phone: contact.phone,
      });
      const file = new File([blob], `지노스키_견적_${trip.replace(/\s/g, "")}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] }) && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
          await nav.share({ files: [file], title: "지노스키 견적" });
        } catch {
          // 공유창 닫음
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      setImgState("done");
      setTimeout(() => setImgState(""), 3000);
    } catch {
      setImgState("");
    }
  }
  const canSend = name.trim().length > 0 && phone.replace(/[^0-9]/g, "").length >= 9;
  async function send() {
    if (!canSend) return;
    setStatus("sending");
    trackEvent("quote_submit", { people, days });
    try {
      const res = await fetch(KAKAO_NOTIFY_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date: `${period} (${trip})`,
          program: `견적 ${LEN_LABEL[len]} · ${dayText}`,
          timeSlot: timeText,
          groupSize: `어른${adults} 어린이${kids} · 반 ${usedSplit.join("+")}`,
          equipment: "",
          level: "",
          total: `${won(grand)} (수업 ${sessions}회)`,
          note: [
            extras.map((x) => `${x.label.replace(" · ", "")}${x.count}`).join(" "),
            helmets.map((x) => `${x.label}${x.count}`).join(" "),
            customOn
              ? schedule.map((d) => `${d.day}일${d.slots.map((x) => x.label).join("+") || "없음"}`).join(" ")
              : edge
                ? "도착·출발일 1번"
                : "",
            note.trim(),
          ]
            .filter(Boolean)
            .join(" / "),
        }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  // ── 화면 ─────────────────────────────
  return (
    <section className="bg-ice-200 py-10 sm:py-14">
      <Container>
        <div id="quote-top" className="mx-auto max-w-xl">
          {/* 진행 표시 */}
          <div className="flex items-center justify-between text-[13px] font-semibold text-snow-500">
            <span>
              {step} / {STEPS.length}
            </span>
            {step > 1 && step < 6 && people > 0 && sessions > 0 && (
              <span className="text-brand-600">1인 1회 약 {won(perHead1)}</span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
          </div>

          <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-snow-300/60 sm:p-7">
            <h2 className="text-[24px] font-bold tracking-tight text-ink-900 sm:text-[26px]">{STEPS[step - 1]}</h2>

            {step === 1 && (
              <div className="mt-5">
                <RangeCalendar
                  start={startDate}
                  days={startDate ? days : 0}
                  onChange={(sd, d) => {
                    setStartDate(sd);
                    setDays(d);
                  }}
                />
                <div className="mt-4 rounded-2xl bg-ice-200/70 px-4 py-3 text-center">
                  <p className="text-[16px] font-bold text-ink-900">
                    {startDate ? `${period} · ${trip}` : "아직 날짜가 안 정해졌어요"}
                  </p>
                  {!startDate && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-[13px] text-snow-600">며칠 동안?</span>
                      <Stepper value={days} min={1} max={MAX_DAYS} onChange={setDays} suffix={`일 (${trip})`} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 flex flex-col gap-4">
                <BigCounter label="어른" sub="중학생 이상" value={adults} max={MAX_PEOPLE - kids} onChange={(v) => setPeople(v, kids)} />
                <BigCounter label="어린이" sub="초등학생 이하 · 만 4세부터" value={kids} max={MAX_PEOPLE - adults} onChange={(v) => setPeople(adults, v)} />
                <p className="text-center text-[13px] text-snow-500">
                  {people ? `모두 ${people}명이 배워요` : "배울 사람 수를 넣어주세요"} · 구경만 하는 분은 빼고 넣어주세요
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 flex flex-col gap-6">
                <div>
                  <p className="mb-2 text-[14px] font-semibold text-ink-900">한 번에 몇 시간?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(LEN_LABEL) as Len[]).map((l) => (
                      <BigChoice
                        key={l}
                        on={len === l}
                        onClick={() => {
                          setLen(l);
                          setTimeIdx(0);
                          setTwiceIdx(0);
                        }}
                        title={LEN_LABEL[l]}
                        sub={l === "2h" ? "가장 많이 해요" : l === "3h" ? "넉넉하게" : "집중 코스"}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[14px] font-semibold text-ink-900">하루에 몇 번?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <BigChoice on={perDay === 1} onClick={() => setPerDay(1)} title="하루 1번" sub="원하는 교시 하나" />
                    <BigChoice on={perDay === 2} onClick={() => setPerDay(2)} title="하루 2번" sub="쉬는 시간 두고 두 번" />
                  </div>
                </div>
                {perDay === 2 && (
                  <div>
                    <p className="mb-2 text-[14px] font-semibold text-ink-900">
                      이렇게 추천드려요 <span className="font-normal text-snow-500">· 중간에 점심 먹고 쉬어요</span>
                    </p>
                    <div className={cn("grid gap-2", TWICE[len].length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                      {TWICE[len].map((t, i) => (
                        <BigChoice
                          key={t.label}
                          on={twiceIdx === i}
                          onClick={() => setTwiceIdx(i)}
                          title={`${t.label} 추천`}
                          sub={t.idx.map((j) => TIMES[len][j].time).join(" · ")}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {perDay === 1 && (
                  <div>
                    <p className="mb-2 text-[14px] font-semibold text-ink-900">몇 교시가 좋으세요?</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {times.map((t, i) => (
                        <BigChoice key={t.time} on={timeIdx === i} onClick={() => setTimeIdx(i)} title={t.label} sub={t.time} />
                      ))}
                    </div>
                  </div>
                )}
                {perDay === 2 && days >= 2 && (
                  <label className="flex cursor-pointer items-start gap-2 rounded-2xl bg-ice-200/70 px-4 py-3 text-[14px] text-ink-800">
                    <input
                      type="checkbox"
                      checked={edge && !customOn}
                      onChange={(e) => {
                        setEdge(e.target.checked);
                        setCustom(null);
                      }}
                      className="mt-1 h-4 w-4 accent-brand-500"
                    />
                    <span>
                      도착하는 날·떠나는 날은 1번만 할게요
                      <span className="block text-[12.5px] text-snow-500">도착일은 뒤 교시, 출발일은 앞 교시만 해요</span>
                    </span>
                  </label>
                )}
                {perDay > 0 && days >= 2 && (
                  <div className="rounded-2xl border border-snow-300/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-bold text-ink-900">날짜별 일정</p>
                      {customOn && (
                        <button
                          type="button"
                          onClick={() => setCustom(null)}
                          className="text-[12.5px] font-semibold text-snow-500 underline underline-offset-2"
                        >
                          처음대로
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-snow-500">날마다 다르게 하고 싶으면 교시를 눌러서 넣고 빼세요</p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {schedule.map((d, i) => (
                        <li key={d.day}>
                          <p className="text-[13.5px] font-semibold text-ink-900">
                            {d.day}일차{startDate && ` ${addDays(startDate, i)}`}
                            <span className="ml-1.5 font-normal text-snow-500">{d.slots.length ? `${d.slots.length}번` : "수업 없음"}</span>
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {times.map((t, j) => {
                              const on = d.idx.includes(j);
                              return (
                                <button
                                  key={t.time}
                                  type="button"
                                  onClick={() => toggleDaySlot(i, j)}
                                  aria-pressed={on}
                                  className={cn(
                                    "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                                    on ? "border-brand-500 bg-brand-500 text-white" : "border-snow-300/70 text-snow-600"
                                  )}
                                >
                                  {t.label}
                                  <span className={cn("ml-1 font-normal", on ? "text-white/80" : "text-snow-400")}>{t.time.slice(0, 5)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-right text-[13px] font-semibold text-brand-600">총 수업 {sessions}회</p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="mt-5 flex flex-col gap-2.5">
                <p className="text-[13.5px] text-snow-600">
                  강사 1명이 최대 3명까지 가르쳐요. 실력·나이가 비슷한 분끼리 묶어드려요.
                </p>
                {[
                  { title: "알뜰하게", sp: splitCheapest, desc: "강사 1명당 3명까지" },
                  { title: "소수정예", sp: splitSmall, desc: "강사 1명당 2명까지" },
                  { title: "1:1 전담", sp: splitPrivate, desc: "한 명에 강사 한 명" },
                ]
                  .filter((o, i, arr) => arr.findIndex((x) => x.sp.join() === o.sp.join()) === i)
                  .map((o) => (
                    <SplitButton
                      key={o.title}
                      title={o.title}
                      desc={o.desc}
                      sp={o.sp}
                      on={usedSplit.join() === o.sp.join()}
                      pp={sessions ? Math.round(o.sp.reduce((a, g) => a + groupCost(g), 0) / people / 1000) * 1000 : 0}
                      onClick={() => setSplit(o.sp)}
                    />
                  ))}
                {!showAllSplits ? (
                  <button type="button" onClick={() => setShowAllSplits(true)} className="mt-1 text-[13px] font-semibold text-snow-500 underline underline-offset-2">
                    다른 방법으로 나누기
                  </button>
                ) : (
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {allSplits(people).map((sp) => (
                      <button
                        key={sp.join("-")}
                        type="button"
                        onClick={() => setSplit(sp)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-left text-[15px] font-bold tabular-nums",
                          usedSplit.join() === sp.join() ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 text-ink-900"
                        )}
                      >
                        {sp.join(" + ")}
                        <span className="block text-[11.5px] font-medium text-snow-500">강사 {sp.length}명</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="mt-5 flex flex-col gap-4">
                <p className="rounded-2xl bg-[#E8F9EE] px-4 py-3 text-[14px] font-semibold text-[#03803D]">
                  지노스키 손님은 리프트·장비 <span className="text-[17px]">40% 할인</span>! 필요한 인원만 넣어주세요. (없으면 그냥 다음)
                </p>
                <OptionRow
                  title="리프트 + 장비"
                  sub="스키·보드 장비까지 빌려요"
                  a={lr.a}
                  k={lr.k}
                  maxA={adults - lo.a}
                  maxK={kids - lo.k}
                  onChange={(a, k) => setLr({ a, k })}
                  showKids={kids > 0}
                  showAdults={adults > 0}
                />
                <OptionRow
                  title="리프트만"
                  sub="장비는 갖고 있어요"
                  a={lo.a}
                  k={lo.k}
                  maxA={adults - lr.a}
                  maxK={kids - lr.k}
                  onChange={(a, k) => setLo({ a, k })}
                  showKids={kids > 0}
                  showAdults={adults > 0}
                />
                <div className="rounded-2xl border border-snow-300/60 p-4">
                  <p className="text-[15px] font-bold text-ink-900">
                    헬멧 <span className="text-[12.5px] font-medium text-snow-500">· 하루 기준 · 할인 제외</span>
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <MiniCounter label="기본 헬멧 5,000원" value={helmet.basic} max={people - helmet.visor} onChange={(v) => setHelmet((h) => ({ ...h, basic: v }))} />
                    <MiniCounter label="바이저 헬멧 15,000원" value={helmet.visor} max={people - helmet.basic} onChange={(v) => setHelmet((h) => ({ ...h, visor: v }))} />
                  </div>
                </div>
                {extras.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-snow-600">
                    <span>리프트 시간권:</span>
                    {([3, 5, 7] as TicketHours[]).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setTicket(h)}
                        className={cn(
                          "rounded-full border px-3 py-1 font-semibold",
                          tk === h ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 text-ink-700"
                        )}
                      >
                        {h}시간{!ticket && tk === h && " (추천)"}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[12.5px] text-snow-500">스키복·보드복은 제휴 렌탈샵을 안내해 드려요.</p>
              </div>
            )}

            {step === 6 && (
              <div className="mt-4">
                <p className="text-[14px] text-snow-600">
                  {trip} · {period} · {LEN_LABEL[len]} {dayText} · 수업 {sessions}회
                </p>

                <div className="mt-4 rounded-2xl bg-ink-900 p-5 text-white">
                  <p className="text-[13px] text-white/60">1인 1회 강습료</p>
                  <p className="text-[34px] font-bold tabular-nums text-brand-300">약 {won(perHead1)}</p>
                  <p className="text-[12.5px] text-white/50">패찰 포함 · 매 수업 사진·영상 무료</p>
                  {eb && ebSaved > 0 && (
                    <p className="mt-2 inline-block rounded-full bg-red-500 px-3 py-1 text-[12.5px] font-bold text-white">
                      🎁 얼리버드 강습료 10% 할인 · {won(ebSaved)} 아꼈어요
                    </p>
                  )}
                </div>
                {eb && (
                  <p className="mt-2 text-[12px] text-snow-500">
                    얼리버드 할인({EARLY_BIRD.endDate.slice(5).replace("-", "/")}까지 예약)은 2·3시간 강습료에만 적용돼요 · 패찰·리프트·장비·헬멧은 제외
                  </p>
                )}

                <h3 className="mt-6 text-[16px] font-bold text-ink-900">1인 금액 ({sessions}회 기준)</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {perType.map((x) => (
                    <li key={x.label} className="flex items-center justify-between gap-3 rounded-2xl bg-ice-200/70 px-4 py-3">
                      <span className="text-[14.5px] font-semibold text-ink-900">
                        {x.label} <span className="text-[13px] font-medium text-snow-500">{x.count}명</span>
                      </span>
                      <span className="text-[17px] font-bold tabular-nums text-ink-900">{won(lessonAvgPP + x.add)}</span>
                    </li>
                  ))}
                  {helmets.map((x) => (
                    <li key={x.key} className="flex items-center justify-between gap-3 px-4 text-[13.5px] text-snow-600">
                      <span>
                        + {x.label} {x.count}명 ({days}일)
                      </span>
                      <span className="tabular-nums">1인 {won(x.pp)}</span>
                    </li>
                  ))}
                </ul>

                <details className="mt-4 rounded-2xl border border-snow-300/60 px-4 py-3">
                  <summary className="cursor-pointer text-[14px] font-semibold text-ink-900">시간표 · 자세한 내역 보기</summary>
                  <ul className="mt-3 flex flex-col gap-1 text-[13.5px]">
                    {schedule.map((d) => (
                      <li key={d.day} className="flex justify-between gap-3">
                        <span className="text-snow-600">
                          {d.day}일차{startDate && ` ${addDays(startDate, d.day - 1)}`} {d.tag}
                        </span>
                        <span className="tabular-nums text-ink-900">{d.slots.map((s) => s.time).join(" · ")}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 border-t border-snow-300/60 pt-3 text-[13px] text-snow-700">
                    <p>
                      반 나누기 {usedSplit.join(" + ")} (강사 {usedSplit.length}명) · 강습료 1인 {won(lessonAvgPP)}
                      {!evenGroups && " (반별 평균)"}
                    </p>
                    {extras.map((x) => (
                      <p key={x.key}>
                        {x.label} · {tk}시간권 {days}일 · <span className="line-through">{won(x.regular)}</span>{" "}
                        <b className="text-[#03803D]">{won(x.sale)}</b> (40% 할인)
                      </p>
                    ))}
                    <p className="mt-1 text-[12px] text-snow-500">
                      {startDate ? "날짜별 평일·주말 요금" : "날짜 미정이라 주말 요금"} · 공휴일은 주말 요금 · 스키복·보드복은 제휴 렌탈샵 안내
                    </p>
                  </div>
                </details>

                {showTotal ? (
                  <div className="mt-4 rounded-2xl border-2 border-ink-900 p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {[{ label: "전체", i: 0 }, ...dayTotals.map((d) => ({ label: `${d.day}일차`, i: d.day }))].map((t) => (
                        <button
                          key={t.i}
                          type="button"
                          onClick={() => setTotalTab(t.i)}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-[13px] font-bold",
                            totalTab === t.i ? "bg-ink-900 text-white" : "bg-snow-100 text-ink-700"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {(() => {
                      const d = totalTab ? dayTotals[totalTab - 1] : null;
                      const lesson = d ? d.lesson : lessonExact;
                      const extra = d ? d.extra : extrasTotal;
                      const helm = d ? d.helm : helmetTotal;
                      const total = d ? d.total : grand;
                      const sched = d ? schedule[totalTab - 1] : null;
                      return (
                        <div className="mt-3">
                          <p className="text-[13px] text-snow-600">
                            {d
                              ? `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""} · ${
                                  sched!.slots.map((x) => x.label).join("+") || "수업 없음"
                                }`
                              : `${trip} 전체 · ${people}명 · 수업 ${sessions}회`}
                          </p>
                          <div className="mt-2 flex flex-col gap-1 text-[14px]">
                            <div className="flex justify-between">
                              <span className="text-snow-600">강습료 (패찰 포함)</span>
                              <span className="tabular-nums">{won(lesson)}</span>
                            </div>
                            {extra > 0 && (
                              <div className="flex justify-between">
                                <span className="text-snow-600">리프트·장비 (40% 할인)</span>
                                <span className="tabular-nums">{won(extra)}</span>
                              </div>
                            )}
                            {helm > 0 && (
                              <div className="flex justify-between">
                                <span className="text-snow-600">헬멧</span>
                                <span className="tabular-nums">{won(helm)}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-end justify-between border-t border-snow-300/60 pt-2">
                            <span className="text-[14px] font-semibold text-ink-900">{d ? `${d.day}일차 합계` : "토탈"}</span>
                            <span className="text-[24px] font-bold tabular-nums text-ink-900">{won(total)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowTotal(true);
                      trackEvent("quote_total_view", { people });
                    }}
                    className="mt-4 h-12 w-full rounded-full border-2 border-ink-900 text-[15px] font-bold text-ink-900"
                  >
                    토탈 금액 보기
                  </button>
                )}

                <button
                  type="button"
                  onClick={saveImage}
                  disabled={imgState === "making"}
                  className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink-900 text-[15.5px] font-bold text-white disabled:opacity-50"
                >
                  {imgState === "done" ? <Check size={18} /> : <ImageDown size={18} />}
                  {imgState === "making" ? "이미지 만드는 중..." : imgState === "done" ? "저장 완료! 카톡으로 보내주세요" : "견적서 사진으로 저장"}
                </button>
                <a
                  href={contact.kakaoChannel}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => void copy("text")}
                  className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[15.5px] font-bold text-[#191919]"
                >
                  <MessageCircle size={18} /> 카톡으로 상담하기
                </a>
                <p className="mt-2 text-center text-[12.5px] text-snow-500">
                  저장한 사진(또는 화면 캡처)을 카톡 「지노스키」로 보내주시면 바로 확인해 드려요
                </p>

                <div className="mt-5 rounded-2xl bg-ice-200/70 p-4">
                  {status === "sent" ? (
                    <p className="text-center text-[15px] font-bold text-ink-900">
                      ✓ 접수됐어요! 강사 일정을 확인해서 {phone}로 연락드릴게요.
                    </p>
                  ) : (
                    <>
                      <p className="text-[14.5px] font-bold text-ink-900">연락처 남기고 견적 받기</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <input
                          placeholder="이름"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                        />
                        <input
                          type="tel"
                          placeholder="연락처"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-12 rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                        />
                      </div>
                      <input
                        placeholder="요청사항 (선택) · 아이 나이, 실력 등"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={send}
                        disabled={!canSend || status === "sending"}
                        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 text-[15px] font-semibold text-white disabled:opacity-40"
                      >
                        <Send size={16} /> {status === "sending" ? "보내는 중..." : "견적 문의 보내기"}
                      </button>
                      {status === "failed" && (
                        <p className="mt-2 text-center text-[12.5px] text-rose-500">전송이 안 됐어요. 카톡으로 상담해 주세요.</p>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => copy("text")} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-snow-300 text-[13.5px] font-semibold text-ink-900">
                    {copied === "text" ? <Check size={15} /> : <Copy size={15} />} {copied === "text" ? "복사됨" : "견적 글 복사"}
                  </button>
                  <button type="button" onClick={() => copy("link")} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-snow-300 text-[13.5px] font-semibold text-ink-900">
                    {copied === "link" ? <Check size={15} /> : <Link2 size={15} />} {copied === "link" ? "링크 복사됨" : "견적 링크 복사"}
                  </button>
                </div>
                <button type="button" onClick={() => go(1)} className="mt-4 w-full text-center text-[13px] font-semibold text-snow-500 underline underline-offset-2">
                  처음부터 다시 고르기
                </button>
              </div>
            )}
          </div>

          {/* 이전·다음 */}
          {step < 6 && (
            <div className="mt-5 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="flex h-14 items-center justify-center gap-1.5 rounded-full border border-snow-300 bg-white px-6 text-[15px] font-semibold text-ink-900"
                >
                  <ArrowLeft size={16} /> 이전
                </button>
              )}
              <button
                type="button"
                onClick={() => go(step + 1)}
                disabled={!canNext(step)}
                className="flex h-14 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-500 text-[16px] font-bold text-white transition-all hover:bg-brand-600 disabled:opacity-40"
              >
                {step === 5 ? "견적 보기" : step === 1 && !startDate ? "날짜 미정으로 다음" : "다음"} <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function BigCounter({ label, sub, value, max, onChange }: { label: string; sub: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-snow-300/60 px-5 py-4">
      <div>
        <p className="text-[19px] font-bold text-ink-900">{label}</p>
        <p className="text-[12.5px] text-snow-500">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`${label} 줄이기`}
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-snow-300 text-ink-900 disabled:opacity-30"
        >
          <Minus size={20} />
        </button>
        <span className="w-8 text-center text-[26px] font-bold tabular-nums text-ink-900">{value}</span>
        <button
          type="button"
          aria-label={`${label} 늘리기`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white disabled:opacity-30"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

function MiniCounter({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] text-ink-800">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`${label} 줄이기`}
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-snow-300 disabled:opacity-30"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-[18px] font-bold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`${label} 늘리기`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-snow-300 disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function OptionRow({
  title,
  sub,
  a,
  k,
  maxA,
  maxK,
  onChange,
  showAdults,
  showKids,
}: {
  title: string;
  sub: string;
  a: number;
  k: number;
  maxA: number;
  maxK: number;
  onChange: (a: number, k: number) => void;
  showAdults: boolean;
  showKids: boolean;
}) {
  return (
    <div className="rounded-2xl border border-snow-300/60 p-4">
      <p className="text-[15px] font-bold text-ink-900">
        {title} <span className="text-[12.5px] font-medium text-snow-500">· {sub}</span>
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {showAdults && <MiniCounter label="어른" value={a} max={maxA} onChange={(v) => onChange(v, k)} />}
        {showKids && <MiniCounter label="어린이" value={k} max={maxK} onChange={(v) => onChange(a, v)} />}
      </div>
    </div>
  );
}

function BigChoice({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-3.5 text-center transition-colors",
        on ? "border-brand-500 bg-brand-50" : "border-snow-300/60 bg-white hover:border-brand-300"
      )}
    >
      <span className={cn("text-[16px] font-bold", on ? "text-brand-600" : "text-ink-900")}>
        {on && "✓ "}
        {title}
      </span>
      {sub && <span className="mt-0.5 text-[12px] text-snow-500">{sub}</span>}
    </button>
  );
}

function SplitButton({
  title,
  desc,
  sp,
  on,
  pp,
  onClick,
}: {
  title: string;
  desc: string;
  sp: number[];
  on: boolean;
  pp: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors",
        on ? "border-brand-500 bg-brand-50" : "border-snow-300/60 bg-white hover:border-brand-300"
      )}
    >
      <span>
        <span className={cn("block text-[17px] font-bold", on ? "text-brand-600" : "text-ink-900")}>
          {on && "✓ "}
          {title} <span className="tabular-nums">{sp.join("+")}</span>
        </span>
        <span className="text-[12.5px] text-snow-500">
          {desc} · 강사 {sp.length}명
        </span>
      </span>
      {pp > 0 && (
        <span className="shrink-0 text-right">
          <span className="block text-[11px] text-snow-500">1인 1회</span>
          <span className="text-[15px] font-bold tabular-nums text-ink-900">약 {won(pp)}</span>
        </span>
      )}
    </button>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="줄이기"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-snow-300/70 bg-white text-ink-900 disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[2ch] text-center text-[18px] font-bold tabular-nums text-ink-900">{value}</span>
      <button
        type="button"
        aria-label="늘리기"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-snow-300/70 bg-white text-ink-900 disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
      {suffix && <span className="text-[14px] text-snow-600">{suffix}</span>}
    </div>
  );
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 연박용 기간 달력: 첫 번째 누른 날 = 첫날, 두 번째 누른 날 = 마지막 날 */
function RangeCalendar({
  start,
  days,
  onChange,
}: {
  start: string;
  days: number;
  onChange: (start: string, days: number) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 비시즌(4~10월)엔 12월부터 보여줘요
  const init = start
    ? new Date(`${start}T00:00:00`)
    : today.getMonth() >= 3 && today.getMonth() <= 9
      ? new Date(today.getFullYear(), 11, 1)
      : today;
  const [view, setView] = useState({ y: init.getFullYear(), m: init.getMonth() });
  const [picking, setPicking] = useState(false); // 첫날만 고른 상태

  const startD = start ? new Date(`${start}T00:00:00`) : null;
  const endD = startD ? new Date(startD.getFullYear(), startD.getMonth(), startD.getDate() + Math.max(days, 1) - 1) : null;

  const first = new Date(view.y, view.m, 1);
  const cells: (Date | null)[] = [
    ...Array(first.getDay()).fill(null),
    ...Array.from({ length: new Date(view.y, view.m + 1, 0).getDate() }, (_, i) => new Date(view.y, view.m, i + 1)),
  ];

  function pick(d: Date) {
    const key = dateKey(d);
    if (!startD || !picking || d < startD) {
      onChange(key, 1);
      setPicking(true);
      return;
    }
    const diff = Math.round((d.getTime() - startD.getTime()) / 86400000) + 1;
    onChange(start, Math.min(diff, MAX_DAYS));
    setPicking(false);
  }

  const move = (n: number) => {
    const t = new Date(view.y, view.m + n, 1);
    setView({ y: t.getFullYear(), m: t.getMonth() });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="이전 달"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ice-200"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[16px] font-bold text-ink-900">
          {view.y}년 {view.m + 1}월
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="다음 달"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-ice-200"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-semibold text-snow-500">
        {WEEK.map((w, i) => (
          <span key={w} className={i === 0 ? "text-rose-400" : i === 6 ? "text-brand-500" : ""}>
            {w}
          </span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const past = d < today;
          const isStart = !!startD && d.getTime() === startD.getTime();
          const isEnd = !!endD && days > 1 && d.getTime() === endD.getTime();
          const inRange = !!startD && !!endD && d > startD && d < endD;
          const wk = d.getDay();
          return (
            <div
              key={dateKey(d)}
              className={cn(
                "flex h-11 items-center justify-center",
                inRange && "bg-brand-50",
                isStart && days > 1 && "rounded-l-full bg-brand-50",
                isEnd && "rounded-r-full bg-brand-50"
              )}
            >
              <button
                type="button"
                disabled={past}
                onClick={() => pick(d)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-[14.5px] font-medium transition-colors",
                  past && "cursor-not-allowed text-snow-300",
                  !past && !isStart && !isEnd && (wk === 0 ? "text-rose-500" : wk === 6 ? "text-brand-600" : "text-ink-800"),
                  !past && !isStart && !isEnd && "hover:bg-ice-200",
                  (isStart || isEnd) && "bg-brand-500 font-bold text-white"
                )}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[12.5px] text-snow-500">
        {picking ? "마지막 날을 눌러주세요 (당일이면 같은 날을 한 번 더)" : "첫날을 누르고, 마지막 날을 누르면 기간이 정해져요"}
      </p>
    </div>
  );
}
