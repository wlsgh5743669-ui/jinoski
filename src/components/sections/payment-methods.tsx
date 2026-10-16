import { Building2, CreditCard, Globe } from "lucide-react";
import { Container } from "@/components/shared/container";
import { paymentConfig } from "@/config/payments";
import { getContent, type Locale } from "@/config/site";

const T = {
  ko: {
    eyebrow: "PAYMENT",
    title: "결제 방법",
    lead: "결제는 강사 일정이 확정된 뒤에 진행해 주세요. 확정 안내와 함께 결제 방법을 다시 알려드려요.",
    bank: { title: "계좌이체", body: "국민은행 010-4047-7711\n예금주 박진호(지노컴퍼니)" },
    store: { title: "네이버페이 · 카드", body: "네이버 스마트스토어에서 레슨 상품으로 결제할 수 있어요. 결제 후 네이버 리뷰도 남길 수 있어요.", button: "스마트스토어에서 결제" },
    paypal: null,
  },
  en: {
    eyebrow: "PAYMENT",
    title: "How to pay",
    lead: "Prices are set in Korean won (KRW); USD amounts shown on this site are approximate. Please pay after we confirm your instructor and time — your confirmation email includes the exact USD amount and payment link.",
    bank: { title: "Bank transfer (Korea)", body: "KB Kookmin Bank 010-4047-7711\nAccount holder: 박진호 (Jino Company)" },
    store: null,
    paypal: { title: "PayPal / international card", body: "Pay in USD with PayPal or any international card. We send the USD amount with your confirmation.", button: "Pay with PayPal" },
  },
  zh: {
    eyebrow: "PAYMENT",
    title: "付款方式",
    lead: "价格以韩元(KRW)为准，网站上的美元金额仅供参考。请在我们确认教练与时间后再付款，确认邮件中会附上准确的美元金额和付款链接。",
    bank: { title: "韩国银行转账", body: "国民银行 (KB) 010-4047-7711\n收款人：박진호 (Jino Company)" },
    store: null,
    paypal: { title: "PayPal / 国际信用卡", body: "可通过PayPal或国际信用卡以美元付款。确认时会告知美元金额。", button: "PayPal付款" },
  },
} as const;

/** 요금 안내 페이지 하단: 결제 방법 (설정된 것만 보여요) */
export function PaymentMethods({ locale }: { locale: Locale }) {
  const t = T[locale];
  const { contact } = getContent(locale);
  const storeUrl = paymentConfig.smartStoreLessons || contact.smartStore;
  const cards: { key: string; icon: React.ReactNode; title: string; body: string; href?: string; button?: string; tone: string }[] = [
    { key: "bank", icon: <Building2 size={22} />, title: t.bank.title, body: t.bank.body, tone: "bg-brand-50 text-brand-600" },
  ];
  if (t.store && storeUrl)
    cards.push({ key: "store", icon: <CreditCard size={22} />, title: t.store.title, body: t.store.body, href: storeUrl, button: t.store.button, tone: "bg-[#E8F9EE] text-[#03A94F]" });
  if (t.paypal && paymentConfig.paypalMe)
    cards.push({ key: "paypal", icon: <Globe size={22} />, title: t.paypal.title, body: t.paypal.body, href: paymentConfig.paypalMe, button: t.paypal.button, tone: "bg-[#E8F0FE] text-[#003087]" });

  return (
    <section id="payment" className="bg-white pb-20 pt-4 sm:pb-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.eyebrow}</p>
          <h2 className="mt-2 text-[24px] font-bold tracking-tight text-ink-900 sm:text-[30px]">{t.title}</h2>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-snow-500">{t.lead}</p>
          <div className={`mt-7 grid gap-4 ${cards.length > 1 ? "md:grid-cols-2" : ""}`}>
            {cards.map((c) => (
              <div key={c.key} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-snow-300/60">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.tone}`}>{c.icon}</span>
                  <h3 className="text-[17px] font-bold text-ink-900">{c.title}</h3>
                </div>
                <p className="mt-3 flex-1 whitespace-pre-line text-[14.5px] leading-relaxed text-snow-700">{c.body}</p>
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-ink-900 text-[14.5px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    {c.button}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
