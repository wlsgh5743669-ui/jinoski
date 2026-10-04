"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Play, Youtube } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useContent } from "@/lib/use-content";
import { youtubeVideos, youtubeSection, type YoutubeVideo } from "@/config/content/videos";

type Loc = "ko" | "en" | "zh";

/** 썸네일을 먼저 보여주고, 누르면 그 자리에서 유튜브 플레이어를 불러와요 (페이지 속도 유지). */
function VideoCard({ v, loc }: { v: YoutubeVideo; loc: Loc }) {
  const [play, setPlay] = useState(false);
  const isShort = v.kind === "short";
  const title = v.title[loc] ?? v.title.ko;
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-ink-900 shadow-[0_24px_60px_-28px_rgba(10,11,13,0.6)] ${isShort ? "aspect-[9/16]" : "aspect-video"}`}>
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full text-left" aria-label={title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${v.id}/${isShort ? "oardefault" : "hqdefault"}.jpg`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
            }}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-xl transition-transform group-hover:scale-110">
            <Play size={26} className="ml-1" fill="currentColor" />
          </span>
          {isShort && (
            <span className="absolute left-4 top-4 rounded-full bg-[#FF0033] px-2.5 py-1 text-[11.5px] font-bold text-white">Shorts</span>
          )}
          <p className="absolute bottom-4 left-4 right-4 text-[15px] font-semibold leading-snug text-white">{title}</p>
        </button>
      )}
    </div>
  );
}

export function YoutubeVideos({ dark = false }: { dark?: boolean }) {
  const locale = useLocale() as Loc;
  const loc: Loc = (["ko", "en", "zh"] as const).includes(locale) ? locale : "ko";
  const t = youtubeSection[loc];
  const { contact } = useContent();
  if (youtubeVideos.length === 0) return null;

  const shorts = youtubeVideos.filter((v) => v.kind === "short");
  const videos = youtubeVideos.filter((v) => v.kind === "video");

  return (
    <section className={`py-16 sm:py-24 ${dark ? "bg-ink-900" : "bg-white"}`}>
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-[#FF0033]">{t.eyebrow}</p>
            <h2 className={`mt-2 text-[26px] font-bold tracking-tight sm:text-[34px] ${dark ? "text-white" : "text-ink-900"}`}>{t.title}</h2>
            <p className={`mt-2 text-[14.5px] ${dark ? "text-white/60" : "text-snow-500"}`}>{t.description}</p>
          </div>
          <a
            href={contact.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-[#FF0033] px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 sm:self-auto"
          >
            <Youtube size={18} /> {t.more}
          </a>
        </div>

        {videos.length > 0 && (
          <div className="mb-6 grid gap-5 md:grid-cols-2">
            {videos.map((v) => (
              <VideoCard key={v.id} v={v} loc={loc} />
            ))}
          </div>
        )}
        {shorts.length > 0 && (
          <div className={shorts.length === 1 ? "mx-auto max-w-[340px]" : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"}>
            {shorts.map((v) => (
              <VideoCard key={v.id} v={v} loc={loc} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
