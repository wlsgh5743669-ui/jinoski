import type { MetadataRoute } from "next";
import { getContent, defaultLocale, locales } from "@/config/site";

function localizedPath(locale: string, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteConfig } = getContent(defaultLocale);
  const lastModified = new Date();
  const paths = ["/", "/reserve"];

  return paths.map((path) => ({
    url: `${siteConfig.url}${localizedPath(defaultLocale, path)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `${siteConfig.url}${localizedPath(locale, path)}`,
        ])
      ),
    },
  }));
}
