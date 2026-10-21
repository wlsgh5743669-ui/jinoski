"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

/** ?id=16자리 → 워커에 보관된 견적서 사진을 크게 보여줘요 (길게 눌러 저장) */
export function QuotePhoto() {
  const [id, setId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("id") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(/^[a-f0-9]{16}$/.test(v) ? v : "");
  }, []);
  const src = id ? `${API}/img/${id}.jpg` : "";
  return (
    <section className="bg-ice-100 px-3 py-5 md:py-10">
      <div className="mx-auto max-w-2xl">
        {id === null ? null : !src || failed ? (
          <p className="py-20 text-center text-[15px] text-snow-500">사진을 찾을 수 없어요. (보관 기간 90일이 지났거나 주소가 잘못됐어요)</p>
        ) : (
          <>
            <p className="mb-2 text-center text-[13px] text-snow-500">사진을 길게 누르면 저장할 수 있어요</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="견적서" onError={() => setFailed(true)} className="w-full rounded-2xl shadow-sm ring-1 ring-snow-300/60" />
            <div className="mt-3 flex justify-center gap-2">
              <a href={src} download={`지노스키_견적_${id}.jpg`} className="rounded-full bg-ink-900 px-5 py-2.5 text-[14px] font-bold text-white">
                사진 저장
              </a>
              <a href="/ko/quote/inbox/" className="rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-ink-900 ring-1 ring-snow-300/70">
                문의함
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
