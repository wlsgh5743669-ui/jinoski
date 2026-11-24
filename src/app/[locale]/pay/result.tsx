"use client";

// 토스 결제창에서 돌아오는 화면 (성공 /pay/success · 실패 /pay/fail).
// ⚠ 성공으로 돌아와도 아직 「결제 요청」 상태예요. 승인 서버가 시크릿 키로 /v1/payments/confirm 을 불러야 진짜 결제가 끝나요 (10분 안에).
// 승인 서버는 아직 없음 → 다음 단계에서 운영앱(또는 워커)에 붙일 것.
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { TOSS_TEST_MODE } from "@/config/toss";
import { KAKAO_CHAT_URL } from "@/components/shared/messenger-buttons";

type Lang = "ko" | "en" | "zh";

const T = {
  ko: {
    ok: "결제 요청이 들어왔어요",
    okTest: "테스트 결제라 실제로 돈이 나가지 않았어요.",
    fail: "결제가 되지 않았어요",
    retry: "다시 결제하기",
    order: "주문번호",
    amount: "금액",
    help: "카톡으로 문의하기",
  },
  en: {
    ok: "Payment request received",
    okTest: "This was a test, so nothing was charged.",
    fail: "Payment didn't go through",
    retry: "Try again",
    order: "Order",
    amount: "Amount",
    help: "Message us",
  },
  zh: {
    ok: "已收到付款请求",
    okTest: "这是测试，不会实际扣款。",
    fail: "付款未成功",
    retry: "重新付款",
    order: "订单号",
    amount: "金额",
    help: "联系我们",
  },
} as const;

export function PayResult({ lang, ok }: { lang: Lang; ok: boolean }) {
  const t = T[lang];
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => setQ(new URLSearchParams(window.location.search)), []);
  const amount = Number(q?.get("amount") ?? 0);

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <div className="mx-auto max-w-[520px] px-4 pb-16 pt-16 text-center">
        {ok ? (
          <CheckCircle2 size={56} className="mx-auto text-brand-600" />
        ) : (
          <XCircle size={56} className="mx-auto text-red-500" />
        )}
        <h1 className="mt-4 text-[22px] font-bold">{ok ? t.ok : t.fail}</h1>
        {ok && TOSS_TEST_MODE && <p className="mt-2 text-[14px] text-snow-500">{t.okTest}</p>}
        {!ok && q?.get("message") && <p className="mt-2 text-[14px] text-snow-500">{q.get("message")}</p>}

        {q?.get("orderId") && (
          <dl className="mx-auto mt-6 max-w-xs space-y-1.5 rounded-2xl border border-snow-300/70 p-4 text-left text-[13.5px]">
            <div className="flex justify-between gap-3">
              <dt className="text-snow-500">{t.order}</dt>
              <dd className="font-medium break-all">{q.get("orderId")}</dd>
            </div>
            {amount > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-snow-500">{t.amount}</dt>
                <dd className="font-medium">₩{amount.toLocaleString("en-US")}</dd>
              </div>
            )}
          </dl>
        )}

        {!ok && (
          <button
            type="button"
            onClick={() => history.back()}
            className="mt-6 w-full max-w-xs rounded-2xl bg-brand-700 py-3.5 text-[16px] font-bold text-white"
          >
            {t.retry}
          </button>
        )}
        <a href={KAKAO_CHAT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 block text-[13px] font-semibold text-brand-600 underline underline-offset-4">
          {t.help}
        </a>
      </div>
    </main>
  );
}
