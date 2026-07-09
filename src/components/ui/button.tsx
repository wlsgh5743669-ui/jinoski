import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-white shadow-[0_8px_30px_-8px_rgba(45,168,255,0.6)] hover:bg-brand-600 hover:shadow-[0_12px_36px_-8px_rgba(45,168,255,0.75)] active:scale-[0.98]",
        outline:
          "border border-white/30 bg-white/5 text-white backdrop-blur-md hover:bg-white/15 hover:border-white/50 active:scale-[0.98]",
        dark:
          "bg-ink-900 text-white hover:bg-ink-800 active:scale-[0.98]",
        ghost:
          "text-ink-900 hover:bg-ink-900/5 active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5 text-[13px]",
        lg: "h-14 px-9 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
