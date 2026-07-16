import type { Metadata } from "next";
import type { Locale } from "@/config/site";

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

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
    },
    twitter: { images: [image.url] },
  };
}
