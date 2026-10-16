import { useLocale } from "next-intl";
import { paymentConfig } from "@/config/payments";

/** 원화 금액 → "≈ $115" (50달러 이상은 5달러 단위로 올림, 그 아래는 1달러 단위 올림) */
export function approxUsd(krw: number): string {
  const usd = krw / paymentConfig.usdRate;
  const rounded = usd >= 50 ? Math.ceil(usd / 5) * 5 : Math.max(1, Math.ceil(usd));
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
