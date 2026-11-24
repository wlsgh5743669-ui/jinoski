"use client";

import { useLocale } from "next-intl";
import { asQLocale, useQuoteTranslate } from "@/lib/quote-i18n";

import { useState } from "react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

type MyQuote = {
  id: string;
  createdAt: string;
  kind: string;
  name: string;
  date: string;
  groupSize: string;
  timeSlot: string;
  total: string;
  headline: string;
  request: string;
  link: string;
  image: string;
  status: "new" | "contacted" | "booked" | "closed";
  reply: string;
  replyAt: string;
};

const STATUS_TEXT: Record<MyQuote["status"], { t: string; c: string }> = {
  new: { t: "접수됨 · 확인 중", c: "bg-brand-50 text-brand-600" },
  contacted: { t: "상담 중", c: "bg-amber-100 text-amber-700" },
  booked: { t: "예약 확정", c: "bg-emerald-100 text-emerald-700" },
  closed: { t: "종료", c: "bg-snow-100 text-snow-600" },
};
const when = (iso: string, loc = "ko") =>
  new Date(iso).toLocaleString(loc === "en" ? "en-US" : loc === "zh" ? "zh-CN" : "ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

/** 사장님용 표시(🌐 …)는 빼고 손님이 쓴 요청만 */
const cleanReq = (r: string) =>
  r.split(" / ").filter((s) => s && !s.startsWith("🌐")).join(" / ");

/** 손님: 휴대폰 번호 + 비밀번호 → 내 견적서·상태·지노스키 답변 */
export function MyQuotes() {
  const qloc = asQLocale(useLocale());
  useQuoteTranslate("myq-root", qloc);
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [items, setItems] = useState<MyQuote[] | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [big, setBig] = useState("");

  async function find(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (phone.replace(/\D/g, "").length < 9 || pw.trim().length < 4) {
      setErr("휴대폰 번호와 비밀번호(4자리 이상)를 넣어주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/my-quotes`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ phone, pw: pw.trim() }),
      });
      if (res.status === 404) setErr("일치하는 견적이 없어요. 휴대폰 번호와 비밀번호를 확인해 주세요.");
      else if (res.status === 429) setErr("너무 많이 시도했어요. 1시간 뒤에 다시 해주세요.");
      else if (!res.ok) setErr("잠시 후 다시 시도해 주세요.");
      else setItems(((await res.json()) as { items: MyQuote[] }).items);
    } catch {
      setErr("잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="myq-root" className="bg-ice-100 py-10 md:py-16">
      <Container>
        <div className="mx-auto max-w-xl">
          <p className="text-[13px] font-bold tracking-widest text-brand-500">MY QUOTE</p>
          <h1 className="mt-1 text-[26px] font-bold text-ink-900">내 견적 확인</h1>
          <p className="mt-1 text-[14px] text-snow-600">견적 문의 때 넣은 휴대폰 번호와 비밀번호로 견적서와 지노스키 답변을 볼 수 있어요.</p>

          {!items ? (
            <form onSubmit={find} className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-snow-300/60">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="휴대폰 번호"
                className="h-12 w-full rounded-xl border border-snow-300/70 px-4 text-[15px] outline-none focus:border-brand-500"
              />
              <input
                type="password"
                inputMode="numeric"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="비밀번호"
                className="mt-2 h-12 w-full rounded-xl border border-snow-300/70 px-4 text-[15px] outline-none focus:border-brand-500"
              />
              {err && <p className="mt-2 text-[13px] text-rose-500">{err}</p>}
              <button disabled={loading} className="mt-3 h-12 w-full rounded-full bg-brand-500 text-[15px] font-bold text-white disabled:opacity-50">
                {loading ? "찾는 중..." : "내 견적 보기"}
              </button>
              <p className="mt-3 text-center text-[12.5px] text-snow-500">
                비밀번호를 잊으셨으면 카톡 「지노스키」로 문의해 주세요 ·{" "}
                <a href={`/${qloc}/quote/`} className="font-semibold text-brand-600 underline underline-offset-2">
                  새 견적 내기
                </a>
              </p>
            </form>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {items.map((x) => (
                <article key={x.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-snow-300/60">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <b className="text-[16px] text-ink-900"><span data-notr>{qloc === "ko" ? `${x.name}님` : x.name}</span> {x.kind}</b>
                    <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold", STATUS_TEXT[x.status]?.c)}>{STATUS_TEXT[x.status]?.t}</span>
                    <span className="text-[12px] text-snow-500">{when(x.createdAt, qloc)}</span>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5 text-[13.5px] leading-relaxed text-ink-800">
                      {x.date && <p>📅 {x.date}</p>}
                      {x.groupSize && <p>👥 {x.groupSize}</p>}
                      {x.timeSlot && <p className="text-[12.5px] text-snow-600">🕘 {x.timeSlot}</p>}
                      <p className="font-bold text-ink-900">💰 {x.headline || x.total}</p>
                      {cleanReq(x.request) && <p className="text-[13px] text-snow-600">📝 {cleanReq(x.request)}</p>}
                    </div>
                    {x.image && (
                      <button onClick={() => setBig(x.image)} className="shrink-0" aria-label="견적서 크게 보기">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={x.image} alt="견적서" className="h-28 w-20 rounded-lg object-cover object-top ring-1 ring-snow-300/70" loading="lazy" />
                      </button>
                    )}
                  </div>
                  {x.link && (
                    <a href={x.link} className="mt-3 inline-block rounded-full bg-ink-900 px-4 py-2 text-[13px] font-bold text-white">
                      견적 다시 보기 · 수정하기
                    </a>
                  )}
                  {/* 지노스키 답변 (댓글처럼) */}
                  <div className="mt-3 border-t border-snow-300/60 pt-3">
                    {x.reply ? (
                      <div className="flex gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[11px] font-bold text-white">JINO</div>
                        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-brand-50 px-3.5 py-2.5">
                          <p className="text-[12px] font-bold text-brand-600">
                            지노스키 답변 {x.replyAt && <span className="font-normal text-snow-500">· {when(x.replyAt, qloc)}</span>}
                          </p>
                          <p data-notr className="mt-0.5 whitespace-pre-wrap text-[14px] text-ink-900">{x.reply}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] text-snow-500">아직 답변 전이에요. 강사 일정 확인 후 답변 드릴게요.</p>
                    )}
                  </div>
                </article>
              ))}
              <button onClick={() => setItems(null)} className="mt-1 text-center text-[13px] font-semibold text-snow-500 underline underline-offset-2">
                다른 번호로 보기
              </button>
            </div>
          )}
        </div>
      </Container>
      {big && (
        <button onClick={() => setBig("")} className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-3" aria-label="닫기">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={big} alt="견적서" className="w-full max-w-xl rounded-xl" />
        </button>
      )}
    </section>
  );
}
