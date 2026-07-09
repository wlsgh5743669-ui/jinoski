import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-50 px-4 py-1.5 text-[13px] font-medium tracking-tight text-brand-700",
        className
      )}
    >
      {children}
    </span>
  );
}
