"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsConfig } from "@/config/analytics";

type W = Window & {
  gtag?: (...a: unknown[]) => void;
  wcs?: unknown;
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
};

/** 예약 신청 같은 주요 행동을 집계해요 (분석 ID가 없으면 아무 일도 하지 않아요). */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  try {
    w.gtag?.("event", name, params);
  } catch {}
}

export function Analytics() {
  const { naverId, gaId } = analyticsConfig;
  const pathname = usePathname();

  // 네이버 애널리틱스: 페이지 이동마다 방문 기록
  useEffect(() => {
    if (!naverId) return;
    const w = window as W;
    w.wcs_add = w.wcs_add || {};
    w.wcs_add["wa"] = naverId;
    if (w.wcs && w.wcs_do) w.wcs_do();
  }, [naverId, pathname]);

  if (!naverId && !gaId) return null;
  return (
    <>
      {naverId && (
        <Script
          src="https://wcs.naver.net/wcslog.js"
          strategy="afterInteractive"
          onLoad={() => {
            const w = window as W;
            w.wcs_add = w.wcs_add || {};
            w.wcs_add["wa"] = naverId;
            w.wcs_do?.();
          }}
        />
      )}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
