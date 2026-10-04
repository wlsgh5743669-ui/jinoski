import type { Metadata } from "next";
import { isLocale, defaultLocale } from "@/config/site";
import { getPrivacy } from "@/config/content/privacy";
import { pageMetadata } from "@/lib/page-metadata";
import { Container } from "@/components/shared/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale;
  const p = getPrivacy(resolvedLocale);
  return pageMetadata({
    locale: resolvedLocale,
    path: "privacy/",
    title: p.title,
    description: p.intro.slice(0, 120),
    image: { url: "/images/og-image-2627.jpg", alt: p.title },
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const p = getPrivacy(isLocale(locale) ? locale : defaultLocale);
  return (
    <section className="bg-white pb-24 pt-36 sm:pt-44">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[30px] font-bold tracking-tight text-ink-900 sm:text-[38px]">{p.title}</h1>
          <p className="mt-2 text-[13.5px] text-snow-500">{p.effectiveDate}</p>
          <p className="mt-6 text-[15px] leading-relaxed text-snow-700">{p.intro}</p>
          <div className="mt-10 space-y-9">
            {p.sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-[18px] font-bold text-ink-900">{s.title}</h2>
                <div className="mt-3 space-y-1.5 text-[14.5px] leading-relaxed text-snow-700">
                  {s.body.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
