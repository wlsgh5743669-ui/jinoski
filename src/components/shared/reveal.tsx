"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "span";
};

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * 뷰포트에 들어올 때 fade + slide-up 되는 공용 애니메이션 래퍼.
 * 모든 섹션의 reveal 애니메이션은 이 컴포넌트를 재사용합니다.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 28,
  once = true,
  className,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: easeOut },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** 여러 자식을 순차적으로(stagger) 등장시키는 컨테이너 */
export function RevealGroup({
  children,
  stagger = 0.1,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};
