"use client";

import { Instagram, Youtube } from "lucide-react";
import { instructor } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export function Instructor() {
  return (
    <section id="instructor" className="bg-ink-900 py-24 sm:py-32">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-14">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem]">
              <video
                className="h-full w-full object-cover"
                src={instructor.video}
                poster={instructor.photo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[13px] font-medium text-white/90">
                  경력 {instructor.experienceYears}년+ · PADI OWSI · 스키 Level 2
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="w-full">
            <SectionHeading
              eyebrow="Instructor"
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
                Qualifications
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {instructor.certifications.map((cert) => (
                  <li
                    key={cert.label}
                    className="flex items-center gap-3 text-[14.5px] text-white/80"
                  >
                    <span className="text-[17px] leading-none">{cert.icon}</span>
                    {cert.label}
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
    </section>
  );
}
