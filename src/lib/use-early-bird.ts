"use client";

import { useSyncExternalStore } from "react";
import { isEarlyBirdActive } from "@/lib/pricing";

const noSubscribe = () => () => {};

/**
 * 얼리버드 기간인지 (한국 시간 기준).
 * 정적 HTML은 얼리버드판으로 만들어지고, 브라우저에서 오늘 날짜로 다시 판단해요
 * (11/11부터는 손대지 않아도 정가로 바뀌어요 · hydration 경고 없이).
 */
export function useEarlyBird(): boolean {
  return useSyncExternalStore(noSubscribe, isEarlyBirdActive, () => true);
}
