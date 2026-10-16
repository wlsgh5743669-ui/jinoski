import type { Metadata } from "next";
import { Bus, CloudSnow, ExternalLink, MapPin, Shirt, ShoppingBag, Ticket } from "lucide-react";
import { getContent, isLocale, defaultLocale } from "@/config/site";
import { getGuide, type GuideSection } from "@/config/content/guide";
import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";

const ICONS: Record<GuideSection["icon"], React.ReactNode> = {
  pin: <MapPin size={22} />,
  bus: <Bus size={22} />,
  ticket: <Ticket size={22} />,
  shirt: <Shirt size={22} />,
  bag: <ShoppingBag size={22} />,
  cloud: <CloudSnow size={22} />,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  const g = getGuide(l);
  return pageMetadata({
    locale: l,
    path: "guide/",
    title: g.title.join(" "),
    description: g.description,
    image: { url: "/images/og-image-2627.jpg", alt: g.title.join(" ") },
  });
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : defaultLocale;
  const g = getGuide(l);
  const { mapLinks, ui } = getContent(l);
  const mapButtons = [
    { label: ui.directions.naverMapLabel, href: mapLinks.naver },
    { label: ui.directions.kakaoMapLabel, href: mapLinks.kakao },
    { label: ui.directions.googleMapLabel, href: mapLinks.google },
  ];

  return (
    <>
      <PageHero eyebrow={g.eyebrow} title={g.title} description={g.description} />
      <section className="bg-ice-200 py-14 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {g.sections.map((s) => (
              <article id={s.id} key={s.id} className="flex scroll-mt-28 flex-col rounded-3xl bg-white p-7 ring-1 ring-snow-300/60">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">{ICONS[s.icon]}</span>
                  <h2 className="text-[19px] font-bold text-ink-900">{s.title}</h2>
                </div>
                <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-[14.5px] leading-relaxed text-snow-700">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {s.id === "meeting" && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {mapButtons.map((b) => (
                      <a key={b.label} href={b.href} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full border border-snow-300 px-4 text-[13.5px] font-semibold text-ink-900 hover:border-brand-500 hover:text-brand-600">
                        {b.label}
                      </a>
                    ))}
                  </div>
                )}
                {s.links && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.links.map((lnk) => (
                      <a key={lnk.label} href={lnk.href} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
                        {lnk.label} <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-5xl text-[13px] text-snow-500">※ {g.updatedNote}</p>

          <div className="mx-auto mt-10 max-w-5xl rounded-3xl bg-ink-900 p-8 text-center sm:p-10">
            <h2 className="text-[22px] font-bold text-white sm:text-[26px]">{g.cta.title}</h2>
            <p className="mt-2 text-[14.5px] text-white/70">{g.cta.body}</p>
            <Link href="/reserve" className="mt-6 inline-flex h-13 items-center justify-center rounded-full bg-brand-500 px-8 text-[15px] font-bold text-white hover:bg-brand-600" style={{ height: 52 }}>
              {g.cta.book}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
