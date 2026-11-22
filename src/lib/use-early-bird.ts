"use client";

import { useSyncExternalStore } from "react";
import { isEarlyBirdActive } from "@/lib/pricing";

const noSubscribe = () => () => {};

/**
 * 얼리버드 기간인지 (한국 시간 기준).
 * 정적 HTML은 빌드한 날 기준으로 만들어지고, 브라우저에서 오늘 날짜로 다시 판단해요
 * (11-22: 예전엔 정적 HTML이 늘 얼리버드판이라 끝난 뒤에도 처음 화면·검색에 얼리버드가 보였어요).
 */
export function useEarlyBird(): boolean {
  return useSyncExternalStore(noSubscribe, isEarlyBirdActive, () => isEarlyBirdActive());
}
