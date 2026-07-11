import { ko } from "./content/ko";
import { en } from "./content/en";
import { zh } from "./content/zh";
import type { SiteContent } from "./content/types";

export const locales = ["ko", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

const contentMap: Record<Locale, SiteContent> = { ko, en, zh };

export function getContent(locale: Locale): SiteContent {
  return contentMap[locale];
}

export type { SiteContent } from "./content/types";
