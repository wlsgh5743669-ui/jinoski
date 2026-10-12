import type { Metadata, Viewport } from "next";
import { getContent, defaultLocale } from "@/config/site";
import "./globals.css";

const fallback = getContent(defaultLocale);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "지노스키 JinoSki",
  alternateName: ["지노스키", "JinoSki", "지노 스키앤보드스쿨", "JINO SKI & BOARD SCHOOL"],
  description: fallback.siteConfig.description,
  url: fallback.siteConfig.url,
  image: `${fallback.siteConfig.url}${fallback.siteConfig.ogImage}`,
  telephone: fallback.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "한치골길 262 비발디파크",
    addressLocality: "홍천군 서면",
    addressRegion: "강원도",
    addressCountry: "KR",
  },
  areaServed: "비발디파크",
  founder: {
    "@type": "Person",
    name: fallback.contact.representativeName,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(fallback.siteConfig.url),
  title: {
    default: fallback.siteConfig.title,
    template: `%s | ${fallback.siteConfig.name}`,
  },
  description: fallback.siteConfig.description,
  keywords: fallback.siteConfig.keywords,
  // 루트(jinoski.com/)는 /ko/로 넘겨주는 페이지라, 검색엔진에 대표 주소를 /ko/로 알려줘요
  alternates: {
    canonical: "/ko/",
    languages: { ko: "/ko/", en: "/en/", zh: "/zh/", "x-default": "/ko/" },
  },
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
    google: "EJeBYm2X5PiDyOEt0wFgUa56i_qsnTjaW79IyeVx8BQ",
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
