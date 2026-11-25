"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/components/shared/analytics";

/**
 * 제휴 숙소 더오딘펜션 소개 팝업 (대표 11-25 「비발디에서 3분 펜션 소개 2장 · 전화 예약 10% 할인 · 팝업」 → 「A·B 번갈아」)
 * - 한국어 첫 화면에서만, 들어올 때마다 A(전경)·B(객실·시설)를 번갈아 보여 줘요.
 * - 사진을 누르면 펜션으로 전화(033-435-0007).
 * - 「오늘 하루 안 보기」는 그날 끝까지, 닫기는 이번 방문 동안 다시 안 떠요.
 * - 할인 조건은 대표가 말한 것만(전화 예약 10%) — 연휴 제외 같은 말은 넣지 않음.
 */
const VARIANTS = [
  { key: "a", src: "/images/partner/theodin-a.jpg", alt: "지노스키 제휴 숙소 더오딘펜션 · 비발디파크에서 차로 3분 · 전화 예약 10% 할인 · 033-435-0007" },
  { key: "b", src: "/images/partner/theodin-b.jpg", alt: "강습 끝나면 더오딘펜션에서 쉬어요 · SPA룸·바비큐 테라스·루프탑 · 전화 예약 10% 할인 · 033-435-0007" },
] as const;

const TEL = "tel:0334350007";
const K_HIDE = "jino_odin_popup_hide"; // 값: 안 보기로 한 날짜(YYYY-MM-DD)
const K_SEEN = "jino_odin_popup_seen"; // 이번 방문(탭)에서 이미 봤음
const K_TURN = "jino_odin_popup_turn"; // 번갈아 보여 주기 차례

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function get(store: "local" | "session", k: string) {
  try {
    return (store === "local" ? window.localStorage : window.sessionStorage).getItem(k);
  } catch {
    return null;
  }
}
function set(store: "local" | "session", k: string, v: string) {
  try {
    (store === "local" ? window.localStorage : window.sessionStorage).setItem(k, v);
  } catch {}
}

export function PartnerPopup() {
  const [v, setV] = useState<(typeof VARIANTS)[number] | null>(null);

  useEffect(() => {
    if (get("local", K_HIDE) === today() || get("session", K_SEEN)) return;
    const stored = Number(get("local", K_TURN));
    const turn = Number.isFinite(stored) && get("local", K_TURN) !== null ? stored : Math.floor(Math.random() * 2);
    const pick = VARIANTS[turn % 2];
    set("local", K_TURN, String((turn + 1) % 2));
    const t = window.setTimeout(() => {
      setV(pick);
      set("session", K_SEEN, "1");
      trackEvent("partner_popup_view", { partner: "theodin", variant: pick.key });
    }, 1200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!v) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setV(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [v]);

  if (!v) return null;

  const close = () => setV(null);
  const hideToday = () => {
    set("local", K_HIDE, today());
    trackEvent("partner_popup_hide_today", { partner: "theodin", variant: v.key });
    setV(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="제휴 숙소 더오딘펜션 안내"
      onClick={close}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-5 backdrop-blur-[2px]"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxWidth: "min(360px, calc((100dvh - 110px) * 0.8))" }}>
        <button
          type="button"
          aria-label="닫기"
          onClick={close}
          className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white"
        >
          <X size={18} />
        </button>
        <a
          href={TEL}
          onClick={() => trackEvent("partner_popup_call", { partner: "theodin", variant: v.key })}
          className="block"
          aria-label="더오딘펜션에 전화 걸기 033-435-0007"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.src} alt={v.alt} width={900} height={1125} className="block h-auto w-full" />
        </a>
        <div className="flex divide-x divide-snow-200 border-t border-snow-200 text-[14px]">
          <button type="button" onClick={hideToday} className="flex-1 py-3 text-ink-600">
            오늘 하루 안 보기
          </button>
          <button type="button" onClick={close} className="flex-1 py-3 font-bold text-ink-900">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
