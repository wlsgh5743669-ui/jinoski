"use client";

import { ConsentBox, marketingTag } from "@/components/shared/consent-box";
import { attributionText } from "@/components/shared/attribution";
import { useState } from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import { useLocale } from "next-intl";
import { useContent } from "@/lib/use-content";
import { trackEvent } from "@/components/shared/analytics";

const KAKAO_NOTIFY_URL =
  process.env.NEXT_PUBLIC_KAKAO_NOTIFY_URL || "https://jinoski-notify.wlsgh5743669.workers.dev";

const T = {
  en: {
    title: "Send us a question",
    lead: "Fill in what you know — we'll reply by email within 24 hours.",
    name: "Your name",
    email: "Your email",
    dates: "Preferred date(s)",
    datesPh: "e.g. Jan 10–12, 2027",
    people: "Number of people",
    sport: "Ski or snowboard",
    level: "Level",
    message: "Your question",
    messagePh: "Ages of the students, lesson length, rental, pick-up questions…",
    sports: ["Ski", "Snowboard", "Not sure yet"],
    levels: ["First time", "Beginner", "Intermediate", "Advanced"],
    send: "Send inquiry",
    sending: "Sending…",
    required: "Please enter your name and a valid email.",
    doneTitle: "Thank you! We received your inquiry.",
    doneBody: (email: string) =>
      `We'll reply to ${email} within 24 hours. Please check your spam folder if you don't see it.`,
    failTitle: "Your inquiry could not be sent automatically",
    failBody: "Please copy your message below and email it to us, or open it in your email app.",
    openMail: "Open in my email app",
    copy: "Copy message",
    copied: "Copied",
    subject: "Lesson inquiry from",
    privacy: "We use your name and email only to answer this inquiry.",
  },
  zh: {
    title: "在线咨询",
    lead: "填写您知道的信息即可，我们会在24小时内通过邮件回复。",
    name: "姓名",
    email: "电子邮箱",
    dates: "希望日期",
    datesPh: "例：2027年1月10日–12日",
    people: "人数",
    sport: "双板 / 单板",
    level: "水平",
    message: "咨询内容",
    messagePh: "学员年龄、课程时长、装备租赁、接送等问题…",
    sports: ["双板滑雪", "单板滑雪", "还没决定"],
    levels: ["第一次", "初级", "中级", "高级"],
    send: "发送咨询",
    sending: "发送中…",
    required: "请填写姓名和正确的邮箱地址。",
    doneTitle: "谢谢！我们已收到您的咨询。",
    doneBody: (email: string) => `我们会在24小时内回复至 ${email}。如未收到，请查看垃圾邮件箱。`,
    failTitle: "咨询未能自动发送",
    failBody: "请复制下方内容发送邮件给我们，或在邮件应用中打开。",
    openMail: "在邮件应用中打开",
    copy: "复制内容",
    copied: "已复制",
    subject: "课程咨询 -",
    privacy: "您的姓名和邮箱仅用于回复本次咨询。",
  },
} as const;

const SPORT_KO = ["스키", "스노보드", "미정"];
const LEVEL_KO = ["처음", "초급", "중급", "상급"];
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** 영어·중국어 홈의 문의 폼: 보내면 사장님 카톡으로 바로 알림, 답장은 이메일로 */
export function InquiryForm() {
  const locale = useLocale();
  const { contact } = useContent();
  const t = T[(locale === "zh" ? "zh" : "en") as "en" | "zh"];

  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [people, setPeople] = useState("");
  const [sport, setSport] = useState(-1);
  const [level, setLevel] = useState(-1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const summary = [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    dates.trim() && `Dates: ${dates.trim()}`,
    people.trim() && `People: ${people.trim()}`,
    sport >= 0 && `Sport: ${t.sports[sport]}`,
    level >= 0 && `Level: ${t.levels[level]}`,
    message.trim() && `\n${message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(`${t.subject} ${name.trim()}`)}&body=${encodeURIComponent(summary)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    if (!name.trim() || !isEmail(email)) {
      setError(t.required);
      return;
    }
    setError("");
    setState("sending");
    trackEvent("inquiry_submit", { locale });
    try {
      const res = await fetch(KAKAO_NOTIFY_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: name.trim(),
          phone: email.trim(),
          date: dates.trim() || "날짜 미정",
          program: `외국인 문의(${locale === "zh" ? "중국어" : "영어"}) · 이메일 회신`,
          timeSlot: "",
          groupSize: people.trim() ? `${people.trim()}명` : "인원 미정",
          equipment: sport >= 0 ? SPORT_KO[sport] : "",
          level: level >= 0 ? LEVEL_KO[level] : "",
          total: "",
          note: [message.trim(), marketingTag(marketing), attributionText()].filter(Boolean).join(" / "),
        }),
      });
      setState(res.ok ? "done" : "fail");
    } catch {
      setState("fail");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${contact.email}\n\n${summary}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const input =
    "h-12 w-full rounded-2xl border border-snow-300/70 bg-white px-4 text-[15px] text-ink-900 outline-none transition-colors focus:border-brand-500";
  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
      on ? "border-brand-500 bg-brand-50 text-brand-600" : "border-snow-300/70 bg-white text-ink-800 hover:border-brand-300"
    }`;

  if (state === "done" || state === "fail") {
    const ok = state === "done";
    return (
      <div id="inquiry" className="mx-auto mt-4 max-w-4xl scroll-mt-28 rounded-3xl bg-white p-7 ring-1 ring-snow-300/60">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full ${ok ? "bg-brand-50 text-brand-600" : "bg-rose-50 text-rose-500"}`}>
            {ok ? <Check size={22} /> : <Mail size={20} />}
          </span>
          <h3 className="text-[19px] font-bold text-ink-900">{ok ? t.doneTitle : t.failTitle}</h3>
        </div>
        <p className="mt-3 text-[14.5px] leading-relaxed text-snow-700">{ok ? t.doneBody(email.trim()) : t.failBody}</p>
        {!ok && (
          <>
            <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-ice-200 p-4 text-[13.5px] text-ink-800">{summary}</pre>
            <p className="mt-3 select-all text-[15px] font-semibold text-ink-900">{contact.email}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a href={mailHref} className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-5 text-[14.5px] font-bold text-white">
                <Mail size={17} /> {t.openMail}
              </a>
              <button type="button" onClick={copy} className="inline-flex h-12 items-center gap-2 rounded-full border border-snow-300 px-5 text-[14.5px] font-semibold text-ink-900">
                <Copy size={16} /> {copied ? t.copied : t.copy}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <form
      id="inquiry"
      onSubmit={submit}
      noValidate
      className="mx-auto mt-4 grid max-w-4xl scroll-mt-28 gap-4 rounded-3xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(10,11,13,0.35)] ring-1 ring-snow-300/60"
    >
      <div>
        <h3 className="flex items-center gap-2 text-[19px] font-bold text-ink-900">
          <Mail size={20} className="text-brand-500" /> {t.title}
        </h3>
        <p className="mt-1.5 text-[14px] text-snow-500">{t.lead}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[13.5px] font-semibold text-ink-900">
          {t.name} *
          <input id="inq-name" className={input} value={name} onChange={(e) => { setName(e.target.value); setError(""); }} autoComplete="name" />
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold text-ink-900">
          {t.email} *
          <input id="inq-email" type="email" inputMode="email" className={input} value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" />
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold text-ink-900">
          {t.dates}
          <input id="inq-dates" className={input} placeholder={t.datesPh} value={dates} onChange={(e) => setDates(e.target.value)} />
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold text-ink-900">
          {t.people}
          <input id="inq-people" type="number" min={1} inputMode="numeric" className={input} value={people} onChange={(e) => setPeople(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink-900">{t.sport}</p>
          <div className="flex flex-wrap gap-2">
            {t.sports.map((s, i) => (
              <button key={s} type="button" className={chip(sport === i)} onClick={() => setSport(i)}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink-900">{t.level}</p>
          <div className="flex flex-wrap gap-2">
            {t.levels.map((s, i) => (
              <button key={s} type="button" className={chip(level === i)} onClick={() => setLevel(i)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <label className="grid gap-1.5 text-[13.5px] font-semibold text-ink-900">
        {t.message}
        <textarea
          id="inq-message"
          rows={4}
          className="w-full rounded-2xl border border-snow-300/70 bg-white px-4 py-3 text-[15px] font-normal text-ink-900 outline-none transition-colors focus:border-brand-500"
          placeholder={t.messagePh}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <ConsentBox locale={locale} agree={consent} onAgree={setConsent} marketing={marketing} onMarketing={setMarketing} />
      {error && <p className="text-[13.5px] font-medium text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending" || !consent}
        className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-500 text-[15px] font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        style={{ height: 52 }}
      >
        <Send size={17} /> {state === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
