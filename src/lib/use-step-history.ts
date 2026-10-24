"use client";

import { useEffect, useRef } from "react";

/**
 * 단계(step)형 화면에서 휴대폰·브라우저 「뒤로가기」를 누르면
 * 홈페이지를 나가지 않고 이전 단계로 돌아가게 해요.
 * - 단계가 앞으로 바뀔 때마다 주소 기록(history)에 한 칸씩 쌓아요.
 * - 뒤로가기(popstate) → 기록에 남은 단계로 이동. 첫 단계에서 뒤로가기는 원래대로 이전 페이지.
 */
export function useStepHistory(step: number, setStep: (n: number) => void, key: string) {
  const fromPop = useRef(false);
  const ready = useRef(false);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as Record<string, unknown> | null)?.[key];
      if (typeof s === "number") {
        fromPop.current = true;
        setStep(s);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [key, setStep]);

  useEffect(() => {
    const cur = (window.history.state as Record<string, unknown> | null)?.[key];
    if (!ready.current) {
      ready.current = true;
      window.history.replaceState({ ...(window.history.state ?? {}), [key]: step }, "");
      return;
    }
    if (fromPop.current) {
      fromPop.current = false;
      return;
    }
    if (cur === step) return;
    window.history.pushState({ ...(window.history.state ?? {}), [key]: step }, "");
  }, [step, key]);
}
