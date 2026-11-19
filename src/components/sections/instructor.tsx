"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Lightbox } from "@/components/shared/lightbox";

import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

/**
 * 대표 박진호 강사 소개.
 * compact = 한국어 강사 소개 페이지에서 강사진 카드 아래 작은 칸 「지노스키를 만든 사람」 (대표 11-19 「내가 너무 대문짝만하게 나오잖아」).
 * 영어·중국어도 같은 작은 칸 (대표 11-19). 큰 모양(compact 아님)은 지금 안 씀.
 */
const FOUNDER = {
  ko: { label: "지노스키를 만든 사람", role: (y: number) => `대표 강사 · 경력 ${y}년+`, bio: (y: number) => `${y}년 넘게 비발디파크에서 스키·스노보드를 가르치고, 포토그래퍼로 레슨의 순간을 사진과 영상으로 기록해요.` },
  en: { label: "The founder of JinoSki", role: (y: number) => `Head Instructor · ${y}+ yrs`, bio: (y: number) => `Teaching skiing and snowboarding at Vivaldi Park for over ${y} years, and capturing each lesson in photos and video as a photographer.` },
  zh: { label: "JinoSki 创始人", role: (y: number) => `首席教练 · 执教${y}年以上`, bio: (y: number) => `在大明维瓦尔第执教双板与单板${y}年以上，同时作为摄影师，用照片和视频记录每一堂课的瞬间。` },
};
export function Instructor({ compact = false }: { compact?: boolean } = {}) {
  const { instructor, ui, shootSamples } = useContent();
  const [certImage, setCertImage] = useState<string | null>(null);
  const loc = useLocale();
  const f = FOUNDER[loc === "en" || loc === "zh" ? loc : "ko"];
  if (compact) {
    return (
      <section className="bg-ink-900 pb-20 sm:pb-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
              <h2 className="text-[13px] font-semibold text-brand-300">{f.label}</h2>
              <div className="mt-4 flex items-center gap-4 sm:gap-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                  <Image
                    src={instructor.photo}
                    alt={instructor.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[22px] font-bold leading-tight text-white sm:text-[26px]">
                    {instructor.name}
                    <span className="ml-2 text-[14px] font-medium text-white/50 sm:text-[15px]">
                      {f.role(instructor.experienceYears)}
                    </span>
                  </p>
                  <p className="mt-2 text-[15.5px] font-semibold leading-snug text-brand-300 sm:text-[17px]">
                    &ldquo;{instructor.tagline}&rdquo;
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/70 sm:text-[15.5px]">
                {f.bio(instructor.experienceYears)}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {instructor.certifications.map((cert) =>
                  cert.image ? (
                    <li key={cert.label}>
                      <button
                        type="button"
                        onClick={() => setCertImage(cert.image ?? null)}
                        className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-left text-[12.5px] text-white/85 transition-colors hover:border-brand-400 hover:text-brand-300"
                      >
                        <span aria-hidden>{cert.icon}</span>
                        {cert.label}
                        <span className="font-semibold text-brand-300">{shootSamples.viewCertLabel}</span>
                      </button>
                    </li>
                  ) : (
                    <li
                      key={cert.label}
                      className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12.5px] text-white/70"
                    >
                      <span aria-hidden>{cert.icon}</span>
                      {cert.label}
                    </li>
                  )
                )}
              </ul>
              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href={instructor.sns.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-400"
                  aria-label="강사 인스타그램"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href={instructor.sns.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-400"
                  aria-label="강사 유튜브"
                >
                  <Youtube size={17} />
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
        <Lightbox src={certImage} onClose={() => setCertImage(null)} />
      </section>
    );
  }
  return (
    <section className="bg-ink-900 pb-24 pt-40 sm:pb-32 sm:pt-44">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-14">
          <Reveal className="w-full max-w-md">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem]">
              <Image
                src={instructor.photo}
                alt={instructor.name}
                fill
                sizes="(max-width: 639px) 100vw, 448px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[13px] font-medium text-white/90">
                  {ui.instructor.experienceBadge(instructor.experienceYears)}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="w-full">
            <SectionHeading
              as="h1"
              eyebrow={ui.instructor.eyebrow}
              light
              title={
                <>
                  {instructor.name}
                  <span className="mt-2 block text-[16px] font-medium text-white/50 sm:text-[18px]">
                    {instructor.role}
                  </span>
                </>
              }
            />

            <p className="mt-6 max-w-lg text-[20px] font-semibold leading-snug tracking-tight text-brand-300 sm:text-[22px]">
              &ldquo;{instructor.tagline}&rdquo;
            </p>

            <div className="mt-6 flex max-w-lg flex-col gap-4">
              {instructor.bio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15.5px] leading-relaxed text-white/70"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {ui.instructor.qualificationsLabel}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {instructor.certifications.map((cert) => (
                  <li
                    key={cert.label}
                    className="flex items-center gap-3 text-[14.5px] text-white/80"
                  >
                    <span className="text-[17px] leading-none">{cert.icon}</span>
                    {cert.label}
                    {cert.image && (
                      <button
                        type="button"
                        onClick={() => setCertImage(cert.image ?? null)}
                        className="ml-auto shrink-0 rounded-full border border-white/20 px-3 py-1 text-[12px] font-semibold text-white/80 transition-colors hover:border-brand-400 hover:text-brand-300"
                      >
                        {shootSamples.viewCertLabel}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex items-center gap-3">
              <a
                href={instructor.sns.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-400"
                aria-label="강사 인스타그램"
              >
                <Instagram size={19} />
              </a>
              <a
                href={instructor.sns.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-400"
                aria-label="강사 유튜브"
              >
                <Youtube size={19} />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
      <Lightbox src={certImage} onClose={() => setCertImage(null)} />
    </section>
  );
}
