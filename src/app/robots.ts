import type { MetadataRoute } from "next";
import { getContent, defaultLocale } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const { siteConfig } = getContent(defaultLocale);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
