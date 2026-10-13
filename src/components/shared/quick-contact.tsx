"use client";

import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { getConsult } from "@/config/content/consult";
import { trackEvent } from "@/components/shared/analytics";

const LABELS = {
  ko: { kakao: "카톡", email: "메일", insta: "인스타", phone: "전화" },
  en: { kakao: "Kakao", email: "Email", insta: "Insta", phone: "Call" },
  zh: { kakao: "Kakao", email: "邮件", insta: "Insta", phone: "电话" },
} as const;

/**
 * 모든 페이지 오른쪽 옆에 떠 있는 작은 상담 바.
 * 한국어: 카톡 · 인스타 · 전화 / 영어·중국어: 메일 · 인스타 · 전화
 */
export function QuickContact() {
  const locale = useLocale();
  const { contact } = useContent();
  const t = getConsult(locale);
  const l = LABELS[(locale in LABELS ? locale : "ko") as keyof typeof LABELS];
  const ko = locale === "ko";

  const items = [
    ko
      ? {
          key: "kakao",
          href: contact.kakaoChannel,
          external: true,
          label: l.kakao,
          aria: t.kakao.button,
          circle: "bg-[#FEE500] text-[#191919]",
          icon: <MessageCircle size={18} fill="currentColor" />,
        }
      : {
          key: "email",
          href: `/${locale}/#inquiry`,
          external: false,
          label: l.email,
          aria: t.kakao.button,
          circle: "bg-ink-900 text-white",
          icon: <Mail size={17} />,
        },
    {
      key: "instagram",
      href: contact.instagram,
      external: true,
      label: l.insta,
      aria: "Instagram @jino_ski",
      circle: "bg-[linear-gradient(45deg,#F58529_0%,#DD2A7B_50%,#8134AF_80%,#515BD4_100%)] text-white",
      icon: <Instagram size={18} />,
    },
    {
      key: "phone",
      href: contact.phoneHref,
      external: false,
      label: l.phone,
      aria: t.phone.button,
      circle: "bg-brand-500 text-white",
      icon: <Phone size={17} />,
    },
  ];

  return (
    <nav
      aria-label="Contact"
      className="fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] right-2.5 z-40 flex flex-col items-center gap-2 rounded-full bg-white/95 px-1.5 py-2.5 shadow-[0_10px_30px_-12px_rgba(10,11,13,0.45)] ring-1 ring-snow-300/60 backdrop-blur sm:bottom-8 sm:right-5 sm:gap-2.5 sm:px-2 sm:py-3"
    >
      {items.map((it) => (
        <a
          key={it.key}
          href={it.href}
          target={it.external ? "_blank" : undefined}
          rel={it.external ? "noreferrer" : undefined}
          onClick={() => trackEvent("contact_click", { channel: it.key, place: "float" })}
          aria-label={it.aria}
          className="group flex flex-col items-center gap-0.5"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110 group-active:scale-95 sm:h-10 sm:w-10 ${it.circle}`}
          >
            {it.icon}
          </span>
          <span className="text-[10px] font-semibold leading-none text-ink-800 sm:text-[10.5px]">{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
