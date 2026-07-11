"use client";

import { useLocale } from "next-intl";
import { getContent, isLocale, defaultLocale } from "@/config/site";

export function useContent() {
  const locale = useLocale();
  return getContent(isLocale(locale) ? locale : defaultLocale);
}
