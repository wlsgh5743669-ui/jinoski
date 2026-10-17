import type { Metadata } from "next";
import { locales, getContent, type Locale } from "@/config/site";

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: { url: string; alt: string };
}): Metadata {
  const url = `/${locale}/${path}`;
  const site = getContent(locale).siteConfig;
  // 언어별 같은 페이지를 서로 알려줘서 구글이 한·영·중 버전을 올바르게 연결하게 해요
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/${path}`;
  languages["x-default"] = `/ko/${path}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url,
      title,
      description,
      images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
