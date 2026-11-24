import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { PayResult } from "../result";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  return <PayResult lang={l} ok={false} />;
}
