"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Calendar, LogOut, FileSpreadsheet, Check, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveBookingLabels } from "@/lib/booking-labels";
import { buildReminderMessage } from "@/lib/guidance-message";
import { getContent, isLocale, defaultLocale } from "@/config/site";

function tomorrowDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type BookingStatus = "requested" | "confirming" | "confirmed" | "cancelled";

type Booking = {
  id: string;
  date: string;
  program: string;
  timeSlot: string;
  groupSize: string;
  equipment: string;
  level: string;
  ageGroup: string;
  liftPassPayment: string;
  requestNote: string | null;
  locale: string;
  name: string;
  phone: string;
  basePrice: number;
  liftPassFee: number;
  totalPrice: number;
  priceOnRequest: boolean;
  message: string;
  status: BookingStatus;
  paymentStatus: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_TABS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "requested", label: "신청" },
  { value: "confirming", label: "확인중" },
  { value: "confirmed", label: "확정" },
  { value: "cancelled", label: "취소" },
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "신청",
  confirming: "확인중",
  confirmed: "확정",
  cancelled: "취소",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  requested: "bg-snow-100 text-snow-700",
  confirming: "bg-amber-50 text-amber-600",
  confirmed: "bg-brand-50 text-brand-600",
  cancelled: "bg-red-50 text-red-500",
};

function formatPrice(booking: Booking): string {
  if (booking.priceOnRequest) return "협의";
  return `${booking.totalPrice.toLocaleString("ko-KR")}원`;
}

function buildCalendarUrl(b: Booking, programLabel: string): string {
  const dateCompact = b.date.replace(/-/g, "");
  const next = new Date(b.date);
  next.setDate(next.getDate() + 1);
  const nextCompact = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(
    next.getDate()
  ).padStart(2, "0")}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `[JinoSki] ${b.name} - ${programLabel}`,
    dates: `${dateCompact}/${nextCompact}`,
    details: b.message,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | BookingStatus>("all");
  const [tomorrowOnly, setTomorrowOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memoDrafts, setMemoDrafts] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedReminderId, setCopiedReminderId] = useState<string | null>(null);
  const [savingMemoId, setSavingMemoId] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const tomorrow = useMemo(() => tomorrowDateKey(), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/bookings");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) setBookings(data.bookings);
      } catch {
        if (!cancelled) setError("예약 목록을 불러오지 못했습니다");
      }
    }
    load();
    fetch("/api/admin/sheet-url")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.url) setSheetUrl(data.url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  const tomorrowCount = useMemo(
    () => bookings?.filter((b) => b.date === tomorrow).length ?? 0,
    [bookings, tomorrow]
  );

  const filtered = useMemo(() => {
    if (!bookings) return [];
    let list = bookings;
    if (tab !== "all") list = list.filter((b) => b.status === tab);
    if (tomorrowOnly) list = list.filter((b) => b.date === tomorrow);
    return list;
  }, [bookings, tab, tomorrowOnly, tomorrow]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setBookings((prev) => prev?.map((b) => (b.id === id ? data.booking : b)) ?? prev);
  }

  async function saveMemo(id: string) {
    const memo = memoDrafts[id] ?? "";
    setSavingMemoId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setBookings((prev) => prev?.map((b) => (b.id === id ? data.booking : b)) ?? prev);
    } finally {
      setSavingMemoId(null);
    }
  }

  async function handleCopy(booking: Booking) {
    try {
      await navigator.clipboard.writeText(booking.message);
      setCopiedId(booking.id);
      setTimeout(() => setCopiedId((cur) => (cur === booking.id ? null : cur)), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  async function handleCopyReminder(booking: Booking) {
    const content = getContent(isLocale(booking.locale) ? booking.locale : defaultLocale);
    const labels = resolveBookingLabels(booking);
    const reminder = buildReminderMessage({
      name: booking.name,
      date: booking.date,
      program: labels.program,
      timeSlot: labels.timeSlot,
      content,
    });
    try {
      await navigator.clipboard.writeText(reminder);
      setCopiedReminderId(booking.id);
      setTimeout(
        () => setCopiedReminderId((cur) => (cur === booking.id ? null : cur)),
        2000
      );
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold tracking-tight text-ink-900">
          JINO<span className="text-brand-500">SKI</span> 예약 관리
        </h1>
        <div className="flex items-center gap-2">
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center gap-1.5 rounded-full border border-snow-300 px-4 text-[13px] font-semibold text-ink-800 transition-colors hover:border-brand-500"
            >
              <FileSpreadsheet size={14} />
              구글 시트에서 보기
            </a>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 items-center gap-1.5 rounded-full border border-snow-300 px-4 text-[13px] font-semibold text-ink-800 transition-colors hover:border-brand-500"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors",
              tab === t.value
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-snow-300/60 bg-white text-ink-800 hover:border-brand-300"
            )}
          >
            {t.label}
            {bookings && t.value !== "all" && (
              <span className="ml-1.5 text-snow-500">
                {bookings.filter((b) => b.status === t.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setTomorrowOnly((v) => !v)}
        className={cn(
          "mt-3 flex items-center gap-2 rounded-2xl border px-4 py-3 text-[13.5px] font-semibold transition-colors",
          tomorrowOnly
            ? "border-brand-500 bg-brand-50 text-brand-600"
            : "border-snow-300/60 bg-white text-ink-800 hover:border-brand-300"
        )}
      >
        <Bell size={15} />
        내일({tomorrow}) 레슨 예약자만 보기
        <span className={cn("text-snow-500", tomorrowOnly && "text-brand-500")}>
          {tomorrowCount}건
        </span>
      </button>

      <div className="mt-6 flex flex-col gap-3">
        {error && <p className="text-[14px] text-red-500">{error}</p>}
        {bookings === null && !error && (
          <p className="text-[14px] text-snow-500">불러오는 중...</p>
        )}
        {bookings !== null && filtered.length === 0 && (
          <p className="rounded-2xl border border-snow-300/60 bg-white p-8 text-center text-[14px] text-snow-500">
            예약이 없습니다
          </p>
        )}

        {filtered.map((b) => {
          const labels = resolveBookingLabels(b);
          const expanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className="rounded-2xl border border-snow-300/60 bg-white p-5"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : b.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-ink-900">
                      {b.date} · {labels.program}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                        STATUS_COLORS[b.status]
                      )}
                    >
                      {STATUS_LABELS[b.status]}
                    </span>
                    {b.date === tomorrow && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-0.5 text-[12px] font-semibold text-white">
                        <Bell size={11} />
                        내일
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13.5px] text-snow-500">
                    {b.name} · {b.phone} · {labels.groupSize} · {formatPrice(b)}
                  </p>
                </div>
              </button>

              {expanded && (
                <div className="mt-5 flex flex-col gap-4 border-t border-snow-100 pt-5">
                  <pre className="whitespace-pre-wrap rounded-xl bg-ice-200 p-4 text-[13.5px] leading-relaxed text-ink-800">
                    {b.message}
                  </pre>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(b)}
                      className="flex h-10 items-center gap-1.5 rounded-full bg-brand-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-600"
                    >
                      {copiedId === b.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === b.id ? "복사됨" : "메시지 복사"}
                    </button>
                    <a
                      href={buildCalendarUrl(b, labels.program)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center gap-1.5 rounded-full border border-snow-300 px-4 text-[13px] font-semibold text-ink-800 transition-colors hover:border-brand-500"
                    >
                      <Calendar size={14} />
                      캘린더에 추가
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyReminder(b)}
                      className="flex h-10 items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-50 px-4 text-[13px] font-semibold text-brand-600 transition-colors hover:border-brand-500"
                    >
                      {copiedReminderId === b.id ? <Check size={14} /> : <Bell size={14} />}
                      {copiedReminderId === b.id ? "복사됨" : "D-1 안내문구 복사"}
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 text-[13px] font-semibold text-ink-900">상태 변경</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(b.id, s)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                            b.status === s
                              ? "border-brand-500 bg-brand-50 text-brand-600"
                              : "border-snow-300/60 bg-white text-ink-700 hover:border-brand-300"
                          )}
                        >
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[13px] font-semibold text-ink-900">메모</p>
                    <textarea
                      rows={2}
                      value={memoDrafts[b.id] ?? b.memo ?? ""}
                      onChange={(e) =>
                        setMemoDrafts((prev) => ({ ...prev, [b.id]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-snow-300/60 px-4 py-3 text-[13.5px] outline-none transition-colors focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => saveMemo(b.id)}
                      disabled={savingMemoId === b.id}
                      className="mt-2 h-9 rounded-full border border-snow-300 px-4 text-[12.5px] font-semibold text-ink-800 transition-colors hover:border-brand-500 disabled:opacity-40"
                    >
                      {savingMemoId === b.id ? "저장 중..." : "메모 저장"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
