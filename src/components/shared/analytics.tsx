"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsConfig } from "@/config/analytics";

type W = Window & {
  dataLayer?: Record<string, unknown>[];
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
    if (w.gtag) w.gtag("event", name, params);
    else if (w.dataLayer) w.dataLayer.push({ event: name, ...params });
  } catch {}
}

export function Analytics() {
  const { naverId, gaId, gtmId } = analyticsConfig;
  const pathname = usePathname();

  // 네이버 애널리틱스: 페이지 이동마다 방문 기록
  useEffect(() => {
    if (!naverId) return;
    const w = window as W;
    w.wcs_add = w.wcs_add || {};
    w.wcs_add["wa"] = naverId;
    if (w.wcs && w.wcs_do) w.wcs_do();
  }, [naverId, pathname]);

  if (!naverId && !gaId && !gtmId) return null;
  return (
    <>
      {naverId && (
        <Script
          src="https://wcs.pstatic.net/wcslog.js"
          strategy="afterInteractive"
          onLoad={() => {
            const w = window as W;
            w.wcs_add = w.wcs_add || {};
            w.wcs_add["wa"] = naverId;
            w.wcs_do?.();
          }}
        />
      )}
      {gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
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
