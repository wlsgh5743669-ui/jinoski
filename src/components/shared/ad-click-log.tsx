"use client";

// 🛡 광고 부정클릭 지키기 — 광고(네이버·구글·메타·카카오)를 눌러 들어온 방문만 운영 프로그램에 알려요
// - 들어올 때: 어느 광고·검색어·첫 페이지 (접속 IP는 서버가 받는 순간 기록)
// - 나갈 때: 머문 시간·스크롤·본 페이지 수·예약/전화/카톡을 눌렀는지
// - 이름·연락처는 보내지 않아요. 같은 IP가 여러 번 누르고 바로 나가면 운영 프로그램에서 차단해요
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ENDPOINT = "https://ops.jinoski.com/api/adhit";
const KEY = "jino_adv";
const ACT_EVENT = "jino:adact";

type Visit = { sid: string; t0: number; pages: number; scroll: number; act: string[]; last?: string };

function read(): Visit | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Visit) : null;
  } catch {
    return null;
  }
}
function write(v: Visit) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
}

function send(body: Record<string, unknown>) {
  const data = JSON.stringify(body);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([data], { type: "text/plain" }))) return;
  } catch {}
  try {
    void fetch(ENDPOINT, { method: "POST", body: data, keepalive: true, mode: "cors", headers: { "Content-Type": "text/plain" } }).catch(() => {});
  } catch {}
}

const host = (ref: string) => {
  try {
    return new URL(ref).hostname;
  } catch {
    return "";
  }
};

/** 광고로 들어왔는지: 광고 꼬리표(주소 뒤 ?…) → 광고 클릭 중간 주소(리퍼러) */
export function adChannelOf(url: URL, ref: string): { ch: string; kw: string | null; cmp: string | null } | null {
  const q = url.searchParams;
  const src = (q.get("utm_source") || q.get("from") || "").toLowerCase();
  const med = (q.get("utm_medium") || "").toLowerCase();
  const paid = /^(cpc|ppc|paid|ad|ads|display|paid_social|paidsocial|cpm)$/.test(med);
  const kw = q.get("n_query") || q.get("n_keyword") || q.get("utm_term") || null;
  const cmp = q.get("n_campaign") || q.get("n_ad_group") || q.get("utm_campaign") || null;
  const h = host(ref);
  if (q.get("n_media") || q.get("n_query") || q.get("n_keyword") || q.get("NaPm") || src === "powerlink" || (src === "naver" && paid) || /(^|\.)adcr\.naver\.com$|(^|\.)ad\.search\.naver\.com$/.test(h))
    return { ch: "NAVER", kw, cmp };
  if (q.get("gclid") || q.get("gbraid") || q.get("wbraid") || (src === "google" && paid)) return { ch: "GOOGLE", kw, cmp };
  if (/^(facebook|instagram|meta|fb|ig)$/.test(src) && paid) return { ch: "META", kw, cmp };
  if (/^(kakao|daum|kakaomoment)$/.test(src) && paid) return { ch: "KAKAO", kw, cmp };
  if (/(^|\.)ad\.daum\.net$|adlink\.kakao|ader\.kakao/.test(h)) return { ch: "KAKAO", kw, cmp };
  return null;
}

/** 예약 신청·문의 완료처럼 중요한 행동을 광고 방문에 표시 (analytics.ts의 trackEvent가 불러요) */
export function markAdAction(name: string) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(ACT_EVENT, { detail: name }));
  } catch {}
}

const sid = () => {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 20);
};

/** 모든 페이지에 넣는 기록기 (화면에는 아무것도 안 그려요) */
export function AdClickLog() {
  const pathname = usePathname();

  // 처음 열 때 한 번: 광고로 들어왔으면 새 방문, 아니면 이어서
  useEffect(() => {
    const url = new URL(window.location.href);
    const ad = adChannelOf(url, document.referrer);
    let v = read();
    if (ad) {
      v = { sid: sid(), t0: Date.now(), pages: 1, scroll: 0, act: [] };
      write(v);
      send({ t: "s", sid: v.sid, ch: ad.ch, kw: ad.kw, cmp: ad.cmp, path: url.pathname, ref: host(document.referrer) || null });
    }
    if (!v) return;

    const addAct = (a: string) => {
      const cur = read();
      if (!cur || cur.act.includes(a)) return;
      cur.act = [...cur.act, a];
      write(cur);
    };
    const onScroll = () => {
      const cur = read();
      if (!cur) return;
      const doc = document.documentElement;
      const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / Math.max(1, doc.scrollHeight)) * 100));
      if (pct > cur.scroll + 4) {
        cur.scroll = pct;
        write(cur);
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a, button");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const label = `${href} ${a.textContent ?? ""}`;
      if (href.startsWith("tel:")) addAct("tel");
      else if (/kakao|pf\.kakao|카톡/.test(label)) addAct("kakao");
      else if (/\/reserve/.test(href)) addAct("reserve");
      else if (/\/quote/.test(href)) addAct("quote");
      else if (/문의|상담|chat/i.test(a.textContent ?? "")) addAct("chat");
    };
    const onAct = (e: Event) => {
      const name = String((e as CustomEvent).detail ?? "");
      if (/_submit$/.test(name)) addAct("submit");
      else if (/quote/.test(name)) addAct("quote");
    };
    const finish = () => {
      const cur = read();
      if (!cur) return;
      send({ t: "e", sid: cur.sid, dwell: Date.now() - cur.t0, scroll: cur.scroll, pages: cur.pages, act: cur.act.join(",") });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") finish();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener(ACT_EVENT, onAct);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", finish);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(ACT_EVENT, onAct);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", finish);
    };
  }, []);

  // 페이지를 옮길 때마다 본 페이지 수 +1
  useEffect(() => {
    const cur = read();
    if (!cur || cur.last === pathname) return;
    write({ ...cur, pages: cur.last ? cur.pages + 1 : cur.pages, last: pathname });
  }, [pathname]);

  return null;
}
