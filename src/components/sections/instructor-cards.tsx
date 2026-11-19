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
const noOf = (p: InstructorCard) => String(INSTRUCTOR_CARDS.people.indexOf(p) + 1).padStart(2, "0");

type Mode = "all" | "split";

/**
 * 강사진 페이지 「지노스키 강사진을 만나 보세요」 — 강사 포토카드가 원 모양으로 돌아가는 회전 무대 (한국어만).
 * 저절로 한 칸씩 돌고, 옆으로 밀거나 옆 카드를 누르면 앞으로 와요. 앞 카드 강사 소개가 아래 칸에 나와요.
 * 「전체 보기 / 여자·남자 나눠 보기」 단추: 나눠 보기는 위 원(여자 강사)·아래 원(남자 강사)으로, 바꿀 때 카드가 돌면서 활짝 펼쳐져요.
 * 회전 무대 모양(.pcr-*)은 globals.css, 내용·사진은 src/config/content/instructor-cards.ts
 */
export function InstructorCards() {
  const locale = useLocale();
  const people = INSTRUCTOR_CARDS.people;
  const { contact } = useContent();

  const [mode, setMode] = useState<Mode>("all");
  const [sel, setSel] = useState<InstructorCard>(people[0]);
  // 나눠 보기에서 아래 소개 칸을 따라가는 원 (마지막으로 손댄 원)
  const [active, setActive] = useState("all");
  // 크게 보는 자격증 사진
  const [view, setView] = useState<{ p: InstructorCard; k: number } | null>(null);

  const women = people.filter((p) => p.gender === "f");
  const men = people.filter((p) => p.gender === "m");
  const canSplit = women.length > 0 && men.length > 0;

  const openProof = (p: InstructorCard, k = 0) => {
    if (!p.proofs?.length) return;
    setView({ p, k });
    trackEvent("instructor_cert_view", { instructor: p.id });
  };

  useEffect(() => {
    if (!view) return;
    const n = view.p.proofs?.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight" && n > 1) setView((v) => v && { ...v, k: (v.k + 1) % n });
      if (e.key === "ArrowLeft" && n > 1) setView((v) => v && { ...v, k: (v.k - 1 + n) % n });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  const show = INSTRUCTOR_CARDS.enabled && locale === "ko" && people.length > 0;
  if (!show) return null;
  const cur = sel;

  const pick = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setActive(m === "all" ? "all" : "f");
    trackEvent("instructor_cards_mode", { mode: m });
  };
  const onFront = (key: string) => (p: InstructorCard) => {
    if (active === key) setSel(p);
  };
  const onTouch = (key: string) => () => setActive(key);

  const openChat = (e: React.MouseEvent) => {
    trackEvent("contact_click", { channel: "chat", place: "instructor_cards" });
    const b = document.getElementById("jk-chat-btn");
    if (b) {
      e.preventDefault();
      b.click();
    }
  };

  return (
    <section className="ic-ring overflow-hidden bg-ink-900 pb-20 pt-4 sm:pb-28">
      <Container>
        <SectionHeading
          light
          align="center"
          eyebrow={INSTRUCTOR_CARDS.eyebrow}
          title={INSTRUCTOR_CARDS.title}
          description={INSTRUCTOR_CARDS.description}
        />

        {canSplit && (
          <div className="mt-6 flex justify-center">
            <div className="ic-toggle" role="tablist" aria-label="강사 보기 방법">
              <button type="button" role="tab" aria-selected={mode === "all"} onClick={() => pick("all")} className={cn(mode === "all" && "is-on")}>
                전체 보기 <span>{people.length}</span>
              </button>
              <button type="button" role="tab" aria-selected={mode === "split"} onClick={() => pick("split")} className={cn(mode === "split" && "is-on")}>
                여자·남자 나눠 보기
              </button>
            </div>
          </div>
        )}

        {mode === "all" || !canSplit ? (
          <CardRing
            key="all"
            ringKey="all"
            people={people}
            paused={!!view}
            onFront={onFront("all")}
            onTouch={onTouch("all")}
            onOpen={openProof}
          />
        ) : (
          <div key="split">
            <CardRing
              ringKey="f"
              label="여자 강사"
              small
              people={women}
              paused={!!view}
              onFront={onFront("f")}
              onTouch={onTouch("f")}
              onOpen={openProof}
            />
            <CardRing
              ringKey="m"
              label="남자 강사"
              small
              dir={-1}
              delay={180}
              people={men}
              paused={!!view}
              onFront={onFront("m")}
              onTouch={onTouch("m")}
              onOpen={openProof}
            />
          </div>
        )}

        {/* 앞 카드 강사 소개 */}
        <div key={cur.id} className="ic-panel mx-auto mt-6 flex max-w-[560px] gap-4 rounded-3xl bg-white p-5 text-ink-900">
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
                      onClick={() => openProof(cur, k)}
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
                  onClick={() => openProof(cur)}
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
      {view && view.p.proofs?.[view.k] && <ProofViewer person={view.p} k={view.k} setK={(k) => setView({ p: view.p, k })} onClose={() => setView(null)} />}
    </section>
  );
}

/**
 * 원 하나. 사람이 적으면(6명 이하) 카드를 두 번씩 넣어 원을 채워요.
 * 처음 나타날 때 카드가 가운데에서 돌면서 원 크기로 펼쳐져요.
 */
function CardRing({
  ringKey,
  people,
  label,
  small,
  dir = 1,
  delay = 0,
  paused,
  onFront,
  onTouch,
  onOpen,
}: {
  ringKey: string;
  people: InstructorCard[];
  label?: string;
  small?: boolean;
  dir?: 1 | -1;
  delay?: number;
  paused: boolean;
  onFront: (p: InstructorCard) => void;
  onTouch: () => void;
  onOpen: (p: InstructorCard) => void;
}) {
  const N = people.length;
  const SLOTS = N <= 6 ? N * 2 : N;
  const STEP = 360 / SLOTS;
  const slots = Array.from({ length: SLOTS }, (_, i) => people[i % N]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const st = useRef({ rot: 150 * dir, target: 0, R: 220, vf: -1, dragging: false, pauseUntil: 0, inView: false, reduce: false, open: 0, start: 0 });
  const [front, setFront] = useState(0);

  const hold = () => {
    st.current.pauseUntil = Date.now() + PAUSE_MS;
    onTouch();
  };
  const step = (d: number) => {
    st.current.target -= d * STEP;
    hold();
  };
  const bringTo = (i: number) => {
    const s = st.current;
    let diff = mod(i - -s.target / STEP, SLOTS);
    if (diff > SLOTS / 2) diff -= SLOTS;
    s.target -= diff * STEP;
    hold();
  };
  const cb = useRef({ bringTo, onOpen, onFront, onTouch, slots });
  useEffect(() => {
    cb.current = { bringTo, onOpen, onFront, onTouch, slots };
  });
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    const section = sectionRef.current;
    if (!stage || !ring || !section) return;
    const s = st.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.start = performance.now() + delay;
    if (s.reduce) {
      s.open = 1;
      s.rot = 0;
    }
    const cards = cardEls.current.filter(Boolean) as HTMLDivElement[];

    let baseR = 220;
    const place = () => {
      // 펼쳐지는 동안: 원 크기 0 → 제 크기, 카드도 작게 → 제 크기
      const e = 1 - Math.pow(1 - s.open, 3);
      s.R = Math.max(1, Math.round(baseR * e));
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * STEP}deg) translateZ(${s.R}px) scale(${(0.35 + 0.65 * e).toFixed(3)})`;
        c.style.opacity = String(Math.min(1, s.open * 1.6));
      });
    };
    const layout = () => {
      const w = cards[0]?.offsetWidth || 150;
      baseR = Math.round(w / 2 / Math.tan(Math.PI / SLOTS)) + 22;
      place();
    };
    layout();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (s.open < 1) {
        if (now < s.start) return;
        s.open = Math.min(1, (now - s.start) / 900);
        place();
      } else if (!s.inView && Math.abs(s.target - s.rot) < 0.01) return;
      if (!s.dragging) s.rot += (s.target - s.rot) * (s.reduce ? 1 : s.open < 1 ? 0.06 : 0.1);
      ring.style.transform = `translateZ(${-s.R}px) rotateY(${s.rot}deg)`;
      const f = mod(Math.round(-s.rot / STEP), SLOTS);
      cards.forEach((c, i) => {
        const rel = mod(i * STEP + s.rot + 180, 360) - 180;
        c.style.setProperty("--holo", (rel * 1.2).toFixed(1));
        c.style.filter = `brightness(${(1 - Math.min(Math.abs(rel), 150) / 300).toFixed(3)})`;
        c.classList.toggle("is-front", i === f);
      });
      // 펼쳐지며 도는 동안엔 아래 소개 칸을 바꾸지 않고, 다 펼쳐진 뒤에 앞 카드로
      if (f !== s.vf && s.open >= 1) {
        s.vf = f;
        setFront(f);
        cb.current.onFront(cb.current.slots[f]);
      }
    };
    s.inView = true;
    tick();

    const io = new IntersectionObserver(([e]) => (s.inView = e.isIntersecting), { threshold: 0.15 });
    io.observe(section);

    const auto = window.setInterval(() => {
      if (!s.reduce && s.open >= 1 && s.inView && !s.dragging && !pausedRef.current && Date.now() > s.pauseUntil && !document.hidden) s.target -= STEP * dir;
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
      cb.current.onTouch();
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
        if (i >= 0 && i !== s.vf) cb.current.bringTo(i);
        else if (i >= 0) {
          // 앞 카드를 누르면 아래 소개를 이 강사로 + 자격증 사진
          cb.current.onFront(cb.current.slots[i]);
          cb.current.onOpen(cb.current.slots[i]);
        }
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
  }, [SLOTS, STEP, dir, delay]);

  const curP = slots[front] ?? people[0];
  const navBtn = "flex items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10";

  return (
    <div ref={sectionRef} className={cn(small && "mt-5")} data-ring={ringKey}>
      {label && (
        <div className="ic-ring-label flex items-center justify-center gap-3">
          <button type="button" onClick={() => step(-1)} aria-label={`${label} 이전`} className={cn(navBtn, "h-9 w-9")}>
            <ChevronLeft size={18} />
          </button>
          <p className="min-w-[8em] text-center">
            <span className="text-[15px] font-bold text-white">{label}</span>
            <span className="ml-1.5 text-[13px] font-semibold text-brand-300">{N}명</span>
          </p>
          <button type="button" onClick={() => step(1)} aria-label={`${label} 다음`} className={cn(navBtn, "h-9 w-9")}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div ref={stageRef} className={cn("pcr-stage", small ? "is-sm mt-1" : "mt-8 sm:mt-12")}>
        <div ref={ringRef} className="pcr-ring">
          {slots.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              className="pcr-card"
              role="button"
              tabIndex={i < N ? 0 : -1}
              aria-hidden={i >= N ? true : undefined}
              aria-label={i === front && p.proofs?.length ? `${p.name} 강사 자격증 보기` : `${p.name} 강사 소개 보기`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (i === front) {
                    onFront(p);
                    onOpen(p);
                  } else bringTo(i);
                }
              }}
            >
              <div className="pcr-face" style={{ backgroundImage: `url("${p.image}")`, backgroundPosition: "center 20%" }}>
                <div className="pcr-holo" />
                <span className="pcr-no">No.{noOf(p)}</span>
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

      {!label && (
        <>
          {/* 앞 카드 이름 + ‹ › */}
          <div className="mt-2 flex items-center justify-center gap-4">
            <button type="button" onClick={() => step(-1)} aria-label="이전 강사" className={cn(navBtn, "h-12 w-12")}>
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-[7em] text-center" aria-live="polite">
              <div className="text-[17px] font-bold text-white">{curP.name}</div>
              <div className="text-[12.5px] text-white/60">{sub(curP)}</div>
            </div>
            <button type="button" onClick={() => step(1)} aria-label="다음 강사" className={cn(navBtn, "h-12 w-12")}>
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="mt-3.5 flex justify-center gap-1.5" aria-hidden>
            {people.map((p, i) => (
              <span key={p.id} className={cn("h-[7px] rounded-full transition-all", i === front % N ? "w-[22px] bg-brand-400" : "w-[7px] bg-white/25")} />
            ))}
          </div>
        </>
      )}
    </div>
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
