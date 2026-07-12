import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isLocale, getContent } from "@/config/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = getContent(locale);
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `/${l}/`;
  }

  return {
    title: {
      absolute: content.siteConfig.title,
      default: content.siteConfig.title,
      template: `%s | ${content.siteConfig.name}`,
    },
    description: content.siteConfig.description,
    keywords: content.siteConfig.keywords,
    authors: [{ name: "박진호" }],
    creator: "JinoSki",
    applicationName: content.siteConfig.name,
    formatDetection: { telephone: true, email: true, address: true },
    openGraph: {
      type: "website",
      locale: content.siteConfig.locale,
      url: `/${locale}/`,
      title: content.siteConfig.title,
      description: content.siteConfig.description,
      siteName: content.siteConfig.name,
      images: [
        {
          url: content.siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: content.siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.siteConfig.title,
      description: content.siteConfig.description,
      images: [content.siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/${locale}/`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
  );
}
