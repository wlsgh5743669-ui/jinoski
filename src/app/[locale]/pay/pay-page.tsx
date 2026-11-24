"use client";

// 💳 손님 결제 화면 (jinoski.com/ko/pay?a=금액&n=상품이름&c=손님이름&o=주문번호)
// 링크에 금액이 없으면 요금표 정찰제 상품을 골라 바로 결제 (대표 11-24 「바로 결제 할수있게」 · 토스페이먼츠 심사 「결제 상품이 바로 보이는 화면」)
// 토스페이먼츠 결제위젯: 국내 카드·간편결제·해외카드가 한 화면에. 흰 바탕 (대표 11-22 「흰색」).
// 금액은 링크에 적힌 값이라 손님이 바꿀 수 있어요 → 실제로 받기 전에 승인 서버에서 운영앱 견적 금액과 꼭 맞춰 볼 것.
import { useEffect, useRef, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { TOSS_CLIENT_KEY, TOSS_SDK, TOSS_TEST_MODE } from "@/config/toss";
import { KAKAO_CHAT_URL } from "@/components/shared/messenger-buttons";
import { useContent } from "@/lib/use-content";
import { calculateBookingPrice } from "@/lib/pricing";
import type { ProgramValue } from "@/lib/booking-options";
import type { SiteContent } from "@/config/content/types";

type Lang = "ko" | "en" | "zh";

const T = {
  ko: {
    head: "강습료 결제",
    sub: "지노스키 비발디파크 스키·스노보드 강습",
    item: "상품",
    who: "예약자",
    total: "결제 금액",
    pay: (w: string) => `${w} 결제하기`,
    loading: "결제 화면을 불러오는 중이에요…",
    test: "테스트 결제 — 실제로 돈이 나가지 않아요",
    safe: "카드 정보는 토스페이먼츠가 안전하게 처리해요. 지노스키는 카드 번호를 보지 않아요.",
    help: "결제가 안 되면 카톡으로 알려 주세요",
    bad: "결제 링크가 잘못됐어요. 받은 링크를 다시 눌러 주시거나 카톡으로 알려 주세요.",
    pick: "상품 고르기",
    pickNote: "요금표 그대로의 정찰제 금액이에요 (패찰 포함). 결제 뒤 날짜·시간을 정하고, 원하는 시간이 마감이면 전액 환불해 드려요.",
    defaultItem: "지노스키 강습",
    won: (n: number) => `${n.toLocaleString("ko-KR")}원`,
  },
  en: {
    head: "Lesson payment",
    sub: "JinoSki ski & snowboard lessons at Vivaldi Park",
    item: "Item",
    who: "Booked by",
    total: "Total",
    pay: (w: string) => `Pay ${w}`,
    loading: "Loading the payment form…",
    test: "Test payment — no money will be charged",
    safe: "Your card is processed securely by Toss Payments. JinoSki never sees your card number.",
    help: "Trouble paying? Message us",
    bad: "This payment link looks broken. Please open the link we sent again, or message us.",
    pick: "Choose a lesson",
    pickNote: "Fixed list prices (lift permit included). We set the date and time after payment and refund in full if your time is unavailable.",
    defaultItem: "JinoSki lesson",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
  zh: {
    head: "课程付款",
    sub: "JinoSki 大明维瓦尔第滑雪·单板课程",
    item: "商品",
    who: "预约人",
    total: "付款金额",
    pay: (w: string) => `支付 ${w}`,
    loading: "正在加载付款页面…",
    test: "测试付款 — 不会实际扣款",
    safe: "银行卡信息由 Toss Payments 安全处理，JinoSki 不会看到您的卡号。",
    help: "付款遇到问题？请联系我们",
    bad: "付款链接有误，请重新打开我们发送的链接或联系我们。",
    pick: "选择课程",
    pickNote: "价格表定价（含许可）。付款后确定日期和时间，如时间已满将全额退款。",
    defaultItem: "JinoSki 课程",
    won: (n: number) => `₩${n.toLocaleString("en-US")}`,
  },
} as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    TossPayments?: any;
  }
}

function loadSdk(): Promise<any> {
  if (window.TossPayments) return Promise.resolve(window.TossPayments);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = TOSS_SDK;
    s.onload = () => resolve(window.TossPayments);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

type Order = { amount: number; name: string; customer: string; orderId: string };
type Item = { key: string; name: string; amount: number };

const newOrderId = () => `JINO-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

/** 요금표(홈페이지 요금 안내와 같은 데이터)로 만든 정찰제 상품 — 레슨료 + 패찰 */
function fixedItems(content: SiteContent): Item[] {
  const items: Item[] = [];
  for (const g of content.lessonPricing) {
    for (const r of g.rows) {
      const p = calculateBookingPrice({ program: g.program as ProgramValue, groupSize: r.people, liftPassPayment: "pay-together", content });
      if (!p.priceOnRequest && p.totalPrice > 0)
        items.push({ key: `${g.program}-${r.people}`, name: `${content.programLabels[g.program as ProgramValue]} · ${r.people}`, amount: p.totalPrice });
    }
  }
  for (const f of content.fullCarePrograms) {
    for (const r of f.rows) {
      const p = calculateBookingPrice({ program: f.slug as ProgramValue, groupSize: r.people, liftPassPayment: "pay-together", content });
      if (!p.priceOnRequest && p.totalPrice > 0)
        items.push({ key: `${f.slug}-${r.people}`, name: `${content.programLabels[f.slug as ProgramValue]} · ${r.people.replace("p", "")}${content.siteConfig.locale.startsWith("ko") ? "명" : "p"}`, amount: p.totalPrice });
    }
  }
  return items;
}

/** 링크에 금액(a)이 있으면 그 주문, 없으면 undefined(상품 고르기 화면), 잘못된 링크면 null */
function readOrder(lang: Lang): Order | null | "pick" {
  const q = new URLSearchParams(window.location.search);
  if (!q.get("a")) return "pick";
  const amount = Number(q.get("a"));
  if (!Number.isInteger(amount) || amount < 100) return null;
  const rawId = q.get("o") ?? newOrderId();
  const orderId = rawId.replace(/[^A-Za-z0-9_=-]/g, "").slice(0, 64);
  if (orderId.length < 6) return null;
  return {
    amount,
    name: (q.get("n") ?? T[lang].defaultItem).slice(0, 100),
    customer: (q.get("c") ?? "").slice(0, 40),
    orderId,
  };
}

export function PayPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const content = useContent();
  const items = fixedItems(content);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [picking, setPicking] = useState(false);
  const [pickedKey, setPickedKey] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const widgets = useRef<any>(null);

  useEffect(() => {
    const r = readOrder(lang);
    if (r === "pick") {
      setPicking(true);
      const first = fixedItems(content)[0];
      if (first) {
        setPickedKey(first.key);
        setOrder({ amount: first.amount, name: `지노스키 ${first.name}`, customer: "", orderId: newOrderId() });
      }
    } else setOrder(r);
  }, [lang, content]);

  function pick(it: Item) {
    setPickedKey(it.key);
    setOrder((o) => (o ? { ...o, amount: it.amount, name: `지노스키 ${it.name}` } : o));
    widgets.current?.setAmount({ currency: "KRW", value: it.amount });
  }

  // 결제위젯은 그릴 칸(#toss-methods)이 화면에 생긴 뒤에 불러요
  const hasOrder = !!order;
  useEffect(() => {
    const o = order;
    if (!o || widgets.current) return;
    let cancelled = false;
    (async () => {
      try {
        const TossPayments = await loadSdk();
        const toss = TossPayments(TOSS_CLIENT_KEY);
        const w = toss.widgets({ customerKey: TossPayments.ANONYMOUS });
        await w.setAmount({ currency: "KRW", value: o.amount });
        await Promise.all([
          w.renderPaymentMethods({ selector: "#toss-methods", variantKey: "DEFAULT" }),
          w.renderAgreement({ selector: "#toss-agreement", variantKey: "AGREEMENT" }),
        ]);
        if (cancelled) return;
        widgets.current = w;
        setReady(true);
      } catch (e) {
        if (!cancelled) setErr(String((e as Error)?.message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
    // 금액만 바뀔 땐 위젯을 다시 그리지 않고 pick()에서 setAmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOrder]);

  async function pay() {
    if (!widgets.current || !order) return;
    setBusy(true);
    setErr("");
    try {
      const base = `${window.location.origin}/${lang}/pay`;
      await widgets.current.requestPayment({
        orderId: picking ? newOrderId() : order.orderId,
        orderName: order.name,
        customerName: order.customer || undefined,
        successUrl: `${base}/success/`,
        failUrl: `${base}/fail/`,
      });
    } catch (e) {
      // 손님이 결제창을 닫은 경우도 여기로 와요
      const code = (e as { code?: string })?.code;
      if (code !== "USER_CANCEL") setErr(String((e as Error)?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <div className="mx-auto max-w-[520px] px-4 pb-16 pt-8">
        <header className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="JinoSki" className="h-11 w-11 rounded-full border border-snow-300/70 object-contain p-1" />
          <div>
            <h1 className="text-[20px] font-bold leading-tight">{t.head}</h1>
            <p className="text-[13px] text-snow-500">{t.sub}</p>
          </div>
        </header>

        {TOSS_TEST_MODE && (
          <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] font-semibold text-amber-800">{t.test}</p>
        )}

        {order === null && <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">{t.bad}</p>}

        {picking && items.length > 0 && (
          <section className="mt-5">
            <h2 className="text-[15px] font-bold">{t.pick}</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-snow-500">{t.pickNote}</p>
            <div className="mt-3 grid gap-2">
              {items.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => pick(it)}
                  aria-pressed={pickedKey === it.key}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[14px] transition-colors ${
                    pickedKey === it.key ? "border-brand-600 bg-brand-50 font-semibold" : "border-snow-300/70 hover:border-brand-400"
                  }`}
                >
                  <span>{it.name}</span>
                  <span className="tabular-nums">{t.won(it.amount)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {order && (
          <>
            <section className="mt-5 rounded-2xl border border-snow-300/70 p-4 sm:p-5">
              <dl className="space-y-2 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-snow-500">{t.item}</dt>
                  <dd className="text-right font-medium">{order.name}</dd>
                </div>
                {order.customer && (
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-snow-500">{t.who}</dt>
                    <dd className="text-right font-medium">{order.customer}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-snow-300/60 pt-4">
                <span className="text-[14px] font-semibold text-snow-500">{t.total}</span>
                <span className="text-[26px] font-bold tracking-tight">{t.won(order.amount)}</span>
              </div>
            </section>

            {/* 토스 결제위젯이 이 두 칸에 그려져요 */}
            <div id="toss-methods" className="mt-4 -mx-2" />
            <div id="toss-agreement" className="-mx-2" />
            {!ready && !err && <p className="py-10 text-center text-[14px] text-snow-500">{t.loading}</p>}

            {err && <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{err}</p>}

            <button
              type="button"
              onClick={pay}
              disabled={!ready || busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
            >
              <Lock size={18} />
              {t.pay(t.won(order.amount))}
            </button>

            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-snow-500">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
              {t.safe}
            </p>
          </>
        )}

        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block text-center text-[13px] font-semibold text-brand-600 underline underline-offset-4"
        >
          {t.help}
        </a>
      </div>
    </main>
  );
}
