"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ImageDown, Link2, MessageCircle, Minus, Plus, Send, Trash2, UserPlus } from "lucide-react";
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
type Team = { name: string; people: number; sport: Sport; extra: Extra; ticket: TicketHours; kids: number };

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
const MAX_DAYS = 7;

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

  const [days, setDays] = useState(3);
  const [len, setLen] = useState<Len>("2h");
  const [slots, setSlots] = useState<number[]>(DEFAULT_SLOTS["2h"]);
  const [edge, setEdge] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    { name: "가족 1", people: 3, sport: "ski", extra: "none", ticket: 7, kids: 0 },
    { name: "가족 2", people: 3, sport: "ski", extra: "none", ticket: 7, kids: 0 },
  ]);
  const [startDate, setStartDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [copied, setCopied] = useState<"" | "text" | "link">("");
  const [imgState, setImgState] = useState<"" | "making" | "done">("");

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
        .map(([n, p, sp, ex, tk, kd]) => {
          const people = Math.min(MAX_PEOPLE, Math.max(1, Number(p) || 1));
          return {
            name: n.slice(0, 12),
            people,
            sport: (["ski", "board", "mix"].includes(sp) ? sp : "ski") as Sport,
            extra: (["none", "lift", "liftRental"].includes(ex) ? ex : "none") as Extra,
            ticket: ([3, 5, 7].includes(Number(tk)) ? Number(tk) : 7) as TicketHours,
            kids: Math.min(people, Math.max(0, Number(kd) || 0)),
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

  const rows = teams.map((t) => {
    const groups = splitGroups(t.people);
    const lesson = groups.reduce((a, g) => a + (prices.table[len][g - 1] ?? 0), 0);
    const discount = eb ? Math.round((lesson * EARLY_BIRD.rate) / 1000) * 1000 : 0;
    const pass = prices.pass[len] * t.people;
    const perSession = lesson - discount + pass;
    // 리프트(·장비): 하루 1장씩, 날짜별 평일/주말, 어른/어린이 요금 → 40% 할인
    let extraRegular = 0;
    if (t.extra !== "none") {
      for (let d = 0; d < days; d++) {
        const w = isWeekend(startDate, d) ? 1 : 0;
        const adults = t.people - t.kids;
        let day = LIFT_PRICES[t.ticket].adult[w] * adults + LIFT_PRICES[t.ticket].child[w] * t.kids;
        if (t.extra === "liftRental")
          day += RENTAL_PRICES[t.ticket].adult[w] * adults + RENTAL_PRICES[t.ticket].child[w] * t.kids;
        extraRegular += day;
      }
    }
    const extraTotal = roundUp100(extraRegular * (1 - LIFT_RENTAL_DISCOUNT));
    const lessonTotal = perSession * sessions;
    return { ...t, groups, lesson, discount, pass, perSession, lessonTotal, extraRegular, extraTotal, total: lessonTotal + extraTotal };
  });
  const anyExtra = teams.some((t) => t.extra !== "none");
  const extraLabel = (r: { extra: Extra; ticket: TicketHours }) =>
    r.extra === "lift" ? `리프트 ${r.ticket}시간권` : `리프트 ${r.ticket}시간권+장비 ${RENTAL_PRICES[r.ticket].hours}시간`;
  const totalPeople = teams.reduce((a, t) => a + t.people, 0);
  const grand = rows.reduce((a, r) => a + r.total, 0);
  const instructorsAtOnce = rows.reduce((a, r) => a + r.groups.length, 0);
  const lenLabel = LENS.find((l) => l.value === len)!.label;
  const trip = days === 1 ? "당일" : `${days - 1}박 ${days}일`;

  function setTeam(i: number, patch: Partial<Team>) {
    setTeams((ts) => ts.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  }
  function changeLen(l: Len) {
    setLen(l);
    setSlots(DEFAULT_SLOTS[l]);
    setTeams((ts) => ts.map((t) => ({ ...t, ticket: suggestTicket(l, DEFAULT_SLOTS[l].length) })));
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
    "■ 팀별 비용",
    ...rows.map(
      (r) =>
        `${r.name} ${r.people}명(${SPORTS.find((s) => s.value === r.sport)!.label}) · 강사 ${r.groups.length}명(${r.groups.join("+")}) · 1회 ${won(
          r.perSession
        )} × ${sessions}회 = ${won(r.lessonTotal)}${
          r.extra !== "none"
            ? `\n  └ ${extraLabel(r)} ${r.people}명${r.kids ? `(어린이 ${r.kids})` : ""} × ${days}일 = ${won(r.extraTotal)} (40% 할인)`
            : ""
        }`
    ),
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
      t: teams.map((t) => `${t.name.replace(/[_~]/g, " ")}_${t.people}_${t.sport}_${t.extra}_${t.ticket}_${t.kids}`).join("~"),
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
        total: won(grand),
        totalSub: `${teams.length}팀 ${totalPeople}명 · 1인 평균 ${won(totalPeople ? Math.round(grand / totalPeople / 1000) * 1000 : 0)}${
          eb ? " · 얼리버드 10% 반영" : ""
        }`,
        schedule: schedule.map((d) => ({
          left: `${d.day}일차${startDate ? ` ${addDays(startDate, d.day - 1)}` : ""}${d.tag ? ` ${d.tag}` : ""}`,
          right: d.slots.map((x) => x.time).join("  ·  ") || "-",
        })),
        teams: rows.map((r) => ({
          name: `${r.name} · ${r.people}명 (${SPORTS.find((x) => x.value === r.sport)!.label})`,
          amount: won(r.total),
          lines: [
            `강습 · 강사 ${r.groups.length}명(${r.groups.map((x) => `1:${x}`).join("+")}) · 1회 ${won(r.perSession)} × ${sessions}회 = ${won(r.lessonTotal)}`,
            ...(r.extra !== "none"
              ? [
                  `${extraLabel(r)}${r.kids ? ` (어린이 ${r.kids})` : ""} × ${days}일 = ${won(r.extraTotal)} (정가 ${won(r.extraRegular)}에서 40% 할인)`,
                ]
              : []),
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
        .map(
          (r) =>
            `${r.name} ${r.people}명(${r.groups.join("+")})${
              r.extra === "none" ? "" : ` ${r.extra === "lift" ? "리프트" : "리프트+장비"}${r.ticket}h${r.kids ? ` 어린이${r.kids}` : ""}`
            }`
        )
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
            <Card title="1. 일정">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Field label="며칠 동안?">
                  <Stepper value={days} min={1} max={MAX_DAYS} onChange={setDays} suffix={`일 (${trip})`} />
                </Field>
                <Field label="첫날 (선택)">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11 rounded-xl border border-snow-300/70 px-3 text-[14.5px] outline-none focus:border-brand-500"
                  />
                </Field>
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
                  const g = splitGroups(t.people);
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
                          <Stepper value={t.people} min={1} max={MAX_PEOPLE} onChange={(v) => setTeam(i, { people: v, kids: Math.min(t.kids, v) })} suffix="명" />
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
                          리프트·장비 <span className="font-bold text-[#03A94F]">40% 할인</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {EXTRAS.map((x) => (
                            <Chip key={x.value} small on={t.extra === x.value} onClick={() => setTeam(i, { extra: x.value })}>
                              {x.label}
                            </Chip>
                          ))}
                        </div>
                        {t.extra !== "none" && (
                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl bg-white p-3 ring-1 ring-snow-300/60">
                            <Field label="리프트 시간권 (하루)">
                              <div className="flex gap-1.5">
                                {TICKETS.map((h) => (
                                  <Chip key={h} small on={t.ticket === h} onClick={() => setTeam(i, { ticket: h })}>
                                    {h}시간
                                  </Chip>
                                ))}
                              </div>
                            </Field>
                            <Field label={`그중 ${CHILD_LABEL}`}>
                              <Stepper value={t.kids} min={0} max={t.people} onChange={(v) => setTeam(i, { kids: v })} suffix="명" />
                            </Field>
                            <p className="w-full text-[11.5px] leading-relaxed text-snow-500">
                              하루 {perDay}회 수업이면 {suggestTicket(len, perDay)}시간권을 추천해요 · {HELMET_NOTE}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="mt-2.5 text-[12.5px] text-snow-600">
                        {g.length === 1
                          ? `강사 1명 · 1:${t.people} 수업`
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
                      { name: `가족 ${ts.length + 1}`, people: 2, sport: "ski", extra: ts[0]?.extra ?? "none", ticket: suggestTicket(len, perDay), kids: 0 },
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
                예상 합계 · 수업 {sessions}회
                <span className="block text-[22px] font-bold tabular-nums text-brand-300">{won(grand)}</span>
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
              <p className="mt-2 text-[34px] font-bold tabular-nums tracking-tight text-brand-300">{won(grand)}</p>
              <p className="text-[12.5px] text-white/50">
                {teams.length}팀 {totalPeople}명 · 1인 평균 {won(totalPeople ? Math.round(grand / totalPeople / 1000) * 1000 : 0)}
                {eb && " · 얼리버드 10% 반영"}
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
                <p className="text-[12.5px] font-semibold text-white/50">팀별</p>
                <ul className="mt-2 flex flex-col gap-2.5 text-[13.5px]">
                  {rows.map((r, i) => (
                    <li key={i}>
                      <div className="flex justify-between gap-3 font-semibold">
                        <span>
                          {r.name} · {r.people}명
                        </span>
                        <span className="tabular-nums">{won(r.total)}</span>
                      </div>
                      <p className="text-[12px] text-white/50">
                        강습 · 강사 {r.groups.length}명({r.groups.map((x) => `1:${x}`).join("+")}) · 1회 {won(r.perSession)} × {sessions}회 ={" "}
                        {won(r.lessonTotal)}
                      </p>
                      {r.extra !== "none" && (
                        <p className="text-[12px] text-white/50">
                          {extraLabel(r)} × {days}일 ·{" "}
                          <span className="text-white/35 line-through">{won(r.extraRegular)}</span>{" "}
                          <span className="font-semibold text-[#5BE38F]">40% {won(r.extraTotal)}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
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
