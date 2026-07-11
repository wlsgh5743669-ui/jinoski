"use client";

import { useMemo, useState, useTransition } from "react";
import type { Booking } from "@prisma/client";
import { ChevronDown, Copy, Calendar, Download, LogOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProgramLabel, type ProgramValue } from "@/lib/booking-options";
import { ko } from "@/config/content/ko";
import {
  formatDate,
  formatWon,
  equipmentLabel,
  levelLabel,
  groupSizeLabel,
  liftPassPaymentLabel,
  timeSlotLabel,
  buildGoogleCalendarUrl,
  buildConfirmationMessage,
  bookingTotal,
} from "./booking-format";
import { updateBookingStatus, updateBookingMemo, logout } from "./actions";

const STATUS_TABS = ["전체", "신청", "확인중", "확정", "취소"] as const;
const STATUS_OPTIONS = ["신청", "확인중", "확정", "취소"] as const;

const STATUS_STYLES: Record<string, string> = {
  신청: "bg-brand-50 text-brand-600",
  확인중: "bg-amber-50 text-amber-600",
  확정: "bg-emerald-50 text-emerald-600",
  취소: "bg-snow-100 text-snow-500",
};

export function BookingDashboard({ bookings }: { bookings: Booking[] }) {
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_TABS)[number]>("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memoDraft, setMemoDraft] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const newCount = bookings.filter((b) => b.status === "신청").length;

  const filtered = useMemo(() => {
    if (statusFilter === "전체") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  function toggleExpand(booking: Booking) {
    if (expandedId === booking.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(booking.id);
    setMemoDraft(booking.memo ?? "");
  }

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      await updateBookingStatus(id, status);
    });
  }

  function handleMemoSave(id: string) {
    startTransition(async () => {
      await updateBookingMemo(id, memoDraft);
    });
  }

  async function handleCopy(booking: Booking) {
    try {
      await navigator.clipboard.writeText(buildConfirmationMessage(booking));
      setCopiedId(booking.id);
      setTimeout(
        () => setCopiedId((current) => (current === booking.id ? null : current)),
        2000
      );
    } catch {
      alert("클립보드 복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  }

  async function handleExportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map((b) => ({
      날짜: formatDate(b.date),
      프로그램: getProgramLabel(b.program as ProgramValue, ko),
      시간대: timeSlotLabel(b.program, b.timeSlot),
      인원: groupSizeLabel(b.groupSize),
      장비: equipmentLabel(b.equipment),
      레벨: levelLabel(b.level),
      촬영: b.wantsPhoto ? "희망" : "비희망",
      이름: b.name,
      연락처: b.phone,
      카카오ID: b.kakaoId ?? "",
      요청사항: b.requestNote ?? "",
      레슨료: b.basePrice,
      촬영비: b.photoAddOn,
      패찰비용: b.liftPassFee,
      패찰결제방식: liftPassPaymentLabel(b.liftPassPayment),
      지금결제할금액: b.priceOnRequest ? "별도 문의" : bookingTotal(b),
      상태: b.status,
      메모: b.memo ?? "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "예약목록");
    XLSX.writeFile(
      workbook,
      `jinoski-bookings-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  return (
    <div className="min-h-[100svh] bg-ice-200/60">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
              예약 관리
            </h1>
            {newCount > 0 && (
              <p className="mt-1 text-[13.5px] font-semibold text-brand-600">
                새 예약 신청 {newCount}건
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex h-11 items-center gap-2 rounded-full border border-snow-300 px-5 text-[13.5px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
            >
              <Download size={15} />
              엑셀 다운로드
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded-full border border-snow-300 px-5 text-[13.5px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
              >
                <LogOut size={15} />
                로그아웃
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors",
                statusFilter === tab
                  ? "bg-ink-900 text-white"
                  : "bg-white text-snow-600 hover:text-ink-900"
              )}
            >
              {tab}
              {tab === "신청" && newCount > 0 && ` (${newCount})`}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="rounded-2xl bg-white p-8 text-center text-[14px] text-snow-500">
              예약이 없습니다.
            </p>
          )}

          {filtered.map((booking) => {
            const isExpanded = expandedId === booking.id;
            const total = booking.priceOnRequest ? null : bookingTotal(booking);

            return (
              <div key={booking.id} className="overflow-hidden rounded-2xl bg-white">
                <button
                  type="button"
                  onClick={() => toggleExpand(booking)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-[14px] font-bold text-ink-900">
                      {formatDate(booking.date)}
                    </span>
                    <span className="text-[13.5px] text-snow-600">
                      {getProgramLabel(booking.program as ProgramValue, ko)}
                    </span>
                    <span className="text-[13.5px] text-snow-600">
                      {groupSizeLabel(booking.groupSize)}
                    </span>
                    <span className="text-[13.5px] font-semibold text-ink-800">
                      {booking.name}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 text-[12.5px] font-semibold",
                      STATUS_STYLES[booking.status]
                    )}
                  >
                    {booking.status}
                  </span>
                  <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink-900">
                    {total === null ? "문의" : formatWon(total)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-snow-400 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="flex flex-col gap-6 border-t border-snow-100 p-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <Field label="연락처" value={booking.phone} />
                      <Field label="카카오톡 ID" value={booking.kakaoId || "-"} />
                      <Field label="시간대" value={timeSlotLabel(booking.program, booking.timeSlot)} />
                      <Field label="장비" value={equipmentLabel(booking.equipment)} />
                      <Field label="레벨" value={levelLabel(booking.level)} />
                      <Field
                        label="촬영 서비스"
                        value={booking.wantsPhoto ? "희망" : "비희망"}
                      />
                      <Field
                        label="패찰 결제 방식"
                        value={liftPassPaymentLabel(booking.liftPassPayment)}
                      />
                    </div>

                    {booking.requestNote && (
                      <Field label="요청사항" value={booking.requestNote} />
                    )}

                    <div className="rounded-2xl bg-ice-200/60 p-5">
                      <div className="flex items-center justify-between text-[13.5px]">
                        <span className="text-snow-600">레슨료</span>
                        <span className="font-semibold tabular-nums text-ink-900">
                          {booking.priceOnRequest
                            ? "별도 문의"
                            : formatWon(booking.basePrice)}
                        </span>
                      </div>
                      {booking.photoAddOn > 0 && (
                        <div className="mt-1.5 flex items-center justify-between text-[13.5px]">
                          <span className="text-snow-600">촬영 추가비</span>
                          <span className="font-semibold tabular-nums text-ink-900">
                            {formatWon(booking.photoAddOn)}
                          </span>
                        </div>
                      )}
                      {booking.liftPassFee > 0 && (
                        <div className="mt-1.5 flex items-center justify-between text-[13.5px] text-snow-500">
                          <span>
                            패찰(강습 허가권) 비용 ·{" "}
                            {liftPassPaymentLabel(booking.liftPassPayment)}
                          </span>
                          <span>{formatWon(booking.liftPassFee)}</span>
                        </div>
                      )}
                      {!booking.priceOnRequest && (
                        <div className="mt-1.5 flex items-center justify-between border-t border-snow-300/60 pt-2 text-[13.5px] font-bold">
                          <span className="text-ink-900">
                            {booking.liftPassPayment === "pay-onsite"
                              ? "지금 결제할 금액"
                              : "합계"}
                          </span>
                          <span className="tabular-nums text-brand-600">
                            {formatWon(bookingTotal(booking))}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-[13px] font-semibold text-snow-500">
                        상태
                      </label>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={isPending}
                        className="h-10 rounded-full border border-snow-300 px-4 text-[13.5px] font-semibold text-ink-900 outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-snow-500">
                        메모
                      </label>
                      <textarea
                        value={memoDraft}
                        onChange={(e) => setMemoDraft(e.target.value)}
                        rows={2}
                        className="mt-2 w-full rounded-2xl border border-snow-300/60 px-4 py-3 text-[14px] outline-none transition-colors focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleMemoSave(booking.id)}
                        disabled={isPending}
                        className="mt-2 h-10 rounded-full border border-snow-300 px-5 text-[13px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
                      >
                        메모 저장
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(booking)}
                        className="flex h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-ink-700"
                      >
                        {copiedId === booking.id ? (
                          <Check size={15} />
                        ) : (
                          <Copy size={15} />
                        )}
                        {copiedId === booking.id ? "복사됨" : "예약 확정 메시지 복사"}
                      </button>
                      <a
                        href={buildGoogleCalendarUrl(booking)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 items-center gap-2 rounded-full border border-snow-300 px-5 text-[13.5px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
                      >
                        <Calendar size={15} />
                        구글 캘린더에 추가
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-snow-400">
        {label}
      </p>
      <p className="mt-1 text-[14px] font-medium text-ink-900">{value}</p>
    </div>
  );
}
