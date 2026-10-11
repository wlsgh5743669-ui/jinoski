import type { MetadataRoute } from "next";
import { getContent, defaultLocale, locales } from "@/config/site";

export const dynamic = "force-static";

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteConfig } = getContent(defaultLocale);
  const lastModified = new Date();
  const paths = [
    "/",
    "/lessons/",
    "/pricing/",
    "/instructor/",
    "/gallery/",
    "/snap/",
    "/reviews/",
    "/faq/",
    "/reserve/",
    "/privacy/",
  ];

  // 언어별 페이지를 각각 한 줄씩 넣고, 서로를 대체 언어로 연결 (구글 권장 방식)
  return locales.flatMap((pageLocale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}${localizedPath(pageLocale, path)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? (pageLocale === defaultLocale ? 1 : 0.9) : pageLocale === defaultLocale ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [
            locale,
            `${siteConfig.url}${localizedPath(locale, path)}`,
          ])
        ),
      },
    }))
  );
}
