import type { MetadataRoute } from "next";
import { getContent, defaultLocale, locales } from "@/config/site";

export const dynamic = "force-static";

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteConfig } = getContent(defaultLocale);
  const lastModified = new Date();
  const paths = ["/"];

  return paths.map((path) => ({
    url: `${siteConfig.url}${localizedPath(defaultLocale, path)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
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
