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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
