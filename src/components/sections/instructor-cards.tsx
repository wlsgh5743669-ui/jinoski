"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, FileBadge, MessageSquareText, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { trackEvent } from "@/components/shared/analytics";
import { useContent } from "@/lib/use-content";
import { INSTRUCTOR_CARDS, type InstructorCard } from "@/config/content/instructor-cards";
import { cn } from "@/lib/utils";

const AUTO_MS = 2800; // 저절로 한 칸 돌아가는 간격
const PAUSE_MS = 6000; // 손댄 뒤 멈춰 있는 시간

const mod = (a: number, n: number) => ((a % n) + n) % n;
const sub = (p: InstructorCard) => [p.role, p.years].filter(Boolean).join(" · ");

/**
 * 강사진 페이지 「지노스키 강사진을 만나 보세요」 — 강사 포토카드가 원 모양으로 돌아가는 회전 무대 (한국어만).
 * 저절로 한 칸씩 돌고, 옆으로 밀거나 옆 카드를 누르면 앞으로 와요. 앞 카드 강사 소개가 아래 칸에 나와요.
 * 회전 무대 모양(.pcr-*)은 globals.css, 내용·사진은 src/config/content/instructor-cards.ts
 */
export function InstructorCards() {
  const locale = useLocale();
  const people = INSTRUCTOR_CARDS.people;
  const N = people.length;
  const STEP = 360 / N;
  const { contact } = useContent();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ rot: 0, target: 0, R: 220, vf: 0, dragging: false, pauseUntil: 0, inView: false, reduce: false });
  const [front, setFront] = useState(0);
  // 크게 보는 자격증 사진 (p = 강사 순서, k = 몇 번째 자격증)
  const [view, setView] = useState<{ p: number; k: number } | null>(null);

  const hold = () => {
    st.current.pauseUntil = Date.now() + PAUSE_MS;
  };
  const step = (d: number) => {
    st.current.target -= d * STEP;
    hold();
  };
  const bringTo = (i: number) => {
    const s = st.current;
    let diff = mod(i - -s.target / STEP, N);
    if (diff > N / 2) diff -= N;
    s.target -= diff * STEP;
    hold();
  };
  const openProof = (i: number, k = 0) => {
    if (!people[i]?.proofs?.length) return;
    setView({ p: i, k });
    hold();
    trackEvent("instructor_cert_view", { instructor: people[i].id });
  };
  const bringRef = useRef<(i: number) => void>(() => {});
  const openRef = useRef<(i: number) => void>(() => {});
  useEffect(() => {
    bringRef.current = bringTo;
    openRef.current = openProof;
  });

  // 자격증 창: Esc 닫기, 좌우 화살표로 넘기기, 열려 있는 동안 회전 멈춤
  useEffect(() => {
    if (!view) return;
    const n = people[view.p]?.proofs?.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight" && n > 1) setView((v) => v && { ...v, k: (v.k + 1) % n });
      if (e.key === "ArrowLeft" && n > 1) setView((v) => v && { ...v, k: (v.k - 1 + n) % n });
    };
    window.addEventListener("keydown", onKey);
    const t = setInterval(() => {
      st.current.pauseUntil = Date.now() + PAUSE_MS;
    }, 1000);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearInterval(t);
    };
  }, [view, people]);

  const show = INSTRUCTOR_CARDS.enabled && locale === "ko" && N > 0;

  useEffect(() => {
    if (!show) return;
    const stage = stageRef.current;
    const ring = ringRef.current;
    const section = sectionRef.current;
    if (!stage || !ring || !section) return;
    const s = st.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = cardEls.current.filter(Boolean) as HTMLDivElement[];

    const layout = () => {
      const w = cards[0]?.offsetWidth || 150;
      s.R = Math.round(w / 2 / Math.tan(Math.PI / N)) + 22;
      cards.forEach((c, i) => (c.style.transform = `rotateY(${i * STEP}deg) translateZ(${s.R}px)`));
    };
    layout();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.inView && Math.abs(s.target - s.rot) < 0.01) return;
      if (!s.dragging) s.rot += (s.target - s.rot) * (s.reduce ? 1 : 0.1);
      ring.style.transform = `translateZ(${-s.R}px) rotateY(${s.rot}deg)`;
      const f = mod(Math.round(-s.rot / STEP), N);
      cards.forEach((c, i) => {
        const rel = mod(i * STEP + s.rot + 180, 360) - 180;
        c.style.setProperty("--holo", (rel * 1.2).toFixed(1));
        c.style.filter = `brightness(${(1 - Math.min(Math.abs(rel), 150) / 300).toFixed(3)})`;
        c.classList.toggle("is-front", i === f);
      });
      if (f !== s.vf) {
        s.vf = f;
        setFront(f);
      }
    };
    s.inView = true;
    tick();

    const io = new IntersectionObserver(([e]) => (s.inView = e.isIntersecting), { threshold: 0.15 });
    io.observe(section);

    const auto = window.setInterval(() => {
      if (!s.reduce && s.inView && !s.dragging && Date.now() > s.pauseUntil && !document.hidden) s.target -= STEP;
    }, AUTO_MS);

    let sx = 0;
    let srot = 0;
    let moved = 0;
    const down = (e: PointerEvent) => {
      if (e.button > 0) return;
      s.dragging = true;
      moved = 0;
      sx = e.clientX;
      srot = s.rot;
      stage.classList.add("is-drag");
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !stage.hasPointerCapture(e.pointerId)) stage.setPointerCapture(e.pointerId);
      s.rot = srot + dx * 0.35;
    };
    const up = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      stage.classList.remove("is-drag");
      s.pauseUntil = Date.now() + PAUSE_MS;
      if (moved < 6) {
        s.rot = srot;
        const el = (e.target as HTMLElement).closest?.(".pcr-card") as HTMLDivElement | null;
        const i = el ? cards.indexOf(el) : -1;
        if (i >= 0 && i !== s.vf) bringRef.current(i);
        else if (i >= 0) openRef.current(i); // 앞 카드를 누르면 자격증 사진
        return;
      }
      s.target = Math.round(s.rot / STEP) * STEP;
    };
    const cancel = () => {
      s.dragging = false;
      stage.classList.remove("is-drag");
      s.target = Math.round(s.rot / STEP) * STEP;
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", cancel);
    window.addEventListener("resize", layout);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
      io.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", cancel);
      window.removeEventListener("resize", layout);
    };
  }, [show, N, STEP]);

  if (!show) return null;
  const cur = people[front];

  const openChat = (e: React.MouseEvent) => {
    trackEvent("contact_click", { channel: "chat", place: "instructor_cards" });
    const b = document.getElementById("jk-chat-btn");
    if (b) {
      e.preventDefault();
      b.click();
    }
  };

  return (
    <section ref={sectionRef} className="ic-ring overflow-hidden bg-ink-900 pb-20 pt-4 sm:pb-28">
      <Container>
        <SectionHeading
          light
          align="center"
          eyebrow={INSTRUCTOR_CARDS.eyebrow}
          title={INSTRUCTOR_CARDS.title}
          description={INSTRUCTOR_CARDS.description}
        />

        <div ref={stageRef} className="pcr-stage mt-8 sm:mt-12">
          <div ref={ringRef} className="pcr-ring">
            {people.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => {
                  cardEls.current[i] = el;
                }}
                className="pcr-card"
                role="button"
                tabIndex={0}
                aria-label={i === front && p.proofs?.length ? `${p.name} 강사 자격증 보기` : `${p.name} 강사 소개 보기`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (i === front) openProof(i);
                    else bringTo(i);
                  }
                }}
              >
                <div className="pcr-face" style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: "center 20%" }}>
                  <div className="pcr-holo" />
                  <span className="pcr-no">No.{String(i + 1).padStart(2, "0")}</span>
                  <div className="pcr-info">
                    <span className="pcr-name">{p.name}</span>
                    <span className="pcr-tag">{sub(p)}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {p.certs.slice(0, 2).map((c) => (
                        <span
                          key={c.label}
                          className={cn(
                            "rounded-full px-1.5 py-px text-[10px] font-bold",
                            c.gold ? "bg-[#E7C77F] text-[#2a1d00]" : "bg-white/20 text-white"
                          )}
                        >
                          {c.label.replace("스노보드", "보드")}
                        </span>
                      ))}
                    </span>
                    <span className="pcr-brand">{INSTRUCTOR_CARDS.brand}</span>
                  </div>
                </div>
                <div className="pcr-back">
                  <span>
                    JINOSKI
                    <small>VIVALDI PARK</small>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pcr-floor" aria-hidden />
        </div>

        {/* 앞 카드 이름 + ‹ › */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="이전 강사"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-[7em] text-center" aria-live="polite">
            <div className="text-[17px] font-bold text-white">{cur.name}</div>
            <div className="text-[12.5px] text-white/60">{sub(cur)}</div>
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="다음 강사"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="mt-3.5 flex justify-center gap-1.5" aria-hidden>
          {people.map((p, i) => (
            <span key={p.id} className={cn("h-[7px] rounded-full transition-all", i === front ? "w-[22px] bg-brand-400" : "w-[7px] bg-white/25")} />
          ))}
        </div>

        {/* 앞 카드 강사 소개 */}
        <div className="mx-auto mt-6 flex max-w-[560px] gap-4 rounded-3xl bg-white p-5 text-ink-900">
          <div
            className="h-[117px] w-[88px] shrink-0 rounded-2xl bg-cover"
            style={{ backgroundImage: `url("${cur.image}")`, backgroundPosition: "center 20%" }}
            role="img"
            aria-label={`${cur.name} 강사 사진`}
          />
          <div className="min-w-0">
            <p className="text-[21px] font-bold leading-tight">
              {cur.name}
              <span className="ml-1.5 text-[13px] font-semibold text-snow-600">{cur.role ?? "강사"}</span>
            </p>
            <p className="mt-1 text-[13.5px] leading-snug text-snow-700">
              {["비발디파크 강습 " + cur.years, cur.languages && "외국어 " + cur.languages].filter(Boolean).join(" · ")}
            </p>
            {cur.got && <p className="mt-0.5 text-[13.5px] font-semibold text-brand-700">자격 취득 {cur.got}</p>}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {cur.certs.map((c) => (
                <span
                  key={c.label}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[12px] font-bold",
                    c.gold ? "bg-[#fbf1d9] text-[#8a6200]" : "bg-brand-50 text-brand-700"
                  )}
                >
                  {c.label}
                </span>
              ))}
              {cur.extra && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">{cur.extra}</span>}
            </div>
            {cur.proofs?.length ? (
              <div className="mt-3">
                <p className="text-[12px] font-semibold text-snow-600">자격증 사진 · 눌러서 크게 보기</p>
                <div className="mt-1.5 flex gap-2">
                  {cur.proofs.map((pr, k) => (
                    <button
                      key={pr.src}
                      type="button"
                      onClick={() => openProof(front, k)}
                      className="group w-[64px] text-center"
                      aria-label={`${cur.name} ${pr.label} 자격증 크게 보기`}
                    >
                      <span
                        className="block h-[64px] w-[64px] rounded-lg border border-snow-200 bg-snow-50 bg-cover bg-center shadow-sm transition group-hover:border-brand-400"
                        style={{ backgroundImage: `url("${pr.src}")` }}
                      />
                      <span className="mt-1 block truncate text-[11px] font-semibold text-snow-700">{pr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-3.5 flex flex-wrap gap-2">
              {cur.proofs?.length ? (
                <button
                  type="button"
                  onClick={() => openProof(front)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-snow-300 px-3.5 py-2 text-[13.5px] font-bold text-ink-900"
                >
                  <FileBadge size={15} /> 자격증 보기
                </button>
              ) : (
                <a
                  href="#team-certs"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-snow-300 px-3.5 py-2 text-[13.5px] font-bold text-ink-900"
                >
                  <FileBadge size={15} /> 자격확인서 모음 보기
                </a>
              )}
              <a
                href={contact.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                onClick={openChat}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-[13.5px] font-bold text-white"
              >
                <MessageSquareText size={15} /> 상담하기
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* 자격증 크게 보기 */}
      {view && people[view.p]?.proofs?.[view.k] && <ProofViewer person={people[view.p]} k={view.k} setK={(k) => setView({ p: view.p, k })} onClose={() => setView(null)} />}
    </section>
  );
}

function ProofViewer({ person, k, setK, onClose }: { person: InstructorCard; k: number; setK: (k: number) => void; onClose: () => void }) {
  const list = person.proofs ?? [];
  const pr = list[k];
  const go = (d: number) => setK((k + d + list.length) % list.length);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${person.name} 강사 자격증`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
      >
        <X size={20} />
      </button>
      <p className="mb-3 text-center text-[15px] font-bold text-white">
        {person.name} 강사 · {pr.label}
        {list.length > 1 && (
          <span className="ml-2 text-[13px] font-semibold text-white/60">
            {k + 1} / {list.length}
          </span>
        )}
      </p>
      <div className="relative flex max-w-full items-center" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pr.src} alt={`${person.name} 강사 ${pr.label} 자격증`} className="max-h-[74vh] max-w-full rounded-xl bg-white object-contain" />
        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="이전 자격증"
              onClick={() => go(-1)}
              className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="다음 자격증"
              onClick={() => go(1)}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-[12px] text-white/60">개인정보 보호를 위해 생년월일·주소는 가렸어요</p>
    </div>
  );
}
