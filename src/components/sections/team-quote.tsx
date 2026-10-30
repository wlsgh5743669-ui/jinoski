"use client";

import { ConsentBox, marketingTag } from "@/components/shared/consent-box";
import { attributionText } from "@/components/shared/attribution";
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
import { useStepHistory } from "@/lib/use-step-history";
import { useLocale } from "next-intl";
import { asQLocale, trDeep, trQuote, useQuoteTranslate, type QLocale } from "@/lib/quote-i18n";
import { Container } from "@/components/shared/container";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { EARLY_BIRD, isEarlyBirdActive } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { HOLIDAYS, LIFT_PRICES, LIFT_RENTAL_DISCOUNT, RENTAL_PRICES, type TicketHours } from "@/config/lift-rental";

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

type Len = "2h" | "3h" | "4h" | "fc" | "nc";
const LEN_LABEL: Record<Len, string> = { "2h": "2시간", "3h": "3시간", "4h": "4시간", fc: "원데이 풀케어", nc: "나이트 풀케어" };
/** 시간제 수업 (풀케어 제외) */
const BASE_LENS: Len[] = ["2h", "3h", "4h"];
const isFC = (l?: Len) => l === "fc" || l === "nc";
/** 하루 1번일 때 고를 수 있는 시간대 / 2번이면 오전+오후 */
const TIMES: Record<Len, { label: string; time: string }[]> = {
  "2h": [
    { label: "1교시", time: "09:00~11:00" },
    { label: "2교시", time: "11:00~13:00" },
    { label: "3교시", time: "13:20~15:20" },
    { label: "4교시", time: "15:30~17:30" },
    { label: "5교시(야간)", time: "19:00~21:00" },
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
  // 원데이 풀케어: 08:40 미팅 · 오전 3시간 30분 + 점심 + 오후 3시간 30분
  fc: [
    { label: "오전", time: "09:00~12:30" },
    { label: "오후", time: "13:00~16:30" },
  ],
  // 나이트 풀케어: 13:30 미팅 · 오후 4시간 + 저녁·정설 + 야간 3시간
  nc: [
    { label: "오후", time: "13:30~17:30" },
    { label: "야간", time: "19:00~22:00" },
  ],
};
/** 하루 2번 추천 조합 — 2시간은 1+3교시 / 2+4교시, 3·4시간은 오전+오후 */
const TWICE: Record<Len, { label: string; idx: [number, number]; rec?: boolean }[]> = {
  "2h": [
    { label: "1+3교시", idx: [0, 2], rec: true },
    { label: "2+4교시", idx: [1, 3], rec: true },
    { label: "3+5교시", idx: [2, 4] },
    { label: "4+5교시", idx: [3, 4] },
  ],
  "3h": [
    { label: "오전+오후", idx: [0, 1], rec: true },
    { label: "오전+야간", idx: [0, 2] },
    { label: "오후+야간", idx: [1, 2] },
  ],
  "4h": [
    { label: "오전+오후", idx: [0, 1], rec: true },
    { label: "오전+야간", idx: [0, 2] },
    { label: "오후+야간", idx: [1, 2] },
  ],
  fc: [{ label: "원데이 풀케어", idx: [0, 1], rec: true }],
  nc: [{ label: "나이트 풀케어", idx: [0, 1] }],
};

const HELMET_PRICE = { basic: 5000, visor: 15000 };
/** 날짜별 수업: n = 0(안 함)·1번·2번, one = 1번일 때 교시, two = 2번일 때 추천 조합 */
type Plan = { n: 0 | 1 | 2; one: number; two: number; len?: Len };
type Extra = "none" | "lift" | "liftRental";
type Helmet = 0 | 1 | 2; // 0 없음 · 1 기본 · 2 바이저
/** 종목 · 실력 (스키와 보드는 반이 따로) */
type Sport = "ski" | "board";
type Level = 1 | 2 | 3;
type Person = { name: string; extra: Extra; helmet: Helmet; sport: Sport; level: Level };
const newPerson = (): Person => ({ name: "", extra: "none", helmet: 0, sport: "ski", level: 1 });
const SPORT_LABEL: Record<Sport, string> = { ski: "스키", board: "보드" };
const LEVEL_LABEL: Record<Level, string> = { 1: "초급", 2: "중급", 3: "상급" };
const EXTRA_CODE: Record<Extra, string> = { none: "n", lift: "l", liftRental: "r" };
const CODE_EXTRA: Record<string, Extra> = { n: "none", l: "lift", r: "liftRental" };
const EXTRA_LABEL: Record<Extra, string> = { none: "강습만", lift: "+ 리프트", liftRental: "+ 리프트·장비" };
const HELMET_LABEL: Record<Helmet, string> = { 0: "헬멧 있음", 1: "헬멧 5천", 2: "바이저 1.5만" };
const LEN_CODE: Record<Len, string> = { "2h": "a", "3h": "b", "4h": "c", fc: "d", nc: "e" };
const CODE_LEN: Record<string, Len> = { a: "2h", b: "3h", c: "4h", d: "fc", e: "nc" };
const DAY_NAMES = ["첫째", "둘째", "셋째", "넷째", "다섯째", "여섯째", "일곱째", "여덟째", "아홉째", "열째"];
const MAX_PEOPLE = 15;
const MAX_DAYS = 10;
const STEPS = ["언제 오세요?", "몇 명이 배우세요?", "수업은 어떻게 할까요?", "반은 어떻게 나눌까요?", "리프트·장비도 필요하세요?", "견적서"];

/** 강사 배정 희망 (특이사항) */
const TEACHER_PREFS = ["상관없음", "여자 선생님", "남자 선생님", "여자+남자 섞어서"] as const;
const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const num = (s: string | undefined) => Number((s ?? "").replace(/[^0-9]/g, "")) || 0;
const roundUp100 = (n: number) => Math.ceil(n / 100) * 100;

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
function addDays(date: string, d: number) {
  const t = new Date(`${date}T00:00:00`);
  t.setDate(t.getDate() + d);
  return `${t.getMonth() + 1}/${t.getDate()}(${WEEK[t.getDay()]})`;
}
function dateAt(start: string, offset: number) {
  const t = new Date(`${start}T00:00:00`);
  t.setDate(t.getDate() + offset);
  return t;
}
const keyOf = (t: Date) => `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
/** 공휴일이면 주말 요금 (시즌 공휴일 목록은 config/lift-rental.ts) */
function isHoliday(start: string, offset: number) {
  return !!start && HOLIDAYS.includes(keyOf(dateAt(start, offset)));
}
function isWeekend(start: string, offset: number) {
  if (!start) return true; // 날짜 모르면 주말 요금으로 넉넉하게
  const t = dateAt(start, offset);
  return t.getDay() === 0 || t.getDay() === 6 || HOLIDAYS.includes(keyOf(t));
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
  // 영어·중국어 페이지는 화면 글자만 번역 (사장님 카톡 알림은 한국어 그대로)
  const qloc = asQLocale(useLocale());
  useQuoteTranslate("quote-root", qloc);
  const { contact } = content;

  const prices = useMemo(() => {
    const table: Record<Len, number[]> = { "2h": [], "3h": [], "4h": [], fc: [], nc: [] };
    // 풀케어(패찰 포함 하루 금액) → 오전·오후 2번으로 나눠 계산
    for (const f of content.fullCarePrograms ?? []) {
      const key: Len | null = f.slug === "one-day" ? "fc" : f.slug === "night" ? "nc" : null;
      if (key) table[key] = f.rows.map((r) => num(r.price) / 2);
    }
    for (const g of content.lessonPricing) if (g.program in table) table[g.program as Len] = g.rows.map((r) => num(r.price));
    const pass: Record<Len, number> = { "2h": 0, "3h": 0, "4h": 0, fc: 0, nc: 0 };
    for (const p of content.liftPassPricing) if (p.program in pass) pass[p.program as Len] = num(p.price);
    return { table, pass };
  }, [content]);

  const [step, setStep] = useState(1);
  // 휴대폰 뒤로가기 → 이전 단계로
  useStepHistory(step, setStep, "quoteStep");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [len, setLen] = useState<Len>("2h");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [split, setSplit] = useState<number[]>([]);
  const [showAllSplits, setShowAllSplits] = useState(false);
  // 리프트·장비 (40% 할인) — 어른/어린이 각각 몇 명
  // 사람마다 이름·리프트·장비·헬멧 (앞 adults명은 어른, 나머지는 어린이)
  const [persons, setPersons] = useState<Person[]>([]);
  // 날짜별 리프트 시간권: undefined = 그날 수업에 맞춰 자동 추천, 0 = 그날은 안 씀
  const [dayTickets, setDayTickets] = useState<(TicketHours | 0 | undefined)[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  /** 손님이 정하는 비밀번호 — 나중에 「내 견적 확인」에서 답변 볼 때 사용 */
  const [pw, setPw] = useState("");
  const [teacherPref, setTeacherPref] = useState(0);
  /** 마지막으로 보낸 견적 링크 — 손님이 견적을 바꾸면 「수정본 다시 보내기」가 떠요 */
  const [sentLink, setSentLink] = useState("");
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
    const int = (v: string | null) => Math.max(0, Math.floor(Number(v)) || 0);
    const a = Math.min(MAX_PEOPLE, int(q.get("a")));
    const k = Math.min(MAX_PEOPLE - a, int(q.get("k")));
    setAdults(a);
    setKids(k);
    const sd = q.get("sd");
    if (sd && /^\d{4}-\d{2}-\d{2}$/.test(sd) && !isNaN(Date.parse(sd)) && new Date(sd).toISOString().slice(0, 10) === sd) setStartDate(sd);
    const tp = Number(q.get("tp"));
    if (tp > 0 && tp < TEACHER_PREFS.length) setTeacherPref(tp);
    const d = int(q.get("d"));
    if (d >= 1 && d <= MAX_DAYS) setDays(d);
    const l = q.get("l") as Len;
    if (l in TIMES) setLen(l);
    // 날짜별 수업 dp=12-20-10 (1번·3교시 / 2번·1+3교시 / 1번·1교시) — 예전 링크(n·ti·tw)도 읽어요
    const dp = q.get("dp");
    if (dp && /^[0-2]\d?[a-e]?(-[0-2]\d?[a-e]?)*$/.test(dp)) {
      setPlans(
        dp.split("-").map((c) => ({
          n: Number(c[0]) as 0 | 1 | 2,
          one: c[0] === "1" ? Number(c[1] ?? 0) : 0,
          two: c[0] === "2" ? Number(c[1] ?? 0) : 0,
          len: CODE_LEN[c[c.length - 1]],
        }))
      );
    } else {
      const n = Number(q.get("n"));
      if (n === 1 || n === 2)
        setPlans(Array.from({ length: d || 1 }, () => ({ n, one: Number(q.get("ti")) || 0, two: Number(q.get("tw")) || 0 })));
    }
    const g = (q.get("g") ?? "").split("-").map(Number);
    setSplit(g.every((x) => x >= 1 && x <= 3) && g.reduce((s, x) => s + x, 0) === a + k ? g : even(a + k, Math.ceil((a + k) / 3)));
    // 사람별 pp=n0:민준.r1.l0 (리프트 n/l/r · 헬멧 0/1/2 · 이름) — 예전 링크(lr·lo·h 인원)도 읽어요
    const pp = q.get("pp");
    if (pp) {
      setPersons(
        pp
          .split(".")
          .slice(0, a + k)
          .map((c) => ({
            extra: CODE_EXTRA[c[0]] ?? "none",
            helmet: (Number(c[1]) || 0) as Helmet,
            name: c.includes(":") ? c.slice(c.indexOf(":") + 1, c.indexOf(":") + 11) : "",
            sport: (c[2] === "b" ? "board" : "ski") as Sport,
            level: (["1", "2", "3"].includes(c[3]) ? Number(c[3]) : 1) as Level,
          }))
      );
    } else {
      const [lra, lrk] = pair(q.get("lr"));
      const [loa, lok] = pair(q.get("lo"));
      const [hb, hv] = pair(q.get("h"));
      const list: Person[] = Array.from({ length: a + k }, (_, i) => {
        const child = i >= a;
        const j = child ? i - a : i;
        const lrN = child ? lrk : lra;
        const loN = child ? lok : loa;
        return { name: "", extra: j < lrN ? "liftRental" : j < lrN + loN ? "lift" : "none", helmet: (i < hb ? 1 : i < hb + hv ? 2 : 0) as Helmet, sport: "ski", level: 1 };
      });
      setPersons(list);
    }
    // 날짜별 시간권 dt=a-7-0 (a 자동 · 0 안 씀) — 예전 링크 tk=7 은 모든 날 같은 시간권
    const dt = q.get("dt");
    const tk0 = Number(q.get("tk"));
    if (dt) setDayTickets(dt.split("-").map((x) => ([0, 3, 5, 7].includes(Number(x)) && x !== "a" ? (Number(x) as TicketHours | 0) : undefined)));
    else if ([3, 5, 7].includes(tk0)) setDayTickets(Array.from({ length: d || 1 }, () => tk0 as TicketHours));
    setStep(a + k > 0 ? 6 : 2);
    // 링크로 들어오면 소개 화면을 건너뛰고 견적서로 바로 이동
    setTimeout(() => {
      const el = document.getElementById("quote-top");
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "auto" });
    }, 300);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ── 계산 ─────────────────────────────
  /** 그날 기본값: 도착일(첫날)은 오후 교시, 나머지는 오전 · 수업 시간은 기본(len) */
  const defaultPlan = (i: number, l: Len = len): Plan => ({ n: 0, one: days > 1 && i === 0 ? (l === "2h" ? 2 : 1) : 0, two: 0, len: l });
  const dayPlans: Plan[] = [];
  for (let i = 0; i < days; i++) {
    const prevLen = dayPlans[i - 1]?.len ?? len;
    const p = plans[i] ?? defaultPlan(i, prevLen);
    dayPlans.push({ ...p, len: p.len ?? prevLen });
  }
  const planIdx = (p: Plan) => {
    const l = p.len ?? len;
    return p.n === 2 ? [...TWICE[l][Math.min(p.two, TWICE[l].length - 1)].idx] : p.n === 1 ? [Math.min(p.one, TIMES[l].length - 1)] : [];
  };
  const schedule = dayPlans.map((p, i) => {
    const idx = planIdx(p);
    const l = p.len ?? len;
    return { day: i + 1, tag: "", len: l, idx, slots: idx.map((j) => TIMES[l][j]).filter(Boolean) };
  });
  const usedLens = [...new Set(schedule.filter((d) => d.slots.length).map((d) => d.len))];
  const lenText = usedLens.length === 1 ? LEN_LABEL[usedLens[0]] : usedLens.length ? usedLens.map((l) => LEN_LABEL[l]).join("·") : LEN_LABEL[len];
  const dayLine = (d: { len: Len; slots: { label: string }[] }) =>
    d.slots.length ? `${LEN_LABEL[d.len]} ${d.slots.map((x) => x.label).join("+")}` : "수업 없음";
  function setPlan(i: number, patch: Partial<Plan>) {
    setPlans(() => dayPlans.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }
  function setAllDays(n: 1 | 2) {
    setPlans(() => dayPlans.map((p) => (n === 1 && isFC(p.len) ? { ...p, n, len: "2h", two: 0 } : { ...p, n })));
  }
  const maxPerDay = Math.max(0, ...schedule.map((d) => d.slots.length));
  const sameN = dayPlans.every((p) => p.n === dayPlans[0]?.n);
  const dayText = sameN && dayPlans[0]?.n ? `하루 ${dayPlans[0].n}번` : "날짜별 일정";
  const sessions = schedule.reduce((a, d) => a + d.slots.length, 0);
  const ebFor = (l: Len) => isEarlyBirdActive() && (EARLY_BIRD.programs as string[]).includes(l === "fc" ? "one-day" : l === "nc" ? "night" : l);
  /** 얼리버드 할인액 (풀케어는 반나절 단위라 500원 단위) */
  const ebCut = (l: Len, lesson: number) => {
    const unit = isFC(l) ? 500 : 1000;
    return Math.round((lesson * EARLY_BIRD.rate) / unit) * unit;
  };
  const eb = schedule.some((d) => d.slots.length && ebFor(d.len));
  void maxPerDay;
  /** 그날 수업에 맞는 리프트 추천: 2번 → 7시간, 2시간 1번 → 3시간, 3·4시간 1번 → 5시간, 수업 없는 날 → 안 씀 */
  const autoTicket = (i: number): TicketHours | 0 => {
    const n = schedule[i]?.slots.length ?? 0;
    return n >= 2 ? 7 : n === 1 ? (schedule[i].len === "2h" ? 3 : 5) : 0;
  };
  const ticketOf = (i: number): TicketHours | 0 => dayTickets[i] ?? autoTicket(i);
  /** 그날(주중/주말) 1인 할인가 */
  const dayRate = (i: number, t: TicketHours, child: boolean, withRental: boolean) => {
    const w = isWeekend(startDate, i) ? 1 : 0;
    const who = child ? "child" : "adult";
    return roundUp100((LIFT_PRICES[t][who][w] + (withRental ? RENTAL_PRICES[t][who][w] : 0)) * (1 - LIFT_RENTAL_DISCOUNT));
  };
  const RENTAL_H: Record<TicketHours, number> = { 3: 4, 5: 6, 7: 8 };
  const ticketText = (t: TicketHours | 0) => (t ? `리프트 ${t}시간` : "안 씀");
  function setDayTicket(i: number, t: TicketHours | 0) {
    setDayTickets(() => Array.from({ length: days }, (_, j) => (j === i ? t : dayTickets[j])));
  }
  const lessonDays = schedule.filter((d) => d.slots.length > 0).length;

  /** 반(강사 1명) 1회 비용 = 레슨료(얼리버드는 2·3시간 강습료만 10%) + 패찰 × 인원 */
  const groupCost = (size: number, l: Len = len) => {
    const lesson = prices.table[l][size - 1] ?? 0;
    const discount = ebFor(l) ? ebCut(l, lesson) : 0;
    return lesson - discount + prices.pass[l] * size;
  };
  /** 반 하나의 전체 강습료 (날짜마다 수업 시간이 달라도 합산) */
  const groupTotal = (size: number) => schedule.reduce((a, d) => a + groupCost(size, d.len) * d.slots.length, 0);
  // 스키·보드는 같은 반에서 못 배워요 → 스키 반들 먼저, 보드 반들 나중에
  const sportOf = (i: number) => (persons[i] ?? newPerson()).sport ?? "ski";
  const skiN = Array.from({ length: people }, (_, i) => i).filter((i) => sportOf(i) === "ski").length;
  const boardN = people - skiN;
  const bySport = (f: (n: number) => number[]) => [...(skiN ? f(skiN) : []), ...(boardN ? f(boardN) : [])];
  const splitCheapest = people ? bySport((n) => even(n, Math.ceil(n / 3))) : [];
  const splitSmall = people ? bySport((n) => even(n, Math.ceil(n / 2))) : [];
  const splitPrivate = people ? Array(people).fill(1) : [];
  /** 반 경계가 스키/보드 사이에 딱 맞아야 해요 */
  const splitOk = (sp: number[]) => {
    if (sp.reduce((a, b) => a + b, 0) !== people) return false;
    if (!skiN || !boardN) return true;
    let acc = 0;
    for (const g of sp) {
      acc += g;
      if (acc === skiN) return true;
      if (acc > skiN) return false;
    }
    return false;
  };
  const usedSplit = split.length && splitOk(split) ? split : splitCheapest;
  const splitChoices = (
    skiN && boardN ? allSplits(skiN).flatMap((a) => allSplits(boardN).map((b) => [...a, ...b])).sort((x, y) => x.length - y.length) : allSplits(people)
  ).slice(0, 40);

  const groups = usedSplit.map((size, i) => ({
    no: i + 1,
    size,
    perSession: groupCost(size),
    lessonPP: Math.round(groupTotal(size) / size / 100) * 100,
  }));
  const lessonTotal = groups.reduce((a, g) => a + g.lessonPP * g.size, 0);
  // 얼리버드 10%는 강습료에만 (패찰·리프트·장비·헬멧 제외)
  const ebSaved = schedule.reduce(
    (a, d) =>
      a +
      (ebFor(d.len)
        ? usedSplit.reduce((b, size) => b + ebCut(d.len, prices.table[d.len][size - 1] ?? 0), 0) *
          d.slots.length
        : 0),
    0
  );
  const lessonAvgPP = people ? Math.round(lessonTotal / people / 100) * 100 : 0;
  const perHead1 = people && sessions ? Math.round(lessonTotal / people / sessions / 1000) * 1000 : 0;

  /** 1인 리프트(·장비): 날짜마다 평일/주말 정가 → 40% 할인 (날짜별로 따로 계산해서 1일·2일·3일 금액도 보여줘요) */
  const extraPP = (child: boolean, withRental: boolean) => {
    const who = child ? "child" : "adult";
    const perDayList = Array.from({ length: days }, (_, d) => {
      const t = ticketOf(d);
      if (!t) return { regular: 0, sale: 0 };
      const w = isWeekend(startDate, d) ? 1 : 0;
      // 리프트 3시간 → 장비 4시간, 5시간 → 6시간, 7시간 → 8시간
      const regular = LIFT_PRICES[t][who][w] + (withRental ? RENTAL_PRICES[t][who][w] : 0);
      return { regular, sale: roundUp100(regular * (1 - LIFT_RENTAL_DISCOUNT)) };
    });
    return {
      perDayList,
      regular: perDayList.reduce((a, x) => a + x.regular, 0),
      sale: perDayList.reduce((a, x) => a + x.sale, 0),
    };
  };
  const roster: (Person & { child: boolean; index: number })[] = Array.from({ length: people }, (_, i) => ({
    ...(persons[i] ?? newPerson()),
    child: i >= adults,
    index: i,
  }));
  /** 이름 기본값: 어른 1, 어른 2 … / 아이 1, 아이 2 … (어른·아이 리프트 요금이 달라서 구분) */
  const defLabel = (i: number) => (i >= adults ? `아이 ${i - adults + 1}` : `어른 ${i + 1}`);
  /** 종목·실력 요약: 스키 초급 2명 · 보드 중급 1명 */
  const sportSummary = (["ski", "board"] as Sport[])
    .flatMap((sp) =>
      ([1, 2, 3] as Level[]).map((lv) => {
        const n = roster.filter((x) => x.sport === sp && x.level === lv).length;
        return n ? `${SPORT_LABEL[sp]} ${LEVEL_LABEL[lv]} ${n}명` : "";
      })
    )
    .filter(Boolean)
    .join(" · ");
  const countOf = (child: boolean, extra: Extra) => roster.filter((x) => x.child === child && x.extra === extra).length;
  const lr = { a: countOf(false, "liftRental"), k: countOf(true, "liftRental") };
  const lo = { a: countOf(false, "lift"), k: countOf(true, "lift") };
  const helmet = { basic: roster.filter((x) => x.helmet === 1).length, visor: roster.filter((x) => x.helmet === 2).length };
  const extras = [
    { key: "lr-a", label: "어른 · 리프트+장비", count: lr.a, ...extraPP(false, true) },
    { key: "lr-k", label: "어린이 · 리프트+장비", count: lr.k, ...extraPP(true, true) },
    { key: "lo-a", label: "어른 · 리프트만", count: lo.a, ...extraPP(false, false) },
    { key: "lo-k", label: "어린이 · 리프트만", count: lo.k, ...extraPP(true, false) },
  ].filter((x) => x.count > 0);
  const helmets = [
    { key: "basic", label: "기본 헬멧", count: helmet.basic, pp: HELMET_PRICE.basic * lessonDays },
    { key: "visor", label: "바이저 헬멧", count: helmet.visor, pp: HELMET_PRICE.visor * lessonDays },
  ].filter((x) => x.count > 0);
  const extrasTotal = extras.reduce((a, x) => a + x.sale * x.count, 0);
  const helmetTotal = helmets.reduce((a, x) => a + x.pp * x.count, 0);
  // 날짜별 합계 (토탈 보기: 전체 / 1일차 / 2일차 …)
  const dayTotals = schedule.map((d, i) => {
    const lesson = usedSplit.reduce((a, size) => a + groupCost(size, d.len), 0) * d.slots.length;
    const extra = extras.reduce((a, x) => a + x.perDayList[i].sale * x.count, 0);
    const helm = d.slots.length ? helmet.basic * HELMET_PRICE.basic + helmet.visor * HELMET_PRICE.visor : 0;
    return { day: d.day, lesson, extra, helm, total: lesson + extra + helm };
  });
  const lessonExact = dayTotals.reduce((a, d) => a + d.lesson, 0);
  const grand = lessonExact + extrasTotal + helmetTotal;
  const evenGroups = new Set(usedSplit).size === 1;

  // 반(강사)별로 앞에서부터 사람 배정 → 개인별 강습료
  const groupBySeat: number[] = usedSplit.flatMap((size, gi) => Array(size).fill(gi));
  const seatOrder = roster
    .map((x) => x.index)
    .sort((a, b) => {
      const pa = roster[a], pb = roster[b];
      return (pa.sport === pb.sport ? 0 : pa.sport === "ski" ? -1 : 1) || pa.level - pb.level || a - b;
    });
  const groupOfIndex: number[] = [];
  seatOrder.forEach((pi, seat) => {
    groupOfIndex[pi] = groupBySeat[seat] ?? 0;
  });
  const extraSale = (child: boolean, e: Extra) => (e === "none" ? 0 : extraPP(child, e === "liftRental").sale);
  const personRows = roster.map((x) => {
    const g = groups[groupOfIndex[x.index] ?? 0];
    const lesson = g?.lessonPP ?? 0;
    const lift = extraSale(x.child, x.extra);
    const helm = x.helmet === 2 ? HELMET_PRICE.visor * lessonDays : x.helmet === 1 ? HELMET_PRICE.basic * lessonDays : 0;
    return {
      ...x,
      label: x.name.trim() || defLabel(x.index),
      group: (groupOfIndex[x.index] ?? 0) + 1,
      lesson,
      lift,
      helm,
      pay: lesson + lift + helm,
      desc: [x.name.trim() ? (x.child ? "어린이" : "어른") : "", `${SPORT_LABEL[x.sport]} ${LEVEL_LABEL[x.level]}`, EXTRA_LABEL[x.extra].replace("+ ", "+"), x.helmet ? HELMET_LABEL[x.helmet] : ""].filter(Boolean).join(" · "),
    };
  });
  // 날짜별 준비표 (현장에서 리프트권·장비·헬멧 나눠줄 때)
  const prep = schedule.map((d, i) => {
    const t = ticketOf(i);
    const hasLesson = d.slots.length > 0;
    const rows = roster.map((x) => {
      const items: string[] = [];
      if (t && x.extra !== "none") items.push(`리프트 ${t}h`);
      if (t && x.extra === "liftRental") items.push(`장비 ${RENTAL_H[t]}h`);
      if (hasLesson && x.helmet) items.push(x.helmet === 2 ? "바이저 헬멧" : "헬멧");
      return { label: x.name.trim() || defLabel(x.index), named: !!x.name.trim(), child: x.child, items };
    });
    const cnt = (f: (x: (typeof roster)[number]) => boolean) => ({
      a: roster.filter((x) => !x.child && f(x)).length,
      k: roster.filter((x) => x.child && f(x)).length,
    });
    const lift = t ? cnt((x) => x.extra !== "none") : { a: 0, k: 0 };
    const rent = t ? cnt((x) => x.extra === "liftRental") : { a: 0, k: 0 };
    const hb = hasLesson ? roster.filter((x) => x.helmet === 1).length : 0;
    const hv = hasLesson ? roster.filter((x) => x.helmet === 2).length : 0;
    const ak = (c: { a: number; k: number }) => [c.a ? `어른 ${c.a}` : "", c.k ? `어린이 ${c.k}` : ""].filter(Boolean).join("·");
    const sum = [
      lift.a + lift.k ? `리프트 ${t}h ${ak(lift)}` : "",
      rent.a + rent.k ? `장비 ${RENTAL_H[t as TicketHours]}h ${ak(rent)}` : "",
      hb ? `헬멧 ${hb}` : "",
      hv ? `바이저 ${hv}` : "",
    ]
      .filter(Boolean)
      .join(" / ");
    // 리프트·장비는 주중 / 주말·공휴일 요금이 달라요 (날짜 미정이면 주말 요금)
    const weekend = isWeekend(startDate, i);
    const rateTag = startDate ? (isHoliday(startDate, i) ? "공휴일·주말 요금" : weekend ? "주말 요금" : "주중 요금") : "주말 요금(날짜 미정)";
    const liftCost = extras.reduce((a, x) => a + x.perDayList[i].sale * x.count, 0);
    return { day: d.day, date: startDate ? addDays(startDate, i) : "", sum, rateTag, weekend, liftCost, rows: rows.filter((r) => r.items.length) };
  });
  const anyPrep = prep.some((d) => d.rows.length);

  function setPerson(i: number, patch: Partial<Person>) {
    setPersons(() => roster.map((x, j) => ({ name: x.name, extra: x.extra, helmet: x.helmet, sport: x.sport, level: x.level, ...(j === i ? patch : {}) })));
  }
  function setAllPersons(patch: Partial<Person>) {
    setPersons(() => roster.map((x) => ({ name: x.name, extra: x.extra, helmet: x.helmet, sport: x.sport, level: x.level, ...patch })));
  }



  const trip = days === 1 ? "당일" : `${days - 1}박 ${days}일`;
  const period = startDate ? `${addDays(startDate, 0)}${days > 1 ? ` ~ ${addDays(startDate, days - 1)}` : ""}` : "날짜 미정";
  const timeText = schedule.map((d) => `${d.day}일 ${dayLine(d)}`).join(" / ");

  // ── 단계 이동 ─────────────────────────
  const canNext = (s: number) =>
    s === 1 ? true : s === 2 ? people > 0 : s === 3 ? sessions > 0 : s === 4 ? usedSplit.length > 0 : true;
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
    // 어른·어린이 순서를 지키며 사람 목록 맞추기
    const oldA = persons.slice(0, adults);
    const oldK = persons.slice(adults, adults + kids);
    const fit = (list: Person[], n: number) => Array.from({ length: n }, (_, i) => list[i] ?? newPerson());
    setPersons([...fit(oldA, a), ...fit(oldK, k)]);
  }

  // 풀케어 날이 있으면: 패찰·식사 포함 안내
  const hasOneDay = schedule.some((d) => d.slots.length && d.len === "fc");
  const hasNight = schedule.some((d) => d.slots.length && d.len === "nc");
  const fcNote =
    hasOneDay && hasNight
      ? "풀케어는 패찰 + 식사 포함 (원데이 점심 · 나이트 저녁) · 따로 낼 돈 없어요"
      : hasOneDay
        ? "원데이 풀케어는 패찰 + 점심 식사 포함 · 따로 낼 돈 없어요"
        : hasNight
          ? "나이트 풀케어는 패찰 + 저녁 식사 포함 · 따로 낼 돈 없어요"
          : "";
  // ── 공유·문의 ─────────────────────────
  const summary = [
    `[지노스키 견적] ${trip} · ${lenText} · ${dayText}`,
    `기간: ${period}`,
    `인원: 어른 ${adults}명 · 어린이 ${kids}명 (반 ${usedSplit.join("+")}, 강사 ${usedSplit.length}명)`,
    ...(sportSummary ? [`종목·실력: ${sportSummary}`] : []),
    ...(teacherPref ? [`강사 희망: ${TEACHER_PREFS[teacherPref]}`] : []),
    `수업: 총 ${sessions}회 (${schedule.filter((d) => d.slots.length).map((d) => dayLine(d)).join(" / ")})`,
    ...(days >= 1
      ? [
          "■ 일정",
          ...schedule.map(
            (d) =>
              `  ${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}: ${
                d.slots.length ? `${LEN_LABEL[d.len]} ${d.slots.map((x) => `${x.label}(${x.time})`).join(" · ")}` : "수업 없음"
              }`
          ),
        ]
      : []),
    "",
    `■ 강습료 1인 ${evenGroups ? won(lessonAvgPP) : `약 ${won(lessonAvgPP)}`} (1회 약 ${won(perHead1)} × ${sessions}회, 패찰 포함)`,
    ...(extras.length
      ? [
          "■ 리프트·장비 (40% 할인)",
          ...extras.map((x) => `  ${x.label} ${x.count}명 · 1인 +${won(x.sale)}`),
          `  날짜별: ${schedule
            .map((d, i) => {
              const t = ticketOf(i);
              return `${d.day}일 ${t ? `리프트 ${t}h·장비 ${RENTAL_H[t]}h` : "안 씀"}`;
            })
            .join(" / ")}`,
        ]
      : []),
    ...(helmets.length ? ["■ 헬멧", ...helmets.map((x) => `  ${x.label} ${x.count}명 · 1인 +${won(x.pp)}`)] : []),
    "",
    "■ 1인 금액",
    ...personRows.map((x) => `  ${x.label} (${x.group}반 · ${x.desc}) ${won(x.pay)}`),
    "",
    ...(anyPrep
      ? [
          "",
          "■ 날짜별 준비표 (리프트·장비·헬멧)",
          ...prep.flatMap((d) =>
            d.rows.length
              ? [`  ${d.day}일차${d.date ? ` ${d.date}` : ""} [${d.rateTag}]: ${d.sum}${d.liftCost ? ` → 리프트·장비 ${won(d.liftCost)}` : ""}`, ...d.rows.map((r) => `    - ${r.label}: ${r.items.join(" + ")}`)]
              : [`  ${d.day}일차${d.date ? ` ${d.date}` : ""}: 없음`]
          ),
        ]
      : []),
    ...(days > 1
      ? ["■ 날짜별 합계", ...dayTotals.map((d) => `  ${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}: ${won(d.total)}`)]
      : []),
    `예상 합계: ${won(grand)}${ebSaved ? ` (얼리버드 강습료 10% 할인 -${won(ebSaved)} 반영)` : ""}`,
    ...(fcNote ? [`※ ${fcNote}`] : []),
    "※ 의류는 제휴 렌탈샵 안내 드립니다.^^ · 강사 일정 확인 후 확정",
  ].join("\n");

  function shareUrl(loc: QLocale = qloc) {
    const q = new URLSearchParams({
      d: String(days),
      a: String(adults),
      k: String(kids),
      l: len,
      dp: dayPlans.map((p) => `${p.n}${p.n === 1 ? p.one : p.n === 2 ? p.two : ""}${LEN_CODE[p.len ?? len]}`).join("-"),
      g: usedSplit.join("-"),
      pp: roster
        .map((x) => `${EXTRA_CODE[x.extra]}${x.helmet}${x.sport === "board" ? "b" : "s"}${x.level}${x.name.trim() ? `:${x.name.trim().replace(/[.:&=?#]/g, "")}` : ""}`)
        .join("."),
    });
    if (dayTickets.some((t) => t !== undefined))
      q.set("dt", Array.from({ length: days }, (_, i) => (dayTickets[i] === undefined ? "a" : String(dayTickets[i]))).join("-"));
    if (startDate) q.set("sd", startDate);
    if (teacherPref) q.set("tp", String(teacherPref));
    return `${window.location.origin}/${loc}/quote/?${q.toString()}`;
  }
  async function copy(kind: "text" | "link") {
    try {
      await navigator.clipboard.writeText(kind === "text" ? trQuote(summary, qloc) : shareUrl());
      setCopied(kind);
      setTimeout(() => setCopied(""), 2000);
      trackEvent("quote_copy", { kind });
    } catch {
      // clipboard unavailable
    }
  }
  /** 💰 1인 금액 풀어보기 (견적서 이미지): 강습 몇 시간 · 패찰 · 리프트 · 장비 · 헬멧 */
  const mins = (t: string) => {
    const m = /(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/.exec(t);
    return m ? (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]) : 0;
  };
  const hText = (m: number) => `${Math.floor(m / 60)}시간${m % 60 ? ` ${m % 60}분` : ""}`;
  const personBreakdown = (x: (typeof personRows)[number]) => {
    const size = usedSplit[x.group - 1] ?? 1;
    const lessonMin = schedule.reduce((a, d) => a + d.slots.reduce((b, sl) => b + mins(sl.time), 0), 0);
    const passDays = schedule.filter((d) => d.slots.length && prices.pass[d.len]);
    const pass = passDays.reduce((a, d) => a + prices.pass[d.len] * d.slots.length, 0);
    const passCnt = passDays.reduce((a, d) => a + d.slots.length, 0);
    const passUnits = [...new Set(passDays.map((d) => prices.pass[d.len]))].map((v) => won(v)).join("·");
    const fcDays = schedule.filter((d) => d.slots.length && (d.len === "fc" || d.len === "nc")).length;
    const who = x.child ? "child" : "adult";
    let liftSale = 0, rentSale = 0;
    const liftH: number[] = [], rentH: number[] = [];
    if (x.extra !== "none") {
      schedule.forEach((_, i) => {
        const t = ticketOf(i);
        if (!t) return;
        const w = isWeekend(startDate, i) ? 1 : 0;
        const l = roundUp100(LIFT_PRICES[t][who][w] * (1 - LIFT_RENTAL_DISCOUNT));
        liftSale += l; liftH.push(t);
        if (x.extra === "liftRental") { rentH.push(RENTAL_H[t]); }
      });
      rentSale = x.lift - liftSale; // 합계는 기존 계산과 똑같이 (반올림 차이는 장비 쪽에)
      if (x.extra !== "liftRental") { liftSale = x.lift; rentSale = 0; }
    }
    const rows = [
      { k: "강습료", d: `총 ${hText(lessonMin)} · 수업 ${sessions}회 · 1:${size}${ebSaved ? " · 얼리버드 10%" : ""}`, v: x.lesson - pass },
      ...(pass ? [{ k: "패찰", d: `${passCnt}회 × ${passUnits} (강습 허가권)`, v: pass }] : []),
      ...(fcDays ? [{ k: "풀케어", d: "패찰 + 식사 포함 (강습료에 들어 있어요)", v: 0 }] : []),
      ...(liftSale ? [{ k: "리프트", d: `${liftH.map((h) => `${h}시간`).join(" + ")} · 40% 할인`, v: liftSale }] : []),
      ...(rentSale ? [{ k: "장비", d: `${rentH.map((h) => `${h}시간`).join(" + ")} · 40% 할인`, v: rentSale }] : []),
      ...(x.helm ? [{ k: "헬멧", d: `${x.helmet === 2 ? "바이저" : "기본"} ${won(x.helmet === 2 ? HELMET_PRICE.visor : HELMET_PRICE.basic)} × ${lessonDays}일`, v: x.helm }] : []),
    ];
    return { label: x.label, sub: `${x.group}반 · ${SPORT_LABEL[x.sport]} ${LEVEL_LABEL[x.level]}`, pay: x.pay, rows };
  };
  /** 견적서 이미지 (사진 저장 · 카톡 알림에 같이 사용) */
  const quoteImage = (type: "image/png" | "image/jpeg" = "image/png", loc: QLocale = qloc) =>
    renderQuoteImage(trDeep({
      title: `${trip} · ${period} · ${lenText} · 수업 ${sessions}회`,
      total: `1인 1회 약 ${won(perHead1)}`,
      totalSub: `어른 ${adults} · 어린이 ${kids} · 반 ${usedSplit.join("+")}${ebSaved ? " · 얼리버드 강습료 10% 반영" : ""}`,
      grand: won(grand),
      grandLabel: `총 합계 (${adults + kids}명)`,
      persons: personRows.map(personBreakdown),
      schedule: schedule.map((d) => ({
        left: `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}${d.tag ? ` ${d.tag}` : ""}`,
        right: d.slots.map((x) => x.time).join("  ·  ") || "-",
      })),
      teams: [
        ...(anyPrep
          ? [
              {
                name: "날짜별 준비표",
                amount: "",
                lines: prep.flatMap((d) =>
                  d.rows.length
                    ? [`${d.day}일차${d.date ? ` ${d.date}` : ""} (${d.rateTag}) · ${d.sum}`, ...d.rows.map((r) => `   ${r.label}: ${r.items.join(" + ")}`)]
                    : []
                ),
              },
            ]
          : []),
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
        ...(sportSummary ? [`종목·실력: ${sportSummary}`] : []),
        ebSaved
          ? `얼리버드 10%는 강습료에만 적용 (-${won(ebSaved)}) · 리프트·장비 40% 할인 · 헬멧 할인 제외`
          : "매 수업 사진·영상 무료 · 리프트·장비 40% 할인 · 헬멧 할인 제외",
        ...(teacherPref ? [`강사 희망: ${TEACHER_PREFS[teacherPref]}`] : []),
        ...(fcNote ? [fcNote] : []),
        "의류는 제휴 렌탈샵 안내 드립니다.^^",
        "예상 견적이에요. 강사 일정 확인 후 확정 금액을 안내드려요.",
      ],
      phone: contact.phone,
    }, loc), type, loc);
  async function saveImage() {
    setImgState("making");
    trackEvent("quote_image", { people, days });
    try {
      const blob = await quoteImage();
      const file = new File([blob], `${qloc === "ko" ? "지노스키_견적" : "JinoSki_quote"}_${trQuote(trip, qloc).replace(/\s/g, "")}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] }) && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
          await nav.share({ files: [file], title: qloc === "ko" ? "지노스키 견적" : "JinoSki quote" });
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
  const canSend = name.trim().length > 0 && phone.replace(/[^0-9]/g, "").length >= 9 && consent;
  /**
   * 날짜별·사람별 금액표 — 운영 프로그램(ops) 견적서가 홈페이지 견적서와 같은 숫자로 보여주게 같이 보내요 (한국어)
   * 날짜별 줄을 모두 더하면 합계(grand)와 같아요.
   */
  function buildBreakdown() {
    type Item = { label: string; qty: number; unit: number; amount: number };
    const bySize = new Map<number, number>();
    for (const g of usedSplit) bySize.set(g, (bySize.get(g) ?? 0) + 1);
    const sizes = [...bySize.entries()].sort((a, b) => b[0] - a[0]);
    const days = schedule.map((d, i) => {
      const items: Item[] = [];
      const n = d.slots.length;
      if (n) {
        const fc = isFC(d.len);
        for (const [size, cnt] of sizes) {
          const base = prices.table[d.len][size - 1] ?? 0;
          if (fc)
            items.push({ label: `${LEN_LABEL[d.len]} 1:${size}${cnt > 1 ? ` · ${cnt}반` : ""} (패찰·식사 포함)`, qty: cnt, unit: base * 2, amount: base * 2 * cnt });
          else
            items.push({ label: `${LEN_LABEL[d.len]} 강습 1:${size}${cnt > 1 ? ` · ${cnt}반` : ""}${n > 1 ? ` · ${n}회` : ""}`, qty: cnt * n, unit: base, amount: base * cnt * n });
        }
        if (!fc && prices.pass[d.len]) items.push({ label: `패찰 ${LEN_LABEL[d.len]} (1인 1회)`, qty: people * n, unit: prices.pass[d.len], amount: prices.pass[d.len] * people * n });
        const ebDay = ebFor(d.len) ? usedSplit.reduce((a, size) => a + ebCut(d.len, prices.table[d.len][size - 1] ?? 0), 0) * n : 0;
        if (ebDay) items.push({ label: "얼리버드 10% 할인 (강습료만)", qty: 0, unit: 0, amount: -ebDay });
      }
      const t = ticketOf(i);
      for (const x of extras) {
        const sale = x.perDayList[i]?.sale ?? 0;
        if (!sale || !t) continue;
        const who = x.key.endsWith("-k") ? "어린이" : "어른";
        const rental = x.key.startsWith("lr");
        items.push({ label: `${who} 리프트 ${t}h${rental ? ` + 장비 ${RENTAL_H[t]}h` : ""} (40% 할인)`, qty: x.count, unit: sale, amount: sale * x.count });
      }
      if (n && helmet.basic) items.push({ label: "헬멧", qty: helmet.basic, unit: HELMET_PRICE.basic, amount: HELMET_PRICE.basic * helmet.basic });
      if (n && helmet.visor) items.push({ label: "바이저 헬멧", qty: helmet.visor, unit: HELMET_PRICE.visor, amount: HELMET_PRICE.visor * helmet.visor });
      return {
        title: `${d.day}일차${startDate ? ` ${addDays(startDate, i)}` : ""}`,
        rate: prep[i]?.rateTag ?? "",
        lesson: n ? dayLine(d) : "수업 없음",
        slots: d.slots.map((x) => `${x.label} ${x.time}`),
        items,
        total: dayTotals[i]?.total ?? 0,
      };
    });
    return {
      v: 1,
      title: `${trip} · ${period} · ${lenText} · 수업 ${sessions}회`,
      headline: `1인 1회 약 ${won(perHead1)}`,
      sub: `어른 ${adults} · 어린이 ${kids} · 반 ${usedSplit.join("+")}${sportSummary ? ` · ${sportSummary}` : ""}`,
      days,
      persons: personRows.map((x) => ({ label: x.label, group: x.group, desc: x.desc, lesson: x.lesson, lift: x.lift, helm: x.helm, pay: x.pay })),
      totals: { lesson: lessonExact, lift: extrasTotal, helmet: helmetTotal, eb: ebSaved, grand },
      notes: [
        ...(fcNote ? [fcNote] : []),
        ebSaved ? `얼리버드 10%는 강습료에만 적용 (-${won(ebSaved)}) · 리프트·장비 40% 할인 · 헬멧 할인 제외` : "리프트·장비 40% 할인 · 헬멧 할인 제외",
        ...(teacherPref ? [`강사 희망: ${TEACHER_PREFS[teacherPref]}`] : []),
        "매 수업 사진·영상 무료 · 의류는 제휴 렌탈샵 안내 드립니다.^^",
      ],
    };
  }
  async function send() {
    if (!canSend) return;
    const isEdit = !!sentLink;
    const link = shareUrl("ko"); // 사장님용은 한국어 화면 링크
    const myLink = shareUrl();
    setStatus("sending");
    // 견적서 사진도 같이 보내요 (실패해도 글 알림은 가요)
    let image = "";
    let imageH = 0;
    try {
      const blob = await quoteImage("image/jpeg", "ko");
      if (blob.size < 1_500_000) {
        image = await new Promise<string>((ok, no) => {
          const r = new FileReader();
          r.onload = () => ok(String(r.result));
          r.onerror = () => no(r.error);
          r.readAsDataURL(blob);
        });
        const bmp = await createImageBitmap(blob);
        imageH = bmp.height;
        bmp.close();
      }
    } catch {
      image = "";
    }
    trackEvent(isEdit ? "quote_resubmit" : "quote_submit", { people, days });
    try {
      const res = await fetch(KAKAO_NOTIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          kind: isEdit ? "견적 수정" : "견적",
          link,
          image,
          imageW: 1080,
          imageH,
          headline: `1인 1회 약 ${won(perHead1)} · 합계 ${won(grand)}`,
          request: [
            qloc === "en" ? "🌐 영어 페이지 손님 (영어 답변)" : qloc === "zh" ? "🌐 중국어 페이지 손님 (중국어 답변)" : "",
            teacherPref ? `강사 ${TEACHER_PREFS[teacherPref]}` : "",
            note.trim(),
          ].filter(Boolean).join(" / "),
          pw: pw.trim(),
          name: name.trim(),
          phone: phone.trim(),
          date: `${period} (${trip})`,
          program: `견적 ${lenText} · ${dayText}`,
          timeSlot: timeText,
          groupSize: `어른${adults} 어린이${kids} · 반 ${usedSplit.join("+")}`,
          equipment: sportSummary,
          breakdown: buildBreakdown(),
          level: "",
          total: `${won(grand)} (수업 ${sessions}회)`,
          note: [
            anyPrep ? prep.filter((d) => d.sum).map((d) => `${d.day}일 ${d.sum}`).join(" | ") : "",
            teacherPref ? `강사 ${TEACHER_PREFS[teacherPref]}` : "",
            note.trim(),
            marketingTag(marketing),
            attributionText(),
          ]
            .filter(Boolean)
            .join(" / "),
        }),
      });
      setStatus(res.ok ? "sent" : "failed");
      if (res.ok) setSentLink(myLink);
    } catch {
      setStatus("failed");
    }
  }

  // ── 화면 ─────────────────────────────
  return (
    <section id="quote-root" className="bg-ice-200 py-10 sm:py-14">
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
                <BigCounter label="어른" sub="14세 이상 (중학생부터)" value={adults} max={MAX_PEOPLE - kids} onChange={(v) => setPeople(v, kids)} />
                <BigCounter label="어린이" sub="13세 이하 (초등학생까지)" value={kids} max={MAX_PEOPLE - adults} onChange={(v) => setPeople(adults, v)} />
                <p className="rounded-xl bg-ice-200/70 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-700">
                  🎫 리프트 요금 나이 기준: <b>소인 = 13세 이하(초등학생까지)</b> · <b>대인 = 14세 이상(중학생부터)</b> · 강습은 만 4세부터 가능해요
                </p>
                {people > 0 && (
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-snow-300/60">
                    <p className="text-[15px] font-bold text-ink-900">🎿 스키·보드 / 실력</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-snow-500">초급 = 처음이거나 초보 슬로프 · 중급 = 턴하며 중급 슬로프 · 상급 = 상급 슬로프·기술 연습</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-snow-500">모두 한 번에:</span>
                      {(["ski", "board"] as Sport[]).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => {
                            setAllPersons({ sport: sp });
                            setSplit([]);
                          }}
                          className="rounded-full bg-snow-100 px-3 py-1 text-[12.5px] font-semibold text-ink-700"
                        >
                          {sp === "ski" ? "모두 스키" : "모두 보드"}
                        </button>
                      ))}
                    </div>
                    <ul className="mt-1 flex flex-col divide-y divide-snow-300/50">
                      {roster.map((x) => (
                        <li key={x.index} className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-2.5">
                          <span className={cn("w-[52px] shrink-0 text-[13px] font-bold", x.child ? "text-amber-700" : "text-ink-900")}>{defLabel(x.index)}</span>
                          <div className="flex rounded-full bg-snow-100 p-0.5">
                            {(["ski", "board"] as Sport[]).map((sp) => (
                              <button
                                key={sp}
                                type="button"
                                aria-pressed={x.sport === sp}
                                onClick={() => {
                                  setPerson(x.index, { sport: sp });
                                  setSplit([]);
                                }}
                                className={cn("rounded-full px-3 py-1 text-[12.5px] font-bold", x.sport === sp ? "bg-brand-500 text-white" : "text-ink-700")}
                              >
                                {SPORT_LABEL[sp]}
                              </button>
                            ))}
                          </div>
                          <div className="flex rounded-full bg-snow-100 p-0.5">
                            {([1, 2, 3] as Level[]).map((lv) => (
                              <button
                                key={lv}
                                type="button"
                                aria-pressed={x.level === lv}
                                onClick={() => setPerson(x.index, { level: lv })}
                                className={cn("rounded-full px-2.5 py-1 text-[12.5px] font-bold", x.level === lv ? "bg-ink-900 text-white" : "text-ink-700")}
                              >
                                {LEVEL_LABEL[lv]}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-center text-[13px] text-snow-500">
                  {people ? `모두 ${people}명이 배워요` : "배울 사람 수를 넣어주세요"} · 구경만 하는 분은 빼고 넣어주세요
                </p>
                <PriceGuide prices={prices} people={people} rec={splitCheapest} />
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 flex flex-col gap-6">
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-ink-900">
                      날짜마다 순서대로 골라주세요{" "}
                      <span className="block text-[12.5px] font-normal text-snow-500">몇 번 → 몇 시간 → 몇 교시 (날마다 달라도 돼요)</span>
                    </p>
                    {days > 1 && (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setAllDays(1)}
                          className="rounded-full bg-snow-100 px-3 py-1 text-[12.5px] font-semibold text-ink-700"
                        >
                          모두 1번
                        </button>
                        <button
                          type="button"
                          onClick={() => setAllDays(2)}
                          className="rounded-full bg-snow-100 px-3 py-1 text-[12.5px] font-semibold text-ink-700"
                        >
                          모두 2번
                        </button>
                      </div>
                    )}
                  </div>
                  <ul className="flex flex-col gap-3">
                    {dayPlans.map((p, i) => (
                      <li
                        key={i}
                        className={cn("rounded-2xl border-2 p-3.5", p.n ? "border-brand-500/40 bg-brand-50/40" : "border-snow-300/60")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 text-[15px] font-bold text-ink-900">
                            {days > 1 ? `${DAY_NAMES[i]} 날` : "수업 날"}
                            {startDate && (
                              <span className="block text-[12.5px] font-medium text-snow-500">
                                {addDays(startDate, i)} <RateBadge weekend={isWeekend(startDate, i)} holiday={isHoliday(startDate, i)} />
                              </span>
                            )}
                          </p>
                          <div className="flex shrink-0 rounded-full bg-white p-0.5 ring-1 ring-snow-300/70">
                            {([0, 1, 2] as const).map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setPlan(i, n !== 2 && isFC(p.len) ? { n, len: "2h", one: defaultPlan(i, "2h").one, two: 0 } : { n })}
                                aria-pressed={p.n === n}
                                className={cn(
                                  "whitespace-nowrap rounded-full px-3 py-1.5 text-[13.5px] font-bold",
                                  p.n === n ? "bg-brand-500 text-white" : "text-snow-600"
                                )}
                              >
                                {n === 0 ? "안 함" : `${n}번`}
                              </button>
                            ))}
                          </div>
                        </div>
                        {p.n > 0 && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[12px] font-semibold text-snow-500">수업 시간</span>
                            {BASE_LENS.map((l) => (
                              <button
                                key={l}
                                type="button"
                                onClick={() => setPlan(i, { len: l, one: defaultPlan(i, l).one, two: 0 })}
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-[12.5px] font-bold",
                                  (p.len ?? len) === l ? "bg-ink-900 text-white" : "bg-white text-snow-600 ring-1 ring-snow-300/70"
                                )}
                              >
                                {LEN_LABEL[l]}
                              </button>
                            ))}
                            {p.n === 2 && (
                              <button
                                type="button"
                                onClick={() => setPlan(i, { len: "fc", two: 0 })}
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-[12.5px] font-bold",
                                  isFC(p.len) ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                                )}
                              >
                                풀케어 <span className="rounded bg-white/90 px-1 text-[10.5px] text-rose-600">강추</span>
                              </button>
                            )}
                          </div>
                        )}
                        {p.n === 2 && !isFC(p.len) && people > 0 && (
                          <button
                            type="button"
                            onClick={() => setPlan(i, { len: "fc", two: 0 })}
                            className="mt-2.5 w-full rounded-xl bg-rose-50 px-3 py-2 text-left text-[12.5px] leading-relaxed text-rose-700 ring-1 ring-rose-200"
                          >
                            💡 하루 2번이면 <b>원데이 풀케어 강추!</b> {LEN_LABEL[p.len ?? len]}×2번 ={" "}
                            {won(usedSplit.reduce((a, size) => a + groupCost(size, p.len ?? len) * 2, 0))} → 풀케어 7시간 ={" "}
                            <b>{won(usedSplit.reduce((a, size) => a + groupCost(size, "fc") * 2, 0))}</b> (패찰·점심 포함) · 눌러서 바꾸기
                          </button>
                        )}
                        {p.n === 2 && isFC(p.len) && (
                          <div className="mt-2.5 rounded-xl bg-rose-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-rose-800 ring-1 ring-rose-200">
                            <div className="flex flex-wrap gap-1.5">
                              {(["fc", "nc"] as Len[]).map((l) => (
                                <button
                                  key={l}
                                  type="button"
                                  onClick={() => setPlan(i, { len: l, two: 0 })}
                                  className={cn(
                                    "rounded-full border px-3 py-1.5 text-[12.5px] font-bold",
                                    p.len === l ? "border-rose-500 bg-rose-500 text-white" : "border-rose-200 bg-white text-rose-700"
                                  )}
                                >
                                  {LEN_LABEL[l]}
                                  {l === "fc" ? " 강추" : ""}
                                </button>
                              ))}
                            </div>
                            <p className="mt-1.5">
                              {p.len === "nc"
                                ? "13:30 미팅 · 오후 4시간 + 정설 후 야간 3시간 = 레슨 7시간 · 저녁 식사·사진·영상·패찰 포함"
                                : "08:40 미팅 · 오전 3시간 30분 + 오후 3시간 30분 = 레슨 7시간 · 점심 식사·사진·영상·패찰 포함"}
                            </p>
                            {people > 0 && (
                              <p className="mt-0.5 font-bold">
                                이날 {usedSplit.length > 1 ? `${usedSplit.length}팀 ` : ""}합계 {won(usedSplit.reduce((a, size) => a + groupCost(size, p.len as Len) * 2, 0))}
                                {ebFor(p.len as Len) ? " (얼리버드 10% 반영)" : ""}
                              </p>
                            )}
                          </div>
                        )}
                        {p.n === 1 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {TIMES[p.len ?? len].map((t, j) => (
                              <button
                                key={t.time}
                                type="button"
                                onClick={() => setPlan(i, { one: j })}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                                  p.one === j ? "border-brand-500 bg-brand-500 text-white" : "border-snow-300/70 bg-white text-ink-700"
                                )}
                              >
                                {t.label}{" "}
                                <span className={cn("font-normal", p.one === j ? "text-white/80" : "text-snow-400")}>{t.time.slice(0, 5)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {p.n === 2 && !isFC(p.len) && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {TWICE[p.len ?? len].map((t, j) => (
                              <button
                                key={t.label}
                                type="button"
                                onClick={() => setPlan(i, { two: j })}
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                                  p.two === j ? "border-brand-500 bg-brand-500 text-white" : "border-snow-300/70 bg-white text-ink-700"
                                )}
                              >
                                {t.label}
                                {t.rec ? " 추천" : ""}{" "}
                                <span className={cn("font-normal", p.two === j ? "text-white/80" : "text-snow-400")}>
                                  {t.idx.map((x) => TIMES[p.len ?? len][x].time.slice(0, 5)).join("·")}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12.5px] text-snow-500">
                    하루 2번이면 중간에 점심 먹고 쉬어요 · 2시간 수업은 1+3교시 또는 2+4교시를 추천드려요
                  </p>
                  <p className="mt-1 text-right text-[14px] font-bold text-brand-600">총 수업 {sessions}회</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="mt-5 flex flex-col gap-2.5">
                <p className="text-[13.5px] text-snow-600">
                  강사 1명이 최대 3명까지 가르쳐요. 실력·나이가 비슷한 분끼리 묶어드려요.
                </p>
                {skiN > 0 && boardN > 0 && (
                  <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] font-semibold text-amber-700">
                    🎿 스키 {skiN}명 · 🏂 보드 {boardN}명 — 스키와 보드는 반을 따로 나눠요
                  </p>
                )}
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
                    {splitChoices.map((sp) => (
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
                  지노스키 손님은 리프트·장비 <span className="text-[17px]">40% 할인</span>! 이름을 넣고 사람마다 골라주세요. (필요 없으면 그냥 다음)
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-snow-500">모두 한 번에:</span>
                  {(["lift", "liftRental", "none"] as Extra[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setAllPersons({ extra: e })}
                      className="rounded-full bg-snow-100 px-3 py-1 text-[12.5px] font-semibold text-ink-700"
                    >
                      {e === "none" ? "모두 필요없음" : e === "lift" ? "모두 리프트만" : "모두 리프트+장비"}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAllPersons({ helmet: 1 })}
                    className="rounded-full bg-snow-100 px-3 py-1 text-[12.5px] font-semibold text-ink-700"
                  >
                    헬멧 모두
                  </button>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {roster.map((x, i) => (
                    <li key={i} className="rounded-2xl border border-snow-300/60 p-3">
                      <div className="flex items-center gap-2">
                        <input
                          value={x.name}
                          placeholder={defLabel(i)}
                          onChange={(e) => setPerson(i, { name: e.target.value.slice(0, 10) })}
                          aria-label={`${defLabel(i)} 이름`}
                          className="h-10 min-w-0 flex-1 rounded-xl border border-snow-300/70 px-3 text-[15px] outline-none focus:border-brand-500"
                        />
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold",
                            x.child ? "bg-amber-100 text-amber-700" : "bg-snow-100 text-ink-700"
                          )}
                        >
                          {x.child ? "어린이" : "어른"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {/* 강습은 고정 포함 — 리프트만 / 리프트+장비 / 필요없음 중 하나 */}
                        <span className="rounded-full bg-snow-100 px-3 py-1.5 text-[12.5px] font-semibold text-snow-500">✓ 강습 포함</span>
                        {(["lift", "liftRental", "none"] as Extra[]).map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => setPerson(i, { extra: e })}
                            aria-pressed={x.extra === e}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                              x.extra === e
                                ? e === "none"
                                  ? "border-ink-700 bg-ink-700 text-white"
                                  : "border-brand-500 bg-brand-500 text-white"
                                : "border-snow-300/70 text-ink-700"
                            )}
                          >
                            {x.extra === e && e !== "none" && "✓ "}
                            {e === "none" ? "필요없음" : e === "lift" ? "리프트만" : "리프트+장비"}
                          </button>
                        ))}
                      </div>
                      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                        {([0, 1, 2] as Helmet[]).map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setPerson(i, { helmet: h })}
                            className={cn(
                              "whitespace-nowrap rounded-full border px-1 py-1.5 text-[12px] font-semibold",
                              x.helmet === h
                                ? h === 0
                                  ? "border-ink-900 bg-ink-900 text-white"
                                  : "border-brand-500 bg-brand-500 text-white"
                                : "border-snow-300/70 text-snow-600"
                            )}
                          >
                            {x.helmet === h && h !== 0 && "✓ "}
                            {HELMET_LABEL[h]}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-[12px] text-snow-500">헬멧은 수업 있는 날 기준 · 할인 제외 (기본 5,000원 · 바이저 15,000원)</p>
                {extras.length > 0 && (
                  <div className="rounded-2xl border border-snow-300/60 p-4">
                    <p className="text-[15px] font-bold text-ink-900">
                      날짜별 리프트 <span className="text-[12.5px] font-medium text-snow-500">· 수업 시간표에 맞춰 자동 추천</span>
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-snow-500">장비는 리프트보다 1시간 길게 자동으로 맞춰요 (3시간 → 장비 4시간)</p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {schedule.map((d, i) => {
                        const cur = ticketOf(i);
                        const rec = autoTicket(i);
                        return (
                          <li
                            key={d.day}
                            className={cn(
                              "rounded-xl p-2.5",
                              isWeekend(startDate, i) ? "bg-rose-50 ring-1 ring-rose-200" : "bg-sky-50/60 ring-1 ring-sky-100"
                            )}
                          >
                            <p className="text-[13.5px] font-semibold text-ink-900">
                              {DAY_NAMES[i] ?? `${d.day}째`} 날{startDate && <span className="ml-1 font-normal text-snow-500">{addDays(startDate, i)}</span>}{" "}
                              <RateBadge weekend={isWeekend(startDate, i)} holiday={isHoliday(startDate, i)} dateless={!startDate} />
                              <span className="ml-1.5 text-[12px] font-normal text-snow-500">
                                · {dayLine(d)}
                              </span>
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {([3, 5, 7, 0] as (TicketHours | 0)[]).map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setDayTicket(i, t)}
                                  aria-pressed={cur === t}
                                  className={cn(
                                    "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                                    cur === t ? "border-brand-500 bg-brand-500 text-white" : "border-snow-300/70 bg-white text-ink-700"
                                  )}
                                >
                                  {t ? `${t}시간` : "안 씀"}
                                  {t === rec && t !== 0 && <span className={cn("ml-1 text-[11px]", cur === t ? "text-white/85" : "text-brand-500")}>추천</span>}
                                </button>
                              ))}
                            </div>
                            <p className="mt-1 text-[12px] text-snow-500">
                              {cur
                                ? `리프트 ${cur}시간 + 장비 ${RENTAL_H[cur]}시간 · 1인 대인 ${won(dayRate(i, cur, false, true))} · 소인 ${won(dayRate(i, cur, true, true))} (리프트만 대인 ${won(dayRate(i, cur, false, false))} · 소인 ${won(dayRate(i, cur, true, false))})`
                                : "이날은 리프트·장비 안 써요"}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <p className="text-[12.5px] text-snow-500">의류는 제휴 렌탈샵 안내 드립니다.^^</p>
                <PriceBoard />
              </div>
            )}

            {step === 6 && (
              <div className="mt-4">
                <p className="text-[14px] text-snow-600">
                  {trip} · {period} · {lenText} · 수업 {sessions}회
                </p>

                <div className="mt-4 rounded-2xl bg-ink-900 p-5 text-white">
                  <p className="text-[13px] text-white/60">1인 1회 강습료</p>
                  <p className="whitespace-nowrap text-[30px] font-bold tabular-nums text-brand-300 sm:text-[34px]">약 {won(perHead1)}</p>
                  <p className="text-[12.5px] text-white/50">패찰 포함 · 매 수업 사진·영상 무료</p>
                  {fcNote && <p className="mt-1.5 rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-[12.5px] font-semibold text-rose-200">🏆 {fcNote}</p>}
                  {eb && ebSaved > 0 && (
                    <p className="mt-2 inline-block rounded-full bg-red-500 px-3 py-1 text-[12.5px] font-bold text-white">
                      🎁 얼리버드 강습료 10% 할인 · {won(ebSaved)} 아꼈어요
                    </p>
                  )}
                </div>
                {eb && (
                  <p className="mt-2 text-[12px] text-snow-500">
                    얼리버드 할인({EARLY_BIRD.endDate.slice(5).replace("-", "/")}까지 예약)은 2·3시간 강습료·풀케어(원데이·나이트)에만 적용돼요 · 패찰·리프트·장비·헬멧은 제외
                  </p>
                )}

                <h3 className="mt-6 text-[16px] font-bold text-ink-900">개인별 금액 ({sessions}회 기준)</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {personRows.map((x) => (
                    <li key={x.index} className="rounded-2xl bg-ice-200/70 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 text-[15px] font-bold text-ink-900">
                          {x.label}
                          <span className="ml-1.5 text-[12px] font-medium text-snow-500">{x.group}반</span>
                        </span>
                        <span className="shrink-0 text-[18px] font-bold tabular-nums text-ink-900">{won(x.pay)}</span>
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-snow-600">
                        {x.desc} · 강습 {won(x.lesson)}
                        {x.lift > 0 && ` + 리프트${x.extra === "liftRental" ? "·장비" : ""} ${won(x.lift)}`}
                        {x.helm > 0 && ` + 헬멧 ${won(x.helm)}`}
                      </p>
                    </li>
                  ))}
                </ul>

                {anyPrep && (
                  <div className="mt-5 rounded-2xl border-2 border-[#03C75A]/40 bg-[#F2FBF5] p-4">
                    <h3 className="text-[16px] font-bold text-ink-900">📋 날짜별 준비표</h3>
                    <p className="text-[12.5px] text-snow-600">현장에서 리프트권·장비·헬멧을 이대로 준비해 드려요</p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {prep.map((d) => (
                        <li key={d.day} className="rounded-xl bg-white p-3 ring-1 ring-snow-300/60">
                          <p className="text-[14px] font-bold text-ink-900">
                            {d.day}일차{d.date && <span className="ml-1 font-medium text-snow-500">{d.date}</span>}
                            <span className="ml-1.5 text-[12px] font-medium text-snow-500">· {dayLine(schedule[d.day - 1])}</span>
                          </p>
                          {d.rows.length ? (
                            <>
                              <p className="mt-1 text-[12.5px] font-semibold text-[#03803D]">{d.sum}</p>
                              {d.liftCost > 0 && (
                                <p className="mt-0.5 text-[12px] text-snow-600">
                                  <span
                                    className={cn(
                                      "mr-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                                      d.weekend ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-700"
                                    )}
                                  >
                                    {d.rateTag}
                                  </span>
                                  리프트·장비 {won(d.liftCost)} (40% 할인)
                                </p>
                              )}
                              <ul className="mt-1.5 flex flex-col gap-0.5">
                                {d.rows.map((r, k) => (
                                  <li key={k} className="flex justify-between gap-3 text-[13.5px]">
                                    <span className="font-semibold text-ink-900">
                                      {r.label}{r.named && <span className="ml-1 text-[11.5px] font-normal text-snow-500">{r.child ? "어린이" : "어른"}</span>}
                                    </span>
                                    <span className="text-right text-ink-800">{r.items.join(" + ")}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="mt-1 text-[12.5px] text-snow-500">리프트·장비 없음</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                        {x.label} · {schedule.map((_, i) => ticketOf(i) || "-").join("/")}시간권 · <span className="line-through">{won(x.regular)}</span>{" "}
                        <b className="text-[#03803D]">{won(x.sale)}</b> (40% 할인)
                      </p>
                    ))}
                    <p className="mt-1 text-[12px] text-snow-500">
                      {startDate ? "날짜별 평일·주말 요금" : "날짜 미정이라 주말 요금"} · 공휴일은 주말 요금 · 의류는 제휴 렌탈샵 안내 드립니다.^^
                    </p>
                    <div className="mt-3">
                      <PriceBoard />
                    </div>
                  </div>
                </details>

                {showTotal ? (
                  <div className="mt-4 rounded-2xl border-2 border-ink-900 p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...dayTotals.map((d) => {
                          const hol = !!startDate && isHoliday(startDate, d.day - 1);
                          const wk = !!startDate && isWeekend(startDate, d.day - 1);
                          return { label: `${d.day}일차${startDate ? (hol ? " 공휴일" : wk ? " 주말" : " 주중") : ""}`, i: d.day, tone: startDate ? (wk ? "red" : "blue") : "" };
                        }),
                        { label: "강습료만", i: -1, tone: "" },
                        ...(extrasTotal + helmetTotal > 0 ? [{ label: "장비료만", i: -2, tone: "" }] : []),
                        { label: "전체", i: 0, tone: "" },
                      ].map((t) => (
                        <button
                          key={t.i}
                          type="button"
                          onClick={() => setTotalTab(t.i)}
                          aria-pressed={totalTab === t.i}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-[13px] font-bold",
                            t.tone === "red"
                              ? totalTab === t.i
                                ? "bg-rose-500 text-white"
                                : "bg-rose-50 text-rose-600"
                              : t.tone === "blue"
                                ? totalTab === t.i
                                  ? "bg-brand-500 text-white"
                                  : "bg-brand-50 text-brand-600"
                                : totalTab === t.i
                                  ? "bg-ink-900 text-white"
                                  : "bg-snow-100 text-ink-700"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {totalTab < 0 && (
                      <div className="mt-3">
                        <p className="text-[13px] text-snow-600">
                          {totalTab === -1 ? "강습료만 (패찰 포함 · 얼리버드 반영)" : "장비료만 (리프트·장비 40% 할인 + 헬멧)"}
                        </p>
                        <p className="mt-2 text-[12px] font-semibold text-snow-500">날짜별</p>
                        <div className="mt-1 flex flex-col gap-1 text-[14px]">
                          {dayTotals.map((d) => (
                            <div key={d.day} className="flex justify-between">
                              <span className="text-snow-600">
                                {d.day}일차{startDate && ` ${addDays(startDate, d.day - 1)}`}
                              </span>
                              <span className="tabular-nums">{won(totalTab === -1 ? d.lesson : d.extra + d.helm)}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-[12px] font-semibold text-snow-500">개인별</p>
                        <div className="mt-1 flex flex-col gap-1 text-[14px]">
                          {personRows
                            .filter((x) => totalTab === -1 || x.lift + x.helm > 0)
                            .map((x) => (
                              <div key={x.index} className="flex justify-between">
                                <span className="text-snow-600">{x.label}</span>
                                <span className="tabular-nums">{won(totalTab === -1 ? x.lesson : x.lift + x.helm)}</span>
                              </div>
                            ))}
                        </div>
                        <div className="mt-2 flex items-end justify-between border-t border-snow-300/60 pt-2">
                          <span className="text-[14px] font-semibold text-ink-900">{totalTab === -1 ? "강습료 합계" : "장비료 합계"}</span>
                          <span className="text-[24px] font-bold tabular-nums text-ink-900">
                            {won(totalTab === -1 ? lessonExact : extrasTotal + helmetTotal)}
                          </span>
                        </div>
                      </div>
                    )}
                    {totalTab >= 0 && (() => {
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
                                  dayLine(sched!)
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
                  {copied === "text" ? (
                    <b className="text-ink-900">✓ 견적 내용이 복사됐어요 · 카톡 채팅창에 붙여넣기만 하세요</b>
                  ) : (
                    "저장한 사진(또는 화면 캡처)을 카톡 「지노스키」로 보내주시면 바로 확인해 드려요"
                  )}
                </p>

                <div className="mt-5 rounded-2xl bg-ice-200/70 p-4">
                  {status === "sent" ? (
                    <div className="text-center">
                      <p className="text-[15px] font-bold text-ink-900">✓ 접수됐어요! 강사 일정을 확인해서 {phone}로 연락드릴게요.</p>
                      {pw.trim().length >= 4 && (
                        <a href={`/${qloc}/quote/my/`} className="mt-2 inline-block text-[13.5px] font-semibold text-brand-600 underline underline-offset-2">
                          답변은 「내 견적 확인」에서 휴대폰 번호 + 비밀번호로 볼 수 있어요 →
                        </a>
                      )}
                      {typeof window !== "undefined" && shareUrl() !== sentLink ? (
                        <button
                          type="button"
                          onClick={send}
                          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 text-[15px] font-semibold text-white"
                        >
                          <Send size={16} /> 수정한 견적 다시 보내기
                        </button>
                      ) : (
                        <p className="mt-1.5 text-[12.5px] text-snow-500">
                          일정·인원·리프트를 바꾸면 여기서 수정한 견적을 바로 다시 보낼 수 있어요
                        </p>
                      )}
                    </div>
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
                          placeholder="휴대폰 번호"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-12 rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                        />
                      </div>
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="new-password"
                        placeholder="비밀번호 4자리 이상 · 답변 확인용 (선택)"
                        value={pw}
                        onChange={(e) => setPw(e.target.value.slice(0, 20))}
                        className="mt-2 h-12 w-full rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                      />
                      <p className="mt-1 text-[12px] text-snow-500">
                        비밀번호를 정해두면 「내 견적 확인」에서 견적서와 지노스키 답변을 다시 볼 수 있어요
                      </p>
                      <p className="mt-3 text-[13.5px] font-bold text-ink-900">
                        특이사항 · 강사 배정 희망 <span className="font-normal text-snow-500">(선택)</span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {TEACHER_PREFS.map((t, i) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTeacherPref(i)}
                            aria-pressed={teacherPref === i}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[13px] font-semibold",
                              teacherPref === i ? "border-brand-500 bg-brand-500 text-white" : "border-snow-300/70 bg-white text-ink-700"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {teacherPref === 3 && (
                        <p className="mt-1.5 text-[12px] text-snow-500">반이 2개 이상일 때 여자·남자 선생님을 섞어서 배정해 드려요</p>
                      )}
                      <input
                        placeholder="요청사항 (선택) · 아이 나이, 실력 등"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500"
                      />
                      <div data-notr className="mt-2">
                        <ConsentBox locale={qloc} agree={consent} onAgree={setConsent} marketing={marketing} onMarketing={setMarketing} />
                      </div>
                      <button
                        type="button"
                        onClick={send}
                        disabled={!canSend || status === "sending"}
                        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 text-[15px] font-semibold text-white disabled:opacity-40"
                      >
                        <Send size={16} /> {status === "sending" ? "보내는 중..." : "견적 문의 보내기"}
                      </button>
                      {!canSend && status !== "sending" && (
                        <p className="mt-1.5 text-center text-[12px] text-snow-500">
                          {!(name.trim() && phone.trim()) ? "이름과 휴대폰 번호를 넣으면 보낼 수 있어요" : phone.replace(/[^0-9]/g, "").length < 9 ? "휴대폰 번호를 확인해 주세요 (숫자 9자리 이상)" : "개인정보 수집·이용 동의(필수)에 체크해 주세요"}
                        </p>
                      )}
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
          {/* 다음 버튼이 안 눌리는 이유 안내 */}
          {step < 6 && !canNext(step) && (
            <p className="mt-2 text-center text-[12.5px] font-semibold text-rose-500">
              {step === 2 ? "배울 사람 수를 넣어주세요" : step === 3 ? "날짜마다 수업 1번 또는 2번을 골라주세요" : "반 나누는 방법을 골라주세요"}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

/** 주중(파랑) / 주말·공휴일(빨강) 요금 표시 — 금요일은 주중, 토·일은 주말 요금 */
function RateBadge({ weekend, holiday, dateless }: { weekend: boolean; holiday?: boolean; dateless?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-2 py-0.5 align-middle text-[11px] font-bold",
        weekend ? "bg-rose-500 text-white" : "bg-sky-500 text-white"
      )}
    >
      {dateless ? "주말 요금(날짜 미정)" : holiday ? "공휴일·주말 요금" : weekend ? "주말 요금" : "주중 요금"}
    </span>
  );
}

const PARTS = [
  { key: "am", label: "☀️ 오전" },
  { key: "pm", label: "🌤 오후" },
  { key: "night", label: "🌃 야간" },
] as const;
const partOf = (time: string) => {
  const h = Number(time.slice(0, 2));
  return h < 13 ? "am" : h < 19 ? "pm" : "night";
};
/** 2단계(인원) 아래 안내: 강습료 가격대 · 패찰 · 시간표 · 저녁 정설 */
/** 140000 → 14만, 125000 → 12.5만 */
const man = (n: number) => `${Number((n / 10000).toFixed(1))}만`;
function PriceGuide({ prices, people, rec: recIn }: { prices: { table: Record<Len, number[]>; pass: Record<Len, number> }; people: number; rec?: number[] }) {
  const lens = BASE_LENS;
  const hasFC = prices.table.fc.length > 0;
  const sizes = Math.max(...lens.map((l) => prices.table[l].length));
  // 인원에 맞는 추천 반 나누기: 4명 → 1:2+1:2, 5명 → 1:3+1:2 …
  const rec = recIn ?? (people > 0 ? even(people, Math.ceil(people / 3)) : []);
  const hotSet = new Set(rec);
  const TEAM_KO = ["", "한", "두", "세", "네", "다섯"];
  const eb = isEarlyBirdActive();
  return (
    <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-snow-100/60 p-4 ring-1 ring-snow-300/60">
      <div>
        {people > 0 && (
          <div className="mb-3 rounded-xl bg-brand-50 p-3 ring-1 ring-brand-200">
            <p className="text-[13.5px] font-bold text-ink-900">
              👥 {people}명이면 {rec.length > 1 ? `강사 ${rec.length}명 · ${TEAM_KO[rec.length] ?? rec.length} 팀으로 나눠요` : "강사 1명이 가르쳐요"}
            </p>
            <p className="mt-0.5 text-[17px] font-bold text-brand-600">{rec.map((n) => `1:${n}`).join(" + ")}</p>
            <ul className="mt-1.5 flex flex-col gap-0.5 text-[12.5px] text-ink-700">
              {lens.map((l) => {
                const total = rec.reduce((a, n) => a + (prices.table[l][n - 1] ?? 0), 0);
                return (
                  <li key={l} className="flex justify-between gap-2">
                    <span>{LEN_LABEL[l]} 1회</span>
                    <span className="tabular-nums">
                      <b>{man(total)}원</b> <span className="text-snow-500">· 1인 약 {man(Math.round(total / people / 1000) * 1000)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-1.5 text-[11.5px] text-snow-500">강습료만 표시 · 패찰은 견적에 자동 포함 · 다음 단계에서 다른 방법으로도 나눌 수 있어요</p>
          </div>
        )}
        <p className="text-[14.5px] font-bold text-ink-900">💰 강습료 (1회 · 강사 1명 기준)</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-center text-[12.5px] tabular-nums">
            <thead>
              <tr className="text-snow-500">
                <th className="py-1 text-left font-semibold">인원</th>
                {lens.map((l) => (
                  <th key={l} className="py-1 font-semibold">{LEN_LABEL[l]}</th>
                ))}
                {hasFC && (
                  <th className="rounded-t-lg bg-rose-50 py-1 font-semibold text-rose-600">
                    7시간
                    <span className="block text-[10.5px] font-bold">풀케어 강추</span>
                    <span className="block text-[10px] font-semibold text-rose-500">패찰·점심 포함</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: sizes }, (_, i) => i + 1).map((n) => (
                <tr key={n} className={cn("border-t border-snow-300/60", hotSet.has(n) && "bg-brand-50 font-semibold")}>
                  <td className="py-1.5 text-left font-bold text-ink-900">1:{n}</td>
                  {lens.map((l) => {
                    const v = prices.table[l][n - 1];
                    return (
                      <td key={l} className="py-1.5 text-ink-900">
                        {v ? `${man(v)}원` : "-"}
                        {v && n > 1 ? <span className="block text-[11px] font-normal text-snow-500">1인 {man(Math.round(v / n / 1000) * 1000)}</span> : null}
                      </td>
                    );
                  })}
                  {hasFC && (() => {
                    const v = (prices.table.fc[n - 1] ?? 0) * 2;
                    return (
                      <td className="bg-rose-50 py-1.5 font-semibold text-rose-700">
                        {v ? `${man(v)}원` : "-"}
                        {v && n > 1 ? <span className="block text-[11px] font-normal text-rose-400">1인 {man(Math.round(v / n / 1000) * 1000)}</span> : null}
                      </td>
                    );
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-snow-600">
          + 패찰(강습 허가권) 1인 {lens.map((l) => `${LEN_LABEL[l]} ${won(prices.pass[l])}`).join(" · ")} — 견적에 자동으로 포함돼요 · 7시간 풀케어(원데이·나이트)는 식사·사진·영상·패찰 포함
          {eb && <span className="block font-semibold text-brand-600">얼리버드: 2·3시간 강습료·풀케어 {Math.round(EARLY_BIRD.rate * 100)}% 할인 적용 중</span>}
        </p>
      </div>
      <div className="border-t border-snow-300/60 pt-3">
        <p className="text-[14.5px] font-bold text-ink-900">🕘 수업 시간표</p>
        <div className="mt-2 flex flex-col gap-2">
          {PARTS.map((part) => (
            <div key={part.key}>
              {part.key === "night" && (
                <p className="mb-2 rounded-xl bg-white px-3 py-2 text-[12.5px] text-ink-700 ring-1 ring-snow-300/60">
                  🌙 <b>저녁 정설</b> {TIMES["2h"][3]?.time.slice(-5)}~{TIMES["2h"][4]?.time.slice(0, 5)} · 슬로프를 정비하는 시간이라 수업이 없어요. 야간 강습은 정설이 끝난 뒤 시작해요.
                </p>
              )}
              <div className="rounded-xl bg-white p-3 ring-1 ring-snow-300/60">
                <p className="text-[13.5px] font-bold text-ink-900">{part.label}</p>
                <ul className="mt-1 flex flex-col gap-0.5 text-[12.5px] text-ink-700">
                  {lens.map((l) => {
                    const ts = TIMES[l].filter((t) => partOf(t.time) === part.key);
                    return ts.length ? (
                      <li key={l} className="flex gap-2">
                        <span className="w-11 shrink-0 font-semibold text-snow-500">{LEN_LABEL[l]}</span>
                        <span>{ts.map((t) => (l === "2h" ? `${t.label} ${t.time}` : t.time)).join(" · ")}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 비발디파크 매표소 리프트/렌탈 요금 안내판 사진 — 40% 할인 기준 정가를 손님이 직접 확인 */
function PriceBoard() {
  return (
    <figure className="overflow-hidden rounded-2xl ring-1 ring-snow-300/60">
      <a href="/images/vivaldi-lift-rental-price.jpg" target="_blank" rel="noreferrer" title="크게 보기">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/vivaldi-lift-rental-price.jpg"
          alt="비발디파크 매표소 리프트·렌탈 요금표 — 리프트 3·5·7시간, 렌탈 4·6·8시간, 주중·주말공휴일, 대인·소인 요금"
          width={1200}
          height={412}
          loading="lazy"
          className="block h-auto w-full"
        />
      </a>
      <figcaption className="bg-snow-100 px-3 py-2 text-[12px] leading-relaxed text-snow-600">
        📷 비발디파크 매표소 요금 안내판 (현장 사진) · 이 정가에서 <b className="text-[#03803D]">40% 할인</b>해 계산해요 · 누르면 크게 보여요
      </figcaption>
      <DiscountTable />
    </figure>
  );
}

/** 지노스키 손님 40% 할인가 표 (리프트만 / 리프트+장비 · 주중·주말 · 대인·소인) */
function DiscountTable() {
  const [mode, setMode] = useState<"lift" | "rental">("rental");
  const hours: TicketHours[] = [3, 5, 7];
  const RH: Record<TicketHours, number> = { 3: 4, 5: 6, 7: 8 };
  const sale = (h: TicketHours, who: "adult" | "child", w: 0 | 1) =>
    roundUp100((LIFT_PRICES[h][who][w] + (mode === "rental" ? RENTAL_PRICES[h][who][w] : 0)) * (1 - LIFT_RENTAL_DISCOUNT));
  const regular = (h: TicketHours, who: "adult" | "child", w: 0 | 1) =>
    LIFT_PRICES[h][who][w] + (mode === "rental" ? RENTAL_PRICES[h][who][w] : 0);
  const rows: { label: string; who: "adult" | "child"; w: 0 | 1 }[] = [
    { label: "주중 대인", who: "adult", w: 0 },
    { label: "주중 소인", who: "child", w: 0 },
    { label: "주말 대인", who: "adult", w: 1 },
    { label: "주말 소인", who: "child", w: 1 },
  ];
  return (
    <div className="border-t border-snow-300/60 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="whitespace-nowrap text-[14px] font-bold text-[#03803D]">40% 할인가</p>
        <div className="flex rounded-full bg-snow-100 p-0.5">
          {(["rental", "lift"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold",
                mode === m ? "bg-[#03C75A] text-white" : "text-snow-600"
              )}
            >
              {m === "rental" ? "리프트+장비" : "리프트만"}
            </button>
          ))}
        </div>
      </div>
      <table className="mt-2 w-full table-fixed border-collapse text-center text-[12.5px]">
        <thead>
          <tr className="bg-[#0E1A33] text-white">
            <th className="w-[26%] py-1.5 font-semibold">1인 1일</th>
            {hours.map((h) => (
              <th key={h} className="py-1.5 font-semibold">
                {h}시간
                {mode === "rental" && <span className="block text-[10.5px] font-normal text-white/70">장비 {RH[h]}시간</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className={cn(i % 2 ? "bg-snow-100/60" : "bg-white", i === 2 && "border-t-2 border-snow-300")}>
              <td className={cn("py-1.5 font-semibold", r.w ? "text-rose-600" : "text-sky-700")}>{r.label}</td>
              {hours.map((h) => (
                <td key={h} className="py-1.5 tabular-nums">
                  <span className="block text-[10.5px] text-snow-400 line-through">{regular(h, r.who, r.w).toLocaleString("ko-KR")}</span>
                  <b className="text-ink-900">{sale(h, r.who, r.w).toLocaleString("ko-KR")}</b>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1.5 text-[11px] leading-relaxed text-snow-500">
        단위 원 · 주말에는 공휴일 포함 · 헬멧·의류는 할인 제외
        <br />
        <b className="text-ink-700">소인</b> 13세 이하(초등학생, 한국 나이 · 3월 중학교 입학 예정자 포함) · <b className="text-ink-700">대인</b> 14세 이상
      </p>
    </div>
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

/** 2+2+1 / 인원이 많으면 3명×4 + 2명 */
function splitText(sp: number[]) {
  if (sp.length <= 4) return sp.join("+");
  return [3, 2, 1]
    .map((n) => ({ n, c: sp.filter((x) => x === n).length }))
    .filter((x) => x.c)
    .map((x) => (x.c > 1 ? `${x.n}명×${x.c}` : `${x.n}명`))
    .join(" + ");
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
      <span className="min-w-0">
        <span className={cn("block text-[17px] font-bold", on ? "text-brand-600" : "text-ink-900")}>
          {on && "✓ "}
          {title} <span className="tabular-nums">{splitText(sp)}</span>
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
          const red = wk === 0 || HOLIDAYS.includes(dateKey(d));
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
                  !past && !isStart && !isEnd && (red ? "font-bold text-rose-500" : wk === 6 ? "text-brand-600" : "text-ink-800"),
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
      <p className="mt-2 text-center text-[12px] text-snow-500">
        <span className="font-semibold text-rose-500">빨간 날(일·공휴일)</span>과 <span className="font-semibold text-brand-600">토요일</span>은 리프트·장비 주말 요금이에요
      </p>
      <p className="mt-1 text-center text-[12.5px] text-snow-500">
        {picking ? "마지막 날을 눌러주세요 (당일이면 같은 날을 한 번 더)" : "첫날을 누르고, 마지막 날을 누르면 기간이 정해져요"}
      </p>
    </div>
  );
}
