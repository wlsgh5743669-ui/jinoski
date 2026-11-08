import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { getContent, isLocale } from "@/config/site";
import { ANSWERS, ANSWERS_UPDATED, getAnswer, type AnswerBlock } from "@/config/content/answers";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getAnswer(slug);
  if (locale !== "ko" || !a) return {};
  const site = getContent("ko").siteConfig;
  const url = `/ko/answers/${a.slug}/`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: site.locale,
      siteName: site.name,
      url,
      title: a.title,
      description: a.description,
      images: [{ url: a.image.src, alt: a.image.alt }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: [a.image.src] },
  };
}

function Block({ b }: { b: AnswerBlock }) {
  if (b.type === "p") return <p className="text-[15.5px] leading-[1.85] text-snow-700">{b.text}</p>;
  if (b.type === "list")
    return (
      <ul className="flex flex-col gap-2.5">
        {b.items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[15px] leading-relaxed text-snow-700">
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    );
  return (
    <figure>
      <div className="overflow-x-auto rounded-2xl ring-1 ring-snow-300/70">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <caption className="bg-snow-100 px-4 py-2.5 text-left text-[13px] font-semibold text-ink-800">{b.caption}</caption>
          <thead>
            <tr className="bg-ink-900 text-white">
              {b.head.map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.join("|")} className="border-t border-snow-300/60 bg-white even:bg-ice-200">
                {r.map((c, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-4 py-2.5 font-semibold text-ink-900">
                      {c}
                    </th>
                  ) : (
                    <td key={i} className="px-4 py-2.5 text-snow-700">
                      {c}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.note && <figcaption className="mt-2 text-[13px] leading-relaxed text-snow-500">{b.note}</figcaption>}
    </figure>
  );
}

export default async function AnswerPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const a = getAnswer(slug);
  // 한국 손님이 묻는 질문이라 한국어 페이지만 만들어요
  if (!isLocale(locale) || locale !== "ko" || !a) notFound();
  const { contact } = getContent("ko");
  const url = `https://jinoski.com/ko/answers/${a.slug}/`;

  // 글 정보 — 누가 언제 쓴 답인지 검색엔진·AI가 알 수 있게
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.question,
    description: a.short,
    inLanguage: "ko",
    url,
    mainEntityOfPage: url,
    image: `https://jinoski.com${a.image.src}`,
    datePublished: ANSWERS_UPDATED,
    dateModified: ANSWERS_UPDATED,
    author: { "@id": "https://jinoski.com/#jinho" },
    publisher: { "@id": "https://jinoski.com/#org" },
    about: { "@id": "https://jinoski.com/#school" },
  };
  const others = ANSWERS.filter((x) => x.slug !== a.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="지노스키 강사가 답해요" title={[a.question]} />
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <article className="mx-auto max-w-3xl">
            <div className="rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-7">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">한 줄 답</p>
              <p className="mt-2 text-[16.5px] font-medium leading-[1.8] text-ink-900">{a.short}</p>
            </div>

            <p className="mt-5 text-[13px] text-snow-500">
              글·확인: 지노스키 대표 박진호 강사 (대한스키지도자연맹 스키 Level 2 · 스노보드 Level 1, 비발디파크 8시즌 이상) ·
              최종 확인 <time dateTime={ANSWERS_UPDATED}>{ANSWERS_UPDATED.replaceAll("-", ".")}</time> · 26/27 시즌 기준
            </p>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-snow-100">
              <Image src={a.image.src} alt={a.image.alt} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
            </div>

            {a.sections.map((s) => (
              <section key={s.heading} className="mt-12">
                <h2 className="text-[22px] font-bold leading-snug text-ink-900 sm:text-[24px]">{s.heading}</h2>
                <div className="mt-4 flex flex-col gap-5">
                  {s.blocks.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-14 rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
              <p className="text-[18px] font-bold">우리 가족에 맞는 수업이 궁금하면</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">
                날짜·인원·나이·실력만 알려주시면 패찰·리프트·렌탈까지 넣은 예상 총액을 안내해 드려요.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/reserve" className="inline-flex h-12 items-center gap-1.5 rounded-full bg-brand-500 px-5 text-[14px] font-semibold text-white">
                  <CalendarCheck size={16} /> 예약 신청
                </Link>
                <a href={contact.kakaoChannel} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-1.5 rounded-full bg-[#FEE500] px-5 text-[14px] font-semibold text-[#191919]">
                  <MessageCircle size={16} /> 카톡 상담
                </a>
              </div>
            </div>

            <nav aria-label="관련 페이지" className="mt-10">
              <h2 className="text-[15px] font-bold text-ink-900">함께 보면 좋은 페이지</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {a.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="inline-flex h-10 items-center rounded-full border border-snow-300 px-4 text-[13.5px] font-semibold text-ink-900 hover:border-brand-500 hover:text-brand-600">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 text-[15px] font-bold text-ink-900">다른 질문</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/answers/${o.slug}`} className="text-[15px] font-semibold text-brand-600 hover:underline">
                      {o.question}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/faq" className="text-[15px] font-semibold text-brand-600 hover:underline">
                    자주 묻는 질문 전체 보기
                  </Link>
                </li>
              </ul>
            </nav>
          </article>
        </Container>
      </section>
    </>
  );
}
