"use client";

import Image from "next/image";
import { Check, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { trackEvent } from "@/components/shared/analytics";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { isEarlyBirdActive } from "@/lib/pricing";
import { storeProducts } from "@/config/store";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: "1", title: "상품 고르기", text: "아래에서 원하는 강습을 골라요" },
  { n: "2", title: "날짜·시간 선택 후 결제", text: "스마트스토어에서 네이버페이·카드로" },
  { n: "3", title: "강사 배정 연락", text: "일정 확인 후 카톡·문자로 확정 안내" },
];

export function StoreProducts() {
  const { contact } = useContent();
  const eb = isEarlyBirdActive();

  return (
    <section className="bg-ice-200 py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-6xl">
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-snow-300/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#03C75A] text-[16px] font-bold text-white">
                  {s.n}
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink-900">{s.title}</span>
                  <span className="block text-[13px] text-snow-600">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {storeProducts.map((p, i) => {
              const badge = eb && p.earlyBird ? p.earlyBird.badge : p.badge;
              const price = eb && p.earlyBird ? p.earlyBird.price : p.price;
              const href = p.url || contact.smartStore;
              return (
                <Reveal key={p.id} delay={(i % 4) * 0.05} className="h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-snow-300/60">
                    <div className="relative aspect-square overflow-hidden bg-snow-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className={cn("object-cover", p.comingSoon && "grayscale-[40%]")}
                                              />
                      {badge && (
                        <span
                          className={cn(
                            "absolute right-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold",
                            p.comingSoon
                              ? "bg-ink-900/80 text-white"
                              : eb && p.earlyBird
                                ? "bg-red-500 text-white"
                                : "bg-white text-ink-900 shadow"
                          )}
                        >
                          {badge}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur-sm">
                        {String(i + 1).padStart(2, "0")} / {String(storeProducts.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-[18px] font-bold leading-snug text-ink-900">{p.name}</h2>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-snow-700">{p.summary}</p>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-1.5 text-[13px] text-ink-800">
                            <Check size={15} className="mt-0.5 shrink-0 text-[#03C75A]" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-4">
                        {eb && p.earlyBird && (
                          <p className="text-[13px] text-snow-500 line-through">{p.price}</p>
                        )}
                        <p className={cn("text-[19px] font-bold", p.comingSoon ? "text-snow-500" : "text-ink-900")}>
                          {eb && p.earlyBird && <span className="mr-1.5 text-red-500">10%</span>}
                          {price}
                        </p>
                        {p.priceNote && <p className="text-[11.5px] text-snow-500">{p.priceNote}</p>}
                        {p.comingSoon ? (
                          <a
                            href={contact.kakaoChannel}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackEvent("store_product_click", { product: p.id, coming_soon: "yes" })}
                            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-snow-300 text-[14px] font-semibold text-ink-900 transition-colors hover:border-brand-500"
                          >
                            <MessageCircle size={16} /> 카톡으로 먼저 문의
                          </a>
                        ) : (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackEvent("store_product_click", { product: p.id })}
                            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-[#03C75A] text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                          >
                            <ShoppingBag size={16} /> 스토어에서 예약하기
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl bg-ink-900 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <p className="text-[18px] font-bold">어떤 상품이 맞을지 고민되세요?</p>
              <p className="mt-1 text-[14px] text-white/65">
                아이 나이·실력·인원만 알려주시면 딱 맞는 상품을 골라드려요. 계좌이체로 예약하실 분은 예약 문의를 이용해 주세요.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:shrink-0">
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-1.5 rounded-full bg-[#FEE500] px-5 text-[14px] font-semibold text-[#191919]"
              >
                <MessageCircle size={16} /> 카톡 상담
              </a>
              <a
                href={contact.phoneHref}
                className="inline-flex h-12 items-center gap-1.5 rounded-full border border-white/25 px-5 text-[14px] font-semibold"
              >
                <Phone size={16} /> 전화
              </a>
              <Link
                href="/reserve"
                className="inline-flex h-12 items-center rounded-full border border-white/25 px-5 text-[14px] font-semibold"
              >
                예약 문의
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
