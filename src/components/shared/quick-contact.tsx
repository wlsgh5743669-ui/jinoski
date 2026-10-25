"use client";

import { Calculator, Instagram, Mail, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { getConsult } from "@/config/content/consult";
import { trackEvent } from "@/components/shared/analytics";
import { hasLine, hasWeChat, LINE_URL, whatsappHref } from "@/config/messengers";
import { MSG_COLORS, WeChatModal } from "@/components/shared/messenger-buttons";

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
  const [open, setOpen] = useState(false);
  const [wc, setWc] = useState(false);
  // 스크롤하는 동안엔 살짝 투명하게 → 글자를 가리지 않게, 멈추면 다시 선명하게
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setScrolling(true);
      if (t) clearTimeout(t);
      t = setTimeout(() => setScrolling(false), 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (t) clearTimeout(t);
    };
  }, []);

  // 영어·중국어: 위챗(중국어 먼저) · 왓츠앱 · 라인
  const msgIcon = <MessageCircle size={18} fill="currentColor" />;
  const wechatItem = { key: "wechat", href: "#wechat", external: false, label: "WeChat", aria: "WeChat", circle: "text-white", bg: MSG_COLORS.wechat, icon: msgIcon };
  const messengers = ko
    ? []
    : [
        ...(locale === "zh" && hasWeChat() ? [wechatItem] : []),
        { key: "whatsapp", href: whatsappHref(locale), external: true, label: "WhatsApp", aria: "WhatsApp", circle: "text-white", bg: MSG_COLORS.whatsapp, icon: msgIcon },
        ...(hasLine() ? [{ key: "line", href: LINE_URL, external: true, label: "LINE", aria: "LINE", circle: "text-white", bg: MSG_COLORS.line, icon: msgIcon }] : []),
        ...(locale !== "zh" && hasWeChat() ? [wechatItem] : []),
      ];

  const items: { key: string; href: string; external: boolean; label: string; aria: string; circle: string; bg?: string; icon: React.ReactNode }[] = [
    ...messengers,
    // 한국어: 맨 위에 「견적」 — 가족·연박 손님이 바로 계산해 볼 수 있게
    ...(ko
      ? [
          {
            key: "quote",
            href: "/ko/quote/",
            external: false,
            label: "견적",
            aria: "가족·단체·연박 견적 계산",
            circle: "bg-[#03C75A] text-white",
            icon: <Calculator size={17} />,
          },
        ]
      : []),
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

  const toggleLabel = ko ? "상담" : locale === "zh" ? "咨询" : "Contact";
  return (
    <nav
      aria-label="Contact"
      className={`fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-3 z-40 flex flex-col items-center gap-2 transition-opacity duration-300 sm:bottom-8 sm:right-5 ${
        scrolling && !open ? "opacity-60 sm:opacity-100" : "opacity-100"
      }`}
    >
      {open && (
        <div className="flex flex-col items-center gap-2 rounded-full bg-white/95 px-1.5 py-2 shadow-[0_10px_30px_-12px_rgba(10,11,13,0.45)] ring-1 ring-snow-300/60 backdrop-blur">
      {items.map((it) => (
        <a
          key={it.key}
          href={it.href}
          target={it.external ? "_blank" : undefined}
          rel={it.external ? "noreferrer" : undefined}
          onClick={(e) => {
            trackEvent("contact_click", { channel: it.key, place: "float" });
            if (it.key === "wechat") {
              e.preventDefault();
              setWc(true);
            }
          }}
          aria-label={it.aria}
          className="group flex flex-col items-center gap-0.5"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110 group-active:scale-95 ${it.circle}`}
            style={it.bg ? { background: it.bg } : undefined}
          >
            {it.icon}
          </span>
          <span className="text-[10.5px] font-semibold leading-none text-ink-800">{it.label}</span>
        </a>
      ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); if (!open) trackEvent("contact_click", { channel: "toggle", place: "float" }); }}
        aria-expanded={open}
        aria-label={toggleLabel}
        className={`flex h-12 w-12 flex-col items-center justify-center rounded-full text-white shadow-[0_10px_30px_-10px_rgba(10,11,13,0.6)] transition-transform active:scale-95 ${open ? "bg-ink-900" : "bg-brand-500"}`}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} fill="currentColor" />}
        {!open && <span className="mt-0.5 text-[9.5px] font-bold leading-none">{toggleLabel}</span>}
      </button>
      {wc && <WeChatModal locale={locale} onClose={() => setWc(false)} />}
    </nav>
  );
}
