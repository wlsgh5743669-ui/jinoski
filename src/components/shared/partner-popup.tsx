"use client";

import { useEffect, useState } from "react";
import { Globe, Phone, X } from "lucide-react";
import { trackEvent } from "@/components/shared/analytics";

/**
 * 첫 화면 팝업 (한국어 첫 화면에서만, 들어올 때마다 1개씩 차례로)
 * - 비발디파크 개장 (대표 11-26 「27일 날 비발디파크 오픈」「27일 open 팝업」): 누르면 예약 화면.
 *   OPEN_UNTIL(한국 날짜)까지만 나오고, 그 동안은 처음 오는 손님에게 개장 팝업을 먼저 보여 줘요.
 *   사진 원본: 사업 폴더 홈페이지_팝업/개장/render_open_popup.py
 * - 더오딘펜션 (대표 11-25 「비발디에서 3분 펜션 소개 2장 · 전화 예약 10% 할인 · 팝업」 → 「A·B 번갈아」): 누르면 펜션 홈페이지(새 탭, 대표 11-26).
 *   할인 조건은 대표가 말한 것만(전화 예약 10%) — 연휴 제외 같은 말은 넣지 않음.
 *   사진 아래 「전화 예약」「홈페이지」 단추 두 개 (대표 11-26 「오딘 전화번호칸하고 홈페이지 칸」).
 * - 차례: 개장 기간엔 개장 → 펜션 A → 개장 → 펜션 B → …, 끝나면 펜션 A·B 번갈아.
 * - 「오늘 하루 안 보기」는 그날 끝까지 모든 팝업, 닫기는 이번 방문 동안 다시 안 떠요.
 */
type Popup = { key: string; partner: string; src: string; alt: string; href: string; label: string; tel?: string };

const OPEN: Popup = {
  key: "open-1127",
  partner: "jinoski",
  src: "/images/partner/open-1127.jpg",
  alt: "비발디파크 11월 27일 개장 · 지노스키 강습도 첫날부터 · 개장일부터 예약 받아요 · 강습 예약하기",
  href: "/ko/reserve/",
  label: "강습 예약하기",
};
const ODIN_A: Popup = {
  key: "a",
  partner: "theodin",
  src: "/images/partner/theodin-a.jpg",
  alt: "지노스키 제휴 숙소 더오딘펜션 · 비발디파크에서 차로 3분 · 전화 예약 10% 할인 · 033-435-0007",
  href: "https://theodin.co.kr/",
  label: "더오딘펜션 홈페이지 열기 (새 창)",
  tel: "033-435-0007",
};
const ODIN_B: Popup = {
  ...ODIN_A,
  key: "b",
  src: "/images/partner/theodin-b.jpg",
  alt: "강습 끝나면 더오딘펜션에서 쉬어요 · SPA룸·바비큐 테라스·루프탑 · 전화 예약 10% 할인 · 033-435-0007",
};

const OPEN_UNTIL = "2026-12-06"; // 이 날(한국 날짜)까지 개장 팝업
const K_HIDE = "jino_odin_popup_hide"; // 값: 안 보기로 한 날짜(YYYY-MM-DD)
const K_SEEN = "jino_odin_popup_seen"; // 이번 방문(탭)에서 이미 봤음
const K_TURN = "jino_odin_popup_turn"; // 펜션 A·B 차례
const K_TURN_OPEN = "jino_open_popup_turn"; // 개장 기간 차례 (처음 오면 0 = 개장 팝업)

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const kstToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

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
function turnOf(k: string, size: number, fallback: number) {
  const raw = get("local", k);
  const n = Number(raw);
  return raw !== null && Number.isInteger(n) && n >= 0 ? n % size : fallback;
}

export function PartnerPopup() {
  const [v, setV] = useState<Popup | null>(null);

  useEffect(() => {
    if (get("local", K_HIDE) === today() || get("session", K_SEEN)) return;
    let pick: Popup;
    if (kstToday() <= OPEN_UNTIL) {
      const order = [OPEN, ODIN_A, OPEN, ODIN_B];
      const turn = turnOf(K_TURN_OPEN, order.length, 0);
      pick = order[turn];
      set("local", K_TURN_OPEN, String((turn + 1) % order.length));
    } else {
      const order = [ODIN_A, ODIN_B];
      const turn = turnOf(K_TURN, order.length, Math.floor(Math.random() * order.length));
      pick = order[turn];
      set("local", K_TURN, String((turn + 1) % order.length));
    }
    const t = window.setTimeout(() => {
      setV(pick);
      set("session", K_SEEN, "1");
      trackEvent("partner_popup_view", { partner: pick.partner, variant: pick.key });
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
    trackEvent("partner_popup_hide_today", { partner: v.partner, variant: v.key });
    setV(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="지노스키 안내 팝업"
      onClick={close}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-5 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxWidth: v.tel ? "min(540px, calc((100dvh - 170px) * 0.8))" : "min(540px, calc((100dvh - 110px) * 0.8))" }}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={close}
          className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white"
        >
          <X size={18} />
        </button>
        <a
          href={v.href}
          {...(v.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
          onClick={() => trackEvent("partner_popup_click", { partner: v.partner, variant: v.key })}
          className="block"
          aria-label={v.label}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.src} alt={v.alt} width={900} height={1125} className="block h-auto w-full" />
        </a>
        {v.tel && (
          <div className="flex gap-2 border-t border-snow-200 px-3 py-3">
            <a
              href={`tel:${v.tel.replace(/-/g, "")}`}
              aria-label={`더오딘펜션에 전화 걸기 ${v.tel}`}
              onClick={() => trackEvent("partner_popup_call", { partner: v.partner, variant: v.key })}
              className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-3 text-[15px] font-bold text-white sm:text-[17px]"
              style={{ background: "#0A3F6B" }}
            >
              <Phone size={17} /> 전화 예약
            </a>
            <a
              href={v.href}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("partner_popup_click", { partner: v.partner, variant: v.key })}
              className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl py-3 text-[15px] font-bold text-white sm:text-[17px]"
              style={{ background: "#2DA8FF" }}
            >
              <Globe size={17} /> 홈페이지
            </a>
          </div>
        )}
        <div className="flex divide-x divide-snow-200 border-t border-snow-200 text-[14px] sm:text-[16px]">
          <button type="button" onClick={hideToday} className="flex-1 py-3 text-ink-600 sm:py-4">
            오늘 하루 안 보기
          </button>
          <button type="button" onClick={close} className="flex-1 py-3 font-bold text-ink-900 sm:py-4">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
