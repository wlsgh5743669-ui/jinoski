"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Camera, Check, Frame, Minus, Plus, Printer, MessageCircle, Smartphone } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { Lightbox } from "@/components/shared/lightbox";
import { RevealGroup, revealItem } from "@/components/shared/reveal";
import { getSnapContent, optionCost, type SnapPackage } from "@/config/content/snap";

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

function smsHref(phone: string, body: string) {
  const number = phone.replace(/[^0-9]/g, "");
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${number}${isIOS ? "&" : "?"}body=${encodeURIComponent(body)}`;
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-[26px] font-bold tracking-tight text-ink-900 sm:text-[34px]">{children}</h2>
      {sub && <p className="mt-2 text-[14.5px] text-snow-500 sm:text-[16px]">{sub}</p>}
    </div>
  );
}

export function SnapShoot() {
  const locale = useLocale();
  const s = getSnapContent(locale);
  const { contact } = useContent();
  const b = s.booking;

  const [lightbox, setLightbox] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pkg, setPkg] = useState<SnapPackage["id"]>("solo");
  const [noFrame, setNoFrame] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({ a2: 0, a4: 0, a6: 0 });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const selected = s.packages.find((p) => p.id === pkg)!;
  const lines = useMemo(() => {
    const out: { label: string; amount: number }[] = [{ label: `${b.programName} · ${selected.label}`, amount: selected.price }];
    if (noFrame) out.push({ label: s.noFrameLabel, amount: -s.noFrameDiscount });
    for (const o of s.options) {
      const q = qty[o.id] ?? 0;
      if (q > 0) out.push({ label: `${o.label} × ${q}`, amount: optionCost(o, q) });
    }
    return out;
  }, [b.programName, selected, noFrame, qty, s]);
  const total = lines.reduce((a, l) => a + l.amount, 0);

  const message = [
    `[${b.programName}] ${b.title}`,
    `${b.name}: ${name.trim()}`,
    `${b.phone}: ${phone.trim()}`,
    `${b.date}: ${date}`,
    `${b.time}: ${time}`,
    `${b.breakdown}:`,
    ...lines.map((l) => `· ${l.label} ${l.amount < 0 ? "-" : ""}${b.won(Math.abs(l.amount))}`),
    `${b.total}: ${b.won(total)}`,
    note.trim() ? `${b.note}: ${note.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const valid = date && time && name.trim() && phone.trim();

  async function notify() {
    try {
      await fetch(KAKAO_NOTIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date,
          program: b.programName,
          timeSlot: time,
          groupSize: `${selected.label}${noFrame ? ` (${s.noFrameLabel})` : ""}`,
          equipment: "",
          level: "",
          total: b.won(total),
          note: [lines.slice(1).map((l) => l.label).join(", "), note.trim()].filter(Boolean).join(" / "),
        }),
      });
    } catch {
      /* 알림 실패해도 고객 흐름은 계속 */
    }
  }

  async function onSms() {
    if (!valid) return setMsg(b.required);
    notify();
    setMsg(b.sentNotice);
    window.location.href = smsHref(contact.phone, message);
  }
  async function onKakao() {
    if (!valid) return setMsg(b.required);
    notify();
    try {
      await navigator.clipboard.writeText(message);
      setMsg(b.copied);
    } catch {
      setMsg(b.sentNotice);
    }
    window.open(contact.kakaoChannel, "_blank", "noopener");
  }

  const inputCls =
    "w-full rounded-xl border border-snow-300/70 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors focus:border-brand-500";

  return (
    <>
      {/* Intro + hero photo */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
            <button
              type="button"
              onClick={() => setLightbox(s.gallery[0])}
              className="group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(10,11,13,0.45)]"
            >
              <Image src={s.gallery[0]} alt={s.hero.title.join(" ")} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-lg shadow-brand-500/30">
                {s.intro.badge}
              </span>
            </button>
            <div>
              <h2 className="text-[26px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[34px]">{s.intro.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-snow-700 sm:text-[16.5px]">{s.intro.body}</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-[13.5px] font-semibold text-white">
                <Printer size={16} /> {s.intro.printerNote}
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2.5">
                {s.includes.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] font-medium text-ink-900">
                    <Check size={16} className="shrink-0 text-brand-500" /> {i}
                  </li>
                ))}
              </ul>
              <a href="#snap-booking" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-brand-600">
                {b.title}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Shot types */}
      <section className="bg-ice-gradient py-16 sm:py-24">
        <Container>
          <SectionTitle>{s.shotTypesTitle}</SectionTitle>
          <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.shotTypes.map((t) => (
              <motion.button
                type="button"
                key={t.title}
                variants={revealItem}
                onClick={() => setLightbox(t.image)}
                className="group overflow-hidden rounded-3xl bg-white text-left ring-1 ring-snow-300/50 shadow-[0_12px_32px_-16px_rgba(10,11,13,0.15)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={t.image} alt={t.title} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                </div>
                <div className="p-5">
                  <h3 className="flex items-center gap-2 text-[17px] font-bold text-ink-900">
                    <Camera size={17} className="text-brand-500" /> {t.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-snow-700">{t.description}</p>
                </div>
              </motion.button>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Gallery */}
      <section className="bg-ink-900 py-16 sm:py-24">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-[26px] font-bold tracking-tight text-white sm:text-[34px]">{s.galleryTitle}</h2>
            <p className="text-[13px] text-white/50">{s.galleryHint}</p>
          </div>
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
            {s.gallery.map((src, i) => (
              <button
                type="button"
                key={src}
                onClick={() => setLightbox(src)}
                className="group relative mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
              >
                <Image src={src} alt={`${s.galleryTitle} ${i + 1}`} width={1600} height={1000} sizes="(min-width:640px) 33vw, 50vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]" />
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <SectionTitle sub={s.pricingSubtitle}>{s.pricingTitle}</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {s.packages.map((p) => (
              <div key={p.id} className={`rounded-3xl p-7 ring-1 ${p.id === "duo" ? "bg-ink-900 text-white ring-ink-900" : "bg-white ring-snow-300/60"}`}>
                <p className={`text-[14px] font-semibold ${p.id === "duo" ? "text-brand-300" : "text-brand-600"}`}>{p.people}</p>
                <p className="mt-1 text-[22px] font-bold">{p.label}</p>
                <p className="mt-4 text-[30px] font-bold tracking-tight">{b.won(p.price)}</p>
                <p className={`mt-1 text-[13px] ${p.id === "duo" ? "text-white/60" : "text-snow-500"}`}>{s.pricingSubtitle}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13.5px] text-snow-500">
            ※ {s.noFrameLabel}: -{b.won(s.noFrameDiscount)}
          </p>

          <h3 className="mt-12 text-[20px] font-bold text-ink-900">{s.optionsTitle}</h3>
          <ul className="mt-4 divide-y divide-snow-300/50 rounded-3xl ring-1 ring-snow-300/60">
            {s.options.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <span>
                  <span className="block text-[15.5px] font-semibold text-ink-900">{o.label}</span>
                  <span className="text-[13px] text-snow-500">{o.detail}</span>
                </span>
                <span className="shrink-0 text-[16px] font-bold text-ink-900">{b.won(o.unitPrice)}~</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Print quality */}
      <section className="bg-ice-gradient py-16 sm:py-24">
        <Container>
          <SectionTitle>{s.printTitle}</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {s.printItems.map((p, i) => {
              const Icon = [Printer, Frame, Camera][i] ?? Printer;
              return (
                <div key={p.title} className="rounded-3xl bg-white p-7 ring-1 ring-snow-300/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-snow-700">{p.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <SectionTitle>{s.processTitle}</SectionTitle>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p) => (
              <li key={p.step} className="rounded-3xl bg-snow-100/60 p-6">
                <span className="text-[13px] font-bold tracking-[0.15em] text-brand-600">{p.step}</span>
                <h3 className="mt-2 text-[17px] font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-snow-700">{p.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-3xl bg-snow-100/60 p-6 sm:p-7">
            <h3 className="text-[16px] font-bold text-ink-900">{s.notesTitle}</h3>
            <ul className="mt-3 space-y-1.5 text-[13.5px] leading-relaxed text-snow-700">
              {s.notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Booking */}
      <section id="snap-booking" className="scroll-mt-24 bg-ink-900 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 sm:p-10">
            <h2 className="text-[24px] font-bold tracking-tight text-ink-900 sm:text-[30px]">{b.title}</h2>
            <p className="mt-1.5 text-[14px] text-snow-500">{b.subtitle}</p>

            <div className="mt-7 grid gap-5">
              <label className="grid gap-2">
                <span className="text-[14px] font-semibold text-ink-900">{b.date}</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
              </label>

              <div className="grid gap-2">
                <span className="text-[14px] font-semibold text-ink-900">{b.time}</span>
                <div className="grid grid-cols-3 gap-2">
                  {b.timeOptions.map((t) => (
                    <button key={t} type="button" onClick={() => setTime(t)} className={`rounded-xl border px-2 py-3 text-[13.5px] font-semibold transition-colors ${time === t ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 text-ink-900"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-[14px] font-semibold text-ink-900">{b.pkg}</span>
                <div className="grid grid-cols-3 gap-2">
                  {s.packages.map((p) => (
                    <button key={p.id} type="button" onClick={() => setPkg(p.id)} className={`rounded-xl border px-2 py-3 text-center transition-colors ${pkg === p.id ? "border-brand-500 bg-brand-50" : "border-snow-300/70"}`}>
                      <span className={`block text-[15px] font-bold ${pkg === p.id ? "text-brand-600" : "text-ink-900"}`}>{p.label}</span>
                      <span className="block text-[12px] text-snow-500">{b.won(p.price)}</span>
                    </button>
                  ))}
                </div>
                <label className="mt-1 flex cursor-pointer items-center gap-2 text-[13.5px] text-snow-700">
                  <input type="checkbox" checked={noFrame} onChange={(e) => setNoFrame(e.target.checked)} className="h-4 w-4 accent-brand-500" />
                  {b.noFrame}
                </label>
              </div>

              <div className="grid gap-2">
                <span className="text-[14px] font-semibold text-ink-900">{b.options}</span>
                {s.options.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-snow-300/70 px-4 py-3">
                    <span>
                      <span className="block text-[14.5px] font-semibold text-ink-900">{o.label}</span>
                      <span className="text-[12px] text-snow-500">{o.detail}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <button type="button" aria-label="minus" onClick={() => setQty((q) => ({ ...q, [o.id]: Math.max(0, (q[o.id] ?? 0) - 1) }))} className="flex h-8 w-8 items-center justify-center rounded-full border border-snow-300/70 text-ink-900">
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-[15px] font-bold tabular-nums">{qty[o.id] ?? 0}</span>
                      <button type="button" aria-label="plus" onClick={() => setQty((q) => ({ ...q, [o.id]: Math.min(50, (q[o.id] ?? 0) + 1) }))} className="flex h-8 w-8 items-center justify-center rounded-full border border-snow-300/70 text-ink-900">
                        <Plus size={14} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[14px] font-semibold text-ink-900">{b.name}</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </label>
                <label className="grid gap-2">
                  <span className="text-[14px] font-semibold text-ink-900">{b.phone}</span>
                  <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputCls} />
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-[14px] font-semibold text-ink-900">{b.note}</span>
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={b.notePlaceholder} className={inputCls} />
              </label>

              <div className="rounded-2xl bg-ink-900 p-5 text-white">
                <p className="text-[12.5px] font-semibold text-white/45">{b.breakdown}</p>
                <ul className="mt-2 space-y-1.5">
                  {lines.map((l) => (
                    <li key={l.label} className="flex justify-between gap-3 text-[14px]">
                      <span className="text-white/75">{l.label}</span>
                      <span className="tabular-nums font-semibold">{l.amount < 0 ? "-" : ""}{b.won(Math.abs(l.amount))}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-[16px] font-bold">
                  <span>{b.total}</span>
                  <span className="tabular-nums text-brand-300">{b.won(total)}</span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={onSms} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-600">
                  <Smartphone size={17} /> {b.smsButton}
                </button>
                <button type="button" onClick={onKakao} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] py-3.5 text-[15px] font-semibold text-[#191919] transition-opacity hover:opacity-90">
                  <MessageCircle size={17} /> {b.kakaoButton}
                </button>
              </div>
              {msg && <p className="text-center text-[13.5px] font-medium text-brand-600">{msg}</p>}
            </div>
          </div>
        </Container>
      </section>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
