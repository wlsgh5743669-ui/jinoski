import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { NoticeList } from "@/components/sections/notice-list";

type L = "ko" | "en" | "zh";
const T = {
  ko: { eyebrow: "Notice", title: ["공지사항"], desc: "시즌 오픈, 이벤트, 운영 변경 소식을 알려드려요." },
  en: { eyebrow: "Notice", title: ["News & Notices"], desc: "Season opening, events and schedule updates from JinoSki." },
  zh: { eyebrow: "Notice", title: ["公告"], desc: "雪季开放、活动及运营变更等最新消息。" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : defaultLocale) as L;
  return pageMetadata({
    locale: l,
    path: "notice/",
    title: T[l].title.join(" "),
    description: T[l].desc,
    image: { url: "/images/og-image-2627.jpg", alt: T[l].title.join(" ") },
  });
}

export default async function NoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : defaultLocale) as L;
  const t = T[l];
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <section className="bg-ice-200 py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <NoticeList />
          </div>
        </Container>
      </section>
    </>
  );
}
