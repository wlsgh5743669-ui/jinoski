"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Camera, Copy, Gift, Instagram, Link2, Send, Sparkles, Trophy } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { useContent } from "@/lib/use-content";
import { getReviewEvent } from "@/config/content/review-event";

/** 홈 화면용 가로 배너 → 후기 페이지 이벤트 섹션으로 이동 */
export function ReviewEventBanner() {
  const e = getReviewEvent(useLocale());
  return (
    <section className="bg-white py-10 sm:py-14">
      <Container>
        <Link
          href="/reviews#review-event"
          className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-7 text-white shadow-[0_24px_60px_-24px_rgba(225,48,108,0.55)] sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Instagram size={28} />
            </div>
            <div>
              <span className="inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[12px] font-bold">{e.banner.badge}</span>
              <p className="mt-1.5 text-[20px] font-bold leading-snug tracking-tight sm:text-[24px]">{e.banner.title}</p>
              <p className="mt-1 text-[13.5px] text-white/85 sm:text-[15px]">{e.banner.description}</p>
            </div>
          </div>
          <span className="relative inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-[14px] font-bold text-[#C13584] transition-transform group-hover:scale-[1.03]">
            {e.banner.cta} →
          </span>
        </Link>
      </Container>
    </section>
  );
}

/** 후기 페이지 상단 이벤트 섹션 */
export function ReviewEvent() {
  const e = getReviewEvent(useLocale());
  const { contact } = useContent();
  const [copied, setCopied] = useState(false);
  const stepIcons = [Camera, Send, Link2];

  async function copy() {
    try {
      await navigator.clipboard.writeText(e.hashtags);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <section id="review-event" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-[28px] ring-1 ring-snow-300/60">
          <div className="relative bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <p className="relative flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.18em] text-white/80">
              <Sparkles size={15} /> {e.eyebrow}
            </p>
            <h2 className="relative mt-3 text-[28px] font-bold leading-tight tracking-tight sm:text-[38px]">{e.title}</h2>
            <p className="relative mt-3 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-[16.5px]">{e.description}</p>
            <p className="relative mt-4 inline-block rounded-full bg-white/20 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur-sm">{e.period}</p>
          </div>

          <div className="grid gap-10 bg-white px-6 py-10 sm:px-10 lg:grid-cols-2">
            <div>
              <h3 className="text-[19px] font-bold text-ink-900">{e.stepsTitle}</h3>
              <ol className="mt-5 space-y-4">
                {e.steps.map((s, i) => {
                  const Icon = stepIcons[i] ?? Camera;
                  return (
                    <li key={s.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FCE7F1] text-[#C13584]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-[15.5px] font-bold text-ink-900">
                          <span className="mr-1.5 text-[#C13584]">{String(i + 1).padStart(2, "0")}</span>
                          {s.title}
                        </p>
                        <p className="mt-0.5 text-[13.5px] leading-relaxed text-snow-700">{s.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-7 rounded-2xl bg-snow-100/70 p-4">
                <p className="text-[12.5px] font-semibold text-snow-500">{e.hashtagsLabel}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-[15px] font-bold text-ink-900">{e.hashtags}</p>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-[12.5px] font-semibold text-white"
                  >
                    <Copy size={13} /> {copied ? e.copied : e.copy}
                  </button>
                </div>
              </div>

              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-6 text-[14.5px] font-semibold text-white"
              >
                <Instagram size={18} /> {e.instagramCta}
              </a>
            </div>

            <div>
              <h3 className="text-[19px] font-bold text-ink-900">{e.rewardsTitle}</h3>
              <ul className="mt-5 space-y-3">
                {e.rewards.map((r) => (
                  <li
                    key={r.label}
                    className={`flex items-start gap-3 rounded-2xl p-4 ${r.highlight ? "bg-ink-900 text-white" : "bg-snow-100/70"}`}
                  >
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${r.highlight ? "bg-white/15 text-[#F9A8D4]" : "bg-white text-[#C13584]"}`}>
                      {r.highlight ? <Trophy size={18} /> : <Gift size={18} />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${r.highlight ? "text-white/70" : "text-snow-500"}`}>{r.label}</p>
                      <p className={`text-[15.5px] font-bold ${r.highlight ? "text-white" : "text-ink-900"}`}>{r.reward}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-snow-300/70 p-5">
                <p className="text-[14px] font-bold text-ink-900">{e.rulesTitle}</p>
                <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-snow-700">
                  {e.rules.map((r) => (
                    <li key={r}>· {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
