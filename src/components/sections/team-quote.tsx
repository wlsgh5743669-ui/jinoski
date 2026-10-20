"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, ImageDown, Link2, MessageCircle, Minus, Plus, Send, Trash2, UserPlus } from "lucide-react";
import { renderQuoteImage } from "@/lib/quote-image";
import { Container } from "@/components/shared/container";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { EARLY_BIRD, isEarlyBirdActive } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import {
  CHILD_LABEL,
  HELMET_NOTE,
  LIFT_PRICES,
  LIFT_RENTAL_DISCOUNT,
  RENTAL_PRICES,
  type TicketHours,
} from "@/config/lift-rental";

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

type Len = "2h" | "3h" | "4h";
type Sport = "ski" | "board" | "mix";
type Extra = "none" | "lift" | "liftRental";
type Member = { child: boolean; extra: Extra; name?: string };
type Team = { name: string; sport: Sport; ticket: TicketHours; members: Member[] };
const makeMembers = (n: number, extra: Extra = "none", child = false): Member[] =>
  Array.from({ length: n }, () => ({ child, extra }));
const EXTRA_CODE: Record<Extra, string> = { none: "n", lift: "l", liftRental: "r" };
const CODE_EXTRA: Record<string, Extra> = { n: "none", l: "lift", r: "liftRental" };

const EXTRAS: { value: Extra; label: string }[] = [
  { value: "none", label: "강습만" },
  { value: "lift", label: "+ 리프트" },
  { value: "liftRental", label: "+ 리프트·장비" },
];
const TICKETS: TicketHours[] = [3, 5, 7];
/** 수업 시간·하루 횟수에 맞는 리프트 시간권 추천 */
function suggestTicket(len: "2h" | "3h" | "4h", perDay: number): TicketHours {
  if (perDay >= 2) return 7;
  return len === "2h" ? 3 : 5;
}
const roundUp100 = (n: number) => Math.ceil(n / 100) * 100;
function isWeekend(start: string, offset: number) {
  if (!start) return true; // 날짜 모르면 주말 요금으로 넉넉하게
  const t = new Date(`${start}T00:00:00`);
  t.setDate(t.getDate() + offset);
  return t.getDay() === 0 || t.getDay() === 6;
}

const LENS: { value: Len; label: string }[] = [
  { value: "2h", label: "2시간" },
  { value: "3h", label: "3시간" },
  { value: "4h", label: "4시간" },
];
const SPORTS: { value: Sport; label: string }[] = [
  { value: "ski", label: "스키" },
  { value: "board", label: "보드" },
  { value: "mix", label: "섞여요" },
];
const DEFAULT_SLOTS: Record<Len, number[]> = { "2h": [0, 2], "3h": [0, 1], "4h": [0] };
const MAX_TEAMS = 8;
const MAX_PEOPLE = 15;
const MAX_DAYS = 10;

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const num = (s: string | undefined) => Number((s ?? "").replace(/[^0-9]/g, "")) || 0;

/** 한 강사당 최대 3명 — 4명 이상은 비슷한 인원으로 반을 나눠요 (4→2+2, 5→3+2, 7→3+2+2) */
function splitGroups(people: number): number[] {
  if (people <= 0) return [];
  const groups = Math.ceil(people / 3);
  const base = Math.floor(people / groups);
  const extra = people % groups;
  return Array.from({ length: groups }, (_, i) => base + (i < extra ? 1 : 0));
}

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
function addDays(date: string, d: number) {
  const t = new Date(`${date}T00:00:00`);
  t.setDate(t.getDate() + d);
  return `${t.getMonth() + 1}/${t.getDate()}(${WEEK[t.getDay()]})`;
}

export function TeamQuote() {
  const content = useContent();
  const { contact } = content;

  const slotTable: Record<Len, { label: string; time: string }[]> = {
    "2h": [
      { label: "오전 1", time: "09:00~11:00" },
      { label: "오전 2", time: "11:00~13:00" },
      { label: "오후 1", time: "13:20~15:20" },
      { label: "오후 2", time: "15:30~17:30" },
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

  const prices = useMemo(() => {
    const table: Record<Len, number[]> = { "2h": [], "3h": [], "4h": [] };
    for (const g of content.lessonPricing) {
      if (g.program in table) table[g.program as Len] = g.rows.map((r) => num(r.price));
    }
    const pass: Record<Len, number> = { "2h": 0, "3h": 0, "4h": 0 };
    for (const p of content.liftPassPricing) if (p.program in pass) pass[p.program as Len] = num(p.price);
    return { table, pass };
  }, [content]);

  const [days, setDays] = useState(1);
  const [len, setLen] = useState<Len>("2h");
  // 처음엔 타임을 비워 두고 0원에서 시작 (손님이 직접 골라야 금액이 올라가요)
  const [slots, setSlots] = useState<number[]>([]);
  const [edge, setEdge] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    { name: "가족 1", sport: "ski", ticket: 3, members: makeMembers(1) },
  ]);
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [copied, setCopied] = useState<"" | "text" | "link">("");
  const [imgState, setImgState] = useState<"" | "making" | "done">("");
  const [showTotal, setShowTotal] = useState(false);

  // 링크로 받은 견적 불러오기 (?d=3&l=2h&s=0.2&e=1&t=가족1_3_ski~가족2_3_board&sd=2026-12-20)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    const d = Number(q.get("d"));
    if (d >= 1 && d <= MAX_DAYS) setDays(d);
    const l = q.get("l") as Len | null;
    if (l && l in DEFAULT_SLOTS) setLen(l);
    const s = q.get("s");
    if (s) setSlots(s.split(".").map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < 5));
    if (q.get("e") === "1") setEdge(true);
    const sd = q.get("sd");
    if (sd && /^\d{4}-\d{2}-\d{2}$/.test(sd)) setStartDate(sd);
    const t = q.get("t");
    if (t) {
      const parsed = t
        .split("~")
        .map((x) => x.split("_"))
        .filter((p) => p.length >= 3)
        .map((parts): Team => {
          const [n, a, b, c, d, e] = parts;
          const name = n.slice(0, 12);
          const sport = (x: string) => (["ski", "board", "mix"].includes(x) ? x : "ski") as Sport;
          const ticket = (x: string) => ([3, 5, 7].includes(Number(x)) ? Number(x) : 7) as TicketHours;
          // 새 형식: 이름_종목_시간권_멤버코드(an.cl.ar)
          if (/^[a-z]+$/.test(a) && d === undefined && c && /^[ac][nlr]/.test(c)) {
            const members = c
              .split(".")
              .slice(0, MAX_PEOPLE)
              .map((m) => ({ child: m[0] === "c", extra: CODE_EXTRA[m[1]] ?? "none", name: m.slice(3, 15) || undefined }));
            return { name, sport: sport(a), ticket: ticket(b), members: members.length ? members : makeMembers(1) };
          }
          // 예전 형식: 이름_인원_종목_옵션_시간권_어린이수
          const people = Math.min(MAX_PEOPLE, Math.max(1, Number(a) || 1));
          const extra = (["none", "lift", "liftRental"].includes(c) ? c : "none") as Extra;
          const kids = Math.min(people, Math.max(0, Number(e) || 0));
          return {
            name,
            sport: sport(b),
            ticket: ticket(d),
            members: Array.from({ length: people }, (_, k) => ({ child: k < kids, extra })),
          };
        })
        .slice(0, MAX_TEAMS);
      if (parsed.length) setTeams(parsed);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const slotList = slotTable[len];
  const chosen = slots.filter((i) => i < slotList.length).sort((a, b) => a - b);
  const perDay = chosen.length;

  // 일자별 시간표 (도착일은 마지막 타임, 출발일은 첫 타임만)
  const schedule = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      let idx = chosen;
      let tag = "";
      if (edge && days >= 2 && perDay > 1) {
        if (i === 0) {
          idx = chosen.slice(-1);
          tag = "도착일";
        } else if (i === days - 1) {
          idx = chosen.slice(0, 1);
          tag = "출발일";
        }
      }
      return { day: i + 1, tag, slots: idx.map((j) => slotList[j]) };
    });
  }, [days, chosen, edge, perDay, slotList]);
  const sessions = schedule.reduce((a, d) => a + d.slots.length, 0);

  const eb = isEarlyBirdActive() && EARLY_BIRD.programs.includes(len);

  // 날짜별 평일/주말 요금으로 1인 리프트(·장비) 정가 → 40% 할인
  const extraFor = (ticket: TicketHours, m: Member) => {
    if (m.extra === "none") return { regular: 0, sale: 0 };
    let regular = 0;
    for (let d = 0; d < days; d++) {
      const w = isWeekend(startDate, d) ? 1 : 0;
      const who = m.child ? "child" : "adult";
      regular += LIFT_PRICES[ticket][who][w];
      if (m.extra === "liftRental") regular += RENTAL_PRICES[ticket][who][w];
    }
    return { regular, sale: roundUp100(regular * (1 - LIFT_RENTAL_DISCOUNT)) };
  };

  const rows = teams.map((t) => {
    const people = t.members.length;
    const groups = splitGroups(people);
    const lesson = groups.reduce((a, g) => a + (prices.table[len][g - 1] ?? 0), 0);
    const discount = eb ? Math.round((lesson * EARLY_BIRD.rate) / 1000) * 1000 : 0;
    const pass = prices.pass[len] * people;
    const perSession = lesson - discount + pass;
    const lessonTotal = perSession * sessions;
    // 강습료는 인원수로 똑같이 나누기 (N/1)
    const lessonPP = people ? Math.round(lessonTotal / people / 100) * 100 : 0;
    // 같은 조건(어른/어린이 × 강습만/리프트/리프트+장비)끼리 묶기
    const kindMap = new Map<string, { child: boolean; extra: Extra; count: number; regular: number; sale: number }>();
    for (const m of t.members) {
      const key = `${m.child ? "c" : "a"}${m.extra}`;
      const cur = kindMap.get(key);
      if (cur) cur.count += 1;
      else kindMap.set(key, { child: m.child, extra: m.extra, count: 1, ...extraFor(t.ticket, m) });
    }
    const kinds = [...kindMap.values()].sort(
      (x, y) => ["none", "lift", "liftRental"].indexOf(x.extra) - ["none", "lift", "liftRental"].indexOf(y.extra) || Number(x.child) - Number(y.child)
    );
    const extraTotal = kinds.reduce((a, k) => a + k.sale * k.count, 0);
    const extraRegular = kinds.reduce((a, k) => a + k.regular * k.count, 0);
    // 사람별 (N/1): 이름 없으면 「손님 1, 손님 2…」
    const persons = t.members.map((m, k) => {
      const ex = extraFor(t.ticket, m);
      return { label: m.name?.trim() || `손님 ${k + 1}`, ...m, sale: ex.sale, pay: lessonPP + ex.sale };
    });
    return { ...t, people, groups, perSession, lessonTotal, lessonPP, kinds, persons, extraTotal, extraRegular, total: lessonPP * people + extraTotal };
  });
  const anyExtra = teams.some((t) => t.members.some((m) => m.extra !== "none"));
  const extraName = (e: Extra, ticket: TicketHours) =>
    e === "lift" ? `리프트 ${ticket}시간권` : e === "liftRental" ? `리프트 ${ticket}시간권+장비` : "강습만";
  const kindName = (k: { child: boolean; extra: Extra }) =>
    `${k.child ? "어린이" : "어른"} · ${k.extra === "none" ? "강습만" : k.extra === "lift" ? "강습+리프트" : "강습+리프트·장비"}`;
  const totalPeople = rows.reduce((a, r) => a + r.people, 0);
  const grand = rows.reduce((a, r) => a + r.total, 0);
  const lessonAll = rows.reduce((a, r) => a + r.lessonPP * r.people, 0);
  // 큰 총액 대신 「1인 1회 강습료」를 크게 (부담 줄이기) — 토탈은 버튼으로
  const perHeadAll = totalPeople && sessions ? Math.round(lessonAll / totalPeople / sessions / 1000) * 1000 : 0;
  const instructorsAtOnce = rows.reduce((a, r) => a + r.groups.length, 0);
  const lenLabel = LENS.find((l) => l.value === len)!.label;
  const trip = days === 1 ? "당일" : `${days - 1}박 ${days}일`;

  function setTeam(i: number, patch: Partial<Team>) {
    setTeams((ts) => ts.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  }
  function changeLen(l: Len) {
    setLen(l);
    setSlots([]);
    setTeams((ts) => ts.map((t) => ({ ...t, ticket: suggestTicket(l, 1) })));
  }
  function toggleSlotAndTicket(i: number) {
    const next = slots.includes(i) ? slots.filter((x) => x !== i) : [...slots, i];
    setSlots(next);
    setTeams((ts) => ts.map((t) => ({ ...t, ticket: suggestTicket(len, next.length) })));
  }

  const summary = [
    `[지노스키 팀 견적] ${trip} · ${lenLabel} 수업 · 하루 ${perDay}회`,
    startDate ? `첫날: ${addDays(startDate, 0)}` : "",
    `총 ${teams.length}팀 ${totalPeople}명 · 수업 ${sessions}회`,
    "",
    "■ 시간표",
    ...schedule.map(
      (d) =>
        `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}${d.tag ? ` (${d.tag})` : ""}: ${
          d.slots.map((s) => s.time).join(" · ") || "수업 없음"
        }`
    ),
    "",
    "■ 팀별 비용 (1인 부담)",
    ...rows.flatMap((r) => [
      `${r.name} ${r.people}명(${SPORTS.find((x) => x.value === r.sport)!.label}) · 강사 ${r.groups.length}명(${r.groups.join("+")})`,
      `  강습료 1인 ${won(r.lessonPP)} (1회 ${won(Math.round(r.lessonPP / Math.max(sessions, 1) / 100) * 100)} × ${sessions}회)`,
      ...r.kinds
        .filter((k) => k.extra !== "none")
        .map((k) => `  + ${extraName(k.extra, r.ticket)} ${k.child ? "어린이" : "어른"} ${k.count}명 · 1인 ${won(k.sale)} (${days}일, 40% 할인)`),
      ...r.persons.map((x) => `  → ${x.label} (${kindName(x)}): ${won(x.pay)}`),
      `  팀 합계 ${won(r.total)}`,
    ]),
    "",
    `예상 합계: ${won(grand)}${eb ? " (얼리버드 레슨료 10% 할인 반영)" : ""}`,
    anyExtra
      ? "※ 패찰 포함 · 리프트·장비는 정가 대비 40% 할인 (헬멧·의류 렌탈은 할인 제외·별도) · 강사 일정 확인 후 확정"
      : "※ 강습 허가권(패찰) 포함 · 리프트권·장비 렌탈 별도 · 강사 일정 확인 후 확정",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  function shareUrl() {
    const q = new URLSearchParams({
      d: String(days),
      l: len,
      s: chosen.join("."),
      t: teams
        .map(
          (t) =>
            `${t.name.replace(/[_~.]/g, " ")}_${t.sport}_${t.ticket}_${t.members
              .map((m) => `${m.child ? "c" : "a"}${EXTRA_CODE[m.extra]}${m.name?.trim() ? `:${m.name.trim().replace(/[_~.:]/g, "")}` : ""}`)
              .join(".")}`
        )
        .join("~"),
    });
    if (edge) q.set("e", "1");
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
      // clipboard unavailable — summary text stays selectable
    }
  }

  // 견적을 이미지(PNG)로 만들어 저장 — 휴대폰은 공유창(사진 저장·카톡 전송), PC는 다운로드
  async function saveImage() {
    setImgState("making");
    trackEvent("quote_image", { teams: teams.length, people: totalPeople });
    try {
      const blob = await renderQuoteImage({
        title: `${trip} · ${lenLabel} · 하루 ${perDay}회 · 수업 ${sessions}회`,
        total: `총 ${won(grand)}`,
        totalSub: `${teams.length}팀 ${totalPeople}명 · 수업 ${sessions}회 · 1인 1회 강습료 약 ${won(perHeadAll)}${eb ? " · 얼리버드 10% 반영" : ""}`,
        schedule: schedule.map((d) => ({
          left: `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}${d.tag ? ` ${d.tag}` : ""}`,
          right: d.slots.map((x) => x.time).join("  ·  ") || "-",
        })),
        teams: rows.map((r) => ({
          name: `${r.name} · ${r.people}명 (${SPORTS.find((x) => x.value === r.sport)!.label})`,
          amount: won(r.total),
          lines: [
            `강습료 1인 ${won(r.lessonPP)} (1회 × ${sessions}회) · 강사 ${r.groups.length}명(${r.groups.map((x) => `1:${x}`).join("+")})`,
            ...r.kinds
              .filter((k) => k.extra !== "none")
              .map((k) => `+ ${extraName(k.extra, r.ticket)} ${k.child ? "어린이" : "어른"} ${k.count}명 · 1인 ${won(k.sale)} (40% 할인)`),
            ...r.persons.map((x) => `→ ${x.label} (${kindName(x)}) · ${won(x.pay)}`),
          ],
        })),
        notes: [
          "강습 허가권(패찰) 포함 · 매 수업 사진·영상 무료",
          anyExtra ? `리프트·장비 40% 할인 · ${HELMET_NOTE} · 공휴일은 주말 요금` : "리프트권·장비·의류 렌탈 별도",
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
          // 공유창 닫음 — 무시
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

  async function send() {
    if (!name.trim() || phone.replace(/[^0-9]/g, "").length < 9 || perDay === 0) return;
    setStatus("sending");
    trackEvent("quote_submit", { teams: teams.length, people: totalPeople, days });
    try {
      const teamLine = rows
        .map((r) => {
          const ex = r.kinds
            .filter((k) => k.extra !== "none")
            .map((k) => `${k.extra === "lift" ? "리프트" : "리프트장비"}${k.child ? "아" : "어"}${k.count}`)
            .join(" ");
          const names = r.persons.filter((x) => x.name?.trim()).map((x) => x.label).join("·");
          return `${r.name} ${r.people}명(${r.groups.join("+")})${ex ? ` ${r.ticket}h ${ex}` : ""}${names ? ` [${names}]` : ""}`;
        })
        .join(", ");
      const res = await fetch(KAKAO_NOTIFY_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date: startDate || "날짜 미정",
          program: `팀 견적 ${trip} · ${lenLabel} · 하루 ${perDay}회`,
          timeSlot: chosen.map((i) => slotList[i].time).join(" · "),
          groupSize: `${teams.length}팀 ${totalPeople}명 · 강사 ${instructorsAtOnce}명`,
          equipment: [...new Set(teams.map((t) => SPORTS.find((s) => s.value === t.sport)!.label))].join("/"),
          level: "",
          total: `${won(grand)} (수업 ${sessions}회)`,
          note: [teamLine, edge ? "도착·출발일 1회" : "", note.trim()].filter(Boolean).join(" / "),
        }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  const canSend = name.trim().length > 0 && phone.replace(/[^0-9]/g, "").length >= 9 && perDay > 0;

  return (
    <section className="bg-ice-200 py-12 sm:py-16">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* 입력 */}
          <div className="flex flex-col gap-5">
            <Card title="1. 일정 — 달력에서 첫날·마지막 날을 눌러주세요">
              <RangeCalendar
                start={startDate}
                days={startDate ? days : 0}
                onChange={(sd, d) => {
                  setStartDate(sd);
                  setDays(d);
                }}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ice-200/70 px-4 py-3">
                <p className="text-[14.5px] font-bold text-ink-900">
                  {startDate
                    ? `${addDays(startDate, 0)}${days > 1 ? ` ~ ${addDays(startDate, days - 1)}` : ""} · ${trip}`
                    : `날짜 미정 · ${trip}`}
                </p>
                {startDate ? (
                  <button
                    type="button"
                    onClick={() => setStartDate("")}
                    className="text-[12.5px] font-semibold text-snow-500 underline underline-offset-2"
                  >
                    날짜 다시 고르기
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] text-snow-500">날짜 미정이면 일수만</span>
                    <Stepper value={days} min={1} max={MAX_DAYS} onChange={setDays} suffix="일" />
                  </div>
                )}
              </div>
            </Card>

            <Card title="2. 수업 시간 · 하루 몇 번?">
              <div className="flex gap-2">
                {LENS.map((l) => (
                  <Chip key={l.value} on={len === l.value} onClick={() => changeLen(l.value)}>
                    {l.label}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-[13px] font-semibold text-ink-900">
                원하는 타임을 고르세요 <span className="font-normal text-snow-500">· 고른 개수 = 하루 수업 횟수</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slotList.map((s, i) => (
                  <button
                    key={s.time}
                    type="button"
                    onClick={() => toggleSlotAndTicket(i)}
                    aria-pressed={chosen.includes(i)}
                    className={cn(
                      "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors",
                      chosen.includes(i)
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-snow-300/70 bg-white text-ink-800 hover:border-brand-300"
                    )}
                  >
                    <span className="text-[13.5px] font-bold">
                      {chosen.includes(i) && "✓ "}
                      {s.label}
                    </span>
                    <span className="text-[12.5px] text-snow-600">{s.time}</span>
                  </button>
                ))}
              </div>
              {days >= 2 && perDay > 1 && (
                <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13.5px] text-ink-800">
                  <input
                    type="checkbox"
                    checked={edge}
                    onChange={(e) => setEdge(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-brand-500"
                  />
                  <span>
                    도착하는 날·떠나는 날은 1회만 할게요
                    <span className="block text-[12px] text-snow-500">도착일은 마지막 타임, 출발일은 첫 타임으로 계산해요</span>
                  </span>
                </label>
              )}
            </Card>

            <Card title={`3. 팀 구성 (${teams.length}팀 · ${totalPeople}명)`}>
              <div className="flex flex-col gap-3">
                {teams.map((t, i) => {
                  const g = splitGroups(t.members.length);
                  const hasExtra = t.members.some((m) => m.extra !== "none");
                  return (
                    <div key={i} className="rounded-2xl border border-snow-300/60 bg-snow-100/40 p-4">
                      <div className="flex items-center gap-2">
                        <input
                          value={t.name}
                          onChange={(e) => setTeam(i, { name: e.target.value.slice(0, 12) })}
                          className="h-10 min-w-0 flex-1 rounded-xl border border-snow-300/70 bg-white px-3 text-[14.5px] font-semibold outline-none focus:border-brand-500"
                          aria-label="팀 이름"
                        />
                        {teams.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setTeams((ts) => ts.filter((_, j) => j !== i))}
                            aria-label={`${t.name} 삭제`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-snow-500 hover:bg-white hover:text-rose-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Field label="배울 사람">
                          <Stepper
                            value={t.members.length}
                            min={1}
                            max={MAX_PEOPLE}
                            onChange={(v) => {
                              const last = t.members[t.members.length - 1];
                              setTeam(i, {
                                members:
                                  v < t.members.length
                                    ? t.members.slice(0, v)
                                    : [...t.members, ...makeMembers(v - t.members.length, last?.extra ?? "none")],
                              });
                            }}
                            suffix="명"
                          />
                        </Field>
                        <Field label="종목">
                          <div className="flex gap-1.5">
                            {SPORTS.map((s) => (
                              <Chip key={s.value} small on={t.sport === s.value} onClick={() => setTeam(i, { sport: s.value })}>
                                {s.label}
                              </Chip>
                            ))}
                          </div>
                        </Field>
                      </div>
                      <div className="mt-3">
                        <p className="mb-1.5 text-[12.5px] font-semibold text-snow-600">
                          이름(선택)·어른/어린이·옵션을 사람마다 · 리프트·장비 <span className="font-bold text-[#03A94F]">40% 할인</span>
                        </p>
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11.5px] text-snow-500">한 번에:</span>
                          {EXTRAS.map((x) => (
                            <button
                              key={x.value}
                              type="button"
                              onClick={() => setTeam(i, { members: t.members.map((m) => ({ ...m, extra: x.value })) })}
                              className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-ink-700 ring-1 ring-snow-300/70 hover:ring-brand-400"
                            >
                              모두 {x.label.replace("+ ", "")}
                            </button>
                          ))}
                        </div>
                        <ul className="flex flex-col gap-1.5">
                          {t.members.map((m, k) => (
                            <li key={k} className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 ring-1 ring-snow-300/60">
                              <span className="w-8 text-[12.5px] font-bold text-snow-500">{k + 1}번</span>
                              <input
                                value={m.name ?? ""}
                                placeholder={`손님 ${k + 1}`}
                                onChange={(e) =>
                                  setTeam(i, {
                                    members: t.members.map((x, j) => (j === k ? { ...x, name: e.target.value.slice(0, 10) } : x)),
                                  })
                                }
                                aria-label={`${k + 1}번 이름`}
                                className="h-8 w-[88px] rounded-lg border border-snow-300/70 px-2 text-[13px] outline-none focus:border-brand-500"
                              />
                              <div className="flex rounded-full bg-snow-100 p-0.5">
                                {[false, true].map((c) => (
                                  <button
                                    key={String(c)}
                                    type="button"
                                    onClick={() =>
                                      setTeam(i, { members: t.members.map((x, j) => (j === k ? { ...x, child: c } : x)) })
                                    }
                                    className={cn(
                                      "rounded-full px-2.5 py-1 text-[12px] font-semibold",
                                      m.child === c ? "bg-ink-900 text-white" : "text-snow-600"
                                    )}
                                  >
                                    {c ? "어린이" : "어른"}
                                  </button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {EXTRAS.map((x) => (
                                  <button
                                    key={x.value}
                                    type="button"
                                    onClick={() =>
                                      setTeam(i, { members: t.members.map((y, j) => (j === k ? { ...y, extra: x.value } : y)) })
                                    }
                                    className={cn(
                                      "rounded-full border px-2.5 py-1 text-[12px] font-semibold",
                                      m.extra === x.value
                                        ? "border-brand-500 bg-brand-50 text-brand-600"
                                        : "border-snow-300/70 text-ink-700"
                                    )}
                                  >
                                    {x.label}
                                  </button>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                        {hasExtra && (
                          <div className="mt-2.5 rounded-xl bg-white p-3 ring-1 ring-snow-300/60">
                            <Field label="리프트 시간권 (하루)">
                              <div className="flex gap-1.5">
                                {TICKETS.map((h) => (
                                  <Chip key={h} small on={t.ticket === h} onClick={() => setTeam(i, { ticket: h })}>
                                    {h}시간
                                  </Chip>
                                ))}
                              </div>
                            </Field>
                            <p className="mt-2 text-[11.5px] leading-relaxed text-snow-500">
                              하루 {perDay}회 수업이면 {suggestTicket(len, perDay)}시간권을 추천해요 · 어린이는 {CHILD_LABEL} 기준 · {HELMET_NOTE}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="mt-2.5 text-[12.5px] text-snow-600">
                        {g.length === 1
                          ? `강사 1명 · 1:${t.members.length} 수업`
                          : `강사 ${g.length}명으로 나눠요 (${g.map((x) => `1:${x}`).join(" + ")}) · 강사 1명당 최대 3명`}
                      </p>
                    </div>
                  );
                })}
              </div>
              {teams.length < MAX_TEAMS && (
                <button
                  type="button"
                  onClick={() =>
                    setTeams((ts) => [
                      ...ts,
                      { name: `가족 ${ts.length + 1}`, sport: "ski", ticket: suggestTicket(len, perDay), members: makeMembers(2) },
                    ])
                  }
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-400 text-[14px] font-semibold text-brand-600 hover:bg-brand-50"
                >
                  <UserPlus size={16} /> 팀 추가
                </button>
              )}
            </Card>

            {/* 휴대폰: 입력 바로 아래에서 합계 확인 */}
            <a
              href="#quote-result"
              className="flex items-center justify-between rounded-2xl bg-ink-900 px-5 py-4 text-white lg:hidden"
            >
              <span className="text-[13px] text-white/70">
                1인 1회 강습료
                <span className="block text-[22px] font-bold tabular-nums text-brand-300">{sessions ? `약 ${won(perHeadAll)}` : "0원"}</span>
              </span>
              <span className="text-[13.5px] font-semibold">시간표·문의 ↓</span>
            </a>
          </div>

          {/* 결과 */}
          <div id="quote-result" className="flex scroll-mt-24 flex-col gap-4 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-ink-900 p-6 text-white">
              <p className="text-[12.5px] font-semibold text-white/50">예상 견적</p>
              <p className="mt-1 text-[15px] font-semibold text-white/80">
                {trip} · {lenLabel} · 하루 {perDay}회 · 수업 {sessions}회
              </p>
              <p className="mt-3 text-[13px] font-semibold text-white/60">1인 1회 강습료</p>
              <p className="text-[38px] font-bold leading-tight tabular-nums tracking-tight text-brand-300">
                {sessions ? `약 ${won(perHeadAll)}` : "0원"}
              </p>
              {!sessions && (
                <p className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-[12.5px] text-white/80">
                  👉 날짜와 수업 타임을 고르면 금액이 계산돼요
                </p>
              )}
              <p className="mt-1 text-[12.5px] text-white/50">
                패찰 포함{eb && " · 얼리버드 10% 반영"}
                {anyExtra && " · 리프트·장비는 사람마다 아래에 따로"}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[12.5px] font-semibold text-white/50">시간표</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px]">
                  {schedule.map((d) => (
                    <li key={d.day} className="flex justify-between gap-3">
                      <span className="shrink-0 text-white/70">
                        {d.day}일차{startDate && ` ${addDays(startDate, d.day - 1)}`}
                        {d.tag && <span className="ml-1 text-[11.5px] text-brand-300">{d.tag}</span>}
                      </span>
                      <span className="text-right tabular-nums">{d.slots.map((s) => s.time).join(" · ") || "-"}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[12.5px] font-semibold text-white/50">팀별 · 1인 부담 (N/1)</p>
                <ul className="mt-2 flex flex-col gap-4 text-[13.5px]">
                  {rows.map((r, i) => (
                    <li key={i}>
                      <div className="flex justify-between gap-3 font-semibold">
                        <span>
                          {r.name} · {r.people}명
                        </span>
                        <span className="text-[12px] font-medium text-white/50">
                          강사 {r.groups.length}명({r.groups.map((x) => `1:${x}`).join("+")})
                        </span>
                      </div>
                      <div className="mt-1.5 flex justify-between gap-3 text-[12.5px] text-white/70">
                        <span>강습료 (1회 × {sessions}회)</span>
                        <span className="tabular-nums">1인 {won(r.lessonPP)}</span>
                      </div>
                      {r.kinds
                        .filter((k) => k.extra !== "none")
                        .map((k) => (
                          <div key={`${k.child}${k.extra}`} className="flex justify-between gap-3 text-[12.5px] text-white/70">
                            <span>
                              + {extraName(k.extra, r.ticket)} · {k.child ? "어린이" : "어른"} {k.count}명
                            </span>
                            <span className="shrink-0 tabular-nums">
                              <span className="text-white/35 line-through">{won(k.regular)}</span>{" "}
                              <span className="font-semibold text-[#5BE38F]">1인 {won(k.sale)}</span>
                            </span>
                          </div>
                        ))}
                      <div className="mt-2 flex flex-col gap-1 rounded-xl bg-white/[0.06] px-3 py-2">
                        {r.persons.map((x, k) => (
                          <div key={k} className="flex justify-between gap-3 text-[12.5px]">
                            <span className="min-w-0 text-white/80">
                              <span className="font-semibold text-white">{x.label}</span>{" "}
                              <span className="text-white/50">{kindName(x)}</span>
                            </span>
                            <span className="shrink-0 font-bold tabular-nums text-brand-300">{won(x.pay)}</span>
                          </div>
                        ))}
                      </div>
                      {showTotal && (
                        <div className="mt-1.5 flex justify-between text-[12.5px] text-white/60">
                          <span>팀 합계</span>
                          <span className="font-semibold tabular-nums text-white">{won(r.total)}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {showTotal ? (
                  <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
                    <span className="text-[13px] text-white/60">
                      토탈 · {teams.length}팀 {totalPeople}명
                    </span>
                    <span className="text-[24px] font-bold tabular-nums text-white">{won(grand)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowTotal(true);
                      trackEvent("quote_total_view", { teams: teams.length });
                    }}
                    className="mt-4 h-11 w-full rounded-full border border-white/20 text-[13.5px] font-semibold text-white/90 hover:bg-white/10"
                  >
                    토탈 금액 보기
                  </button>
                )}
              </div>
              <p className="mt-5 text-[11.5px] leading-relaxed text-white/45">
                강습 허가권(패찰) 포함 ·{" "}
                {anyExtra
                  ? `리프트·장비는 정가 대비 40% 할인가예요${startDate ? " (날짜별 평일·주말 요금)" : " (날짜를 넣으면 평일 요금으로 다시 계산돼요)"} · ${HELMET_NOTE} · 공휴일은 주말 요금`
                  : "리프트권·장비·의류 렌탈은 별도예요"}
                . 같은 시간에 강사 {instructorsAtOnce}명이 필요해요 — 강사 일정 확인 후 확정 금액을 안내드려요.
              </p>
            </div>

            <button
              type="button"
              onClick={saveImage}
              disabled={imgState === "making" || perDay === 0}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink-900 text-[15px] font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
            >
              {imgState === "done" ? <Check size={18} /> : <ImageDown size={18} />}
              {imgState === "making" ? "이미지 만드는 중..." : imgState === "done" ? "저장 완료! 카톡으로 보내주세요" : "견적서 이미지로 저장"}
            </button>
            <p className="-mt-2 text-center text-[12px] text-snow-500">
              저장한 사진(또는 화면 캡처)을 카톡 「지노스키」로 보내주시면 바로 확인해 드려요
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => copy("text")}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-snow-300 bg-white text-[14px] font-semibold text-ink-900 hover:border-brand-500"
              >
                {copied === "text" ? <Check size={16} /> : <Copy size={16} />} {copied === "text" ? "복사됨" : "견적 복사"}
              </button>
              <button
                type="button"
                onClick={() => copy("link")}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-snow-300 bg-white text-[14px] font-semibold text-ink-900 hover:border-brand-500"
              >
                {copied === "link" ? <Check size={16} /> : <Link2 size={16} />} {copied === "link" ? "링크 복사됨" : "견적 링크 복사"}
              </button>
            </div>

            <div className="rounded-3xl bg-white p-5 ring-1 ring-snow-300/60">
              {status === "sent" ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check size={22} />
                  </div>
                  <p className="mt-3 text-[16px] font-bold text-ink-900">견적 문의가 접수됐어요</p>
                  <p className="mt-1 text-[13.5px] text-snow-600">강사 일정을 확인해서 {phone}로 연락드릴게요.</p>
                </div>
              ) : (
                <>
                  <p className="text-[15px] font-bold text-ink-900">이 견적으로 문의하기</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <input
                      placeholder="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl border border-snow-300/70 px-4 text-[15px] outline-none focus:border-brand-500"
                    />
                    <input
                      type="tel"
                      placeholder="연락처 (010-0000-0000)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl border border-snow-300/70 px-4 text-[15px] outline-none focus:border-brand-500"
                    />
                    <textarea
                      placeholder="요청사항 (선택) · 아이 나이, 실력, 숙소 등"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="rounded-xl border border-snow-300/70 px-4 py-3 text-[15px] outline-none focus:border-brand-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={send}
                    disabled={!canSend || status === "sending"}
                    className="mt-3 inline-flex h-13 w-full items-center justify-center gap-1.5 rounded-full bg-brand-500 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-40"
                  >
                    <Send size={16} /> {status === "sending" ? "보내는 중..." : "견적 문의 보내기"}
                  </button>
                  {status === "failed" && (
                    <p className="mt-2 text-center text-[12.5px] text-rose-500">
                      전송이 안 됐어요. 견적 복사 후 카톡으로 보내주세요.
                    </p>
                  )}
                  <a
                    href={contact.kakaoChannel}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => void copy("text")}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-[#FEE500] text-[14.5px] font-semibold text-[#191919]"
                  >
                    <MessageCircle size={16} /> 견적 복사하고 카톡 상담
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-snow-300/60 sm:p-6">
      <h2 className="mb-4 text-[17px] font-bold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[12.5px] font-semibold text-snow-600">{label}</p>
      {children}
    </div>
  );
}

function Chip({ on, onClick, children, small }: { on: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "rounded-full border font-semibold transition-colors",
        small ? "px-3 py-1.5 text-[13px]" : "px-5 py-2.5 text-[14px]",
        on ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 bg-white text-ink-800 hover:border-brand-300"
      )}
    >
      {children}
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
