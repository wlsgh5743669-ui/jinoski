"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { trackEvent } from "@/components/shared/analytics";
import { hasLine, hasWeChat, LINE_URL, WECHAT_ID, WECHAT_QR, whatsappHref } from "@/config/messengers";

export const MSG_COLORS = { whatsapp: "#25D366", line: "#06C755", wechat: "#07C160" } as const;

/** 위챗은 링크가 없어서 아이디·QR을 보여주는 창 */
export function WeChatModal({ onClose, locale }: { onClose: () => void; locale: string }) {
  const [copied, setCopied] = useState(false);
  const zh = locale === "zh";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/60 px-5" onClick={onClose}>
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button type="button" aria-label="close" onClick={onClose} className="-mr-2 -mt-2 p-2 text-snow-500">
            <X size={20} />
          </button>
        </div>
        <p className="text-[18px] font-bold text-ink-900">{zh ? "添加微信" : "Add us on WeChat"}</p>
        {WECHAT_QR && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={WECHAT_QR} alt="WeChat QR" className="mx-auto mt-4 w-48 rounded-xl ring-1 ring-snow-300/60" />
        )}
        {WECHAT_ID && (
          <>
            <p className="mt-4 text-[13px] text-snow-500">{zh ? "微信号" : "WeChat ID"}</p>
            <p className="mt-0.5 select-all text-[18px] font-bold text-ink-900">{WECHAT_ID}</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(WECHAT_ID);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full text-[14.5px] font-bold text-white"
              style={{ background: MSG_COLORS.wechat }}
            >
              {copied ? (zh ? "已复制 ✓" : "Copied ✓") : zh ? "复制微信号" : "Copy WeChat ID"}
            </button>
          </>
        )}
        <p className="mt-3 text-[12px] leading-relaxed text-snow-500">
          {zh ? "在微信中搜索微信号或扫描二维码添加好友" : "Search the ID or scan the QR code in WeChat"}
        </p>
      </div>
    </div>
  );
}

/** 예약 완료 화면 등에 넣는 큰 버튼 줄 */
export function MessengerButtons({ locale, place }: { locale: string; place: string }) {
  const [wc, setWc] = useState(false);
  const zh = locale === "zh";
  const btn = "inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full text-[14.5px] font-bold text-white transition-transform active:scale-[0.98]";
  const items = [
    ...(zh && hasWeChat() ? [{ key: "wechat", label: "WeChat", onClick: () => setWc(true) }] : []),
    { key: "whatsapp", label: "WhatsApp", href: whatsappHref(locale) },
    ...(hasLine() ? [{ key: "line", label: "LINE", href: LINE_URL }] : []),
    ...(!zh && hasWeChat() ? [{ key: "wechat", label: "WeChat", onClick: () => setWc(true) }] : []),
  ] as { key: keyof typeof MSG_COLORS; label: string; href?: string; onClick?: () => void }[];
  return (
    <>
      <div className="flex gap-2">
        {items.map((it) =>
          it.href ? (
            <a
              key={it.key}
              href={it.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("contact_click", { channel: it.key, place })}
              className={btn}
              style={{ background: MSG_COLORS[it.key] }}
            >
              <MessageCircle size={17} fill="currentColor" /> {it.label}
            </a>
          ) : (
            <button
              key={it.key}
              type="button"
              onClick={() => {
                trackEvent("contact_click", { channel: it.key, place });
                it.onClick?.();
              }}
              className={btn}
              style={{ background: MSG_COLORS[it.key] }}
            >
              <MessageCircle size={17} fill="currentColor" /> {it.label}
            </button>
          )
        )}
      </div>
      {wc && <WeChatModal locale={locale} onClose={() => setWc(false)} />}
    </>
  );
}
