"use client";

import { Bell, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { useContent } from "@/lib/use-content";
import { displayPhone, getConsult, kakaoAddFriendUrl } from "@/config/content/consult";
import { trackEvent } from "@/components/shared/analytics";
import { InquiryForm } from "@/components/sections/inquiry-form";

/** 홈 '상담 안내' 구간: 카카오톡 채널(외국어는 이메일) + 24시간 유선 상담 */
export function Consult() {
  const locale = useLocale();
  const { contact } = useContent();
  const t = getConsult(locale);
  const ko = locale === "ko";

  return (
    <section id="consult" className="bg-ice-200 py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-brand-500">{t.eyebrow}</p>
            <h2 className="mt-2 text-[26px] font-bold tracking-tight text-ink-900 sm:text-[34px]" style={{ textWrap: "balance" }}>
              {t.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-snow-500">{t.description}</p>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {/* 카카오톡 채널 / 이메일 */}
          <Reveal delay={0.05}>
            <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(10,11,13,0.35)] ring-1 ring-snow-300/60">
              <div className="flex items-center gap-3">
                <span
                  className={
                    ko
                      ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE500] text-[#191919]"
                      : "flex h-12 w-12 items-center justify-center rounded-2xl bg-snow-100 text-ink-900"
                  }
                >
                  {ko ? <MessageCircle size={24} fill="currentColor" /> : <Mail size={22} />}
                </span>
                <h3 className="text-[19px] font-bold text-ink-900">{t.kakao.title}</h3>
              </div>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-snow-700">{t.kakao.body}</p>
              {!ko && <p className="mt-2 select-all text-[15px] font-semibold text-ink-900">{contact.email}</p>}
              <a
                href={ko ? contact.kakaoChannel : "#inquiry"}
                target={ko ? "_blank" : undefined}
                rel={ko ? "noreferrer" : undefined}
                onClick={() => trackEvent("contact_click", { channel: ko ? "kakao" : "email", place: "home" })}
                className={
                  ko
                    ? "mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[15px] font-bold text-[#191919] transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    : "mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 text-[15px] font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.98]"
                }
                style={{ height: 52 }}
              >
                {ko ? <MessageCircle size={18} fill="currentColor" /> : <Mail size={18} />}
                {t.kakao.button}
              </a>
              {"addButton" in t.kakao && (
                <>
                  <a
                    href={kakaoAddFriendUrl(contact.kakaoChannel)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("contact_click", { channel: "kakao_add", place: "home" })}
                    className="mt-2.5 inline-flex items-center justify-center gap-2 rounded-full border border-snow-300 bg-white text-[14.5px] font-semibold text-ink-900 transition-colors hover:border-[#E5CE00] hover:bg-[#FFFBE0]"
                    style={{ height: 48 }}
                  >
                    <Bell size={16} />
                    {t.kakao.addButton}
                  </a>
                  <p className="mt-2 text-center text-[12.5px] text-snow-500">{t.kakao.addHint}</p>
                </>
              )}
            </div>
          </Reveal>

          {/* 유선 상담 */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(10,11,13,0.35)] ring-1 ring-snow-300/60">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Phone size={22} />
                </span>
                <h3 className="text-[19px] font-bold text-ink-900">{t.phone.title}</h3>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
                  <Clock size={13} />
                  {t.phone.hours}
                </span>
              </div>
              <p className="mt-4 select-all text-[24px] font-bold tracking-tight text-ink-900 tabular-nums">
                {displayPhone(contact.phone, locale)}
              </p>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-snow-700">{t.phone.body}</p>
              <a
                href={contact.phoneHref}
                onClick={() => trackEvent("contact_click", { channel: "phone", place: "home" })}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.98]"
                style={{ height: 52 }}
              >
                <Phone size={18} />
                {t.phone.button}
              </a>
            </div>
          </Reveal>
        </div>
        {!ko && <InquiryForm />}
      </Container>
    </section>
  );
}
