"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { getConsult } from "@/config/content/consult";
import { trackEvent } from "@/components/shared/analytics";

/** 모든 페이지 오른쪽 아래에 떠 있는 상담 버튼 (한국어: 카톡·전화 / 외국어: 이메일·전화) */
export function QuickContact() {
  const locale = useLocale();
  const { contact } = useContent();
  const t = getConsult(locale);
  const ko = locale === "ko";

  return (
    <div className="pointer-events-none fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {ko ? (
        <a
          href={contact.kakaoChannel}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("contact_click", { channel: "kakao" })}
          aria-label={t.kakao.button}
          className="pointer-events-auto inline-flex w-[52px] items-center justify-center gap-2 rounded-full bg-[#FEE500] sm:w-auto sm:px-4 text-[14px] font-bold text-[#191919] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{ height: 52 }}
        >
          <MessageCircle size={20} fill="currentColor" />
          <span className="hidden sm:inline">{t.floatKakao}</span>
        </a>
      ) : (
        <a
          href={`mailto:${contact.email}`}
          onClick={() => trackEvent("contact_click", { channel: "email" })}
          aria-label={t.kakao.button}
          className="pointer-events-auto inline-flex w-[52px] items-center justify-center gap-2 rounded-full bg-white sm:w-auto sm:px-4 text-[14px] font-bold text-ink-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] ring-1 ring-snow-300/70 transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{ height: 52 }}
        >
          <Mail size={19} />
          <span className="hidden sm:inline">{t.floatKakao}</span>
        </a>
      )}
      <a
        href={contact.phoneHref}
        onClick={() => trackEvent("contact_click", { channel: "phone" })}
        aria-label={t.phone.button}
        className="pointer-events-auto inline-flex w-[52px] items-center justify-center gap-2 rounded-full bg-brand-500 sm:w-auto sm:px-4 text-[14px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(45,168,255,0.7)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
        style={{ height: 52 }}
      >
        <Phone size={19} />
        <span className="hidden sm:inline">{t.floatPhone}</span>
      </a>
    </div>
  );
}
