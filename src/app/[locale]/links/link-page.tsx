"use client";

// 📱 인스타그램 프로필 링크 한 곳에 모은 첫 화면 (jinoski.com/links → /ko/links/)
// 위쪽 메뉴·아래 꼬리 없이 버튼만. 버튼을 바꾸려면 아래 LINKS 만 고치면 돼요.
import {
  BookOpen,
  CalendarCheck,
  Calculator,
  ChevronRight,
  Globe,
  Instagram,
  MessageCircle,
  Phone,
  Receipt,
  ShoppingBag,
  Star,
  Users,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { trackEvent } from "@/components/shared/analytics";
import { KAKAO_CHAT_URL } from "@/components/shared/messenger-buttons";


type Lang = "ko" | "en" | "zh";

const SMART_STORE = "https://smartstore.naver.com/jinoski";
const BLOG = "https://blog.naver.com/jino_adventure";
const YOUTUBE = "https://www.youtube.com/@jino_adventure";
const INSTAGRAM = "https://www.instagram.com/jino_ski/";
const PHONE = "tel:+821040477711";

type Item = {
  key: string;
  icon: LucideIcon;
  href: (l: Lang) => string;
  external?: boolean;
  tone: "main" | "kakao" | "naver" | "plain";
  text: Record<Lang, [string, string]>;
};

const LINKS: Item[] = [
  {
    key: "instructor",
    icon: Users,
    href: (l) => `/${l}/instructor/`,
    tone: "plain",
    text: {
      ko: ["강사 소개", "강사 14명 자격증·경력 보고 고르기"],
      en: ["Our instructors", "14 certified instructors"],
      zh: ["教练介绍", "14 位教练的资格与经历"],
    },
  },
  {
    key: "reserve",
    icon: CalendarCheck,
    href: (l) => `/${l}/reserve/`,
    tone: "main",
    text: {
      ko: ["강습 예약하기", "날짜·시간·인원 고르고 바로 신청"],
      en: ["Book a lesson", "Pick date, time and group size"],
      zh: ["预约课程", "选择日期、时间和人数"],
    },
  },
  {
    key: "kakao",
    icon: MessageCircle,
    href: () => KAKAO_CHAT_URL,
    external: true,
    tone: "kakao",
    text: {
      ko: ["카톡으로 상담하기", "강사 일정·궁금한 것 바로 물어보세요"],
      en: ["Chat on KakaoTalk", "Ask about schedules and lessons"],
      zh: ["KakaoTalk 咨询", "教练时间、课程问题都可以问"],
    },
  },
  {
    key: "quote",
    icon: Calculator,
    href: (l) => `/${l}/quote/`,
    tone: "plain",
    text: {
      ko: ["가족·단체·연박 견적", "여러 날·여러 명 금액 계산"],
      en: ["Family & group quote", "Multi-day and group pricing"],
      zh: ["家庭·团体·连住报价", "多天、多人价格计算"],
    },
  },
  {
    key: "store",
    icon: ShoppingBag,
    href: () => SMART_STORE,
    external: true,
    tone: "naver",
    text: {
      ko: ["네이버 스마트스토어", "네이버페이로 예약·결제"],
      en: ["Naver Smart Store", "Pay with Naver Pay"],
      zh: ["Naver Smart Store", "使用 Naver Pay 付款"],
    },
  },
  {
    key: "pricing",
    icon: Receipt,
    href: (l) => `/${l}/pricing/`,
    tone: "plain",
    text: {
      ko: ["요금 안내", "강습·리프트·장비 요금 한눈에"],
      en: ["Prices", "Lessons, lift tickets and rentals"],
      zh: ["价格", "课程、缆车票、装备"],
    },
  },
  {
    key: "reviews",
    icon: Star,
    href: (l) => `/${l}/reviews/`,
    tone: "plain",
    text: {
      ko: ["실제 후기", "강습 받은 손님들이 남긴 글"],
      en: ["Reviews", "From our students"],
      zh: ["学员评价", "上过课的学员留言"],
    },
  },
  {
    key: "guide",
    icon: BookOpen,
    href: (l) => `/${l}/guide/`,
    tone: "plain",
    text: {
      ko: ["비발디파크 이용 가이드", "모이는 곳·오시는 길·준비물"],
      en: ["Vivaldi Park guide", "Meeting point, directions, what to bring"],
      zh: ["维瓦尔第使用指南", "集合地点、交通、准备物品"],
    },
  },
];

const SOCIAL: { key: string; icon: LucideIcon; href: string; label: string }[] = [
  { key: "instagram", icon: Instagram, href: INSTAGRAM, label: "Instagram" },
  { key: "blog", icon: BookOpen, href: BLOG, label: "Naver Blog" },
  { key: "youtube", icon: Youtube, href: YOUTUBE, label: "YouTube" },
  { key: "phone", icon: Phone, href: PHONE, label: "Call" },
];

const TOP: Record<Lang, { banner: string; name: string; line: string; home: string }> = {
  ko: { banner: "2026-27 시즌 강습 예약 받는 중", name: "지노스키앤보드스쿨", line: "비발디파크 스키·스노보드 강습 · 강사 14명", home: "홈페이지 전체 보기" },
  en: { banner: "Now booking the 2026-27 season", name: "JinoSki & Board School", line: "Ski and snowboard lessons at Vivaldi Park", home: "Visit our website" },
  zh: { banner: "2026-27 雪季课程预约中", name: "JinoSki 滑雪学校", line: "维瓦尔第滑雪场 双板·单板课程", home: "查看官网" },
};

const TONE: Record<Item["tone"], { box: string; icon: string; sub: string }> = {
  main: { box: "bg-brand-900 text-white ring-brand-900", icon: "bg-brand-500 text-white", sub: "text-brand-200" },
  kakao: { box: "bg-white text-ink-900 ring-snow-300/70", icon: "bg-[#FEE500] text-[#3A1D1D]", sub: "text-snow-700" },
  naver: { box: "bg-white text-ink-900 ring-snow-300/70", icon: "bg-[#03C75A] text-white", sub: "text-snow-700" },
  plain: { box: "bg-white text-ink-900 ring-snow-300/70", icon: "bg-brand-50 text-brand-700", sub: "text-snow-700" },
};

export function LinkPage({ lang }: { lang: Lang }) {
  const t = TOP[lang];
  const click = (key: string, external?: boolean) => {
    if (key === "kakao") trackEvent("contact_click", { channel: "kakao", from: "links" });
    else if (key === "store") trackEvent("pay_smartstore_click", { from: "links" });
    else if (key === "phone") trackEvent("contact_click", { channel: "phone", from: "links" });
    else trackEvent("links_click", { target: key, external: external ? "yes" : "no" });
  };

  return (
    <main className="min-h-[100svh] bg-ice-200 pb-10">
      <div className="mx-auto max-w-[480px]">
        <p className="bg-brand-900 py-2 text-center text-[12.5px] font-semibold tracking-tight text-brand-200">{t.banner}</p>
        <div
          className="h-[180px] bg-cover bg-center sm:h-[210px]"
          style={{ backgroundImage: "url(/images/team-group.jpg)" }}
          role="img"
          aria-label={t.name}
        />
        <div className="px-4">
          <div className="-mt-11 flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-ice-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="JinoSki" className="h-full w-full scale-[1.45] object-contain" />
          </div>
          <h1 className="mt-3 text-[22px] font-extrabold tracking-tight text-ink-900">{t.name}</h1>
          <p className="mt-0.5 text-[14px] text-snow-700">{t.line}</p>

          <ul className="mt-5 space-y-2.5">
            {LINKS.map((it) => {
              const Icon = it.icon;
              const tone = TONE[it.tone];
              const [title, sub] = it.text[lang];
              return (
                <li key={it.key}>
                  <a
                    href={it.href(lang)}
                    {...(it.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    onClick={() => click(it.key, it.external)}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 ring-1 transition-transform active:scale-[0.985] ${tone.box}`}
                  >
                    <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${tone.icon}`}>
                      <Icon size={21} strokeWidth={2.2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-bold leading-snug">{title}</span>
                      <span className={`block text-[12.5px] leading-snug ${tone.sub}`}>{sub}</span>
                    </span>
                    <ChevronRight size={18} className="flex-none opacity-50" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex justify-center gap-3">
            {SOCIAL.map((s) => {
              const Icon = s.icon;
              const ext = s.key !== "phone";
              return (
                <a
                  key={s.key}
                  href={s.href}
                  aria-label={s.label}
                  {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
                  onClick={() => click(s.key, ext)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-900 ring-1 ring-snow-300/70"
                >
                  <Icon size={21} aria-hidden />
                </a>
              );
            })}
          </div>

          <a
            href={`/${lang}/`}
            onClick={() => click("home")}
            className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-brand-700"
          >
            <Globe size={15} aria-hidden /> {t.home}
          </a>
          <p className="mt-4 text-center text-[12.5px] text-snow-500">
            {(["ko", "en", "zh"] as Lang[]).map((l, i) => (
              <span key={l}>
                {i > 0 && <span className="px-2">·</span>}
                <a href={`/${l}/links/`} className={l === lang ? "font-bold text-ink-900" : "underline-offset-2 hover:underline"}>
                  {l === "ko" ? "한국어" : l === "en" ? "English" : "中文"}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
