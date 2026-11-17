"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/config/site";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = { ko: "KO", en: "EN", zh: "中" };

export function LanguageSwitcher({
  className,
  dark,
  touch,
}: {
  className?: string;
  dark?: boolean;
  /** 휴대폰 위쪽 줄용: 손가락으로 누르기 쉽게 조금 크게 (대표 11-17) */
  touch?: boolean;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          aria-current={l === locale}
          className={cn(
            "rounded-full font-semibold transition-colors",
            touch ? "min-w-[34px] px-2.5 py-1.5 text-[13px]" : "px-2.5 py-1 text-[12.5px]",
            l === locale
              ? "bg-brand-500 text-white"
              : dark
                ? "text-white/60 hover:text-white"
                : "text-snow-500 hover:text-ink-900"
          )}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
