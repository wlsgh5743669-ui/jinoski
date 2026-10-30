"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { trackEvent } from "@/components/shared/analytics";
import { ConsentBox, marketingTag } from "@/components/shared/consent-box";
import { attributionText } from "@/components/shared/attribution";
import { cn } from "@/lib/utils";

const NOTIFY_URL = process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

/** 🗓️ 예약하기 첫 화면: 시즌 강습(8회) — 목적·의미 설명 + 날짜 협의 상담 신청 */
export function SeasonCard() {
  const { seasonProgram: sp, contact } = useContent();
  const rows = sp?.priceRows ?? [];
  const benefits = sp?.benefits ?? [];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("1:1");
  const [sport, setSport] = useState("스키");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const ok = name.trim() && phone.replace(/[^0-9]/g, "").length >= 9 && consent;

  async function send() {
    if (!ok) return;
    setStatus("sending");
    trackEvent("season_inquiry_submit", { group });
    try {
      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date: when.trim() ? `희망 시기: ${when.trim()} (날짜 협의)` : "날짜 협의",
          program: "🗓️ 시즌 강습 8회 (2시간×8) 상담",
          timeSlot: "협의",
          groupSize: group,
          equipment: sport,
          level: "",
          total: rows.find((r) => r.people === group)?.price ?? "",
          note: [note.trim(), marketingTag(marketing), attributionText()].filter(Boolean).join(" / "),
        }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  const input = "h-12 w-full rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500";
  const chip = (on: boolean) =>
    cn("rounded-full border px-3.5 py-2 text-[13.5px] font-semibold", on ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 bg-white text-ink-700");

  return (
    <div className="col-span-2 rounded-2xl border-2 border-violet-500 bg-violet-50/60">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) trackEvent("season_card_open", { from: "reserve_top" });
        }}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex flex-col">
          <span className="text-[14.5px] font-bold text-ink-900">🗓️ 시즌 강습 (2시간 × 8회)</span>
          <span className="mt-1 text-[12.5px] font-semibold leading-snug text-violet-700">👉 한 시즌 꾸준히 실력 키울 분 · 날짜는 협의</span>
          <span className="mt-0.5 text-[12px] leading-snug text-snow-600">
            1:1 {rows[0]?.price} 부터 · {sp?.badge}
          </span>
        </span>
        <ChevronDown size={20} className={cn("shrink-0 text-ink-900 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-violet-200 px-4 pb-5 pt-4">
          {/* 목적·의미 */}
          <p className="text-[15px] font-bold text-ink-900">시즌 강습은 이런 분께 좋아요</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px] leading-relaxed text-snow-700">
            <li>🎯 <b>목표가 있는 분</b> — 「올해는 중급 슬로프」, 「카빙·숏턴 완성」, 「주니어 기술등급 도전」처럼 한 시즌 목표를 정하고 단계별로 올라가요.</li>
            <li>🔁 <b>한 번 배우고 잊어버리는 게 아쉬운 분</b> — 하루 강습은 다음 해에 처음부터 다시 시작하기 쉬워요. 8회를 이어서 배우면 자세가 몸에 남아요.</li>
            <li>👨‍🏫 <b>같은 강사가 끝까지</b> — 전담 강사가 매회 기록하고 다음 수업으로 이어서 가르쳐요.</li>
            <li>📅 <b>날짜·시간은 협의</b> — 원하는 날에 맞춰 시즌 동안 나눠서 사용해요. 주말·방학 위주도 괜찮아요.</li>
          </ul>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {benefits.slice(0, 4).map((b) => (
              <div key={b.title} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-violet-100">
                <p className="text-[13.5px] font-bold text-ink-900">
                  {b.icon} {b.title}
                </p>
              </div>
            ))}
          </div>

          {/* 가격 */}
          <div className="mt-4 rounded-xl bg-white px-4 py-3 ring-1 ring-violet-100">
            <p className="text-[13.5px] font-bold text-ink-900">
              {sp?.title} <span className="ml-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white">{sp?.badge}</span>
            </p>
            <ul className="mt-2 flex flex-col divide-y divide-snow-300/50">
              {rows.map((r) => (
                <li key={r.people} className="flex items-baseline justify-between py-1.5 text-[14px]">
                  <span className="font-semibold text-ink-800">{r.people}</span>
                  <span>
                    <span className="mr-1.5 text-[12px] text-snow-400 line-through">{r.original}</span>
                    <b className="text-rose-600">{r.price}</b>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[12px] text-snow-500">패찰 회당 1인 25,000원 별도 · 리프트·장비 정가 40% 할인 · 확정 후 예약금 20%</p>
          </div>

          {/* 상담 신청 */}
          {status === "sent" ? (
            <div className="mt-4 rounded-xl bg-white px-4 py-4 text-center ring-1 ring-violet-200">
              <p className="text-[15px] font-bold text-ink-900">✅ 시즌 강습 상담 신청이 접수됐어요</p>
              <p className="mt-1 text-[13px] text-snow-600">원하시는 날짜·목표를 듣고 일정을 같이 짜드릴게요. 곧 연락드려요!</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-[14px] font-bold text-ink-900">상담 신청 (날짜는 연락드려서 같이 정해요)</p>
              <input className={input} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={input} placeholder="연락처 (010-0000-0000)" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <div className="flex flex-wrap gap-1.5">
                {["1:1", "1:2", "1:3"].map((g) => (
                  <button key={g} type="button" className={chip(group === g)} onClick={() => setGroup(g)}>
                    {g}
                  </button>
                ))}
                <span className="mx-1 self-center text-snow-300">|</span>
                {["스키", "스노보드"].map((s) => (
                  <button key={s} type="button" className={chip(sport === s)} onClick={() => setSport(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <input className={input} placeholder="희망 시기 (예: 12월 주말, 1월 방학 평일)" value={when} onChange={(e) => setWhen(e.target.value)} />
              <input className={input} placeholder="목표·요청 (예: 초등 2학년, 중급 슬로프 목표)" value={note} onChange={(e) => setNote(e.target.value)} />
              <ConsentBox locale="ko" agree={consent} onAgree={setConsent} marketing={marketing} onMarketing={setMarketing} />
              <button
                type="button"
                onClick={send}
                disabled={!ok || status === "sending"}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-violet-600 text-[15px] font-bold text-white disabled:opacity-40"
              >
                <Send size={16} /> {status === "sending" ? "보내는 중..." : "시즌 강습 상담 신청"}
              </button>
              {status === "failed" && <p className="text-center text-[12.5px] text-rose-500">전송이 안 됐어요. 카톡으로 상담해 주세요.</p>}
              <a href={contact.kakaoChannel} target="_blank" rel="noreferrer" className="text-center text-[13px] font-semibold text-snow-600 underline underline-offset-2">
                카톡으로 바로 상담하기
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
