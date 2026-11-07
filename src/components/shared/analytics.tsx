"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsConfig } from "@/config/analytics";
import { markAdAction } from "@/components/shared/ad-click-log";

type W = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...a: unknown[]) => void;
  wcs?: { inflow?: (domain?: string) => void; trans?: (conv: Record<string, unknown>) => void };
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
};

/**
 * 네이버 광고 전환(wcs.trans) 종류 — 광고 보고서에 숫자로 보이는 종류만 씀
 *  · 예약 신청 → schedule · 견적/시즌/스냅 문의 접수 → lead
 *  · 전화·카톡·메신저 버튼 → custom001 · 스마트스토어로 이동 → custom002
 *  (상담 메뉴 열기·준비 중 상품 클릭은 전환 아님)
 */
export function naverConvType(name: string, params: Record<string, string | number> = {}): string {
  switch (name) {
    case "booking_submit":
      return "schedule";
    case "inquiry_submit":
    case "season_inquiry_submit":
    case "snap_submit":
      return "lead";
    case "contact_click":
      return params.channel === "toggle" ? "" : "custom001";
    case "pay_smartstore_click":
    case "season_store_click":
      return "custom002";
    case "store_product_click":
      return params.coming_soon === "yes" ? "" : "custom002";
    default:
      return "";
  }
}

const SITE_DOMAIN = "jinoski.com";

/** 네이버: 애널리틱스 방문 기록 + 광고 전환용 방문 기록 (wcslog는 호출할 때의 wcs_add.wa를 읽어서 키를 바꿔 가며 보냄) */
function naverPageView() {
  const w = window as W;
  const { naverId, naverAdKey } = analyticsConfig;
  if (!w.wcs || !w.wcs_do) return;
  w.wcs_add = w.wcs_add || {};
  try {
    if (naverAdKey) {
      w.wcs_add["wa"] = naverAdKey;
      w.wcs.inflow?.(SITE_DOMAIN); // 광고로 들어온 정보(NaPm)를 쿠키에 저장 → 나중 페이지의 전환과 연결
      w.wcs_do();
    }
    if (naverId) {
      w.wcs_add["wa"] = naverId;
      w.wcs_do();
    }
  } catch {}
}

/** 네이버 광고 전환 신호 보내기 */
function naverConversion(type: string) {
  const w = window as W;
  const { naverId, naverAdKey } = analyticsConfig;
  if (!type || !naverAdKey || !w.wcs?.trans) return;
  w.wcs_add = w.wcs_add || {};
  try {
    w.wcs_add["wa"] = naverAdKey;
    w.wcs.trans({ type });
  } catch {}
  if (naverId) w.wcs_add["wa"] = naverId;
}

/** 예약 신청 같은 주요 행동을 집계해요 (분석 ID가 없으면 아무 일도 하지 않아요). */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  markAdAction(name);
  naverConversion(naverConvType(name, params));
  const w = window as W;
  try {
    if (w.gtag) w.gtag("event", name, params);
    else if (w.dataLayer) w.dataLayer.push({ event: name, ...params });
  } catch {}
}

export function Analytics() {
  const { naverId, naverAdKey, gaId, gtmId } = analyticsConfig;
  const pathname = usePathname();

  // 네이버 애널리틱스: 페이지 이동마다 방문 기록
  useEffect(() => {
    if (!naverId && !naverAdKey) return;
    naverPageView();
  }, [naverId, naverAdKey, pathname]);

  if (!naverId && !naverAdKey && !gaId && !gtmId) return null;
  return (
    <>
      {(naverId || naverAdKey) && (
        <Script
          src="https://wcs.pstatic.net/wcslog.js"
          strategy="afterInteractive"
          onLoad={naverPageView}
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
