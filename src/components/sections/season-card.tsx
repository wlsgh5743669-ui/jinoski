"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { trackEvent } from "@/components/shared/analytics";
import { ConsentBox, marketingTag } from "@/components/shared/consent-box";
import { attributionText } from "@/components/shared/attribution";
import { cn } from "@/lib/utils";
import { isEarlyBirdActive } from "@/lib/pricing";

type Hrs = "2h" | "3h";
const PASS: Record<Hrs, number> = { "2h": 25000, "3h": 35000 };
const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
/** 8회 가격 = 레슨 1회 가격 × 8 (얼리버드 기간엔 10% 할인) */
function seasonRows(lessonPricing: { program: string; rows: { people: string; price: string }[] }[], h: Hrs) {
  const eb = isEarlyBirdActive();
  return (lessonPricing.find((g) => g.program === h)?.rows ?? []).map((r) => {
    const full = Number(r.price.replace(/[^0-9]/g, "")) * 8;
    return { people: r.people, full, price: eb ? Math.round((full * 0.9) / 1000) * 1000 : full, eb };
  });
}

const NOTIFY_URL = process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

/** 예약하기 첫 화면의 작은 카드 → 시즌 강습 화면으로 */
export function SeasonCard() {
  const { lessonPricing } = useContent();
  const r0 = seasonRows(lessonPricing, "2h")[0];
  return (
    <Link
      href="/reserve/season"
      onClick={() => trackEvent("season_card_open", { from: "reserve_top" })}
      className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-violet-500 bg-violet-50/60 px-4 py-3.5 transition-colors hover:bg-violet-50"
    >
      <span className="flex flex-col">
        <span className="text-[14.5px] font-bold text-ink-900">🗓️ 시즌 강습 (2·3시간 × 8회)</span>
        <span className="mt-1 text-[12.5px] font-semibold leading-snug text-violet-700">👉 한 시즌 꾸준히 배울 분 · 날짜는 협의</span>
        <span className="mt-0.5 text-[12px] leading-snug text-snow-600">2시간 1:1 {r0 ? won(r0.price) : ""}부터{r0?.eb ? " · 얼리버드 10%" : ""}</span>
      </span>
      <span className="shrink-0 text-[18px] font-bold text-ink-900">→</span>
    </Link>
  );
}

/** 시즌 강습 화면: ① 추천 ② 가격 ③ 패찰·결제 → [상담 신청] → 신청서 */
export function SeasonView() {
  const { lessonPricing, contact } = useContent();
  const [hrs, setHrs] = useState<Hrs>("2h");
  const rows2 = seasonRows(lessonPricing, "2h");
  const rows3 = seasonRows(lessonPricing, "3h");
  const rows = hrs === "2h" ? rows2 : rows3;
  const eb = rows2[0]?.eb;
  const [page, setPage] = useState<"info" | "form">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("1:1");
  const [sport, setSport] = useState("스키");
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [payPass, setPayPass] = useState(true);
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const people = Number(group.slice(2)) || 1;
  const passOne = PASS[hrs];
  const passAll = passOne * 8 * people;
  const lessonPrice = rows.find((r) => r.people === group)?.price ?? 0;
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
          program: `🗓️ 시즌 강습 8회 (${hrs === "2h" ? "2시간" : "3시간"}×8) 상담`,
          timeSlot: "협의",
          groupSize: group,
          equipment: sport,
          level: "",
          total: payPass ? `${won(lessonPrice + passAll)} (강습 ${won(lessonPrice)} + 패찰 8회 ${won(passAll)})` : `${won(lessonPrice)} (패찰 별도)`,
          note: [payPass ? `🎫 패찰 8회분 한 번에 결제 (${people}명 × 8회 = ${won(passAll)})` : "패찰은 회차마다 결제", note.trim(), marketingTag(marketing), attributionText()].filter(Boolean).join(" / "),
        }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  const h2 = "text-[13px] font-bold tracking-wide text-violet-600";
  const card = "rounded-2xl bg-white px-4 py-3.5 ring-1 ring-snow-300/60";
  const input = "h-12 w-full rounded-xl border border-snow-300/70 bg-white px-4 text-[15px] outline-none focus:border-brand-500";
  const chip = (on: boolean) =>
    cn("rounded-full border px-3.5 py-2 text-[13.5px] font-semibold", on ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 bg-white text-ink-700");

  return (
    <div className="mx-auto min-h-[100svh] max-w-lg px-5 pb-16 pt-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-[18px] font-bold tracking-tightest text-ink-900">
          JINO<span className="text-brand-500">SKI</span>
        </Link>
        {page === "form" ? (
          <button type="button" onClick={() => setPage("info")} className="flex items-center gap-1 text-[13.5px] font-semibold text-snow-500">
            <ArrowLeft size={15} /> 이전
          </button>
        ) : (
          <Link href="/reserve" className="flex items-center gap-1 text-[13.5px] font-semibold text-snow-500">
            <ArrowLeft size={15} /> 예약하기
          </Link>
        )}
      </div>

      <h1 className="mt-6 text-[26px] font-bold tracking-tight text-ink-900">🗓️ 시즌 강습</h1>
      <p className="mt-1 text-[14px] text-snow-600">2시간 또는 3시간 × 8회 · 같은 강사 · 날짜는 협의</p>

      {page === "info" ? (
        <div className="mt-6 flex flex-col gap-5">
          {/* ① 추천 */}
          <section>
            <p className={h2}>이런 분께 추천해요</p>
            <ul className={cn(card, "mt-2 flex flex-col gap-1.5 text-[14px] text-ink-800")}>
              <li>🎯 올해 목표가 있는 분 (중급 슬로프·카빙·주니어 등급)</li>
              <li>🔁 하루 강습 후 다음 해에 다시 처음부터 하는 분</li>
              <li>👨‍🏫 한 강사에게 꾸준히 배우고 싶은 분</li>
            </ul>
          </section>

          {/* ② 가격 */}
          <section>
            <p className={h2}>
              가격 (8회 합계){eb ? <span className="ml-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] text-white">얼리버드 10% 할인</span> : null}
            </p>
            <div className={cn(card, "mt-2 py-2")}>
              <div className="grid grid-cols-[48px_1fr_1fr] gap-x-2 border-b border-snow-300/50 pb-1.5 text-[12px] font-bold text-snow-500">
                <span />
                <span className="text-right">2시간 × 8회</span>
                <span className="text-right">3시간 × 8회</span>
              </div>
              {rows2.map((r, i) => (
                <div key={r.people} className="grid grid-cols-[48px_1fr_1fr] items-baseline gap-x-2 border-b border-snow-300/40 py-2 last:border-0">
                  <span className="text-[14px] font-semibold text-ink-800">{r.people}</span>
                  {[r, rows3[i]].map((x, j) => (
                    <span key={j} className="text-right">
                      {x?.eb && <span className="block text-[11px] text-snow-400 line-through">{won(x.full)}</span>}
                      <b className="text-[14.5px] text-rose-600">{x ? won(x.price) : "-"}</b>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ③ 패찰·결제 */}
          <section>
            <p className={h2}>패찰 · 결제</p>
            <ul className={cn(card, "mt-2 flex flex-col gap-1.5 text-[14px] text-ink-800")}>
              <li>🎫 패찰: 2시간 1회 25,000원 · 3시간 1회 35,000원 (1인) · <b>8회분을 강습료와 한 번에 결제</b>할 수 있어요</li>
              <li>🎿 리프트·장비: 정가 40% 할인으로 같이 결제 가능</li>
              <li>💳 일정 확정 후 예약금 20% · 나머지는 첫 강습 날</li>
              <li>📅 날짜·시간은 상담 후 시즌 동안 나눠서 정해요</li>
            </ul>
          </section>

          <button
            type="button"
            onClick={() => {
              setPage("form");
              window.scrollTo({ top: 0 });
            }}
            className="mt-1 inline-flex h-14 items-center justify-center rounded-full bg-violet-600 text-[16px] font-bold text-white"
          >
            시즌 강습 상담 신청 →
          </button>
          <a href={contact.kakaoChannel} target="_blank" rel="noreferrer" className="text-center text-[13px] font-semibold text-snow-600 underline underline-offset-2">
            카톡으로 바로 물어보기
          </a>
        </div>
      ) : status === "sent" ? (
        <div className="mt-8 rounded-2xl bg-violet-50 px-5 py-6 text-center ring-1 ring-violet-200">
          <p className="text-[17px] font-bold text-ink-900">✅ 상담 신청이 접수됐어요</p>
          <p className="mt-1.5 text-[14px] text-snow-600">목표와 원하는 날짜를 듣고 일정을 같이 짜드릴게요. 곧 연락드려요!</p>
          <Link href="/" className="mt-4 inline-block text-[13.5px] font-semibold text-snow-500 underline">
            홈으로
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2.5">
          <p className="text-[15px] font-bold text-ink-900">상담 신청 · 날짜는 연락드려서 같이 정해요</p>
          <input className={input} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder="연락처 (010-0000-0000)" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="flex gap-1.5">
            {(["2h", "3h"] as const).map((h) => (
              <button key={h} type="button" className={cn(chip(hrs === h), "flex-1")} onClick={() => setHrs(h)}>
                {h === "2h" ? "2시간 × 8회" : "3시간 × 8회"}
              </button>
            ))}
          </div>
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
          <label className="flex items-start gap-2.5 rounded-2xl bg-violet-50 px-4 py-3 ring-1 ring-violet-200">
            <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#7c3aed]" checked={payPass} onChange={(e) => setPayPass(e.target.checked)} />
            <span className="flex-1">
              <span className="block text-[14px] font-bold text-ink-900">🎫 패찰 8회분 한 번에 결제</span>
              <span className="block text-[12.5px] text-snow-600">
                {people}명 × 8회 × {won(passOne)} = {won(passAll)} · 매번 따로 낼 필요 없어요
              </span>
              <span className="mt-1 block text-[13px] font-bold text-violet-700">
                예상 합계 {won(lessonPrice + (payPass ? passAll : 0))}
                {payPass ? ` (강습 ${won(lessonPrice)} + 패찰 ${won(passAll)})` : " (패찰은 회차마다 결제)"}
              </span>
            </span>
          </label>
          <ConsentBox locale="ko" agree={consent} onAgree={setConsent} marketing={marketing} onMarketing={setMarketing} />
          <button
            type="button"
            onClick={send}
            disabled={!ok || status === "sending"}
            className="mt-1 inline-flex h-14 items-center justify-center gap-1.5 rounded-full bg-violet-600 text-[16px] font-bold text-white disabled:opacity-40"
          >
            <Send size={17} /> {status === "sending" ? "보내는 중..." : "상담 신청 보내기"}
          </button>
          {status === "failed" && <p className="text-center text-[12.5px] text-rose-500">전송이 안 됐어요. 카톡으로 상담해 주세요.</p>}
        </div>
      )}
    </div>
  );
}
