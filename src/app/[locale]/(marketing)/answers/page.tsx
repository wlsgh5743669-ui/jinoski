import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getContent, isLocale } from "@/config/site";
import { ANSWERS } from "@/config/content/answers";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";

const TITLE = "강사가 답해요 — 비발디파크 스키강습 질문";
const DESCRIPTION =
  "아이 스키 몇 살부터인지, 비발디파크 스키강습 고르는 법, 1:1과 1:3 차이까지 — 예약 전에 가장 많이 묻는 질문에 지노스키 박진호 강사가 요금·시간 숫자와 함께 답했어요.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ko") return {};
  const site = getContent("ko").siteConfig;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/ko/answers/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: "/ko/answers/",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [site.ogImage] },
  };
}

export default async function AnswersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ko") notFound();
  return (
    <>
      <PageHero
        eyebrow="지노스키 강사가 답해요"
        title={["예약 전에 많이 묻는", "질문에 답했어요"]}
        description="비발디파크에서 8시즌 넘게 가르친 박진호 강사가 요금·시간 숫자까지 넣어 정리했어요."
      />
      <section className="bg-ice-200 py-14 sm:py-20">
        <Container>
          <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {ANSWERS.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/answers/${a.slug}`}
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-snow-300/60 transition-shadow hover:shadow-lg"
                >
                  <h2 className="text-[18px] font-bold leading-snug text-ink-900">{a.question}</h2>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-snow-700">{a.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-brand-600">
                    자세히 보기 <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
