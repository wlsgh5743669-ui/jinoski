"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/config/site";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = { ko: "KO", en: "EN", zh: "中" };

export function LanguageSwitcher({
  className,
  dark,
}: {
  className?: string;
  dark?: boolean;
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
            "rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors",
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
