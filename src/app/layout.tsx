import type { Metadata, Viewport } from "next";
import { getContent, defaultLocale } from "@/config/site";
import "./globals.css";

const fallback = getContent(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(fallback.siteConfig.url),
  title: {
    default: fallback.siteConfig.title,
    template: `%s | ${fallback.siteConfig.name}`,
  },
  description: fallback.siteConfig.description,
  keywords: fallback.siteConfig.keywords,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: fallback.siteConfig.locale,
    url: "/",
    title: fallback.siteConfig.title,
    description: fallback.siteConfig.description,
    siteName: fallback.siteConfig.name,
    images: [
      {
        url: fallback.siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: fallback.siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fallback.siteConfig.title,
    description: fallback.siteConfig.description,
    images: [fallback.siteConfig.ogImage],
  },
  verification: {
    other: {
      "naver-site-verification": "5723a2c062edf5ff0ca702bcf2ca4512493a00e3",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0B0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
