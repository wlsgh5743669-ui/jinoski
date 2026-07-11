import type { MetadataRoute } from "next";
import { getContent, defaultLocale } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { siteConfig } = getContent(defaultLocale);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
