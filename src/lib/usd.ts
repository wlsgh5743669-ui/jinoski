import { useLocale } from "next-intl";
import { paymentConfig } from "@/config/payments";

/** 원화 금액 → "≈ $121" (1달러 단위 올림 — 상담 AI 가격표와 같은 숫자가 나오게, 대표 2026-11-15) */
export function approxUsd(krw: number): string {
  const usd = krw / paymentConfig.usdRate;
  const rounded = Math.max(1, Math.ceil(usd - 1e-9));
  return `≈ $${rounded.toLocaleString("en-US")}`;
}

/** 영어·중국어에서 "140,000 KRW" / "140,000韩元" 뒤에 "(≈ $110)"를 붙여요. 한국어는 그대로. */
export function withUsd(text: string, locale: string): string {
  if (locale === "ko" || !text) return text;
  return text.replace(/(\d{1,3}(?:,\d{3})+)\s?(KRW|韩元)(?!\s*\(≈)/g, (m, num: string) => {
    const krw = Number(num.replace(/,/g, ""));
    return `${m} (${approxUsd(krw)})`;
  });
}

export function useUsd() {
  const locale = useLocale();
  return (text: string) => withUsd(text, locale);
}
