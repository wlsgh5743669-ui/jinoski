import type { MetadataRoute } from "next";
import { getContent, defaultLocale, locales } from "@/config/site";
import { ANSWERS } from "@/config/content/answers";

export const dynamic = "force-static";

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

// 페이지마다 대표 이미지 — 구글·네이버 이미지 검색과 AI가 사진·안내 카드를 페이지와 함께 찾게 (2026-11-08)
const PAGE_IMAGES: Record<string, string[]> = {
  "/": ["/images/og-image-2627.jpg", "/images/team-group.jpg", "/images/hero-poster.jpg"],
  "/lessons/": ["/images/lesson-intro.jpg", "/images/lesson-kids.jpg", "/images/lesson-advanced.jpg", "/images/guide/day-2.jpg"],
  "/pricing/": ["/images/guide/pricing-1-regular.jpg", "/images/guide/pricing-2.jpg", "/images/guide/pricing-3.jpg", "/images/guide/pricing-4.jpg"],
  "/instructor/": ["/images/instructor-jinho.jpg", "/images/certs/cert-ski-l2-jinho.jpg", "/images/certs/cert-sb-l1-jinho.jpg"],
  "/gallery/": Array.from({ length: 29 }, (_, i) => `/images/gallery-${i + 1}.jpg`),
  "/junior/": ["/images/guide/junior-1.jpg", "/images/guide/junior-2.jpg", "/images/guide/junior-3.jpg"],
  "/guide/": ["/images/guide/vivaldi-1.jpg", "/images/guide/vivaldi-2.jpg", "/images/guide/vivaldi-3.jpg"],
  "/reserve/": ["/images/guide/booking-1.jpg", "/images/guide/booking-2.jpg", "/images/guide/day-1-regular.jpg"],
  "/snap/": ["/images/snap/snap-01.jpg"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteConfig } = getContent(defaultLocale);
  const lastModified = new Date();
  const img = (path: string) => (PAGE_IMAGES[path] ?? []).map((src) => `${siteConfig.url}${src}`);
  const paths = [
    "/",
    "/lessons/",
    "/pricing/",
    "/instructor/",
    "/gallery/",
    "/snap/",
    "/junior/",
    "/notice/",
    "/reviews/",
    "/faq/",
    "/reserve/",
    "/guide/",
    "/privacy/",
  ];

  // 스토어 페이지는 한국어만 있어요
  const koOnly = [
    {
      url: `${siteConfig.url}/ko/store/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/ko/reserve/season/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: [`${siteConfig.url}/images/season-link/1.jpg`, `${siteConfig.url}/images/season-link/2.jpg`, `${siteConfig.url}/images/season-link/3.jpg`],
    },
    // 「강사가 답해요」 질문 답변 글 (한국어만)
    {
      url: `${siteConfig.url}/ko/answers/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...ANSWERS.map((a) => ({
      url: `${siteConfig.url}/ko/answers/${a.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [`${siteConfig.url}${a.image.src}`],
    })),
    ...["ko", "en", "zh"].map((l) => ({
      url: `${siteConfig.url}/${l}/quote/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: l === "ko" ? 0.8 : 0.6,
      images: [`${siteConfig.url}/images/guide/stay-1.jpg`, `${siteConfig.url}/images/guide/stay-2.jpg`, `${siteConfig.url}/images/guide/stay-3.jpg`],
    })),
  ];

  // 언어별 페이지를 각각 한 줄씩 넣고, 서로를 대체 언어로 연결 (구글 권장 방식)
  return [...koOnly, ...locales.flatMap((pageLocale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}${localizedPath(pageLocale, path)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? (pageLocale === defaultLocale ? 1 : 0.9) : pageLocale === defaultLocale ? 0.8 : 0.6,
      images: img(path),
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [
            locale,
            `${siteConfig.url}${localizedPath(locale, path)}`,
          ])
        ),
      },
    }))
  )];
}
