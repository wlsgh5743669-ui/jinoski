"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

function format(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function AnimatedNumber({
  target,
  decimals = 0,
  suffix = "",
  duration = 1.8,
  delay = 0,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const node = ref.current;
    if (!isInView || !node) return;

    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = `${format(value, decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, target, decimals, suffix, duration, delay]);

  return <span ref={ref}>{`${format(0, decimals)}${suffix}`}</span>;
}
