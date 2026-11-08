import type { Metadata } from "next";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Faq } from "@/components/sections/faq";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { ANSWERS } from "@/config/content/answers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const content = getContent(resolvedLocale);
  return pageMetadata({
    locale: resolvedLocale,
    path: "faq/",
    title: content.pageMeta.faq.title,
    description: content.pageMeta.faq.description,
    image: { url: content.siteConfig.ogImage, alt: content.siteConfig.title },
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : defaultLocale);
  const { eyebrow, title, description } = content.ui.faq;
  // 질문·답을 구조화 데이터로도 — 검색 결과·AI 답변이 그대로 인용할 수 있게
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    about: { "@id": "https://jinoski.com/#org" },
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <Faq />
      {locale === "ko" && (
        <section className="bg-white pb-16 sm:pb-20">
          <Container>
            <div className="mx-auto max-w-3xl rounded-3xl bg-ice-200 p-6 ring-1 ring-snow-300/60 sm:p-7">
              <h2 className="text-[17px] font-bold text-ink-900">더 길게 답한 질문</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {ANSWERS.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/answers/${a.slug}`} className="text-[15px] font-semibold text-brand-600 hover:underline">
                      {a.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
