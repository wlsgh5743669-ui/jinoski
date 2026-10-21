"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";
const PW_KEY = "jinoski-inbox-pw";

type Status = "new" | "contacted" | "booked" | "closed";
type Inquiry = {
  key: string;
  createdAt: string;
  updatedAt?: string;
  kind: string;
  name: string;
  phone: string;
  date: string;
  program: string;
  timeSlot: string;
  groupSize: string;
  equipment: string;
  level: string;
  total: string;
  headline: string;
  request: string;
  note: string;
  link: string;
  image: string;
  status: Status;
  memo: string;
};

const STATUS: { v: Status; label: string; on: string }[] = [
  { v: "new", label: "새 문의", on: "bg-rose-500 text-white" },
  { v: "contacted", label: "연락함", on: "bg-amber-500 text-white" },
  { v: "booked", label: "예약확정", on: "bg-emerald-600 text-white" },
  { v: "closed", label: "종료", on: "bg-ink-700 text-white" },
];

function ago(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return d < 8 ? `${d}일 전` : new Date(iso).toLocaleDateString("ko-KR");
}
const when = (iso: string) => new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export function QuoteInbox() {
  const [pw, setPw] = useState("");
  const [input, setInput] = useState("");
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [origin, setOrigin] = useState(API);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [big, setBig] = useState("");

  const load = useCallback(async (p: string) => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/inquiries`, { headers: { Authorization: `Bearer ${p}` }, cache: "no-store" });
      if (res.status === 403) {
        setErr("비밀번호가 맞지 않아요.");
        setPw("");
        try {
          localStorage.removeItem(PW_KEY);
        } catch {}
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const j = (await res.json()) as { origin: string; items: Inquiry[] };
      setItems(j.items);
      setOrigin(j.origin || API);
      setPw(p);
      try {
        localStorage.setItem(PW_KEY, p);
      } catch {}
    } catch {
      setErr("불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = "";
    try {
      saved = localStorage.getItem(PW_KEY) || "";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) void load(saved);
  }, [load]);

  async function update(key: string, patch: { status?: Status; memo?: string }) {
    const res = await fetch(`${API}/inquiries/update`, {
      method: "POST",
      headers: { Authorization: `Bearer ${pw}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key, ...patch }),
    });
    if (!res.ok) {
      alert("저장하지 못했어요. 다시 시도해 주세요.");
      return false;
    }
    const rec = (await res.json()) as Inquiry;
    setItems((list) => (list ? list.map((x) => (x.key === key ? rec : x)) : list));
    return true;
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items?.length ?? 0 };
    for (const s of STATUS) c[s.v] = items?.filter((x) => x.status === s.v).length ?? 0;
    return c;
  }, [items]);
  const shown = (items ?? []).filter((x) => filter === "all" || x.status === filter);

  if (!pw)
    return (
      <section className="bg-ice-100 py-12 md:py-16">
        <Container>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) void load(input.trim());
            }}
            className="mx-auto max-w-sm rounded-3xl bg-white p-6 shadow-sm ring-1 ring-snow-300/60"
          >
            <p className="text-[13px] font-bold tracking-widest text-brand-500">JINOSKI 문의함</p>
            <h1 className="mt-1 text-[24px] font-bold text-ink-900">비밀번호를 넣어주세요</h1>
            <p className="mt-1 text-[13px] text-snow-500">홈페이지 견적·예약 문의를 모아서 볼 수 있어요.</p>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              placeholder="비밀번호"
              className="mt-4 h-12 w-full rounded-xl border border-snow-300/70 px-4 text-[15px] outline-none focus:border-brand-500"
            />
            {err && <p className="mt-2 text-[13px] text-rose-500">{err}</p>}
            <button disabled={loading} className="mt-3 h-12 w-full rounded-full bg-brand-500 text-[15px] font-bold text-white disabled:opacity-50">
              {loading ? "확인 중..." : "들어가기"}
            </button>
          </form>
        </Container>
      </section>
    );

  return (
    <section className="bg-ice-100 py-6 md:py-10">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-[24px] font-bold text-ink-900">문의함</h1>
            <div className="flex gap-1.5">
              <button onClick={() => void load(pw)} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink-900 ring-1 ring-snow-300/70">
                {loading ? "불러오는 중" : "새로고침"}
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem(PW_KEY);
                  } catch {}
                  setPw("");
                  setItems(null);
                }}
                className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-snow-500"
              >
                잠그기
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[{ v: "all" as const, label: "전체", on: "bg-ink-900 text-white" }, ...STATUS].map((s) => (
              <button
                key={s.v}
                onClick={() => setFilter(s.v)}
                className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-bold", filter === s.v ? s.on : "bg-white text-ink-700 ring-1 ring-snow-300/70")}
              >
                {s.label} {counts[s.v] ?? 0}
              </button>
            ))}
          </div>

          {shown.length === 0 && <p className="mt-10 text-center text-[14px] text-snow-500">문의가 없어요.</p>}
          <ul className="mt-4 flex flex-col gap-3">
            {shown.map((x) => (
              <InquiryCard key={x.key} x={x} origin={origin} onUpdate={update} onImage={setBig} />
            ))}
          </ul>
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

function InquiryCard({
  x,
  origin,
  onUpdate,
  onImage,
}: {
  x: Inquiry;
  origin: string;
  onUpdate: (key: string, p: { status?: Status; memo?: string }) => Promise<boolean>;
  onImage: (src: string) => void;
}) {
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const img = x.image ? `${origin}${x.image}` : "";
  const isQuote = x.kind.startsWith("견적");
  const tel = x.phone.replace(/[^0-9]/g, "");
  return (
    <li className={cn("rounded-2xl bg-white p-4 shadow-sm ring-1", x.status === "new" ? "ring-rose-300" : "ring-snow-300/60")}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[16px] font-bold text-brand-600">
          {x.name.slice(0, 1) || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <b className="text-[16px] text-ink-900">{x.name}</b>
            <span className={cn("rounded-full px-2 py-0.5 text-[11.5px] font-bold", isQuote ? "bg-brand-50 text-brand-600" : "bg-amber-100 text-amber-700")}>{x.kind}</span>
            <span className="text-[12px] text-snow-500" title={when(x.createdAt)}>
              {ago(x.createdAt)} · {when(x.createdAt)}
            </span>
          </div>
          <a href={`tel:${tel}`} className="text-[14px] font-semibold text-brand-600 underline underline-offset-2">
            📞 {x.phone}
          </a>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="min-w-0 flex-1 space-y-0.5 text-[13.5px] leading-relaxed text-ink-800">
          {x.date && <p>📅 {x.date}</p>}
          {x.groupSize && <p>👥 {x.groupSize}</p>}
          {!isQuote && x.program && <p>🎿 {x.program}{x.timeSlot ? ` · ${x.timeSlot}` : ""}</p>}
          {isQuote && x.timeSlot && <p className="text-[12.5px] text-snow-600">🕘 {x.timeSlot}</p>}
          {(x.equipment || x.level) && <p>{[x.equipment, x.level].filter(Boolean).join(" · ")}</p>}
          <p className="font-bold text-ink-900">💰 {x.headline || x.total}</p>
          {x.headline && x.total && <p className="text-[12.5px] text-snow-600">{x.total}</p>}
          {x.request && <p className="rounded-lg bg-amber-50 px-2 py-1 text-[13px] text-amber-800">📝 {x.request}</p>}
        </div>
        {img && (
          <button onClick={() => onImage(img)} className="shrink-0" aria-label="견적서 크게 보기">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="견적서" className="h-28 w-20 rounded-lg object-cover object-top ring-1 ring-snow-300/70" loading="lazy" />
          </button>
        )}
      </div>

      {x.note && (
        <details className="mt-2 text-[12.5px] text-snow-600">
          <summary className="cursor-pointer font-semibold">리프트·장비 준비 내용</summary>
          <p className="mt-1 whitespace-pre-wrap">{x.note}</p>
        </details>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {x.link && (
          <a href={x.link} target="_blank" rel="noreferrer" className="rounded-full bg-ink-900 px-3.5 py-1.5 text-[13px] font-bold text-white">
            견적 화면 열기
          </a>
        )}
        <div className="flex flex-wrap gap-1">
          {STATUS.map((s) => (
            <button
              key={s.v}
              onClick={() => void onUpdate(x.key, { status: s.v })}
              className={cn("rounded-full px-2.5 py-1 text-[12px] font-bold", x.status === s.v ? s.on : "bg-snow-100 text-snow-600")}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글처럼 메모 남기기 (시간과 함께 아래로 쌓여요) */}
      <div className="mt-3 border-t border-snow-300/60 pt-3">
        {x.memo && (
          <ul className="mb-2 flex flex-col gap-1">
            {x.memo.split("\n").filter(Boolean).map((line, k) => {
              const m = line.match(/^\[(.+?)\]\s*(.*)$/);
              return (
                <li key={k} className="rounded-xl bg-snow-100 px-3 py-1.5 text-[13px] text-ink-800">
                  💬 {m ? m[2] : line}
                  {m && <span className="ml-1.5 text-[11px] text-snow-400">{m[1]}</span>}
                </li>
              );
            })}
          </ul>
        )}
        <form
          className="flex gap-1.5"
          onSubmit={async (e) => {
            e.preventDefault();
            const t = memo.trim();
            if (!t) return;
            setBusy(true);
            const stamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
            const next = `${x.memo ? `${x.memo}\n` : ""}[${stamp}] ${t.replace(/\n/g, " ")}`;
            if (await onUpdate(x.key, { memo: next })) setMemo("");
            setBusy(false);
          }}
        >
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="댓글 메모 (예: 통화함, 2+4교시로 확정 예정)"
            className="h-10 min-w-0 flex-1 rounded-xl border border-snow-300/70 px-3 text-[13.5px] outline-none focus:border-brand-500"
          />
          <button disabled={busy} className="shrink-0 rounded-xl bg-brand-500 px-3.5 text-[13px] font-bold text-white disabled:opacity-50">
            등록
          </button>
        </form>
      </div>
    </li>
  );
}
